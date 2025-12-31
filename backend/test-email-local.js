// Test email sending locally
require('dotenv').config();
const { sendEmail, getEmailFrom } = require('./config/email');

async function testEmail() {
  console.log('\n🧪 TESTING EMAIL CONFIGURATION LOCALLY 🧪\n');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('  RESEND_API_KEY:', process.env.RESEND_API_KEY ? `SET (${process.env.RESEND_API_KEY.substring(0, 10)}...)` : '❌ NOT SET');
  console.log('  RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || 'NOT SET (using default)');
  console.log('  RESEND_FROM_NAME:', process.env.RESEND_FROM_NAME || 'NOT SET (using default)');
  console.log('');
  
  // Check email from
  const fromEmail = getEmailFrom();
  console.log('📧 From Email:', fromEmail);
  console.log('');
  
  // Test email
  const testEmail = process.argv[2] || 'satyanarayansaiprasadofficial@gmail.com';
  console.log('📤 Sending test email to:', testEmail);
  console.log('');
  
  const mailOptions = {
    from: getEmailFrom(),
    to: testEmail,
    subject: '🧪 Test Email - ITU System (Local Test)',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0E2A4E;">🧪 Test Email</h2>
        <p>This is a test email from the ITU system.</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p>If you received this email, the email system is working correctly!</p>
      </div>
    `
  };
  
  try {
    const result = await sendEmail(mailOptions);
    
    console.log('\n📊 RESULT:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('\n✅ SUCCESS! Email sent successfully!');
      console.log('   Message ID:', result.info?.messageId);
    } else {
      console.log('\n❌ FAILED! Email could not be sent.');
      console.log('   Error:', result.error);
      if (result.fullError) {
        console.log('   Full Error:', JSON.stringify(result.fullError, null, 2));
      }
    }
  } catch (error) {
    console.error('\n❌ EXCEPTION:', error.message);
    console.error('Stack:', error.stack);
  }
}

testEmail().then(() => {
  console.log('\n✅ Test completed');
  process.exit(0);
}).catch(error => {
  console.error('\n❌ Test failed:', error);
  process.exit(1);
});

