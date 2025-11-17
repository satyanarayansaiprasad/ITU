const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Check if MONGO_URI is set
    if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
      console.error('❌ MongoDB URI not found in environment variables');
      console.error('Please set MONGO_URI or MONGODB_URI in your environment variables');
      process.exit(1);
    }

    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✅ Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    console.error('Please check:');
    console.error('1. MONGO_URI or MONGODB_URI is set correctly');
    console.error('2. MongoDB server is accessible');
    console.error('3. Network/firewall settings allow connection');
    process.exit(1); // Exit the app if DB connection fails
  }
};

module.exports = connectDB;
