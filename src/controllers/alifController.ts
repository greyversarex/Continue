import { Request, Response } from 'express';
import prisma from '../config/database';
import { emailService } from '../services/emailService';
import crypto from 'crypto';
import fetch from 'node-fetch';

export const alifController = {
  /**
   * Создать платеж через AlifPay API
   * POST /api/payments/alif/create
   */
  async createPayment(req: Request, res: Response) {
    try {
      const { orderNumber, returnUrl, failUrl } = req.body;

      if (!orderNumber) {
        return res.status(400).json({
          success: false,
          message: 'Order number is required',
        });
      }

      // Получить данные заказа
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: {
          customer: true,
          tour: true,
        },
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      const alifMerchantKey = process.env.ALIF_MERCHANT_KEY;
      const alifMerchantPassword = process.env.ALIF_MERCHANT_PASSWORD;
      const alifApiUrl = process.env.ALIF_API_URL;
      const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

      if (!alifMerchantKey || !alifMerchantPassword || !alifApiUrl) {
        return res.status(500).json({
          success: false,
          message: 'AlifPay configuration missing (ALIF_MERCHANT_KEY, ALIF_MERCHANT_PASSWORD, ALIF_API_URL)',
        });
      }

      // Генерируем HMAC-SHA256 хэш от пароля для безопасности
      const hashedPassword = crypto
        .createHmac('sha256', alifMerchantKey)
        .update(alifMerchantPassword)
        .digest('hex');

      // Преобразовать сумму в тийины (умножить на 100)
      const amount = Math.round(order.totalAmount * 100);
      const orderId = order.id.toString();

      // URLs для возврата
      const defaultReturnUrl = `${baseUrl}/payment-success?orderNumber=${orderNumber}`;
      const defaultFailUrl = `${baseUrl}/payment-fail?orderNumber=${orderNumber}`;

      console.log(`🔄 Creating AlifPay payment: Order ${orderId}, Amount ${amount} тийинов`);

      // Alif WebCheckout API payload
      const callbackUrl = `${baseUrl}/api/payments/alif/callback`;
      const paymentData = {
        merchant_id: alifMerchantKey,
        password: hashedPassword,  // Отправляем хэшированный пароль
        amount: amount,            // Сумма в тийинах
        order_id: orderId,
        description: `Оплата тура №${orderNumber}`,
        return_url: returnUrl || defaultReturnUrl,
        callback_url: callbackUrl,
        customer_email: order.customer.email,
        customer_phone: order.customer.phone || ''
      };

      // Отправить запрос к Alif WebCheckout API
      const response = await fetch(`${alifApiUrl}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        console.error('❌ Alif WebCheckout API failed:', response.statusText);
        return res.status(500).json({
          success: false,
          message: 'Failed to communicate with Alif WebCheckout API',
        });
      }

      const responseData = await response.json() as any;
      console.log('🔄 Alif WebCheckout API response:', responseData);

      if (!responseData.success || !responseData.token) {
        console.error('❌ Alif WebCheckout payment creation failed:', responseData);
        return res.status(500).json({
          success: false,
          message: 'Failed to create Alif WebCheckout payment',
          error: responseData.error || 'Unknown error',
        });
      }

      // Обновить заказ в БД
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentMethod: 'alif',
          paymentStatus: 'processing',
          paymentIntentId: responseData.token,
        },
      });

      console.log(`✅ Alif WebCheckout payment created successfully`);

      // Возвращаем redirectUrl в формате https://web.alif.tj/checkout/<token>
      const redirectUrl = `https://web.alif.tj/checkout/${responseData.token}`;

      return res.json({
        success: true,
        redirectUrl: redirectUrl,
        token: responseData.token,
      });

    } catch (error) {
      console.error('❌ AlifPay createPayment error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create AlifPay payment',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  /**
   * Обработка callback от AlifPay с проверкой подписи
   * POST /api/payments/alif/callback
   */
  async callback(req: Request, res: Response) {
    try {
      const { order_id, status, signature } = req.body;
      
      console.log('🔄 AlifPay callback received:', { order_id, status, signature: signature ? 'present' : 'missing' });

      if (!order_id || !status) {
        console.error('❌ Missing required fields in AlifPay callback');
        return res.status(400).json({
          success: false,
          message: 'Missing order_id or status'
        });
      }

      // ✅ КРИТИЧЕСКИ ВАЖНО: Валидация подписи
      const alifMerchantKey = process.env.ALIF_MERCHANT_KEY;
      const alifMerchantPassword = process.env.ALIF_MERCHANT_PASSWORD;
      
      if (!alifMerchantKey || !alifMerchantPassword) {
        console.error('❌ AlifPay configuration missing for callback validation');
        return res.status(500).json({
          success: false,
          message: 'Payment configuration error'
        });
      }

      // Генерируем HMAC-SHA256 хэш от пароля для безопасности
      const hashedPassword = crypto
        .createHmac('sha256', alifMerchantKey)
        .update(alifMerchantPassword)
        .digest('hex');

      if (!signature) {
        console.error('❌ Missing signature in AlifPay callback');
        return res.status(403).json({
          success: false,
          message: 'Invalid signature'
        });
      }

      // Формируем строку для проверки подписи (order_id + status)
      const message = `${order_id}${status}`;
      const expected = crypto
        .createHmac('sha256', hashedPassword)
        .update(message)
        .digest('hex');

      if (signature !== expected) {
        console.error('❌ Invalid signature in AlifPay callback:', {
          received: signature,
          expected: expected,
          message: message
        });
        return res.status(403).json({
          success: false,
          message: 'Invalid signature'
        });
      }

      console.log('✅ AlifPay callback signature validated successfully');

      // Найти заказ
      const order = await prisma.order.findUnique({
        where: { id: Number(order_id) },
        include: {
          customer: true,
          tour: true,
        },
      });

      if (!order) {
        console.error('❌ Order not found for AlifPay callback:', order_id);
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // ✅ Обновить статус платежа
      if (status === 'PAID') {
        await prisma.order.update({
          where: { id: Number(order_id) },
          data: {
            paymentStatus: 'paid',
          },
        });

        console.log('✅ Payment confirmed for order:', order_id);

        // Отправить email подтверждение
        try {
          await emailService.sendPaymentConfirmation(order, order.customer);
          console.log('✅ Confirmation email sent for order:', order_id);
        } catch (emailError) {
          console.error('❌ Email sending failed:', emailError);
        }
      } else if (status === 'FAILED') {
        await prisma.order.update({
          where: { id: Number(order_id) },
          data: {
            paymentStatus: 'failed',
          },
        });
        console.log('⚠️ Payment failed for order:', order_id, 'with status:', status);
      } else {
        console.log('ℹ️ Unknown payment status for order:', order_id, 'status:', status);
      }

      return res.json({ success: true });

    } catch (error) {
      console.error('❌ AlifPay callback error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
};