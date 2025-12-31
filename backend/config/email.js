const nodemailer = require("nodemailer");
require('dotenv').config();

let cachedTransporter = null;

// Create and configure email transporter for Gmail SMTP
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER || process.env.GMAIL_USER;
  const emailPass = process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;
  const emailFrom = process.env.EMAIL_FROM || emailUser;

  if (!emailUser || !emailPass) {
    console.error('❌ Email configuration missing: EMAIL_USER and EMAIL_PASS are required');
    console.error('Current EMAIL_USER:', emailUser ? '***set***' : 'NOT SET');
    console.error('Current EMAIL_PASS:', emailPass ? '***set***' : 'NOT SET');
    return null;
  }

  // Gmail SMTP configuration
  const config = {
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    },
    // Timeout settings for better reliability
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
  };

  try {
    const transporter = nodemailer.createTransport(config);
    console.log('✅ Gmail SMTP transporter created successfully');
    return transporter;
  } catch (error) {
    console.error('❌ Error creating Gmail transporter:', error.message);
    return null;
  }
};

// Get transporter - create if not exists
const getTransporter = () => {
  if (!cachedTransporter) {
    cachedTransporter = createTransporter();
  }
  return cachedTransporter;
};

// Initialize transporter on module load
cachedTransporter = createTransporter();

// Log email configuration status on startup
console.log('\n📧 ========== EMAIL CONFIGURATION STATUS (GMAIL SMTP) ==========');
console.log('  EMAIL_USER:', process.env.EMAIL_USER ? '***configured***' : '❌ NOT SET');
console.log('  EMAIL_PASS:', process.env.EMAIL_PASS ? '***configured***' : '❌ NOT SET');
console.log('  EMAIL_FROM:', process.env.EMAIL_FROM || process.env.EMAIL_USER || 'not set');
console.log('  Transporter Status:', cachedTransporter ? '✅ Created' : '❌ Failed to create');
console.log('==========================================================\n');

// Get email from address
const getEmailFrom = () => {
  const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@example.com';
  const fromName = process.env.EMAIL_FROM_NAME || 'Indian Taekwondo Union';
  
  // Format: "Name <email@domain.com>"
  if (fromEmail.includes('@')) {
    return `${fromName} <${fromEmail}>`;
  }
  return fromEmail;
};

// Helper function to send email using Gmail SMTP
const sendEmail = async (mailOptions) => {
  console.log('\n\n🚀🚀🚀 SEND EMAIL FUNCTION CALLED (GMAIL SMTP) 🚀🚀🚀');
  console.log('Timestamp:', new Date().toISOString());
  
  try {
    console.log('\n========== EMAIL SENDING ATTEMPT ==========');
    console.log('To:', mailOptions.to);
    console.log('Subject:', mailOptions.subject);
    console.log('From:', mailOptions.from || getEmailFrom());
    
    const transporter = getTransporter();
    
    if (!transporter) {
      const errorMsg = 'Email transporter is not configured. Please set EMAIL_USER and EMAIL_PASS environment variables.';
      console.error('\n========== EMAIL ERROR DETAILS ==========');
      console.error('ERROR TYPE: Transporter Not Configured');
      console.error('ERROR MESSAGE:', errorMsg);
      console.error('EMAIL_USER:', process.env.EMAIL_USER ? '***set***' : '❌ NOT SET');
      console.error('EMAIL_PASS:', process.env.EMAIL_PASS ? '***set***' : '❌ NOT SET');
      console.error('=========================================\n');
      throw new Error(errorMsg);
    }
    
    // Send email
    console.log('Sending email via Gmail SMTP...');
    const info = await transporter.sendMail({
      from: mailOptions.from || getEmailFrom(),
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html,
      text: mailOptions.text || (mailOptions.html ? mailOptions.html.replace(/<[^>]*>/g, '') : undefined)
    });
    
    console.log('\n========== ✅ EMAIL SENT SUCCESSFULLY ==========');
    console.log('Message ID:', info.messageId);
    console.log('To:', mailOptions.to);
    console.log('Subject:', mailOptions.subject);
    console.log('Response:', info.response || 'N/A');
    console.log('Accepted:', info.accepted || 'N/A');
    console.log('Rejected:', info.rejected || 'N/A');
    console.log('=============================================\n');
    
    return { 
      success: true, 
      info: {
        messageId: info.messageId,
        response: info.response || 'Email sent via Gmail SMTP',
        accepted: info.accepted || [mailOptions.to],
        rejected: info.rejected || []
      }
    };
  } catch (error) {
    console.error('\n========== ❌ EMAIL ERROR DETAILS ==========');
    console.error('ERROR TYPE:', error.name || 'Unknown');
    console.error('ERROR MESSAGE:', error.message);
    console.error('ERROR CODE:', error.code || 'N/A');
    console.error('ERROR COMMAND:', error.command || 'N/A');
    console.error('ERROR RESPONSE:', error.response || 'N/A');
    console.error('\n--- Email Details ---');
    console.error('To:', mailOptions.to);
    console.error('Subject:', mailOptions.subject);
    console.error('From:', mailOptions.from || getEmailFrom());
    console.error('\n--- Configuration Check ---');
    console.error('EMAIL_USER:', process.env.EMAIL_USER ? '***configured***' : '❌ NOT SET');
    console.error('EMAIL_PASS:', process.env.EMAIL_PASS ? '***configured***' : '❌ NOT SET');
    console.error('===========================================\n');
    
    console.error('FULL ERROR OBJECT:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    
    return { success: false, error: error.message, fullError: error };
  }
};

module.exports = {
  get transporter() {
    return getTransporter();
  },
  getEmailFrom,
  createTransporter,
  sendEmail
};
