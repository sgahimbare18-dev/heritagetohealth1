const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

const submitContact = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Save to DB if possible
    try {
      const contact = new Contact({ name, email, message });
      await contact.save();
    } catch (dbError) {
      console.log('DB save failed, proceeding with email:', dbError.message);
    }

    // Send email
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: email,
      to: 'heritagetohealth@gmail.com',
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Thank you for contacting us! We will get back to you soon.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
};

module.exports = { submitContact };
