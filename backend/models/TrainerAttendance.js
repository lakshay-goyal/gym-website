const mongoose = require('mongoose');

const trainerAttendanceSchema = new mongoose.Schema({
  trainerUsername: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  checkInDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TrainerAttendance', trainerAttendanceSchema); 