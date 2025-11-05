const dotenv = require("dotenv");
dotenv.config();

const zohoCRM = require('./src/controllers/zohoCRMController');

// Test Zoho CRM Integration
async function testZohoCRMIntegration() {
  console.log('🧪 Testing Zoho CRM Integration...\n');

  // Test 1: Connection Test
  console.log('1️⃣ Testing Zoho CRM Connection...');
  try {
    const connectionTest = await zohoCRM.testConnection();
    if (connectionTest.success) {
      console.log('✅ Zoho CRM connection successful');
      console.log('📊 Organization Info:', connectionTest.data);
    } else {
      console.log('❌ Zoho CRM connection failed:', connectionTest.message);
      console.log('🔧 Troubleshooting:');
      console.log('   - Ensure ZOHO_CRM_ACCESS_TOKEN is set correctly');
      console.log('   - Check if the access token has expired');
      console.log('   - Verify the organization ID is correct');
    }
  } catch (error) {
    console.log('❌ Connection test error:', error.message);
  }
  console.log('');

  // Test 2: Contact Creation Test
  console.log('2️⃣ Testing Contact Creation...');
  try {
    const testContact = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test contact from Heritage to Health website',
      source: 'Test Script',
      description: 'Test contact created by integration test script'
    };

    const contactResult = await zohoCRM.createContact(testContact);
    if (contactResult.success) {
      console.log('✅ Contact created successfully');
      console.log('📋 Contact ID:', contactResult.data.id);
      console.log('📧 Contact Email:', contactResult.data.Email);
      
      // Store contact ID for update test
      global.testContactId = contactResult.data.id;
    } else {
      console.log('❌ Contact creation failed:', contactResult.message);
      console.log('🔍 Error details:', contactResult.error);
    }
  } catch (error) {
    console.log('❌ Contact creation error:', error.message);
  }
  console.log('');

  // Test 3: Lead Creation Test
  console.log('3️⃣ Testing Lead Creation...');
  try {
    const testLead = {
      name: 'Test Organization Contact',
      email: 'partnership@testorg.com',
      organization: 'Test Organization',
      message: 'Interested in partnership opportunities',
      source: 'Test Script - Partnership',
      description: 'Test lead created by integration test script'
    };

    const leadResult = await zohoCRM.createLead(testLead);
    if (leadResult.success) {
      console.log('✅ Lead created successfully');
      console.log('📋 Lead ID:', leadResult.data.id);
      console.log('🏢 Company:', leadResult.data.Company);
      console.log('📧 Lead Email:', leadResult.data.Email);
      
      // Store lead ID for update test
      global.testLeadId = leadResult.data.id;
    } else {
      console.log('❌ Lead creation failed:', leadResult.message);
      console.log('🔍 Error details:', leadResult.error);
    }
  } catch (error) {
    console.log('❌ Lead creation error:', error.message);
  }
  console.log('');

  // Test 4: Search Functionality Test
  console.log('4️⃣ Testing Search Functionality...');
  try {
    // Search for contact by email
    const searchResult = await zohoCRM.searchContactByEmail('test@example.com');
    if (searchResult) {
      console.log('✅ Contact search successful');
      console.log('📋 Found Contact:', searchResult.Email);
      console.log('👤 Contact Name:', searchResult.First_Name, searchResult.Last_Name);
    } else {
      console.log('ℹ️ Contact not found (this may be expected)');
    }
  } catch (error) {
    console.log('❌ Search error:', error.message);
  }
  console.log('');

  // Test 5: Contact Update Test (if contact was created)
  if (global.testContactId) {
    console.log('5️⃣ Testing Contact Update...');
    try {
      const updateData = {
        Phone: '+1-555-0123',
        Description: 'Updated description from test script'
      };

      const updateResult = await zohoCRM.updateContact(global.testContactId, updateData);
      if (updateResult.success) {
        console.log('✅ Contact updated successfully');
        console.log('📱 Updated Phone:', updateResult.data.Phone);
      } else {
        console.log('❌ Contact update failed:', updateResult.message);
      }
    } catch (error) {
      console.log('❌ Contact update error:', error.message);
    }
    console.log('');
  }

  // Test 6: Note Creation Test (if contact was created)
  if (global.testContactId) {
    console.log('6️⃣ Testing Note Creation...');
    try {
      const noteContent = 'This is a test note created by the integration test script.';
      const noteResult = await zohoCRM.createNote('Contacts', global.testContactId, noteContent);
      
      if (noteResult.success) {
        console.log('✅ Note created successfully');
        console.log('📝 Note ID:', noteResult.data.id);
      } else {
        console.log('❌ Note creation failed:', noteResult.message);
      }
    } catch (error) {
      console.log('❌ Note creation error:', error.message);
    }
    console.log('');
  }

  // Test 7: Get All Contacts (limited)
  console.log('7️⃣ Testing Get All Contacts...');
  try {
    const contactsResult = await zohoCRM.getAllContacts(1, 5); // Get first 5 contacts
    if (contactsResult.success) {
      console.log('✅ Contacts retrieved successfully');
      console.log('📊 Total contacts:', contactsResult.info?.count || 'Unknown');
      console.log('👥 Retrieved contacts:', contactsResult.data.length);
      
      if (contactsResult.data.length > 0) {
        console.log('📋 Sample contact:', contactsResult.data[0].Email);
      }
    } else {
      console.log('❌ Failed to retrieve contacts:', contactsResult.message);
    }
  } catch (error) {
    console.log('❌ Get contacts error:', error.message);
  }
  console.log('');

  // Test 8: Get All Leads (limited)
  console.log('8️⃣ Testing Get All Leads...');
  try {
    const leadsResult = await zohoCRM.getAllLeads(1, 5); // Get first 5 leads
    if (leadsResult.success) {
      console.log('✅ Leads retrieved successfully');
      console.log('📊 Total leads:', leadsResult.info?.count || 'Unknown');
      console.log('🏢 Retrieved leads:', leadsResult.data.length);
      
      if (leadsResult.data.length > 0) {
        console.log('📋 Sample lead:', leadsResult.data[0].Email, '-', leadsResult.data[0].Company);
      }
    } else {
      console.log('❌ Failed to retrieve leads:', leadsResult.message);
    }
  } catch (error) {
    console.log('❌ Get leads error:', error.message);
  }
  console.log('');

  console.log('🎯 Zoho CRM Integration Test Complete!');
  console.log('');
  console.log('📚 Next Steps:');
  console.log('   1. Set up proper environment variables in your .env file');
  console.log('   2. Generate valid Zoho CRM access tokens');
  console.log('   3. Test the integration with real contact forms');
  console.log('   4. Monitor CRM for automatically created contacts and leads');
  console.log('');
  console.log('🔧 Environment Variables Required:');
  console.log('   ZOHO_CRM_ACCESS_TOKEN=your-crm-access-token');
  console.log('   ZOHO_CRM_ORG_ID=905013935');
  console.log('   ZOHO_EMAIL_USER=heritagetohealth1@zohomail.com');
  console.log('   ZOHO_EMAIL_PASS=your-zoho-app-password');
}

// Run the test if this script is executed directly
if (require.main === module) {
  testZohoCRMIntegration().catch(console.error);
}

module.exports = { testZohoCRMIntegration };