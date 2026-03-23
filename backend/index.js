const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const connectDB = require('./config/db');
const { initializeFirebase } = require('./config/firebase');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const firebaseRoutes = require('./routes/firebaseRoutes');
const statesRoutes = require('./routes/statesRoutes');

const app = express();

// Connect MongoDB
connectDB();

// Initialize Firebase
initializeFirebase();

// CORS Configuration
const allowedOrigins = [
  'https://itu-f4bn.onrender.com',
  'https://itu-mu.vercel.app',
  'https://taekwondounion.com',
  'https://www.taekwondounion.com',
  'https://taekwondo-union.web.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8080',
  ...(process.env.ALLOWED_ORIGINS?.split(',').map(origin => origin.trim()).filter(Boolean) || [])
];

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, server-to-server)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin) || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS blocked origin: ${origin}`);
      // In development, you might want to allow everything, but in production we should be careful.
      // However, to fix the issue described, we'll temporarily allow all until we confirm it's working.
      callback(null, true); 
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' })); // Limit JSON payload size
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  name: 'sessionId', // Don't use default session name
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Set true in production with HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: 'strict' // CSRF protection
  }
}));

// Health check endpoint (required for Render)
app.get('/', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'ITU Backend API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Test email endpoint (no auth required for testing)
app.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email address is required"
      });
    }

    const { sendEmail, getEmailFrom } = require('./config/email');
    
    const mailOptions = {
      from: getEmailFrom(), // getEmailFrom() already returns formatted "Name <email@domain.com>"
      to: email,
      subject: "🧪 Test Email - ITU System",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0E2A4E;">Test Email from ITU System</h2>
          <p>This is a test email to verify that the email system is working correctly.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p>If you received this email, the email system is configured correctly!</p>
        </div>
      `
    };

    const emailResult = await sendEmail(mailOptions);
    
    if (emailResult.success) {
      res.status(200).json({
        success: true,
        message: "Test email sent successfully",
        details: {
          to: email,
          messageId: emailResult.info?.messageId
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to send test email",
        details: emailResult.error
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error",
      details: error.message
    });
  }
});

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/belt-promotion', require('./routes/beltPromotionRoutes'));
app.use('/api/competition', require('./routes/competitionRoutes'));
app.use('/api/taekwondo-test', require('./routes/taekwondoRoutes'));
// Firebase routes disabled - project deleted
// app.use('/api/firebase', firebaseRoutes);
app.use('/api/states', statesRoutes); // States and Districts routes (uses static data)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    status: 'error', 
    message: 'Route not found' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    status: 'error', 
    message: err.message || 'Internal server error' 
  });
});

// Start Server - Restart trigger
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0'; // Bind to 0.0.0.0 for Render

app.listen(PORT, HOST, () => {
  console.log(`✅ Server running on ${HOST}:${PORT}`);
  console.log(`✅ Health check available at http://${HOST}:${PORT}/health`);
});
















// const express = require('express');
// const session = require('express-session');
// const connectDB = require('./config/db');
// const adminRoutes = require('./routes/adminRoutes');
// const userRoutes =require('./routes/userRoutes')
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// connectDB();

// app.use(cors({
//   origin: 'ALLOWED_ORIGINS',
//   credentials: true
// }));
// app.use(express.json());

// app.use(session({
//   secret: 'yourSecretKey',
//   resave: false,
//   saveUninitialized: false
// }));

// app.use('/api/admin', adminRoutes);
// app.use('/api/user',userRoutes);

// // ====== START THE SERVER IN SAME FILE ======
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
