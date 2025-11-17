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
app.use(cors({
  origin: [
    'https://itu-mu.vercel.app',
    'https://itu-r1qa.onrender.com',
    'https://taekwondounion.com',
    'https://www.taekwondounion.com',
    'http://localhost:5173',
    'http://localhost:3000',
    ...(process.env.ALLOWED_ORIGINS?.split(',') || [])
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set true in production with HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
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

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
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
