// Test the full approval flow locally
require('dotenv').config();
const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

async function testApprovalFlow() {
  console.log('\n🧪 TESTING APPROVAL FLOW 🧪\n');
  console.log('API Base URL:', API_BASE_URL);
  console.log('');
  
  // First, get a pending form
  try {
    console.log('1️⃣ Fetching forms...');
    const formsResponse = await axios.get(`${API_BASE_URL}/api/admin/getForm`);
    const forms = formsResponse.data;
    
    if (!forms || forms.length === 0) {
      console.log('❌ No forms found. Please create a test form first.');
      return;
    }
    
    // Find a pending form
    const pendingForm = forms.find(f => !f.password || f.status === 'pending');
    
    if (!pendingForm) {
      console.log('❌ No pending forms found. All forms are already approved.');
      console.log('   Available forms:', forms.map(f => ({ id: f._id, name: f.name, status: f.status || (f.password ? 'approved' : 'pending') })));
      return;
    }
    
    console.log('✅ Found pending form:');
    console.log('   ID:', pendingForm._id);
    console.log('   Name:', pendingForm.name);
    console.log('   Email:', pendingForm.email);
    console.log('   State:', pendingForm.state);
    console.log('');
    
    // Generate password
    const cleanStateName = (pendingForm.state || 'test').replace(/\s+/g, '').toLowerCase();
    const password = `${cleanStateName}ITU@540720`;
    
    console.log('2️⃣ Approving form...');
    console.log('   Generated Password:', password);
    console.log('');
    
    // Approve the form
    const approveResponse = await axios.put(`${API_BASE_URL}/api/admin/approveForm`, {
      formId: pendingForm._id,
      email: pendingForm.email,
      password: password
    });
    
    console.log('3️⃣ Approval Response:');
    console.log(JSON.stringify(approveResponse.data, null, 2));
    console.log('');
    
    if (approveResponse.data.success) {
      if (approveResponse.data.emailSent) {
        console.log('✅ SUCCESS! Form approved and email sent!');
        console.log('   Email Sent:', approveResponse.data.emailSent);
        console.log('   Email Sent At:', approveResponse.data.emailSentAt);
        console.log('   Message:', approveResponse.data.message);
      } else {
        console.log('⚠️  Form approved but email failed:');
        console.log('   Email Sent:', approveResponse.data.emailSent);
        console.log('   Email Error:', approveResponse.data.emailError);
      }
    } else {
      console.log('❌ Approval failed:', approveResponse.data.error);
    }
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    }
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Make sure your backend server is running on', API_BASE_URL);
      console.error('   Start it with: cd backend && npm start');
    }
  }
}

testApprovalFlow().then(() => {
  console.log('\n✅ Test completed\n');
  process.exit(0);
}).catch(error => {
  console.error('\n❌ Test failed:', error);
  process.exit(1);
});

