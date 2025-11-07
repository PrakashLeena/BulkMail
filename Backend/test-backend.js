// Test script to verify backend functionality locally
const axios = require('axios');

async function testBackend() {
  const baseUrl = 'http://localhost:5000';

  console.log('🚀 Testing BulkMail Backend...\n');

  try {
    // Test health endpoint
    console.log('1. Testing /api/health...');
    const health = await axios.get(`${baseUrl}/api/health`);
    console.log('✅ Health check:', health.data);

    // Test root endpoint
    console.log('\n2. Testing root endpoint...');
    const root = await axios.get(`${baseUrl}/`);
    console.log('✅ Root endpoint:', root.data);

    // Test API test endpoint
    console.log('\n3. Testing /api/test...');
    const test = await axios.get(`${baseUrl}/api/test`);
    console.log('✅ Test endpoint:', test.data);

    console.log('\n🎉 All endpoints working correctly!');
    console.log('\n📋 Next steps:');
    console.log('1. Set environment variables in Vercel backend project');
    console.log('2. Set REACT_APP_API_URL in Vercel frontend project');
    console.log('3. Redeploy both projects');
    console.log('4. Test the deployed application');

  } catch (error) {
    console.error('❌ Error testing backend:', error.response?.data || error.message);
    process.exit(1);
  }
}

testBackend();
