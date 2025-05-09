const express = require('express');
const router = express.Router();
const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const { data, error } = await resend.emails.send({
      from: `${name} <onboarding@resend.dev>`,
      to: ['lakshaygoyal201@gmail.com'],
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
      reply_to: email
    });
    

    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    res.status(200).json({ message: 'Email sent successfully', data });
  } catch (error) {
    console.error('Error in contact route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 