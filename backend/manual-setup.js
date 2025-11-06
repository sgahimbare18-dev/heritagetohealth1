const dotenv = require("dotenv");
dotenv.config();

const axios = require('axios');

// Manual Token Setup Guide
class ManualTokenSetup {
  constructor() {
    console.log('🎯 Manual Zoho Campaigns Token Setup\n');
    
    console.log('📋 Option 1: Direct API Console (Recommended)');
    console.log('Click this URL:');
    const cid = process.env.ZOHO_CLIENT_ID || '';
    const scopes = 'ZohoCampaigns.modules.CREATE,ZohoCampaigns.modules.READ,ZohoCampaigns.modules.UPDATE';
    const url = `https://accounts.zoho.com/apiconsole?client_id=${cid}&scope=${encodeURIComponent(scopes)}&response_type=code&redirect_uri=https://www.zoho.com/selfclient&access_type=offline&prompt=consent`;
    console.log(url + '\n');
    
    console.log('📋 Option 2: Step-by-Step Manual Setup');
    console.log('1. Open browser and go to: https://accounts.zoho.com/apiconsole');
    console.log('2. Log in with your Zoho account');
    console.log('3. Click "Self Client" tab at the top');
    console.log('4. Click "Generate Code" button');
    console.log('5. In the scopes field, enter exactly this (one per line):');
    console.log('   ZohoCampaigns.modules.CREATE');
    console.log('   ZohoCampaigns.modules.READ');
    console.log('   ZohoCampaigns.modules.UPDATE');
    console.log('6. Set "Time Duration" to 1 hour (or longer)');
    console.log('7. Click "Create"');
    console.log('8. Copy the generated code (it will be long like: 1000.xxxx.yyyy)');
    console.log('9. Come back here and run: node exchange-console-code.js YOUR_CODE\n');
    
    console.log('📋 Option 3: Quick Setup (if you have the code already)');
    console.log('If you already got a code from the API console, just run:');
    console.log('node exchange-console-code.js YOUR_CODE\n');
    
    console.log('🎯 What to expect:');
    console.log('• After successful token exchange, you\'ll get an access token');
    console.log('• The token will be valid for about 1 hour');
    console.log('• You\'ll need to add it to your .env file');
    console.log('• Then we can get your mailing list key');
    console.log('• Finally, test the newsletter subscription');
    
    console.log('\n💡 Tips:');
    console.log('• Keep the browser tab open - you might need to generate multiple codes');
    console.log('• If you get an "invalid code" error, just generate a new one');
    console.log('• The access token expires, but we can refresh it later');
    console.log('• Once everything works, we can set up automatic refresh');
  }
}

// Simple token validator
async function validateToken(token) {
  try {
    const response = await axios.get('https://campaigns.zoho.com/api/v1.1/getmailinglists', {
      params: {
        scope: 'CampaignsAPI',
        authtoken: token
      }
    });
    
    if (response.data.status === 'success') {
      console.log('✅ Token is valid!');
      return true;
    } else {
      console.log('❌ Token validation failed:', response.data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Token validation error:', error.response?.data?.message || error.message);
    return false;
  }
}

// Main execution
if (process.argv.length > 2 && process.argv[2] === '--validate') {
  // Validate token if provided
  const token = process.argv[3];
  if (token) {
    console.log('🔍 Validating token...');
    validateToken(token).then(isValid => {
      if (isValid) {
        console.log('🎉 Token is ready to use!');
        console.log('Next step: Get your mailing list key');
        console.log('Run: node get-campaigns-lists.js YOUR_TOKEN');
      } else {
        console.log('🔧 Please generate a new token');
      }
    });
  } else {
    console.log('❌ Please provide a token to validate');
  }
} else {
  // Show setup guide
  new ManualTokenSetup();
}