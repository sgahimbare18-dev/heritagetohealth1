const dotenv = require("dotenv");
dotenv.config();

const axios = require('axios');

// Direct Zoho API Console URL Generator
class ZohoConsoleURLGenerator {
  constructor() {
    this.clientId = process.env.ZOHO_CLIENT_ID;
    this.clientSecret = process.env.ZOHO_CLIENT_SECRET; // not used in URL, kept for presence check
    
    console.log('🎯 Direct Zoho API Console Setup\n');
    
    // Generate the exact URL for API console
    const scopes = [
      'ZohoCampaigns.modules.CREATE',
      'ZohoCampaigns.modules.READ', 
      'ZohoCampaigns.modules.UPDATE'
    ].join(',');
    
    const consoleUrl = `https://accounts.zoho.com/apiconsole?` +
      `client_id=${this.clientId || ''}&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `response_type=code&` +
      `redirect_uri=https://www.zoho.com/selfclient&` +
      `access_type=offline&` +
      `prompt=consent`;
    
    if (!this.clientId) {
      console.log('❌ ZOHO_CLIENT_ID is missing in .env');
      console.log('Add ZOHO_CLIENT_ID to .env and rerun this script.');
    } else {
      console.log('📋 Direct API Console URL:');
      console.log(consoleUrl);
    }
    console.log('\n🚀 Quick Steps:');
    console.log('1. Click the URL above');
    console.log('2. Log in to your Zoho account');
    console.log('3. Click "Generate Code"');
    console.log('4. Set duration (recommended: 1 hour)');
    console.log('5. Copy the generated code');
    console.log('6. Run: node exchange-console-code.js YOUR_CODE');
    
    console.log('\n🔧 Alternative: Manual Setup');
    console.log('1. Visit: https://accounts.zoho.com/apiconsole');
    console.log('2. Click "Self Client" tab');
    console.log('3. Enter these scopes exactly:');
    scopes.split(',').forEach(scope => {
      console.log(`   - ${scope}`);
    });
    console.log('4. Set duration and generate code');
    console.log('5. Exchange code using this script');
  }
}

// Run the generator
new ZohoConsoleURLGenerator();