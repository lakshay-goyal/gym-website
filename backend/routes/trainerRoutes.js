const express = require('express');
const router = express.Router();
const Trainer = require('../models/Trainer');
const adminAuth = require('../middleware/admin');
const TrainerAttendance = require('../models/TrainerAttendance');
const Client = require('../models/Client');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.get('/', adminAuth, async (req, res) => {
  try {
    const trainers = await Trainer.find().sort({ createdAt: -1 });
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trainers', error: error.message });
  }
});

router.post('/', adminAuth, async (req, res) => {
  try {
    const { username, email, phone, specialization, experience } = req.body;
    
    const existingTrainer = await Trainer.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingTrainer) {
      if (existingTrainer.username === username) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      if (existingTrainer.email === email) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    const trainer = new Trainer({
      username,
      email,
      phone,
      specialization,
      experience
    });

    await trainer.save();
    res.status(201).json(trainer);
  } catch (error) {
    res.status(500).json({ message: 'Error adding trainer', error: error.message });
  }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { username, email, phone, specialization, experience } = req.body;
    
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    if (username !== trainer.username || email !== trainer.email) {
      const existingTrainer = await Trainer.findOne({
        $or: [
          { username, _id: { $ne: trainer._id } },
          { email, _id: { $ne: trainer._id } }
        ]
      });
      
      if (existingTrainer) {
        if (existingTrainer.username === username) {
          return res.status(400).json({ message: 'Username already in use' });
        }
        if (existingTrainer.email === email) {
          return res.status(400).json({ message: 'Email already in use' });
        }
      }
    }

    trainer.username = username;
    trainer.email = email;
    trainer.phone = phone;
    trainer.specialization = specialization;
    trainer.experience = experience;

    await trainer.save();
    res.json(trainer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating trainer', error: error.message });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    await trainer.deleteOne();
    res.json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting trainer', error: error.message });
  }
});

router.post('/attendance', async (req, res) => {
  try {
    const { username, code, checkInDate } = req.body;
    if (!username || !code || !checkInDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const today = new Date(checkInDate);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await TrainerAttendance.findOne({
      trainerUsername: username,
      checkInDate: {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'You have already checked in today' });
    }

    const attendance = new TrainerAttendance({
      trainerUsername: username,
      code,
      checkInDate
    });
    await attendance.save();
    res.status(201).json({ message: 'Trainer attendance recorded', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Error recording trainer attendance', error: error.message });
  }
});

const verifyTrainerToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (decoded.role !== 'trainer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const trainer = await Trainer.findById(decoded.userId);
    if (!trainer) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.trainer = trainer;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/clients', verifyTrainerToken, async (req, res) => {
  try {
    const clients = await Client.find({ trainer: req.trainer._id })
      .select('username email phone membershipType startDate endDate')
      .sort({ createdAt: -1 });

    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/clients/attendance', verifyTrainerToken, async (req, res) => {
  try {
    const clients = await Client.find({ trainer: req.trainer._id })
      .select('username');

    if (!clients.length) {
      return res.json([]);
    }

    const clientUsernames = clients.map(client => client.username);
    const attendance = await Attendance.find({
      username: { $in: clientUsernames }
    })
    .sort({ checkInDate: -1 })
    .limit(100);
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/attendance', verifyTrainerToken, async (req, res) => {
  try {
    const attendance = await TrainerAttendance.find({
      trainerUsername: req.trainer.username
    })
    .sort({ checkInDate: -1 })
    .limit(100);
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/clients', verifyTrainerToken, async (req, res) => {
  try {
    const { username, email, phone, membershipType } = req.body;
    
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

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const user = new User({
      username,
      password: username,
      role: 'client'
    });

    await user.save();

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
      trainer: req.trainer._id,
      user: user._id
    });

    await client.save();
    res.status(201).json(client);
  } catch (error) {
    console.error('Error adding client:', error);
    res.status(500).json({ message: 'Error adding client', error: error.message });
  }
});

module.exports = router; 