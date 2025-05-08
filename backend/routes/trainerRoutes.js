const express = require('express');
const router = express.Router();
const Trainer = require('../models/Trainer');
const adminAuth = require('../middleware/admin');
const TrainerAttendance = require('../models/TrainerAttendance');

// Get all trainers
router.get('/', adminAuth, async (req, res) => {
  try {
    const trainers = await Trainer.find().sort({ createdAt: -1 });
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trainers', error: error.message });
  }
});

// Add new trainer
router.post('/', adminAuth, async (req, res) => {
  try {
    const { username, email, phone, specialization, experience } = req.body;
    
    // Check if trainer with username or email already exists
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

// Update trainer
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { username, email, phone, specialization, experience } = req.body;
    
    // Check if trainer exists
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    // Check if username or email is being changed and if it's already in use
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

// Delete trainer
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

// Record trainer attendance
router.post('/attendance', async (req, res) => {
  try {
    const { username, code, checkInDate } = req.body;
    if (!username || !code || !checkInDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if trainer has already checked in today
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

module.exports = router; 