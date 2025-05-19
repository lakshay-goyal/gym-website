const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('QRCode', qrCodeSchema); 