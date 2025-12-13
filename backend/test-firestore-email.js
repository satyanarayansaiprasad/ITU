// Test script for Firestore Email Queue
require('dotenv').config();
const firebaseEmailService = require('./services/firebaseEmailService');

async function testEmailQueue() {
  console.log('\n🧪 Testing Firestore Email Queue...\n');
  
  // Set environment variable for testing
  process.env.USE_FIRESTORE_EMAIL_QUEUE = 'true';
  
  const mailOptions = {
    to: 'test@example.com', // Change this to your test email
    subject: 'Test Email from ITU System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0E2A4E;">Test Email</h2>
        <p>This is a test email from the ITU Firestore Email Queue system.</p>
        <p>If you received this, the queue system is working correctly.</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      </div>
    `,
    from: `"Indian Taekwondo Union" <${process.env.EMAIL_USER || 'indiantaekwondounion@gmail.com'}>`
  };
  
  try {
    console.log('📧 Attempting to queue email in Firestore...');
    const result = await firebaseEmailService.sendEmail(mailOptions);
    
    if (result.success) {
      console.log('\n✅ SUCCESS!');
      console.log('Email queued in Firestore:', result.queueId);
      console.log('\n📝 Next steps:');
      console.log('1. Check Firebase Console > Firestore > emailQueue collection');
      console.log('2. You should see a document with status "pending"');
      console.log('3. After deploying the Cloud Function, it will automatically send the email');
    } else {
      console.log('\n❌ FAILED');
      console.log('Error:', result.error);
    }
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
  }
}

testEmailQueue();

