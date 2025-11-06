const dotenv = require("dotenv");
dotenv.config();

const axios = require('axios');

// Zoho Campaigns OAuth Token Generator
class ZohoCampaignsAuth {
  constructor(clientId, clientSecret) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = 'http://localhost:5000/api/auth/callback'; // Local callback
  }

  // Step 1: Generate Authorization URL
  getAuthorizationUrl() {
    const scope = 'ZohoCampaigns.modules.CREATE,ZohoCampaigns.modules.READ,ZohoCampaigns.modules.UPDATE';
    const url = `https://accounts.zoho.com/oauth/v2/auth?` +
      `client_id=${this.clientId}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `redirect_uri=${encodeURIComponent(this.redirectUri)}&` +
      `access_type=offline&` +
      `prompt=consent`;
    
    return url;
  }

  // Step 2: Exchange Authorization Code for Access Token
  async getAccessToken(authorizationCode) {
    try {
      const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
        params: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'authorization_code',
          code: authorizationCode,
          redirect_uri: this.redirectUri
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        expires_in: response.data.expires_in,
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  // Step 3: Refresh Access Token (if needed)
  async refreshAccessToken(refreshToken) {
    try {
      const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
        params: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return {
        access_token: response.data.access_token,
        expires_in: response.data.expires_in,
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }
}

// Instructions for setting up Zoho Campaigns
function displaySetupInstructions() {
  console.log('🎯 Zoho Campaigns Setup Instructions\n');
  
  console.log('📋 Prerequisites:');
  const cid = process.env.ZOHO_CLIENT_ID;
  const csec = process.env.ZOHO_CLIENT_SECRET;
  console.log(`✅ Client ID: ${cid ? cid : 'Missing in .env'}`);
  console.log(`✅ Client Secret: ${csec ? csec.substring(0, 4) + '••••' : 'Missing in .env'}`);
  console.log('⚠️  Need to complete OAuth flow\n');
  
  console.log('🔧 Step-by-Step Setup:');
  console.log('1. Visit this authorization URL in your browser:');
  
  const auth = new ZohoCampaignsAuth(
    process.env.ZOHO_CLIENT_ID,
    process.env.ZOHO_CLIENT_SECRET
  );
  
  console.log(auth.getAuthorizationUrl());
  console.log('\n2. Log in to your Zoho account and grant permissions');
  console.log('3. You will be redirected to a localhost URL (may show error - that\'s OK)');
  console.log('4. Copy the "code" parameter from the redirected URL');
  console.log('5. Run: node get-zoho-token.js YOUR_CODE_HERE');
  console.log('\n📧 Alternative: Use Zoho Campaigns API Console');
  console.log('Visit: https://accounts.zoho.com/apiconsole');
  console.log('Generate a self-client token with Campaigns scopes');
}

// Main execution
if (process.argv.length > 2 && process.argv[2] !== '--instructions') {
  // If code is provided, get access token
  const auth = new ZohoCampaignsAuth(
    process.env.ZOHO_CLIENT_ID,
    process.env.ZOHO_CLIENT_SECRET
  );
  
  auth.getAccessToken(process.argv[2]).then(result => {
    if (result.success) {
      console.log('✅ Access Token Generated Successfully!');
      console.log('Access Token:', result.access_token);
      console.log('Refresh Token:', result.refresh_token);
      console.log('Expires in:', result.expires_in, 'seconds');
      console.log('\n📝 Add these to your .env file:');
      console.log('ZOHO_CAMPAIGNS_ACCESS_TOKEN=' + result.access_token);
    } else {
      console.log('❌ Error:', result.error);
    }
  });
} else {
  // Show instructions
  displaySetupInstructions();
}

module.exports = ZohoCampaignsAuth;