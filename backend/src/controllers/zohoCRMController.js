const dotenv = require("dotenv");
dotenv.config();

const axios = require('axios');

class ZohoCRMController {
  constructor() {
    this.baseURL = 'https://www.zohoapis.com/crm/v2';
    this.accessToken = process.env.ZOHO_CRM_ACCESS_TOKEN;
    this.organizationId = process.env.ZOHO_CRM_ORG_ID || '905013935';
  }

  // Set authentication headers
  getHeaders() {
    return {
      'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
      'Content-Type': 'application/json',
      'orgId': this.organizationId
    };
  }

  // Create or update a contact in Zoho CRM
  async createContact(contactData) {
    try {
      const contactPayload = {
        data: [{
          First_Name: contactData.firstName || contactData.name?.split(' ')[0] || 'Unknown',
          Last_Name: contactData.lastName || contactData.name?.split(' ').slice(1).join(' ') || 'Unknown',
          Email: contactData.email,
          Phone: contactData.phone || '',
          Description: contactData.message || contactData.description || '',
          Lead_Source: contactData.source || 'Website Contact Form',
          Mailing_Street: contactData.address || '',
          Mailing_City: contactData.city || '',
          Mailing_State: contactData.state || '',
          Mailing_Zip: contactData.zipCode || '',
          Mailing_Country: contactData.country || '',
          Company: contactData.company || 'Heritage to Health Website',
          Title: contactData.title || 'Website Contact',
          Website: contactData.website || 'https://heritagetohealth.com'
        }]
      };

      // First, check if contact already exists by email
      const existingContact = await this.searchContactByEmail(contactData.email);
      
      if (existingContact) {
        console.log('Contact already exists, updating...');
        return await this.updateContact(existingContact.id, contactPayload.data[0]);
      }

      // Create new contact
      const response = await axios.post(
        `${this.baseURL}/Contacts`,
        contactPayload,
        { headers: this.getHeaders() }
      );

      console.log('Contact created in Zoho CRM:', response.data);
      return {
        success: true,
        data: response.data.data[0],
        message: 'Contact successfully created in Zoho CRM'
      };
    } catch (error) {
      console.error('Error creating contact in Zoho CRM:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to create contact in Zoho CRM'
      };
    }
  }

  // Create a lead in Zoho CRM (for partnership requests)
  async createLead(leadData) {
    try {
      const leadPayload = {
        data: [{
          First_Name: leadData.firstName || leadData.name?.split(' ')[0] || 'Unknown',
          Last_Name: leadData.lastName || leadData.name?.split(' ').slice(1).join(' ') || 'Unknown',
          Email: leadData.email,
          Phone: leadData.phone || '',
          Company: leadData.company || leadData.organization || 'Unknown Organization',
          Title: leadData.title || 'Partnership Inquiry',
          Description: leadData.message || leadData.description || '',
          Lead_Source: leadData.source || 'Website Partnership Form',
          Industry: leadData.industry || 'Healthcare/Mental Wellness',
          Website: leadData.website || '',
          Annual_Revenue: leadData.annualRevenue || 0,
          Number_of_Employees: leadData.employeeCount || 0,
          Street: leadData.address || '',
          City: leadData.city || '',
          State: leadData.state || '',
          Zip_Code: leadData.zipCode || '',
          Country: leadData.country || '',
          Lead_Status: 'Not Contacted'
        }]
      };

      // Check if lead already exists by email
      const existingLead = await this.searchLeadByEmail(leadData.email);
      
      if (existingLead) {
        console.log('Lead already exists, updating...');
        return await this.updateLead(existingLead.id, leadPayload.data[0]);
      }

      const response = await axios.post(
        `${this.baseURL}/Leads`,
        leadPayload,
        { headers: this.getHeaders() }
      );

      console.log('Lead created in Zoho CRM:', response.data);
      return {
        success: true,
        data: response.data.data[0],
        message: 'Lead successfully created in Zoho CRM'
      };
    } catch (error) {
      console.error('Error creating lead in Zoho CRM:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to create lead in Zoho CRM'
      };
    }
  }

  // Search contact by email
  async searchContactByEmail(email) {
    try {
      const response = await axios.get(
        `${this.baseURL}/Contacts/search?email=${encodeURIComponent(email)}`,
        { headers: this.getHeaders() }
      );

      if (response.data.data && response.data.data.length > 0) {
        return response.data.data[0];
      }
      return null;
    } catch (error) {
      console.error('Error searching contact by email:', error.response?.data || error.message);
      return null;
    }
  }

  // Search lead by email
  async searchLeadByEmail(email) {
    try {
      const response = await axios.get(
        `${this.baseURL}/Leads/search?email=${encodeURIComponent(email)}`,
        { headers: this.getHeaders() }
      );

      if (response.data.data && response.data.data.length > 0) {
        return response.data.data[0];
      }
      return null;
    } catch (error) {
      console.error('Error searching lead by email:', error.response?.data || error.message);
      return null;
    }
  }

  // Update existing contact
  async updateContact(contactId, updateData) {
    try {
      const payload = {
        data: [updateData]
      };

      const response = await axios.put(
        `${this.baseURL}/Contacts/${contactId}`,
        payload,
        { headers: this.getHeaders() }
      );

      console.log('Contact updated in Zoho CRM:', response.data);
      return {
        success: true,
        data: response.data.data[0],
        message: 'Contact successfully updated in Zoho CRM'
      };
    } catch (error) {
      console.error('Error updating contact in Zoho CRM:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to update contact in Zoho CRM'
      };
    }
  }

  // Update existing lead
  async updateLead(leadId, updateData) {
    try {
      const payload = {
        data: [updateData]
      };

      const response = await axios.put(
        `${this.baseURL}/Leads/${leadId}`,
        payload,
        { headers: this.getHeaders() }
      );

      console.log('Lead updated in Zoho CRM:', response.data);
      return {
        success: true,
        data: response.data.data[0],
        message: 'Lead successfully updated in Zoho CRM'
      };
    } catch (error) {
      console.error('Error updating lead in Zoho CRM:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to update lead in Zoho CRM'
      };
    }
  }

  // Get all contacts (with pagination)
  async getAllContacts(page = 1, perPage = 200) {
    try {
      const response = await axios.get(
        `${this.baseURL}/Contacts?page=${page}&per_page=${perPage}`,
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        data: response.data.data,
        info: response.data.info
      };
    } catch (error) {
      console.error('Error fetching contacts from Zoho CRM:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to fetch contacts from Zoho CRM'
      };
    }
  }

  // Get all leads (with pagination)
  async getAllLeads(page = 1, perPage = 200) {
    try {
      const response = await axios.get(
        `${this.baseURL}/Leads?page=${page}&per_page=${perPage}`,
        { headers: this.getHeaders() }
      );

      return {
        success: true,
        data: response.data.data,
        info: response.data.info
      };
    } catch (error) {
      console.error('Error fetching leads from Zoho CRM:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to fetch leads from Zoho CRM'
      };
    }
  }

  // Create a note for a contact or lead
  async createNote(entityType, entityId, noteContent) {
    try {
      const notePayload = {
        data: [{
          Note_Title: `Website Interaction - ${new Date().toLocaleDateString()}`,
          Note_Content: noteContent,
          Parent_Id: entityId,
          se_module: entityType
        }]
      };

      const response = await axios.post(
        `${this.baseURL}/Notes`,
        notePayload,
        { headers: this.getHeaders() }
      );

      console.log('Note created in Zoho CRM:', response.data);
      return {
        success: true,
        data: response.data.data[0],
        message: 'Note successfully created in Zoho CRM'
      };
    } catch (error) {
      console.error('Error creating note in Zoho CRM:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to create note in Zoho CRM'
      };
    }
  }

  // Test connection to Zoho CRM
  async testConnection() {
    try {
      const response = await axios.get(
        `${this.baseURL}/org`,
        { headers: this.getHeaders() }
      );

      console.log('Zoho CRM connection successful:', response.data);
      return {
        success: true,
        data: response.data,
        message: 'Successfully connected to Zoho CRM'
      };
    } catch (error) {
      console.error('Error connecting to Zoho CRM:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Failed to connect to Zoho CRM'
      };
    }
  }
}

module.exports = new ZohoCRMController();