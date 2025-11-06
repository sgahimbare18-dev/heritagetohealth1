const dotenv = require("dotenv");
dotenv.config();

const axios = require('axios');

// Zoho Campaigns List Manager
class ZohoCampaignsListManager {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseUrl = 'https://campaigns.zoho.com/api/v1.1';
  }

  // Get all mailing lists
  async getAllLists() {
    try {
      const response = await axios.get(`${this.baseUrl}/getmailinglists`, {
        params: {
          scope: 'CampaignsAPI',
          authtoken: this.accessToken
        }
      });

      if (response.data.status === 'success') {
        return {
          success: true,
          lists: response.data.mailing_lists
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Unknown error'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  // Get list details
  async getListDetails(listKey) {
    try {
      const response = await axios.get(`${this.baseUrl}/listdetails`, {
        params: {
          scope: 'CampaignsAPI',
          authtoken: this.accessToken,
          listkey: listKey
        }
      });

      if (response.data.status === 'success') {
        return {
          success: true,
          details: response.data.list_details
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Unknown error'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  // Display lists in a user-friendly format
  displayLists(lists) {
    console.log('\n📋 Your Zoho Campaigns Mailing Lists:\n');
    
    if (!lists || lists.length === 0) {
      console.log('❌ No mailing lists found in your account.');
      console.log('📝 Create a new list in Zoho Campaigns first.');
      console.log('Visit: https://campaigns.zoho.com/campaigns/org905021265/home.do#lists');
      return;
    }

    lists.forEach((list, index) => {
      console.log(`${index + 1}. 📧 ${list.list_name}`);
      console.log(`   🔑 List Key: ${list.list_key}`);
      console.log(`   👥 Subscribers: ${list.subscriber_count || 0}`);
      console.log(`   📅 Created: ${list.created_date}`);
      console.log(`   📝 Description: ${list.description || 'No description'}
`);
    });

    console.log('🎯 To use a list, copy its List Key and add to your .env file:');
    console.log('ZOHO_CAMPAIGNS_LIST_KEY=your-list-key-here\n');
  }
}

// Main execution
async function main() {
  const accessToken = process.argv[2];
  
  if (!accessToken) {
    console.log('❌ Please provide your Zoho Campaigns access token.');
    console.log('Usage: node get-campaigns-lists.js YOUR_ACCESS_TOKEN');
    console.log('\n📝 To get your access token:');
    console.log('1. Run: node get-zoho-token.js --instructions');
    console.log('2. Follow the OAuth flow to get your token');
    return;
  }

  const manager = new ZohoCampaignsListManager(accessToken);
  
  console.log('🔍 Fetching your mailing lists...');
  const result = await manager.getAllLists();
  
  if (result.success) {
    manager.displayLists(result.lists);
  } else {
    console.log('❌ Error fetching lists:', result.error);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if your access token is valid');
    console.log('2. Verify your Zoho Campaigns account has lists created');
    console.log('3. Ensure your token has the correct scopes');
  }
}

// Run the script
main().catch(console.error);

module.exports = ZohoCampaignsListManager;