const { Resend } = require('resend');
require('dotenv').config();

let resendClient = null;

// Initialize Resend client
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.error('❌ RESEND_API_KEY is not set in environment variables');
    return null;
  }
  
  if (!resendClient) {
    resendClient = new Resend(apiKey);
    console.log('✅ Resend client initialized');
  }
  
  return resendClient;
};

// Log email configuration status on startup
console.log('\n📧 ========== EMAIL CONFIGURATION STATUS (RESEND) ==========');
console.log('  RESEND_API_KEY:', process.env.RESEND_API_KEY ? '***configured***' : '❌ NOT SET');
console.log('  RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || 'not set (will use default)');
console.log('  Resend Client:', getResendClient() ? '✅ Initialized' : '❌ Failed');
console.log('==========================================================\n');

// Get email from address
const getEmailFrom = () => {
  // Resend format: "Name <email@domain.com>" or just "email@domain.com"
  const fromEmail = process.env.RESEND_FROM_EMAIL || process.env.EMAIL_USER || 'onboarding@resend.dev';
  const fromName = process.env.RESEND_FROM_NAME || 'Indian Taekwondo Union';
  
  // If email contains @, use it; otherwise format it properly
  if (fromEmail.includes('@')) {
    return `${fromName} <${fromEmail}>`;
  }
  return fromEmail;
};

// Helper function to send email using Resend
const sendEmail = async (mailOptions) => {
  console.log('\n\n🚀🚀🚀 SEND EMAIL FUNCTION CALLED (RESEND) 🚀🚀🚀');
  console.log('Timestamp:', new Date().toISOString());
  
  try {
    console.log('\n========== EMAIL SENDING ATTEMPT ==========');
    console.log('To:', mailOptions.to);
    console.log('Subject:', mailOptions.subject);
    console.log('From:', mailOptions.from || getEmailFrom());
    
    const client = getResendClient();
    
    if (!client) {
      const errorMsg = 'Resend API key is not configured. Please set RESEND_API_KEY environment variable.';
      console.error('\n========== EMAIL ERROR DETAILS ==========');
      console.error('ERROR TYPE: Resend Not Configured');
      console.error('ERROR MESSAGE:', errorMsg);
      console.error('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '***set***' : '❌ NOT SET');
      console.error('=========================================\n');
      throw new Error(errorMsg);
    }
    
    // Parse from email - Resend accepts "email@domain.com" or "Name <email@domain.com>"
    let fromEmail = mailOptions.from || getEmailFrom();
    
    // If it's already in "Name <email>" format, use it; otherwise format it
    if (!fromEmail.includes('<')) {
      const fromName = process.env.RESEND_FROM_NAME || 'Indian Taekwondo Union';
      const emailOnly = fromEmail.replace(/.*<|>.*/g, '').trim() || fromEmail;
      fromEmail = `${fromName} <${emailOnly}>`;
    }
    
    // Ensure 'to' is an array
    const toEmails = Array.isArray(mailOptions.to) ? mailOptions.to : [mailOptions.to];
    
    // Send email using Resend
    console.log('Sending email via Resend API...');
    console.log('From:', fromEmail);
    console.log('To:', toEmails);
    
    const { data, error } = await client.emails.send({
      from: fromEmail,
      to: toEmails,
      subject: mailOptions.subject,
      html: mailOptions.html,
      text: mailOptions.text || (mailOptions.html ? mailOptions.html.replace(/<[^>]*>/g, '') : undefined)
    });
    
    if (error) {
      console.error('\n========== RESEND API ERROR ==========');
      console.error('ERROR:', JSON.stringify(error, null, 2));
      console.error('=====================================\n');
      throw new Error(error.message || 'Resend API error');
    }
    
    console.log('\n========== ✅ EMAIL SENT SUCCESSFULLY ==========');
    console.log('Message ID:', data?.id);
    console.log('To:', mailOptions.to);
    console.log('Subject:', mailOptions.subject);
    console.log('Resend Response:', JSON.stringify(data, null, 2));
    console.log('=============================================\n');
    
    return { 
      success: true, 
      info: {
        messageId: data?.id,
        response: 'Email sent via Resend',
        accepted: [mailOptions.to],
        rejected: []
      }
    };
  } catch (error) {
    console.error('\n========== ❌ EMAIL ERROR DETAILS ==========');
    console.error('ERROR TYPE:', error.name || 'Unknown');
    console.error('ERROR MESSAGE:', error.message);
    console.error('ERROR STACK:', error.stack || 'N/A');
    console.error('\n--- Email Details ---');
    console.error('To:', mailOptions.to);
    console.error('Subject:', mailOptions.subject);
    console.error('From:', mailOptions.from || getEmailFrom());
    console.error('\n--- Configuration Check ---');
    console.error('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '***configured***' : '❌ NOT SET');
    console.error('RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || 'not set');
    console.error('===========================================\n');
    
    console.error('FULL ERROR OBJECT:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    
    return { success: false, error: error.message, fullError: error };
  }
};

// Legacy transporter getter for backward compatibility (returns null, use sendEmail instead)
const getTransporter = () => {
  console.warn('⚠️  getTransporter() called - Resend doesn\'t use transporters. Use sendEmail() instead.');
  return null;
};

// Legacy createTransporter for backward compatibility
const createTransporter = () => {
  console.warn('⚠️  createTransporter() called - Resend doesn\'t use transporters. Use sendEmail() instead.');
  return null;
};

module.exports = {
  get transporter() {
    return getTransporter();
  },
  getEmailFrom,
  createTransporter,
  sendEmail,
  getResendClient
};
