const axios = require('axios');
dotenv = require('dotenv');
dotenv.config();

const API_VERSION = process.env.API_VERSION || '1';
const BASE_URL = 'http://localhost:3000';

async function testAPI() {

  const endpoint = API_VERSION === '1' 
    ? `${BASE_URL}/v1/trips/search`
    : `${BASE_URL}/v2/trips/search`;

  try {
    const response = await axios.get(endpoint, {
      params: {
        from: 'CMB',
        to: 'BKK',
        date: '2025-12-10'
      }
    });

    console.log('Response:', JSON.stringify(response.data, null, 2));
    console.log(`\n✓ API Version: ${response.data.version}`);
    console.log(`✓ Weather included: ${!!response.data.weather}`);
    console.log(`✓ Degraded: ${response.data.degraded}`);
    console.log(`✓ Response Time: ${response.data.responseTimeMs}ms`);
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
}

testAPI();