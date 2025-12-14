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
    // Increased timeout options for better reliability
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000, // 10 seconds
    socketTimeout: 10000, // 10 seconds
  };

  // If custom host is provided, use it (for custom SMTP servers)
  if (emailHost) {
    config.host = emailHost;
    config.port = emailPort;
    config.secure = emailPort === 465; // true for 465, false for other ports
  } else {
    // For Gmail, use explicit SMTP settings instead of service name
    if (emailService === 'gmail' || emailService.toLowerCase() === 'gmail') {
      // Gmail SMTP settings - try port 587 first (STARTTLS)
      config.host = 'smtp.gmail.com';
      config.port = 587;
      config.secure = false; // Use STARTTLS
      config.requireTLS = true;
      config.tls = {
        ciphers: 'SSLv3',
        rejectUnauthorized: false // Allow self-signed certificates for Render
      };
      // Alternative: Try port 465 (SSL) if 587 doesn't work
      // Uncomment below and comment above if 587 times out:
      // config.port = 465;
      // config.secure = true;
    } else {
      // Use service name for other providers
      config.service = emailService;
    }
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
  console.log('\n\n🚀🚀🚀 SEND EMAIL FUNCTION CALLED 🚀🚀🚀');
  console.log('Timestamp:', new Date().toISOString());
  
  try {
    console.log('\n========== EMAIL SENDING ATTEMPT ==========');
    console.log('To:', mailOptions.to);
    console.log('Subject:', mailOptions.subject);
    console.log('From:', mailOptions.from);
    
    let transporter = getTransporter();
    
    // If transporter is null, try to recreate it
    if (!transporter) {
      console.log('⚠️  Transporter is null, attempting to recreate...');
      cachedTransporter = null; // Reset cache
      transporter = getTransporter();
    }
    
    if (!transporter) {
      const errorMsg = 'Email transporter is not configured. Please check EMAIL_USER and EMAIL_PASS environment variables.';
      console.error('\n========== EMAIL ERROR DETAILS ==========');
      console.error('ERROR TYPE: Transporter Not Configured');
      console.error('ERROR MESSAGE:', errorMsg);
      console.error('EMAIL_USER:', process.env.EMAIL_USER ? '***set***' : '❌ NOT SET');
      console.error('EMAIL_PASS:', process.env.EMAIL_PASS ? '***set***' : '❌ NOT SET');
      console.error('EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'gmail (default)');
      console.error('=========================================\n');
      throw new Error(errorMsg);
    }
    
    // Send email with timeout wrapper
    console.log('Attempting to send email...');
    console.log('Using SMTP:', {
      host: transporter.options?.host || 'service-based',
      port: transporter.options?.port || 'service-based',
      secure: transporter.options?.secure,
      service: transporter.options?.service
    });
    
    // Wrap sendMail in a timeout promise
    const sendPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Email send timeout after 30 seconds')), 30000);
    });
    
    const info = await Promise.race([sendPromise, timeoutPromise]);
    console.log('\n========== EMAIL SENT SUCCESSFULLY ==========');
    console.log('Message ID:', info.messageId);
    console.log('To:', mailOptions.to);
    console.log('Subject:', mailOptions.subject);
    console.log('Response:', info.response || 'N/A');
    console.log('=============================================\n');
    return { success: true, info };
  } catch (error) {
    console.error('\n========== EMAIL ERROR DETAILS ==========');
    console.error('ERROR TYPE:', error.name || 'Unknown');
    console.error('ERROR MESSAGE:', error.message);
    console.error('ERROR CODE:', error.code || 'N/A');
    console.error('ERROR COMMAND:', error.command || 'N/A');
    console.error('ERROR RESPONSE:', error.response || 'N/A');
    console.error('ERROR STACK:', error.stack || 'N/A');
    console.error('\n--- Email Details ---');
    console.error('To:', mailOptions.to);
    console.error('Subject:', mailOptions.subject);
    console.error('From:', mailOptions.from);
    console.error('\n--- Configuration Check ---');
    console.error('EMAIL_USER:', process.env.EMAIL_USER ? '***configured***' : '❌ NOT SET');
    console.error('EMAIL_PASS:', process.env.EMAIL_PASS ? '***configured***' : '❌ NOT SET');
    console.error('EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'gmail (default)');
    console.error('EMAIL_HOST:', process.env.EMAIL_HOST || 'not set (using service)');
    console.error('===========================================\n');
    
    // Also log full error object for debugging
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

