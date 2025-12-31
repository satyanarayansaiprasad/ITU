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
  'https://itu-mu.vercel.app',
  'https://itu-r1qa.onrender.com',
  'https://taekwondounion.com',
  'https://www.taekwondounion.com',
  'http://localhost:5173',
  'http://localhost:3000',
  ...(process.env.ALLOWED_ORIGINS?.split(',').map(origin => origin.trim()).filter(Boolean) || [])
];

// Manual CORS middleware as fallback
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow if origin is in allowed list, or if no origin (same-origin requests)
  if (!origin || allowedOrigins.includes(origin)) {
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
    } else {
      res.header('Access-Control-Allow-Origin', '*');
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.header('Access-Control-Expose-Headers', 'Content-Range, X-Content-Range');
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  
  next();
});

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS blocked origin: ${origin}`);
      // For now, allow all origins to debug - change to callback(new Error('Not allowed by CORS')) for production
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
