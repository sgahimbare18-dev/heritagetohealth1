const dotenv = require("dotenv");
dotenv.config();

const nodemailer = require('nodemailer');
require('dotenv').config();

// Test Zoho SMTP configuration
const transporter = nodemailer.createTransporter({
  service: 'zoho',
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL_USER || 'helitagetohealth1@zohomail.com',
    pass: process.env.ZOHO_EMAIL_PASS || ''
  }
});

// Test email options
const mailOptions = {
  from: process.env.ZOHO_EMAIL_USER || 'helitagetohealth1@zohomail.com',
  to: 'helitagetohealth1@zohomail.com',
  subject: 'Test Email from Heritage to Health Application',
  text: 'This is a test email to verify that the Zoho SMTP configuration is working correctly.',
  html: '<p>This is a test email to verify that the Zoho SMTP configuration is working correctly.</p>'
};

console.log('Testing Zoho SMTP configuration...');
console.log('From:', mailOptions.from);
console.log('To:', mailOptions.to);

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error sending test email:', error);
    console.log('\nPossible solutions:');
    console.log('1. Make sure you have set ZOHO_EMAIL_PASS in your .env file');
    console.log('2. Ensure you are using an App Password if 2FA is enabled on your Zoho account');
    console.log('3. Check that your Zoho account allows SMTP access');
    console.log('4. Verify the email address and password are correct');
  } else {
    console.log('Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
  }
  
  process.exit(0);
});