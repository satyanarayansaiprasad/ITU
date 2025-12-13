const nodemailer = require("nodemailer");
require('dotenv').config();

let cachedTransporter = null;
let lastConfigHash = null;

// Create a hash of the current email configuration
const getConfigHash = () => {
  return `${process.env.EMAIL_USER || ''}_${process.env.EMAIL_PASS || ''}_${process.env.EMAIL_HOST || ''}_${process.env.EMAIL_PORT || ''}`;
};

// Create and configure email transporter
const createTransporter = () => {
  const emailService = process.env.EMAIL_SERVICE || 'gmail';
  const emailHost = process.env.EMAIL_HOST;
  const emailPort = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587;
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const emailFrom = process.env.EMAIL_FROM || emailUser;

  if (!emailUser || !emailPass) {
    console.error('Email configuration missing: EMAIL_USER and EMAIL_PASS are required');
    console.error('Current EMAIL_USER:', emailUser ? '***set***' : 'NOT SET');
    console.error('Current EMAIL_PASS:', emailPass ? '***set***' : 'NOT SET');
    return null;
  }

  // Configuration object
  const config = {
    auth: {
      user: emailUser,
      pass: emailPass
    },
    // Add connection timeout options to prevent hanging
    connectionTimeout: 5000, // 5 seconds
    greetingTimeout: 5000, // 5 seconds
    socketTimeout: 5000, // 5 seconds
  };

  // If custom host is provided, use it (for custom SMTP servers)
  if (emailHost) {
    config.host = emailHost;
    config.port = emailPort;
    config.secure = emailPort === 465; // true for 465, false for other ports
  } else {
    // Use service name (gmail, outlook, yahoo, etc.)
    config.service = emailService;
  }

  try {
    const transporter = nodemailer.createTransport(config);
    
    // Skip verification on startup to prevent deployment timeouts
    // Verification will happen on first email send attempt
    // Only verify if explicitly enabled via environment variable
    if (process.env.EMAIL_VERIFY_ON_STARTUP === 'true') {
      // Verify connection (async, non-blocking) with timeout handling
      setImmediate(() => {
        const verifyTimeout = setTimeout(() => {
          console.warn('⚠️  Email verification timed out - server will continue. Email will be verified on first use.');
        }, 3000); // 3 second timeout
        
        transporter.verify((error, success) => {
          clearTimeout(verifyTimeout);
          if (error) {
            console.warn('⚠️  Email transporter verification failed:', error.message);
            console.warn('Email functionality will still be available but may fail on first use. Check your email configuration.');
          } else {
            console.log('✅ Email server is ready to send messages');
          }
        });
      });
    } else {
      console.log('ℹ️  Email transporter created. Verification skipped on startup to prevent deployment timeouts.');
      console.log('ℹ️  Email will be verified on first send attempt.');
    }

    return transporter;
  } catch (error) {
    console.error('Error creating email transporter:', error);
    return null;
  }
};

// Get transporter - recreate if config changed
const getTransporter = () => {
  const currentConfigHash = getConfigHash();
  
  // If config changed or transporter is null, recreate it
  if (!cachedTransporter || lastConfigHash !== currentConfigHash) {
    console.log('📧 Recreating email transporter with updated configuration...');
    cachedTransporter = createTransporter();
    lastConfigHash = currentConfigHash;
    
    if (cachedTransporter) {
      console.log('✅ Email transporter created successfully');
    } else {
      console.error('❌ Email transporter creation failed - check EMAIL_USER and EMAIL_PASS');
    }
  }
  
  return cachedTransporter;
};

// Initialize transporter on module load
const transporter = createTransporter();
cachedTransporter = transporter;
lastConfigHash = getConfigHash();

// Log email configuration status on startup
console.log('📧 Email Configuration Status:');
console.log('  EMAIL_USER:', process.env.EMAIL_USER ? '***configured***' : '❌ NOT SET');
console.log('  EMAIL_PASS:', process.env.EMAIL_PASS ? '***configured***' : '❌ NOT SET');
console.log('  EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'gmail (default)');
console.log('  EMAIL_HOST:', process.env.EMAIL_HOST || 'not set (using service)');
console.log('  Transporter Status:', transporter ? '✅ Created' : '❌ Failed to create');

// Get email from address
const getEmailFrom = () => {
  return process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@example.com';
};

// Helper function to send email with retry logic
const sendEmail = async (mailOptions) => {
  try {
    let transporter = getTransporter();
    
    // If transporter is null, try to recreate it
    if (!transporter) {
      console.log('⚠️  Transporter is null, attempting to recreate...');
      cachedTransporter = null; // Reset cache
      transporter = getTransporter();
    }
    
    if (!transporter) {
      throw new Error('Email transporter is not configured. Please check EMAIL_USER and EMAIL_PASS environment variables.');
    }
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', {
      messageId: info.messageId,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    return { success: true, info };
  } catch (error) {
    console.error('❌ Error sending email:', {
      to: mailOptions.to,
      subject: mailOptions.subject,
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    return { success: false, error: error.message };
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

