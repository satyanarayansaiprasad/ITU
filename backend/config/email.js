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
  // Remove spaces from password (Gmail app passwords should not have spaces)
  const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : null;
  const emailFrom = process.env.EMAIL_FROM || emailUser;

  if (!emailUser || !emailPass) {
    console.error('Email configuration missing: EMAIL_USER and EMAIL_PASS are required');
    console.error('Current EMAIL_USER:', emailUser ? '***set***' : 'NOT SET');
    console.error('Current EMAIL_PASS:', emailPass ? '***set***' : 'NOT SET');
    return null;
  }

  // Log password length for debugging (without showing actual password)
  console.log(`📧 Email Password Length: ${emailPass.length} characters`);

  // Configuration object
  const config = {
    auth: {
      user: emailUser.trim(),
      pass: emailPass
    },
    // Add connection timeout options to prevent hanging
    connectionTimeout: 10000, // 10 seconds (increased for reliability)
    greetingTimeout: 10000, // 10 seconds
    socketTimeout: 10000, // 10 seconds
  };

  // If custom host is provided, use it (for custom SMTP servers)
  if (emailHost) {
    config.host = emailHost;
    config.port = emailPort;
    config.secure = emailPort === 465; // true for 465, false for other ports
  } else {
    // Use service name (gmail, outlook, yahoo, etc.)
    config.service = emailService;
    // For Gmail, ensure we use the correct settings
    if (emailService === 'gmail' || emailService.toLowerCase() === 'gmail') {
      config.secure = false; // Gmail uses STARTTLS on port 587
      config.requireTLS = true;
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
const sendEmail = async (mailOptions, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`\n========== EMAIL SENDING ATTEMPT ${attempt}/${retries} ==========`);
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('From:', mailOptions.from);
      console.log('Timestamp:', new Date().toISOString());
      
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
        console.error('EMAIL_PASS:', process.env.EMAIL_PASS ? `***set*** (${process.env.EMAIL_PASS.replace(/\s+/g, '').length} chars)` : '❌ NOT SET');
        console.error('EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'gmail (default)');
        console.error('=========================================\n');
        throw new Error(errorMsg);
      }
      
      // Send email directly (skip verification to avoid timeout)
      console.log('Sending email...');
      const info = await transporter.sendMail(mailOptions);
      
      console.log('\n========== EMAIL SENT SUCCESSFULLY ==========');
      console.log('Message ID:', info.messageId);
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('Response:', info.response || 'N/A');
      console.log('Accepted:', info.accepted || 'N/A');
      console.log('Rejected:', info.rejected || 'N/A');
      console.log('=============================================\n');
      return { success: true, info };
    } catch (error) {
      console.error(`\n❌ Attempt ${attempt}/${retries} failed:`);
      console.error('Error:', error.message);
      
      // If this is the last attempt, return error
      if (attempt === retries) {
        console.error('\n========== EMAIL ERROR DETAILS ==========');
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
        console.error('EMAIL_HOST:', process.env.EMAIL_HOST || 'not set (using service)');
        console.error('===========================================\n');
        
        // Reset transporter cache for next time
        cachedTransporter = null;
        
        return { success: false, error: error.message, fullError: error };
      }
      
      // Wait before retry (exponential backoff)
      const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      console.log(`⏳ Waiting ${waitTime}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      // Reset transporter cache before retry
      cachedTransporter = null;
    }
  }
};
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

