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

      // Преобразовать сумму в тийины (умножить на 100)
      const amount = Math.round(order.totalAmount * 100);
      const orderId = order.id.toString();

      // URLs для возврата
      const defaultReturnUrl = `${baseUrl}/payment-success?orderNumber=${orderNumber}`;
      const defaultFailUrl = `${baseUrl}/payment-fail?orderNumber=${orderNumber}`;

      console.log(`🔄 Creating AlifPay payment: Order ${orderId}, Amount ${amount} тийинов`);

      // Подготовить данные для AlifPay API
      const paymentData = {
        merchant_id: alifMerchantKey,
        amount: amount,
        order_id: orderId,
        return_url: returnUrl || defaultReturnUrl,
        fail_url: failUrl || defaultFailUrl
      };

      // Создать подпись с помощью ALIF_MERCHANT_PASSWORD
      const signatureString = `${paymentData.merchant_id}${paymentData.amount}${paymentData.order_id}${paymentData.return_url}${paymentData.fail_url}`;
      const signature = crypto
        .createHmac('sha256', alifMerchantPassword)
        .update(signatureString)
        .digest('hex');

      // Добавить подпись к данным
      const requestData = {
        ...paymentData,
        signature
      };

      // Отправить запрос к AlifPay API
      const response = await fetch(`${alifApiUrl}/merchant/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        console.error('❌ AlifPay API failed:', response.statusText);
        return res.status(500).json({
          success: false,
          message: 'Failed to communicate with AlifPay API',
        });
      }

      const responseData = await response.json();
      console.log('🔄 AlifPay API response:', responseData);

      if (!responseData.success || !responseData.redirectUrl) {
        console.error('❌ AlifPay payment creation failed:', responseData);
        return res.status(500).json({
          success: false,
          message: 'Failed to create AlifPay payment',
          error: responseData.error || 'Unknown error',
        });
      }

      // Обновить заказ в БД
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentMethod: 'alif',
          paymentStatus: 'processing',
          paymentIntentId: responseData.paymentId || orderId,
        },
      });

      console.log(`✅ AlifPay payment created successfully`);

      // Вернуть URL для редиректа
      return res.json({
        success: true,
        redirectUrl: responseData.redirectUrl,
        paymentId: responseData.paymentId || orderId,
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
      const alifMerchantPassword = process.env.ALIF_MERCHANT_PASSWORD;
      
      if (!alifMerchantPassword) {
        console.error('❌ AlifPay configuration missing for callback validation');
        return res.status(500).json({
          success: false,
          message: 'Payment configuration error'
        });
      }

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
        .createHmac('sha256', alifMerchantPassword)
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