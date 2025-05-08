const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const Trainer = require('../models/Trainer');
const adminAuth = require('../middleware/admin');

// Get all clients with trainer details
router.get('/', adminAuth, async (req, res) => {
  try {
    const clients = await Client.find().populate('trainer', 'username');
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching clients', error: error.message });
  }
});

// Add new client
router.post('/', adminAuth, async (req, res) => {
  try {
    const { username, email, phone, membershipType, trainerId } = req.body;
    
    // Check if client with username or email already exists
    const existingClient = await Client.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingClient) {
      if (existingClient.username === username) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      if (existingClient.email === email) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // Calculate end date based on membership type
    const startDate = new Date();
    const endDate = new Date();
    switch (membershipType) {
      case '1month':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case '3month':
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case '6month':
        endDate.setMonth(endDate.getMonth() + 6);
        break;
      default:
        endDate.setMonth(endDate.getMonth() + 1);
    }

    const client = new Client({
      username,
      email,
      phone,
      membershipType,
      startDate,
      endDate,
      trainer: trainerId || null
    });

    await client.save();
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: 'Error adding client', error: error.message });
  }
});

// Update client
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { username, email, phone, membershipType, trainerId } = req.body;
    
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Check if username or email is being changed and if it's already in use
    if (username !== client.username || email !== client.email) {
      const existingClient = await Client.findOne({
        $or: [
          { username, _id: { $ne: client._id } },
          { email, _id: { $ne: client._id } }
        ]
      });
      
      if (existingClient) {
        if (existingClient.username === username) {
          return res.status(400).json({ message: 'Username already in use' });
        }
        if (existingClient.email === email) {
          return res.status(400).json({ message: 'Email already in use' });
        }
      }
    }

    // Update client details
    client.username = username;
    client.email = email;
    client.phone = phone;
    client.membershipType = membershipType;
    client.trainer = trainerId || null;

    // If membership type changed, update end date
    if (membershipType !== client.membershipType) {
      const startDate = new Date();
      const endDate = new Date();
      switch (membershipType) {
        case '1month':
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case '3month':
          endDate.setMonth(endDate.getMonth() + 3);
          break;
        case '6month':
          endDate.setMonth(endDate.getMonth() + 6);
          break;
        default:
          endDate.setMonth(endDate.getMonth() + 1);
      }
      client.startDate = startDate;
      client.endDate = endDate;
    }

    await client.save();
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Error updating client', error: error.message });
  }
});

// Delete client
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    await client.deleteOne();
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting client', error: error.message });
  }
});

// Get all trainers for dropdown
router.get('/trainers', adminAuth, async (req, res) => {
  try {
    const trainers = await Trainer.find().select('username');
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trainers', error: error.message });
  }
});

module.exports = router; 