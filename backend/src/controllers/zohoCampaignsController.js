const dotenv = require("dotenv");
dotenv.config();

const axios = require('axios');
const zohoCRM = require('./zohoCRMController');

// Zoho Campaigns API configuration
const ZOHO_CAMPAIGNS_API_URL = 'https://campaigns.zoho.com/api/v1.1/json';

// Subscribe contact to newsletter
const subscribeToNewsletter = async (req, res) => {
  const { email, name } = req.body;

  try {
    // Check if we have the required environment variables
    if (!process.env.ZOHO_CAMPAIGNS_LIST_KEY || !process.env.ZOHO_CAMPAIGNS_ACCESS_TOKEN) {
      return res.status(500).json({ 
        success: false, 
        message: 'Newsletter subscription is not properly configured' 
      });
    }

    // Prepare the contact info for Zoho Campaigns API
    const contactInfo = {
      ContactEmail: email,
      FirstName: name?.split(' ')[0] || '',
      LastName: name?.split(' ').slice(1).join(' ') || ''
    };

    // Make API request to Zoho Campaigns
    const response = await axios.post(
      `${ZOHO_CAMPAIGNS_API_URL}/listsubscribe`,
      new URLSearchParams({
        listkey: process.env.ZOHO_CAMPAIGNS_LIST_KEY,
        contactinfo: JSON.stringify(contactInfo),
        resfmt: 'json'
      }),
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${process.env.ZOHO_CAMPAIGNS_ACCESS_TOKEN}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    // Check if subscription was successful
    if (response.data && response.data.status === 'success') {
      // Sync with Zoho CRM as a contact
      try {
        const crmResult = await zohoCRM.createContact({
          name,
          email,
          source: 'Newsletter Subscription',
          description: 'Subscribed to Heritage to Health Newsletter'
        });
        
        if (crmResult.success) {
          console.log('Newsletter subscriber synced to Zoho CRM successfully');
        } else {
          console.warn('Failed to sync newsletter subscriber to Zoho CRM:', crmResult.message);
        }
      } catch (crmError) {
        console.warn('CRM sync error (non-blocking):', crmError.message);
      }

      res.status(200).json({ 
        success: true, 
        message: 'Successfully subscribed to our newsletter!' 
      });
    } else {
      // Handle specific error cases
      let errorMessage = 'Failed to subscribe to newsletter';
      if (response.data && response.data.message) {
        errorMessage = response.data.message;
      }
      
      res.status(400).json({ 
        success: false, 
        message: errorMessage 
      });
    }

  } catch (error) {
    console.error('Zoho Campaigns API Error:', error.response?.data || error.message);
    
    let errorMessage = 'Failed to subscribe to newsletter';
    
    // Handle specific Zoho API error codes
    if (error.response?.data?.code === '2501') {
      errorMessage = 'Invalid mailing list configuration';
    } else if (error.response?.data?.code === '2004') {
      errorMessage = 'Invalid email address format';
    } else if (error.response?.data?.code === '2005') {
      errorMessage = 'Group email addresses are not allowed';
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage 
    });
  }
};

// Unsubscribe contact from newsletter
const unsubscribeFromNewsletter = async (req, res) => {
  const { email } = req.body;

  try {
    if (!process.env.ZOHO_CAMPAIGNS_LIST_KEY || !process.env.ZOHO_CAMPAIGNS_ACCESS_TOKEN) {
      return res.status(500).json({ 
        success: false, 
        message: 'Newsletter unsubscription is not properly configured' 
      });
    }

    const response = await axios.post(
      `${ZOHO_CAMPAIGNS_API_URL}/listunsubscribe`,
      new URLSearchParams({
        listkey: process.env.ZOHO_CAMPAIGNS_LIST_KEY,
        contactinfo: JSON.stringify({ ContactEmail: email }),
        resfmt: 'json'
      }),
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${process.env.ZOHO_CAMPAIGNS_ACCESS_TOKEN}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (response.data && response.data.status === 'success') {
      res.status(200).json({ 
        success: true, 
        message: 'Successfully unsubscribed from our newsletter' 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: response.data?.message || 'Failed to unsubscribe from newsletter' 
      });
    }

  } catch (error) {
    console.error('Zoho Campaigns Unsubscribe Error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to unsubscribe from newsletter' 
    });
  }
};

// Get subscription status
const getSubscriptionStatus = async (req, res) => {
  const { email } = req.query;

  try {
    if (!process.env.ZOHO_CAMPAIGNS_LIST_KEY || !process.env.ZOHO_CAMPAIGNS_ACCESS_TOKEN) {
      return res.status(500).json({ 
        success: false, 
        message: 'Newsletter status check is not properly configured' 
      });
    }

    const response = await axios.get(
      `${ZOHO_CAMPAIGNS_API_URL}/listsubscribe`,
      {
        params: {
          listkey: process.env.ZOHO_CAMPAIGNS_LIST_KEY,
          contactemail: email,
          resfmt: 'json'
        },
        headers: {
          'Authorization': `Zoho-oauthtoken ${process.env.ZOHO_CAMPAIGNS_ACCESS_TOKEN}`
        }
      }
    );

    if (response.data && response.data.status === 'success') {
      res.status(200).json({ 
        success: true, 
        subscribed: response.data.subscribed || false,
        message: response.data.message 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: response.data?.message || 'Failed to check subscription status' 
      });
    }

  } catch (error) {
    console.error('Zoho Campaigns Status Check Error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to check subscription status' 
    });
  }
};

module.exports = {
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  getSubscriptionStatus
};