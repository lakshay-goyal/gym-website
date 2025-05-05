const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Client = require('../models/Client');

// Middleware to verify admin role
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Helper function to calculate end date based on membership type
const calculateEndDate = (startDate, membershipType) => {
  const start = new Date(startDate);
  let monthsToAdd = 0;

  switch (membershipType) {
    case '1month':
      monthsToAdd = 1;
      break;
    case '3month':
      monthsToAdd = 3;
      break;
    case '6month':
      monthsToAdd = 6;
      break;
    default:
      monthsToAdd = 1;
  }

  return new Date(start.setMonth(start.getMonth() + monthsToAdd));
};

// Add new client
router.post('/add', verifyAdmin, async (req, res) => {
  try {
    const { username, email, phone, membershipType, startDate } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Calculate end date based on membership type
    const endDate = calculateEndDate(startDate, membershipType);

    // Create user account with password same as username
    const user = new User({
      username,
      password: username, // Set password same as username
      role: 'client'
    });

    await user.save();

    // Create client profile
    const client = new Client({
      username,
      email,
      phone,
      membershipType,
      startDate,
      endDate,
      user: user._id
    });

    await client.save();

    res.status(201).json({
      message: 'Client added successfully',
      username,
      password: username // Return the password (same as username)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get client details
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const client = await Client.findOne({ user: decoded.userId });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Calculate days remaining
    const endDate = new Date(client.endDate);
    const today = new Date();
    const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    res.json({
      ...client.toObject(),
      daysRemaining: daysRemaining > 0 ? daysRemaining : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all clients
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const clients = await Client.find().select('-__v');
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Error fetching clients' });
  }
});

module.exports = router; 