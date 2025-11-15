const nodemailer = require("nodemailer");
require('dotenv').config();

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
    return null;
  }

  // Configuration object
  const config = {
    auth: {
      user: emailUser,
      pass: emailPass
    }
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
    
    // Verify connection
    transporter.verify((error, success) => {
      if (error) {
        console.error('Email transporter verification failed:', error);
      } else {
        console.log('Email server is ready to send messages');
      }
    });

    return transporter;
  } catch (error) {
    console.error('Error creating email transporter:', error);
    return null;
  }
};

const transporter = createTransporter();

// Get email from address
const getEmailFrom = () => {
  return process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@example.com';
};

module.exports = {
  transporter,
  getEmailFrom,
  createTransporter
};

