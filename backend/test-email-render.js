// Test email sending via Render backend URL
const axios = require('axios');

const RENDER_URL = 'https://itu-r1qa.onrender.com';
const TEST_EMAIL = 'satyanarayansaiprasadofficial@gmail.com';

async function testEmailViaRender() {
  console.log('\n🧪 TESTING EMAIL VIA RENDER BACKEND 🧪\n');
  console.log('Render URL:', RENDER_URL);
  console.log('Test Email:', TEST_EMAIL);
  console.log('');
  
  try {
    // Test 1: Test email endpoint
    console.log('1️⃣ Testing /test-email endpoint...');
    const testResponse = await axios.post(`${RENDER_URL}/test-email`, {
      email: TEST_EMAIL
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });
    
    console.log('✅ Test Email Response:');
    console.log(JSON.stringify(testResponse.data, null, 2));
    console.log('');
    
    if (testResponse.data.success) {
      console.log('✅ SUCCESS! Test email sent successfully!');
      console.log('   Message ID:', testResponse.data.details?.messageId);
    } else {
      console.log('❌ FAILED! Test email could not be sent.');
      console.log('   Error:', testResponse.data.error || testResponse.data.details);
    }
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('   No response received. Check:');
      console.error('   - Render service is running');
      console.error('   - URL is correct:', RENDER_URL);
      console.error('   - Network connectivity');
    }
  }
  
  console.log('');
  
  // Test 2: Check if we can get forms (to test approval flow)
  try {
    console.log('2️⃣ Testing /api/admin/getForm endpoint...');
    const formsResponse = await axios.get(`${RENDER_URL}/api/admin/getForm`, {
      timeout: 30000
    });
    
    const forms = formsResponse.data;
    console.log(`✅ Found ${forms?.length || 0} forms`);
    
    if (forms && forms.length > 0) {
      const pendingForm = forms.find(f => !f.password || f.status === 'pending');
      if (pendingForm) {
        console.log('\n📋 Found pending form for approval test:');
        console.log('   ID:', pendingForm._id);
        console.log('   Name:', pendingForm.name);
        console.log('   Email:', pendingForm.email);
        console.log('\n💡 To test approval, run:');
        console.log(`   curl -X PUT ${RENDER_URL}/api/admin/approveForm \\`);
        console.log(`     -H "Content-Type: application/json" \\`);
        console.log(`     -d '{"formId":"${pendingForm._id}","email":"${pendingForm.email}","password":"testITU@540720"}'`);
      } else {
        console.log('   No pending forms found');
      }
    }
  } catch (error) {
    console.error('   Error fetching forms:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testEmailViaRender().then(() => {
  console.log('\n✅ Test completed\n');
  process.exit(0);
}).catch(error => {
  console.error('\n❌ Test failed:', error);
  process.exit(1);
});

