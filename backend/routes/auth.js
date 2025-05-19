const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Trainer = require('../models/Trainer');
const Client = require('../models/Client');
const OTP = require('../models/OTP');
const transporter = require('../utils/transporter');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    if (decoded.role === 'trainer') {
      const trainer = await Trainer.findById(decoded.userId);
      if (!trainer) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      req.user = trainer;
      req.user.role = 'trainer';
    } else {
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      req.user = user;
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const user = new User({
      username,
      password,
      role
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    let trainer = await Trainer.findOne({ username });
    if (trainer) {
      const isMatch = await trainer.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: trainer._id, role: 'trainer' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
      );

      return res.json({
        token,
        user: {
          id: trainer._id,
          username: trainer.username,
          email: trainer.email,
          phone: trainer.phone,
          specialization: trainer.specialization,
          experience: trainer.experience,
          role: 'trainer'
        }
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const isMatch = await req.user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    req.user.password = newPassword;
    await req.user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    let user;
    if (role === 'trainer') {
      user = await Trainer.findOne({ username });
      if (!user) {
        return res.status(200).json({ isValid: false, message: 'Invalid credentials' });
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(200).json({ isValid: false, message: 'Invalid credentials' });
      }
      return res.json({ isValid: true, role: 'trainer' });
    } else {
      user = await User.findOne({ username, role: 'client' });
      if (!user) {
        return res.status(200).json({ isValid: false, message: 'Invalid credentials' });
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(200).json({ isValid: false, message: 'Invalid credentials' });
      }
      return res.json({ isValid: true, role: 'client' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/update-admin', verifyToken, async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;

    const isMatch = await req.user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    if (username !== req.user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already in use' });
      }
    }

    req.user.username = username;
    if (newPassword) {
      req.user.password = newPassword;
    }

    await req.user.save();

    const token = jwt.sign(
      { userId: req.user._id, role: req.user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: req.user._id,
        username: req.user.username,
        role: req.user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/update-trainer-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (req.user.role !== 'trainer') {
      return res.status(403).json({ message: 'Access denied. Trainers only.' });
    }

    const isMatch = await req.user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    req.user.password = newPassword;
    await req.user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating trainer password:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Forgot password request for email:', email);

    let user = await User.findOne({ email });
    let client = null;
    if (!user) {
      client = await Client.findOne({ email });
      if (!client) {
        console.log('No user found with email:', email);
        return res.status(404).json({ message: 'No user found with this email' });
      }
      user = await User.findById(client.user);
    }
    console.log('Found user:', user.username);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', otp);

    const otpRecord = await OTP.create({
      email,
      otp,
      clientData: {
        username: user.username,
        email: email,
        purpose: 'password_reset'
      },
      purpose: 'password_reset'
    });
    console.log('Created OTP record:', otpRecord._id);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #333; text-align: center;">🔐 Password Reset OTP</h2>
          <p style="font-size: 16px;">Your OTP for password reset is:</p>
          <h1 style="text-align: center; font-size: 32px; color: #007bff; letter-spacing: 5px;">${otp}</h1>
          <p style="font-size: 14px; color: #666;">This OTP will expire in 5 minutes.</p>
          <p style="font-size: 14px; color: #666;">If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully');
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log('Reset password request for email:', email, 'OTP:', otp);

    const otpRecord = await OTP.findOne({ 
      email, 
      otp,
      'clientData.purpose': 'password_reset'
    });

    console.log('Found OTP record:', otpRecord ? 'Yes' : 'No');

    if (!otpRecord) {
      console.log('Invalid OTP for email:', email);
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const otpAge = Date.now() - otpRecord.createdAt.getTime();
    console.log('OTP age in minutes:', otpAge / (60 * 1000));

    if (otpAge > 5 * 60 * 1000) { 
      console.log('OTP expired for email:', email);
      await OTP.deleteOne({ _id: otpRecord._id }); 
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      const client = await Client.findOne({ email });
      if (!client) {
        console.log('User not found for email:', email);
        return res.status(404).json({ message: 'User not found' });
      }
      user = await User.findById(client.user);
    }
    console.log('Found user for password reset:', user.username);

    user.password = user.username;
    await user.save();
    console.log('Password reset successful for user:', user.username);

    await OTP.deleteOne({ _id: otpRecord._id });
    console.log('OTP record deleted');

    res.json({ 
      message: 'Password reset successfully',
      password: user.username 
    });
  } catch (error) {
    console.error('Error in reset password:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

module.exports = router; 