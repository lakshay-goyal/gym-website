const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: `${process.env.EMAIL_USER}`,
      subject: 'New Contact Form Submission',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #333; text-align: center;">📩 New Contact Form Submission</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px; font-weight: bold; width: 150px; background-color: #f9f9f9;">Name:</td>
              <td style="padding: 10px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; background-color: #f9f9f9;">Email:</td>
              <td style="padding: 10px;">${email}</td>
            </tr>
          </table>

          <div style="margin-top: 20px;">
            <p style="font-weight: bold; margin-bottom: 5px;">Message:</p>
            <div style="background-color: #f1f1f1; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</div>
          </div>
        </div>
      `,
      replyTo: email
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Failed to send email' });
      }

      res.status(200).json({ message: 'Email sent successfully', info });
    });

  } catch (error) {
    console.error('Error in contact route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
