import dotenv from "dotenv";
dotenv.config();

import Contact from '../models/Contact.js';
import nodemailer from 'nodemailer';
import zohoCRM from './zohoCRMController.js';

const submitContact = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // Save to DB if possible
    try {
      const contact = new Contact({ name, email, message: `Subject: ${subject}\n\n${message}` });
      await contact.save();
    } catch (dbError) {
      console.log('DB save failed, proceeding with email:', dbError.message);
    }

    // Send email using Zoho SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_EMAIL_USER,
        pass: process.env.ZOHO_EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Heritage to Health" <${process.env.ZOHO_EMAIL_USER}>`,
      replyTo: email,
      to: 'heritagetohealth1@zohomail.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
        <p><strong>Location:</strong> Arusha, Tanzania</p>
      `
    };

    await transporter.sendMail(mailOptions);

    // Sync with Zoho CRM
    try {
      const crmResult = await zohoCRM.createContact({
        name,
        email,
        message: `Subject: ${subject}\n\n${message}`,
        source: 'Website Contact Form',
        description: `Contact Form Submission\nSubject: ${subject}\nMessage: ${message}`
      });
      
      if (crmResult.success) {
        console.log('Contact synced to Zoho CRM successfully');
      } else {
        console.warn('Failed to sync contact to Zoho CRM:', crmResult.message);
      }
    } catch (crmError) {
      console.warn('CRM sync error (non-blocking):', crmError.message);
    }

    res.status(200).json({ success: true, message: 'Thank you for contacting us! We will get back to you soon.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit contact form' });
  }
};

const submitPartnership = async (req, res) => {
  const { name, email, organization, partnershipType, message } = req.body;

  try {
    // Save to DB if possible
    try {
      const contact = new Contact({
        name,
        email,
        message: `Partnership Interest:\nOrganization: ${organization}\nType: ${partnershipType}\n\n${message}`
      });
      await contact.save();
    } catch (dbError) {
      console.log('DB save failed, proceeding with email:', dbError.message);
    }

    // Send email using Zoho SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_EMAIL_USER,
        pass: process.env.ZOHO_EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Heritage to Health" <${process.env.ZOHO_EMAIL_USER}>`,
      replyTo: email,
      to: 'heritagetohealth1@zohomail.com',
      subject: 'New Partnership Interest Submission',
      html: `
        <h3>New Partnership Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Organization:</strong> ${organization}</p>
        <p><strong>Partnership Type:</strong> ${partnershipType}</p>
        <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    // Create lead in Zoho CRM
    try {
      const crmResult = await zohoCRM.createLead({
        name,
        email,
        organization,
        message: `Partnership Type: ${partnershipType}\n\n${message}`,
        source: 'Website Partnership Form',
        description: `Partnership Interest\nOrganization: ${organization}\nType: ${partnershipType}\nMessage: ${message}`
      });
      
      if (crmResult.success) {
        console.log('Partnership lead created in Zoho CRM successfully');
      } else {
        console.warn('Failed to create partnership lead in Zoho CRM:', crmResult.message);
      }
    } catch (crmError) {
      console.warn('CRM lead creation error (non-blocking):', crmError.message);
    }

    res.status(200).json({ success: true, message: 'Thank you for your partnership interest! We will contact you soon.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit partnership form' });
  }
};

export { submitContact, submitPartnership };
