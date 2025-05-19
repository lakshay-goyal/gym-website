const express = require('express');
const router = express.Router();
const QRCode = require('../models/QRCode');
const Attendance = require('../models/Attendance');
const Client = require('../models/Client');
const qrcode = require('qrcode');
const PDFDocument = require('pdfkit');
const dotenv = require('dotenv');

dotenv.config();

router.post('/generate', async (req, res) => {
  try {
    const code = Math.random().toString(36).substring(2, 15);
    const qr = new QRCode({ code });
    await qr.save();

    const qrContent = `${process.env.FRONTEND_URL}/qr-scanner?code=${code}`;
    const qrData = await qrcode.toDataURL(qrContent, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 400,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    
    res.json({ qrData, code });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/export/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });
  
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=qr-code-${code}.pdf`);
    
    doc.pipe(res);
    
    doc.fontSize(20).text('Gym Attendance QR Code', { align: 'center' });
    doc.moveDown();
    
    const qrContent = `${process.env.FRONTEND_URL}/qr-scanner?code=${code}`;
    const qrData = await qrcode.toDataURL(qrContent, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 400,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    const qrImage = Buffer.from(qrData.split(',')[1], 'base64');
    
    doc.image(qrImage, {
      fit: [300, 300],
      align: 'center'
    });
    
    doc.moveDown();
    doc.fontSize(14).text(`Code: ${code}`, { align: 'center' });
    
    doc.moveDown();
    doc.fontSize(12).text('Instructions:', { align: 'center' });
    doc.fontSize(10).text('1. Print this QR code and display it at the gym entrance', { align: 'center' });
    doc.fontSize(10).text('2. Members can scan this code to check in/out', { align: 'center' });
    
    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { code, username, checkInDate } = req.body;

    if (!code || !username) {
      return res.status(400).json({ message: 'Invalid QR code or username' });
    }

    const today = new Date(checkInDate);
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await Attendance.findOne({
      username,
      checkInDate: {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'You have already checked in today' });
    }

    const attendance = new Attendance({
      username,
      checkInDate: checkInDate || new Date(),
      qrCode: code
    });

    await attendance.save();

    res.json({ message: 'Attendance recorded successfully' });
  } catch (error) {
    console.error('Error recording attendance:', error);
    res.status(500).json({ message: 'Error recording attendance' });
  }
});

router.get('/attendance', async (req, res) => {
  try {
    const { username, date, month } = req.query;
    let query = {};

    if (username) {
      query.username = username;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.checkInDate = { $gte: startDate, $lt: endDate };
    }

    if (month) {
      const [year, monthNum] = month.split('-');
      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 1);
      query.checkInDate = { $gte: startDate, $lt: endDate };
    }

    const attendance = await Attendance.find(query)
      .sort({ checkInDate: -1 });

    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Error fetching attendance records' });
  }
});

router.get('/codes', async (req, res) => {
  try {
    const qrCodes = await QRCode.find().sort({ createdAt: -1 });
    res.json(qrCodes);
  } catch (error) {
    console.error('Error fetching QR codes:', error);
    res.status(500).json({ message: 'Error fetching QR codes' });
  }
});

router.delete('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const deletedQR = await QRCode.findOneAndDelete({ code });
    
    if (!deletedQR) {
      return res.status(404).json({ message: 'QR code not found' });
    }
    
    res.json({ message: 'QR code deleted successfully' });
  } catch (error) {
    console.error('Error deleting QR code:', error);
    res.status(500).json({ message: 'Error deleting QR code' });
  }
});

router.get('/attendance/stats', async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const now = new Date();
    const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const totalVisits = await Attendance.countDocuments({ username });

    const currentMonthVisits = await Attendance.countDocuments({
      username,
      checkInDate: {
        $gte: firstDayOfCurrentMonth,
        $lt: firstDayOfNextMonth
      }
    });

    const lastMonthVisits = await Attendance.countDocuments({
      username,
      checkInDate: {
        $gte: firstDayOfLastMonth,
        $lt: firstDayOfCurrentMonth
      }
    });

    res.json({
      totalVisits,
      currentMonthVisits,
      lastMonthVisits
    });
  } catch (error) {
    console.error('Error fetching attendance stats:', error);
    res.status(500).json({ message: 'Error fetching attendance statistics' });
  }
});

router.get('/verify/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    const qrCode = await QRCode.findOne({ code, isActive: true });
    
    if (!qrCode) {
      return res.json({ isValid: false });
    }
    
    res.json({ isValid: true });
  } catch (error) {
    console.error('Error verifying QR code:', error);
    res.status(500).json({ message: 'Error verifying QR code' });
  }
});

module.exports = router;