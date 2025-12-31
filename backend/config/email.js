const nodemailer = require("nodemailer");
require('dotenv').config();

let cachedTransporter = null;
let lastConfigHash = null;

// Create a hash of the current email configuration
const getConfigHash = () => {
  return `${process.env.EMAIL_USER || ''}_${process.env.EMAIL_PASS || ''}_${process.env.EMAIL_HOST || ''}_${process.env.EMAIL_PORT || ''}`;
};

// Create and configure email transporter with multiple fallback options
const createTransporter = () => {
  const emailService = process.env.EMAIL_SERVICE || 'gmail';
  const emailHost = process.env.EMAIL_HOST;
  const emailPort = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : null;
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const emailFrom = process.env.EMAIL_FROM || emailUser;

  if (!emailUser || !emailPass) {
    console.error('❌ Email configuration missing: EMAIL_USER and EMAIL_PASS are required');
    console.error('Current EMAIL_USER:', emailUser ? '***set***' : 'NOT SET');
    console.error('Current EMAIL_PASS:', emailPass ? '***set***' : 'NOT SET');
    return null;
  }

  // Try multiple Gmail configurations for better compatibility
  const gmailConfigs = [
    // Config 1: Port 465 with SSL (most reliable on Render)
    {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: emailUser, pass: emailPass },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
      tls: { rejectUnauthorized: false }
    },
    // Config 2: Port 587 with STARTTLS (fallback)
    {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: { user: emailUser, pass: emailPass },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
      tls: { rejectUnauthorized: false }
    },
    // Config 3: Service-based (last resort)
    {
      service: 'gmail',
      auth: { user: emailUser, pass: emailPass },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000
    }
  ];

  // If custom host is provided, use it
  if (emailHost) {
    const config = {
      host: emailHost,
      port: emailPort || 587,
      secure: emailPort === 465,
      auth: { user: emailUser, pass: emailPass },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000
    };
    
    if (emailPort === 465) {
      config.secure = true;
    } else {
      config.secure = false;
      config.requireTLS = true;
    }
    
    try {
      const transporter = nodemailer.createTransport(config);
      console.log('✅ Email transporter created with custom host:', emailHost);
      return transporter;
    } catch (error) {
      console.error('❌ Error creating transporter with custom host:', error.message);
      return null;
    }
  }

  // For Gmail, try configurations in order
  if (emailService === 'gmail' || emailService.toLowerCase() === 'gmail') {
    for (let i = 0; i < gmailConfigs.length; i++) {
      try {
        const config = gmailConfigs[i];
        const transporter = nodemailer.createTransport(config);
        console.log(`✅ Gmail transporter created (config ${i + 1}/${gmailConfigs.length})`);
        return transporter;
      } catch (error) {
        console.warn(`⚠️  Gmail config ${i + 1} failed:`, error.message);
        if (i === gmailConfigs.length - 1) {
          console.error('❌ All Gmail configurations failed');
          return null;
        }
      }
    }
  } else {
    // Use service name for other providers
    const config = {
      service: emailService,
      auth: { user: emailUser, pass: emailPass },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000
    };
    
    try {
      const transporter = nodemailer.createTransport(config);
      console.log(`✅ Email transporter created with service: ${emailService}`);
      return transporter;
    } catch (error) {
      console.error('❌ Error creating transporter:', error.message);
      return null;
    }
  }

  return null;
};

// Get transporter - recreate if config changed
const getTransporter = () => {
  const currentConfigHash = getConfigHash();
  
  if (!cachedTransporter || lastConfigHash !== currentConfigHash) {
    console.log('📧 Recreating email transporter...');
    cachedTransporter = createTransporter();
    lastConfigHash = currentConfigHash;
    
    if (cachedTransporter) {
      console.log('✅ Email transporter ready');
    } else {
      console.error('❌ Email transporter creation failed');
    }
  }
  
  return cachedTransporter;
};

// Initialize transporter on module load
const transporter = createTransporter();
cachedTransporter = transporter;
lastConfigHash = getConfigHash();

// Log email configuration status on startup
console.log('\n📧 ========== EMAIL CONFIGURATION STATUS ==========');
console.log('  EMAIL_USER:', process.env.EMAIL_USER ? '***configured***' : '❌ NOT SET');
console.log('  EMAIL_PASS:', process.env.EMAIL_PASS ? '***configured***' : '❌ NOT SET');
console.log('  EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'gmail (default)');
console.log('  EMAIL_HOST:', process.env.EMAIL_HOST || 'not set (using service)');
console.log('  EMAIL_PORT:', process.env.EMAIL_PORT || 'not set (auto)');
console.log('  Transporter Status:', transporter ? '✅ Created' : '❌ Failed to create');
console.log('==================================================\n');

// Get email from address
const getEmailFrom = () => {
  return process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@example.com';
};

// Helper function to send email with retry and multiple transporter attempts
const sendEmail = async (mailOptions, retryCount = 0) => {
  const maxRetries = 2;
  
  console.log('\n\n🚀🚀🚀 SEND EMAIL FUNCTION CALLED 🚀🚀🚀');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Attempt:', retryCount + 1);
  
  try {
    console.log('\n========== EMAIL SENDING ATTEMPT ==========');
    console.log('To:', mailOptions.to);
    console.log('Subject:', mailOptions.subject);
    console.log('From:', mailOptions.from);
    
    // Reset transporter cache on retry
    if (retryCount > 0) {
      console.log('🔄 Resetting transporter cache for retry...');
      cachedTransporter = null;
    }
    
    let transporter = getTransporter();
    
    if (!transporter) {
      console.log('⚠️  Transporter is null, attempting to recreate...');
      cachedTransporter = null;
      transporter = createTransporter();
      cachedTransporter = transporter;
    }
    
    if (!transporter) {
      const errorMsg = 'Email transporter is not configured. Please check EMAIL_USER and EMAIL_PASS environment variables.';
      console.error('\n========== EMAIL ERROR DETAILS ==========');
      console.error('ERROR TYPE: Transporter Not Configured');
      console.error('ERROR MESSAGE:', errorMsg);
      console.error('EMAIL_USER:', process.env.EMAIL_USER ? '***set***' : '❌ NOT SET');
      console.error('EMAIL_PASS:', process.env.EMAIL_PASS ? '***set***' : '❌ NOT SET');
      console.error('EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'gmail (default)');
      console.error('EMAIL_HOST:', process.env.EMAIL_HOST || 'not set');
      console.error('EMAIL_PORT:', process.env.EMAIL_PORT || 'not set');
      console.error('=========================================\n');
      throw new Error(errorMsg);
    }
    
    // Log transporter configuration
    const transporterOptions = transporter.options || {};
    console.log('SMTP Config:', {
      host: transporterOptions.host || 'service-based',
      port: transporterOptions.port || 'service-based',
      secure: transporterOptions.secure,
      service: transporterOptions.service
    });
    
    // Send email with timeout
    console.log('Attempting to send email...');
    const sendPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Email send timeout after 20 seconds')), 20000);
    });
    
    const info = await Promise.race([sendPromise, timeoutPromise]);
    
    console.log('\n========== ✅ EMAIL SENT SUCCESSFULLY ==========');
    console.log('Message ID:', info.messageId);
    console.log('To:', mailOptions.to);
    console.log('Subject:', mailOptions.subject);
    console.log('Response:', info.response || 'N/A');
    console.log('Accepted:', info.accepted || 'N/A');
    console.log('Rejected:', info.rejected || 'N/A');
    console.log('=============================================\n');
    
    return { success: true, info };
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
    console.error('From:', mailOptions.from);
    console.error('\n--- Configuration Check ---');
    console.error('EMAIL_USER:', process.env.EMAIL_USER ? '***configured***' : '❌ NOT SET');
    console.error('EMAIL_PASS:', process.env.EMAIL_PASS ? '***configured***' : '❌ NOT SET');
    console.error('EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'gmail (default)');
    console.error('EMAIL_HOST:', process.env.EMAIL_HOST || 'not set');
    console.error('EMAIL_PORT:', process.env.EMAIL_PORT || 'not set');
    console.error('===========================================\n');
    
    // Retry logic
    if (retryCount < maxRetries && (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED' || error.message.includes('timeout'))) {
      console.log(`⏳ Retrying email send (${retryCount + 1}/${maxRetries})...`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      return sendEmail(mailOptions, retryCount + 1);
    }
    
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
