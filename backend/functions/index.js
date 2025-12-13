const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Initialize Firebase Admin
admin.initializeApp();

// Create reusable transporter
const createTransporter = () => {
  const emailUser = functions.config().email?.user || process.env.EMAIL_USER;
  const emailPass = functions.config().email?.pass || process.env.EMAIL_PASS;
  const emailService = functions.config().email?.service || process.env.EMAIL_SERVICE || 'gmail';

  if (!emailUser || !emailPass) {
    console.error('Email configuration missing');
    return null;
  }

  // Remove spaces from password
  const cleanPassword = emailPass.replace(/\s+/g, '');

  const config = {
    service: emailService,
    auth: {
      user: emailUser.trim(),
      pass: cleanPassword
    },
    secure: false,
    requireTLS: true,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  };

  return nodemailer.createTransport(config);
};

// HTTP Cloud Function to send email
exports.sendEmail = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, html, from } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: to, subject, html' 
      });
    }

    console.log(`📧 Firebase Function: Sending email to ${to}`);

    const transporter = createTransporter();
    if (!transporter) {
      return res.status(500).json({ 
        success: false,
        error: 'Email transporter not configured' 
      });
    }

    const emailFrom = from || `"Indian Taekwondo Union" <${functions.config().email?.user || process.env.EMAIL_USER}>`;

    const mailOptions = {
      from: emailFrom,
      to: to,
      subject: subject,
      html: html
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email sent successfully: ${info.messageId}`);

    return res.status(200).json({
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('❌ Error sending email:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      details: {
        code: error.code,
        command: error.command,
        response: error.response
      }
    });
  }
});

// Firestore trigger to send email when document is created
exports.sendEmailOnApproval = functions.firestore
  .document('emailQueue/{emailId}')
  .onCreate(async (snap, context) => {
    const emailData = snap.data();
    
    console.log(`📧 Firestore Trigger: Processing email for ${emailData.to}`);

    try {
      const transporter = createTransporter();
      if (!transporter) {
        throw new Error('Email transporter not configured');
      }

      const mailOptions = {
        from: emailData.from || `"Indian Taekwondo Union" <${functions.config().email?.user || process.env.EMAIL_USER}>`,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html
      };

      const info = await transporter.sendMail(mailOptions);
      
      console.log(`✅ Email sent via Firestore trigger: ${info.messageId}`);

      // Update the document with success status
      await snap.ref.update({
        status: 'sent',
        messageId: info.messageId,
        sentAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return null;
    } catch (error) {
      console.error('❌ Error sending email via Firestore trigger:', error);
      
      // Update the document with error status
      await snap.ref.update({
        status: 'failed',
        error: error.message,
        failedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return null;
    }
  });

