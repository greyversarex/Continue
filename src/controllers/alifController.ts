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

      // Использовать формат как в старой интеграции AlifPay
      const callbackUrl = `${baseUrl}/api/payments/alif/callback`;
      const info = `Оплата тура №${orderNumber}`;

      // Generate HMAC token: HMAC_SHA256(key+orderId+amount+callbackUrl, HMAC_SHA256(password, key))
      const step1 = crypto.createHmac('sha256', hashedPassword).update(alifMerchantKey).digest('hex');
      const step2Data = alifMerchantKey + orderId + amount + callbackUrl;
      const token = crypto.createHmac('sha256', step1).update(step2Data).digest('hex');

      // Обновить заказ в БД
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentMethod: 'alif',
          paymentStatus: 'processing',
          paymentIntentId: orderId,
        },
      });

      console.log(`✅ AlifPay payment data prepared successfully`);

      // Return form data for redirect to Alif (использует веб-форму, а не прямой API)
      const alifFormData = {
        key: alifMerchantKey,
        orderId: orderId,
        amount: amount,
        info: info,
        returnUrl: returnUrl || defaultReturnUrl,
        callbackUrl: callbackUrl,
        email: order.customer.email,
        phone: order.customer.phone || '',
        gate: 'vsa',
        token: token,
      };

      return res.json({
        success: true,
        paymentUrl: 'https://web.alif.tj/',
        formData: alifFormData,
        method: 'POST',
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
      if (status === 'paid') {
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
      } else {
        await prisma.order.update({
          where: { id: Number(order_id) },
          data: {
            paymentStatus: 'failed',
          },
        });
        console.log('⚠️ Payment failed for order:', order_id, 'with status:', status);
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