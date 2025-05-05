const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  checkInDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  qrCode: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Attendance', attendanceSchema); 