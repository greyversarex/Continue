"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const EMAIL_CONFIG = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER || 'noreply@bunyod-tour.com',
        pass: process.env.SMTP_PASS || 'your-password'
    }
};
const transporter = nodemailer_1.default.createTransport(EMAIL_CONFIG);
const emailTemplates = {
    bookingConfirmation: (order, customer, tour) => ({
        subject: `Подтверждение бронирования №${order.orderNumber}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Спасибо за ваш заказ!</h1>
            <p>Ваше бронирование успешно подтверждено</p>
          </div>
          
          <div class="content">
            <p>Уважаемый(ая) ${customer.fullName},</p>
            <p>Мы рады подтвердить ваше бронирование тура. Ниже вы найдете детали вашего заказа:</p>
            
            <div class="order-details">
              <h3>Детали заказа</h3>
              <div class="detail-row">
                <span><strong>Номер заказа:</strong></span>
                <span>${order.orderNumber}</span>
              </div>
              <div class="detail-row">
                <span><strong>Тур:</strong></span>
                <span>${tour.title?.ru || tour.title?.en || 'Tour'}</span>
              </div>
              <div class="detail-row">
                <span><strong>Дата тура:</strong></span>
                <span>${new Date(order.tourDate).toLocaleDateString('ru-RU')}</span>
              </div>
              <div class="detail-row">
                <span><strong>Количество туристов:</strong></span>
                <span>${JSON.parse(order.tourists || '[]').length}</span>
              </div>
              <div class="detail-row">
                <span><strong>Общая сумма:</strong></span>
                <span style="font-size: 20px; color: #667eea;"><strong>$${order.totalAmount}</strong></span>
              </div>
            </div>
            
            <h3>Список туристов</h3>
            <ol>
              ${JSON.parse(order.tourists || '[]').map((t) => `
                <li>${t.fullName} (${t.birthDate})</li>
              `).join('')}
            </ol>
            
            ${order.hotel ? `
              <h3>Отель</h3>
              <p>${order.hotel.name?.ru || order.hotel.name?.en || 'Hotel'}</p>
            ` : ''}
            
            ${order.guide ? `
              <h3>Гид</h3>
              <p>${order.guide.name?.ru || order.guide.name?.en || 'Guide'}</p>
            ` : ''}
            
            <div style="text-align: center;">
              <a href="http://localhost:5000/my-bookings.html?order=${order.orderNumber}" class="button">
                Посмотреть детали заказа
              </a>
            </div>
            
            <div class="footer">
              <p><strong>Контакты для связи:</strong></p>
              <p>📞 +992 123 456 789 | ✉️ support@bunyod-tour.com</p>
              <p>© 2025 Bunyod-Tour. Все права защищены.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
    }),
    bookingCancellation: (order, customer) => ({
        subject: `Отмена бронирования №${order.orderNumber}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ef4444; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Бронирование отменено</h1>
          </div>
          <div class="content">
            <p>Уважаемый(ая) ${customer.fullName},</p>
            <p>Ваше бронирование №${order.orderNumber} было отменено.</p>
            <p>Если у вас есть вопросы, пожалуйста, свяжитесь с нами.</p>
            <p>С уважением,<br>Команда Bunyod-Tour</p>
          </div>
        </div>
      </body>
      </html>
    `
    }),
    paymentConfirmation: (order, customer) => ({
        subject: `Подтверждение оплаты заказа №${order.orderNumber}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Оплата получена!</h1>
          </div>
          <div class="content">
            <p>Уважаемый(ая) ${customer.fullName},</p>
            <p>Мы получили вашу оплату для заказа №${order.orderNumber}.</p>
            <p>Сумма: <strong>$${order.totalAmount}</strong></p>
            <p>Способ оплаты: ${order.paymentMethod}</p>
            <p>Ваш тур полностью подтвержден. Желаем вам приятного путешествия!</p>
            <p>С уважением,<br>Команда Bunyod-Tour</p>
          </div>
        </div>
      </body>
      </html>
    `
    }),
    adminNotification: (order, customer, tour) => ({
        subject: `Новый заказ №${order.orderNumber}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #667eea; color: white; padding: 20px; text-align: center; }
          .content { background: #f8f9fa; padding: 20px; }
          .details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Новый заказ в системе</h2>
          </div>
          <div class="content">
            <div class="details">
              <h3>Информация о заказе</h3>
              <p><strong>Номер:</strong> ${order.orderNumber}</p>
              <p><strong>Тур:</strong> ${tour.title?.ru || tour.title?.en}</p>
              <p><strong>Дата:</strong> ${new Date(order.tourDate).toLocaleDateString('ru-RU')}</p>
              <p><strong>Сумма:</strong> $${order.totalAmount}</p>
            </div>
            <div class="details">
              <h3>Информация о клиенте</h3>
              <p><strong>Имя:</strong> ${customer.fullName}</p>
              <p><strong>Email:</strong> ${customer.email}</p>
              <p><strong>Телефон:</strong> ${customer.phone}</p>
            </div>
            <p><a href="http://localhost:5000/admin-dashboard.html" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Открыть в админ-панели</a></p>
          </div>
        </div>
      </body>
      </html>
    `
    })
};
exports.emailService = {
    async sendBookingConfirmation(order, customer, tour) {
        try {
            const template = emailTemplates.bookingConfirmation(order, customer, tour);
            await transporter.sendMail({
                from: `"Bunyod-Tour" <${EMAIL_CONFIG.auth.user}>`,
                to: customer.email,
                subject: template.subject,
                html: template.html
            });
            console.log(`Booking confirmation email sent to ${customer.email}`);
            return true;
        }
        catch (error) {
            console.error('Error sending booking confirmation email:', error);
            return false;
        }
    },
    async sendCancellationEmail(order, customer) {
        try {
            const template = emailTemplates.bookingCancellation(order, customer);
            await transporter.sendMail({
                from: `"Bunyod-Tour" <${EMAIL_CONFIG.auth.user}>`,
                to: customer.email,
                subject: template.subject,
                html: template.html
            });
            console.log(`Cancellation email sent to ${customer.email}`);
            return true;
        }
        catch (error) {
            console.error('Error sending cancellation email:', error);
            return false;
        }
    },
    async sendPaymentConfirmation(order, customer) {
        try {
            const template = emailTemplates.paymentConfirmation(order, customer);
            await transporter.sendMail({
                from: `"Bunyod-Tour" <${EMAIL_CONFIG.auth.user}>`,
                to: customer.email,
                subject: template.subject,
                html: template.html
            });
            console.log(`Payment confirmation email sent to ${customer.email}`);
            return true;
        }
        catch (error) {
            console.error('Error sending payment confirmation email:', error);
            return false;
        }
    },
    async sendAdminNotification(order, customer, tour) {
        try {
            const adminEmail = process.env.ADMIN_EMAIL || 'admin@bunyod-tour.com';
            const template = emailTemplates.adminNotification(order, customer, tour);
            await transporter.sendMail({
                from: `"Bunyod-Tour System" <${EMAIL_CONFIG.auth.user}>`,
                to: adminEmail,
                subject: template.subject,
                html: template.html
            });
            console.log(`Admin notification email sent to ${adminEmail}`);
            return true;
        }
        catch (error) {
            console.error('Error sending admin notification email:', error);
            return false;
        }
    },
    async testEmailConfiguration() {
        try {
            await transporter.verify();
            console.log('Email server is ready to send messages');
            return true;
        }
        catch (error) {
            console.error('Email server configuration error:', error);
            return false;
        }
    }
};
exports.default = exports.emailService;
//# sourceMappingURL=emailService.js.map