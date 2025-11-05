const dotenv = require("dotenv");
dotenv.config();

const axios = require('axios');

// Alternative method using Zoho API Console self-client token
class ZohoAPIConsoleHelper {
  constructor() {
    console.log('🎯 Zoho API Console Alternative Method\n');
    
    console.log('📋 Step-by-Step Instructions:');
    console.log('1. Visit: https://accounts.zoho.com/apiconsole');
    console.log('2. Click "Self Client" tab');
    console.log('3. Click "Generate Code"');
    console.log('4. Enter these scopes (one per line):');
    console.log('   - ZohoCampaigns.modules.CREATE');
    console.log('   - ZohoCampaigns.modules.READ');
    console.log('   - ZohoCampaigns.modules.UPDATE');
    console.log('5. Set duration to "10 minutes" (or longer)');
    console.log('6. Click "Create"');
    console.log('7. Copy the generated code');
    console.log('8. Exchange it for an access token using this script\n');
    
    console.log('🔧 To exchange the code for a token:');
    console.log('Run: node exchange-console-code.js YOUR_CONSOLE_CODE\n');
  }
}

// Exchange console code for access token
async function exchangeConsoleCode(code) {
  try {
    const clientId = process.env.ZOHO_CLIENT_ID;
    const clientSecret = process.env.ZOHO_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.log('❌ Missing ZOHO_CLIENT_ID or ZOHO_CLIENT_SECRET in .env');
      console.log('Add them to .env, then rerun: node exchange-console-code.js YOUR_CONSOLE_CODE');
      return;
    }

    const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'https://www.zoho.com/selfclient'
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (response.data.access_token) {
      console.log('✅ SUCCESS! Access Token Generated!');
      console.log('Access Token:', response.data.access_token);
      console.log('Expires in:', response.data.expires_in, 'seconds');
      console.log('\n📝 Add this to your .env file:');
      console.log('ZOHO_CAMPAIGNS_ACCESS_TOKEN=' + response.data.access_token);
      
      return response.data.access_token;
    } else {
      console.log('❌ Error:', response.data);
    }
  } catch (error) {
    console.log('❌ Error exchanging code:', error.response?.data || error.message);
  }
}

// Main execution
if (process.argv.length > 2) {
  // If code is provided, exchange it
  exchangeConsoleCode(process.argv[2]);
} else {
  // Show instructions
  new ZohoAPIConsoleHelper();
}