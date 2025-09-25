const mongoose = require('mongoose');
require('dotenv').config();

const Admin = require('./models/Admin');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

const createAdmin = async () => {
  await connectDB();
  
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'itu@gmail.com' });
    
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin);
      return;
    }
    
    // Create new admin
    const admin = new Admin({
      email: 'itu@gmail.com',
      password: 'itu@2025',
      role: 'admin'
    });
    
    await admin.save();
    console.log('Admin created successfully:', admin);
    
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();
