import nodemailer from 'nodemailer';

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // You can change this to other services like outlook, yahoo, etc.
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD // Use App Password for Gmail
    }
  });
};

export const sendAdminNotification = async (bookingData: {
  fullName: string;
  email: string;
  preferredDate: string;
  numberOfPeople: number;
  tourTitle: string;
}) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `New Booking Request - ${bookingData.tourTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb; margin-bottom: 20px;">New Booking Request</h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #1e293b; margin-top: 0;">Tour Details</h3>
          <p><strong>Tour:</strong> ${bookingData.tourTitle}</p>
          <p><strong>Preferred Date:</strong> ${bookingData.preferredDate}</p>
          <p><strong>Number of People:</strong> ${bookingData.numberOfPeople}</p>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #1e293b; margin-top: 0;">Customer Information</h3>
          <p><strong>Name:</strong> ${bookingData.fullName}</p>
          <p><strong>Email:</strong> ${bookingData.email}</p>
        </div>
        
        <div style="padding: 15px; background-color: #dbeafe; border-left: 4px solid #2563eb; margin-top: 20px;">
          <p style="margin: 0; color: #1e40af;">
            <strong>Action Required:</strong> Please review this booking request and contact the customer within 24 hours to confirm availability and arrange payment.
          </p>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
        
        <p style="font-size: 14px; color: #64748b; text-align: center;">
          This is an automated notification from Tajik Trails booking system.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent successfully');
  } catch (error) {
    console.error('Error sending admin notification:', error);
    throw error;
  }
};

export const sendCustomerConfirmation = async (bookingData: {
  fullName: string;
  email: string;
  preferredDate: string;
  numberOfPeople: number;
  tourTitle: string;
}) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: bookingData.email,
    subject: `Booking Request Confirmation - ${bookingData.tourTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin-bottom: 10px;">Tajik Trails</h1>
          <p style="color: #64748b; margin: 0;">Discover the Beauty of Tajikistan</p>
        </div>
        
        <h2 style="color: #1e293b; margin-bottom: 20px;">Thank You for Your Booking Request!</h2>
        
        <p style="color: #374151; line-height: 1.6;">
          Dear ${bookingData.fullName},
        </p>
        
        <p style="color: #374151; line-height: 1.6;">
          We have received your booking request for our tour and are excited to help you explore the magnificent landscapes and rich culture of Tajikistan.
        </p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e293b; margin-top: 0;">Your Booking Details</h3>
          <p><strong>Tour:</strong> ${bookingData.tourTitle}</p>
          <p><strong>Preferred Date:</strong> ${bookingData.preferredDate}</p>
          <p><strong>Number of People:</strong> ${bookingData.numberOfPeople}</p>
          <p><strong>Contact Email:</strong> ${bookingData.email}</p>
        </div>
        
        <div style="padding: 15px; background-color: #dcfce7; border-left: 4px solid #16a34a; margin: 20px 0;">
          <p style="margin: 0; color: #15803d;">
            <strong>What's Next?</strong> Our team will review your request and contact you within 24 hours to confirm availability, discuss the itinerary details, and arrange payment.
          </p>
        </div>
        
        <div style="margin: 30px 0; padding: 20px; background-color: #fef3c7; border-radius: 8px;">
          <h4 style="color: #92400e; margin-top: 0;">Important Information:</h4>
          <ul style="color: #92400e; line-height: 1.6; margin: 10px 0;">
            <li>This is a booking request, not a confirmed reservation</li>
            <li>Final confirmation is subject to availability</li>
            <li>Payment details will be provided upon confirmation</li>
            <li>Please ensure your contact information is accurate</li>
          </ul>
        </div>
        
        <p style="color: #374151; line-height: 1.6;">
          If you have any questions or need to modify your request, please don't hesitate to contact us at ${process.env.EMAIL_USER || 'info@tajiktrails.com'}.
        </p>
        
        <p style="color: #374151; line-height: 1.6; margin-top: 30px;">
          Best regards,<br>
          <strong>The Tajik Trails Team</strong>
        </p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
        
        <p style="font-size: 14px; color: #64748b; text-align: center;">
          This is an automated confirmation email from Tajik Trails.<br>
          Thank you for choosing us for your Tajikistan adventure!
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Customer confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending customer confirmation:', error);
    throw error;
  }
};

export default { sendAdminNotification, sendCustomerConfirmation };