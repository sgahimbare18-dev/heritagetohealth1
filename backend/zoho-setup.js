const dotenv = require("dotenv");
dotenv.config();

const fs = require('fs');
const path = require('path');

// Zoho Campaigns Setup Guide
class ZohoSetupGuide {
  constructor() {
    this.clientId = process.env.ZOHO_CLIENT_ID;
    this.clientSecret = process.env.ZOHO_CLIENT_SECRET;
    this.envFilePath = path.join(__dirname, '.env');
  }

  // Display current status
  displayCurrentStatus() {
    console.log('🎯 Zoho Campaigns Integration Status\n');
    
    // Check current .env configuration
    const envContent = fs.readFileSync(this.envFilePath, 'utf8');
    
    const hasAccessToken = envContent.includes('ZOHO_CAMPAIGNS_ACCESS_TOKEN=') && 
                          !envContent.includes('ZOHO_CAMPAIGNS_ACCESS_TOKEN=your-zoho-campaigns-access-token');
    
    const hasListKey = envContent.includes('ZOHO_CAMPAIGNS_LIST_KEY=') && 
                      !envContent.includes('ZOHO_CAMPAIGNS_LIST_KEY=your-campaigns-list-key');
    
    console.log('📊 Current Configuration:');
    console.log(`✅ Client ID: ${this.clientId ? this.clientId : 'Missing in .env'}`);
    console.log(`✅ Client Secret: ${this.clientSecret ? this.clientSecret.substring(0, 4) + '••••' : 'Missing in .env'}`);
    console.log(`${hasAccessToken ? '✅' : '❌'} Access Token: ${hasAccessToken ? 'Configured' : 'Missing'}`);
    console.log(`${hasListKey ? '✅' : '❌'} List Key: ${hasListKey ? 'Configured' : 'Missing'}\n`);
    
    if (hasAccessToken && hasListKey) {
      console.log('🎉 Setup Complete! Your newsletter subscription is ready.');
      console.log('Test it by running: node test-newsletter.js\n');
    } else {
      console.log('⚠️  Setup Incomplete - Follow the steps below:\n');
    }
    
    return { hasAccessToken, hasListKey };
  }

  // Step-by-step setup instructions
  displaySetupSteps() {
    console.log('📋 Step-by-Step Setup Instructions:\n');
    
    console.log('🚀 STEP 1: Get Access Token');
    console.log('   Run: node get-zoho-token.js --instructions');
    console.log('   Follow the OAuth flow to get your access token\n');
    
    console.log('📧 STEP 2: Get List Key');
    console.log('   After getting access token:');
    console.log('   Run: node get-campaigns-lists.js YOUR_ACCESS_TOKEN');
    console.log('   Copy the List Key of your preferred mailing list\n');
    
    console.log('⚙️  STEP 3: Update Environment');
    console.log('   Add these to your .env file:');
    console.log('   ZOHO_CAMPAIGNS_ACCESS_TOKEN=your-access-token');
    console.log('   ZOHO_CAMPAIGNS_LIST_KEY=your-list-key\n');
    
    console.log('🧪 STEP 4: Test Integration');
    console.log('   Restart your backend server');
    console.log('   Run: node test-newsletter.js\n');
  }

  // Quick setup command generator
  generateQuickSetup() {
    console.log('⚡ Quick Setup Commands:\n');
    
    console.log('# Step 1: Get authorization URL');
    console.log('node get-zoho-token.js --instructions\n');
    
    console.log('# Step 2: After getting the code, get access token');
    console.log('node get-zoho-token.js YOUR_AUTHORIZATION_CODE\n');
    
    console.log('# Step 3: Get your mailing lists');
    console.log('node get-campaigns-lists.js YOUR_ACCESS_TOKEN\n');
    
    console.log('# Step 4: Test the integration');
    console.log('node test-newsletter.js\n');
  }

  // Display all available tools
  displayAvailableTools() {
    console.log('🛠️  Available Setup Tools:\n');
    
    console.log('📄 get-zoho-token.js');
    console.log('   Generates Zoho Campaigns access tokens\n');
    
    console.log('📋 get-campaigns-lists.js');
    console.log('   Fetches your mailing lists and their keys\n');
    
    console.log('🧪 test-newsletter.js');
    console.log('   Tests the newsletter subscription functionality\n');
    
    console.log('📊 zoho-setup.js');
    console.log('   This guide - shows status and instructions\n');
  }

  // Main guide
  run() {
    console.log('🏗️  Zoho Campaigns Setup Guide\n');
    console.log('=' .repeat(50));
    
    const status = this.displayCurrentStatus();
    
    console.log('\n' + '=' .repeat(50));
    this.displaySetupSteps();
    
    console.log('\n' + '=' .repeat(50));
    this.generateQuickSetup();
    
    console.log('\n' + '=' .repeat(50));
    this.displayAvailableTools();
    
    console.log('\n💡 Tips:');
    console.log('• Your Client ID and Secret are already configured');
    console.log('• Newsletter subscriptions will sync to Zoho CRM automatically');
    console.log('• Contact forms continue to send emails to helitagetohealth1@zohomail.com');
    console.log('• All data is stored in your MongoDB database');
    console.log('\n🆘 Need Help?');
    console.log('• Check the Zoho Campaigns dashboard: https://campaigns.zoho.com/campaigns/org905021265/home.do#lists');
    console.log('• Ensure your Zoho Campaigns account has at least one mailing list');
    console.log('• Verify your OAuth app has the correct redirect URI configured');
  }
}

// Run the guide
const guide = new ZohoSetupGuide();
guide.run();