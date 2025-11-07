// Quick test script to check if backend endpoints are working
const axios = require('axios');

async function testBackend() {
  const backendUrl = 'https://bulk-mail-xr7v.vercel.app';

  console.log('🔍 Testing Backend Endpoints...\n');

  try {
    console.log('1. Testing root endpoint...');
    const root = await axios.get(`${backendUrl}/`);
    console.log('✅ Root:', root.data);

    console.log('\n2. Testing /api/health...');
    const health = await axios.get(`${backendUrl}/api/health`);
    console.log('✅ Health:', health.data);

    console.log('\n3. Testing /api/test...');
    const test = await axios.get(`${backendUrl}/api/test`);
    console.log('✅ Test:', test.data);

    console.log('\n🎉 All backend endpoints working!');

  } catch (error) {
    console.error('❌ Backend test failed:', error.response?.data || error.message);
    console.log('\n🔧 Possible issues:');
    console.log('1. Environment variables not set in Vercel backend project');
    console.log('2. MongoDB connection failing');
    console.log('3. Backend not deployed or redeployed');
    process.exit(1);
  }
}

testBackend();
