import nodemailer from 'nodemailer';

interface BookingConfirmationData {
  order: any;
  customerEmail: string;
  adminEmail: string;
  communityEmail: string;
}

// Create reusable transporter object using the default SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendBookingConfirmation = async (data: BookingConfirmationData) => {
  try {
    const transporter = createTransporter();

    // Parse tourists data
    const tourists = JSON.parse(data.order.tourists);
    const touristsText = tourists.map((t: any, index: number) => 
      `${index + 1}. ${t.fullName} (${t.dateOfBirth})`
    ).join('\n');

    // Customer email template
    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea;">Подтверждение бронирования - Bunyod-Tour</h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Номер заказа: ${data.order.orderNumber}</h3>
          <p><strong>Статус:</strong> ${data.order.status === 'pending' ? 'Ожидает подтверждения' : data.order.status}</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3>Детали тура:</h3>
          <p><strong>Тур:</strong> ${JSON.parse(data.order.tour.title).ru}</p>
          <p><strong>Дата:</strong> ${data.order.tourDate}</p>
          <p><strong>Сумма:</strong> ${data.order.totalAmount} USD</p>
          ${data.order.hotel ? `<p><strong>Отель:</strong> ${JSON.parse(data.order.hotel.name).ru}</p>` : ''}
          ${data.order.guide ? `<p><strong>Гид:</strong> ${JSON.parse(data.order.guide.name).ru}</p>` : ''}
        </div>
        
        <div style="margin: 20px 0;">
          <h3>Туристы:</h3>
          <pre style="background: #f8f9fa; padding: 15px; border-radius: 4px;">${touristsText}</pre>
        </div>
        
        ${data.order.wishes ? `
        <div style="margin: 20px 0;">
          <h3>Пожелания:</h3>
          <p>${data.order.wishes}</p>
        </div>
        ` : ''}
        
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Следующие шаги:</strong></p>
          <p>1. Мы обработаем ваш заказ в течение 24 часов</p>
          <p>2. Вам будет отправлена ссылка для оплаты</p>
          <p>3. После оплаты вы получите подтверждение и детали тура</p>
        </div>
        
        <p>С уважением,<br>Команда Bunyod-Tour</p>
      </div>
    `;

    // Admin email template
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">Новый заказ - ${data.order.orderNumber}</h2>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Информация о заказе:</h3>
          <p><strong>Номер:</strong> ${data.order.orderNumber}</p>
          <p><strong>Дата создания:</strong> ${new Date(data.order.createdAt).toLocaleString('ru-RU')}</p>
          <p><strong>Сумма:</strong> ${data.order.totalAmount} USD</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3>Клиент:</h3>
          <p><strong>Имя:</strong> ${data.order.customer.fullName}</p>
          <p><strong>Email:</strong> ${data.order.customer.email}</p>
          <p><strong>Телефон:</strong> ${data.order.customer.phone}</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3>Детали тура:</h3>
          <p><strong>Тур:</strong> ${JSON.parse(data.order.tour.title).ru}</p>
          <p><strong>Дата:</strong> ${data.order.tourDate}</p>
          ${data.order.hotel ? `<p><strong>Отель:</strong> ${JSON.parse(data.order.hotel.name).ru}</p>` : ''}
          ${data.order.guide ? `<p><strong>Гид:</strong> ${JSON.parse(data.order.guide.name).ru}</p>` : ''}
        </div>
        
        <div style="margin: 20px 0;">
          <h3>Туристы (${tourists.length}):</h3>
          <pre style="background: #f8f9fa; padding: 15px; border-radius: 4px;">${touristsText}</pre>
        </div>
        
        ${data.order.wishes ? `
        <div style="margin: 20px 0;">
          <h3>Пожелания клиента:</h3>
          <p style="background: #f8f9fa; padding: 15px; border-radius: 4px;">${data.order.wishes}</p>
        </div>
        ` : ''}
        
        <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Требуется действие:</strong> Обработайте заказ в админ-панели</p>
        </div>
      </div>
    `;

    // Send emails
    const emailPromises = [
      // Customer email
      transporter.sendMail({
        from: `"Bunyod-Tour" <${process.env.SMTP_USER}>`,
        to: data.customerEmail,
        subject: `Подтверждение бронирования ${data.order.orderNumber}`,
        html: customerHtml,
      }),
      
      // Admin email
      transporter.sendMail({
        from: `"Bunyod-Tour System" <${process.env.SMTP_USER}>`,
        to: data.adminEmail,
        subject: `Новый заказ ${data.order.orderNumber}`,
        html: adminHtml,
      }),
      
      // Community email
      transporter.sendMail({
        from: `"Bunyod-Tour System" <${process.env.SMTP_USER}>`,
        to: data.communityEmail,
        subject: `Новый заказ ${data.order.orderNumber}`,
        html: adminHtml,
      }),
    ];

    await Promise.allSettled(emailPromises);
    console.log('Booking confirmation emails sent successfully');
  } catch (error) {
    console.error('Failed to send booking confirmation emails:', error);
    // Don't throw error - email is non-critical
  }
};

export const sendPaymentConfirmation = async (orderNumber: string, customerEmail: string, receiptData: any) => {
  try {
    const transporter = createTransporter();

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745;">Оплата подтверждена - Bunyod-Tour</h2>
        
        <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Заказ ${orderNumber} успешно оплачен!</h3>
          <p>Ваша оплата получена и обработана.</p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3>Электронный чек:</h3>
          <pre style="background: #f8f9fa; padding: 15px; border-radius: 4px;">${JSON.stringify(receiptData, null, 2)}</pre>
        </div>
        
        <p>В ближайшее время с вами свяжется наш менеджер для уточнения деталей тура.</p>
        
        <p>С уважением,<br>Команда Bunyod-Tour</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Bunyod-Tour" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `Оплата подтверждена - ${orderNumber}`,
      html,
    });

    console.log('Payment confirmation email sent successfully');
  } catch (error) {
    console.error('Failed to send payment confirmation email:', error);
  }
};