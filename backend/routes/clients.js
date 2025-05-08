const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Client = require('../models/Client');
const PDFDocument = require('pdfkit');

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
    const { username, email, phone, membershipType, startDate, trainer } = req.body;

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
      user: user._id,
      trainer: trainer || null // Add trainer assignment
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
    const clients = await Client.find()
      .populate('trainer', 'username')
      .select('-__v');
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Error fetching clients' });
  }
});

// Generate client invoice
router.get('/invoice/:clientId', verifyAdmin, async (req, res) => {
  try {
    const client = await Client.findById(req.params.clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Calculate amount based on membership type
    const monthlyRate = 500; // 500 rupees per month
    let months = 0;
    switch (client.membershipType) {
      case '1month':
        months = 1;
        break;
      case '3month':
        months = 3;
        break;
      case '6month':
        months = 6;
        break;
      default:
        months = 1;
    }
    const totalAmount = months * monthlyRate;

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${client.username}.pdf`);
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Add header with logo and company info
    doc.fontSize(20).text('Gym Membership Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text('Gym Name: Fitness Pro', { align: 'center' });
    doc.text('Address: 123 Fitness Street, City', { align: 'center' });
    doc.text('Phone: +91 1234567890', { align: 'center' });
    doc.text('Email: info@fitnesspro.com', { align: 'center' });
    doc.moveDown();
    
    // Add invoice details
    doc.fontSize(12);
    doc.text(`Invoice Number: INV-${client._id.toString().slice(-6)}`, { align: 'right' });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.moveDown();
    
    // Add client details
    doc.fontSize(14).text('Bill To:', { underline: true });
    doc.fontSize(12);
    doc.text(`Username: ${client.username}`);
    doc.text(`Email: ${client.email}`);
    doc.text(`Phone: ${client.phone}`);
    doc.moveDown();

    // Create table for membership details
    const tableTop = doc.y;
    const tableLeft = 50;
    const col1 = 50;  // Description
    const col2 = 200; // Duration
    const col3 = 300; // Rate
    const col4 = 400; // Amount
    const rowHeight = 30;
    
    // Draw table header
    doc.fontSize(12).font('Helvetica-Bold');
    doc.rect(tableLeft, tableTop, 500, rowHeight).stroke();
    
    // Draw vertical lines
    doc.moveTo(col2, tableTop).lineTo(col2, tableTop + rowHeight).stroke();
    doc.moveTo(col3, tableTop).lineTo(col3, tableTop + rowHeight).stroke();
    doc.moveTo(col4, tableTop).lineTo(col4, tableTop + rowHeight).stroke();
    
    // Add header text
    doc.text('Description', col1 + 10, tableTop + 10);
    doc.text('Duration', col2 + 10, tableTop + 10);
    doc.text('Rate', col3 + 10, tableTop + 10);
    doc.text('Amount', col4 + 10, tableTop + 10);
    
    // Draw table row
    const rowY = tableTop + rowHeight;
    doc.fontSize(12).font('Helvetica');
    doc.rect(tableLeft, rowY, 500, rowHeight).stroke();
    
    // Draw vertical lines for row
    doc.moveTo(col2, rowY).lineTo(col2, rowY + rowHeight).stroke();
    doc.moveTo(col3, rowY).lineTo(col3, rowY + rowHeight).stroke();
    doc.moveTo(col4, rowY).lineTo(col4, rowY + rowHeight).stroke();
    
    // Add row content
    doc.text('Gym Membership', col1 + 10, rowY + 10);
    doc.text(`${months} Month${months > 1 ? 's' : ''}`, col2 + 10, rowY + 10);
    doc.text(`₹${monthlyRate}/month`, col3 + 10, rowY + 10);
    doc.text(`₹${totalAmount}`, col4 + 10, rowY + 10);
    
    // Add total section
    const totalY = rowY + rowHeight;
    doc.rect(tableLeft, totalY, 500, rowHeight).stroke();
    doc.moveTo(col3, totalY).lineTo(col3, totalY + rowHeight).stroke();
    doc.moveTo(col4, totalY).lineTo(col4, totalY + rowHeight).stroke();
    
    doc.fontSize(14).font('Helvetica-Bold');
    doc.text('Total Amount:', col3 + 10, totalY + 10);
    doc.text(`₹${totalAmount}`, col4 + 10, totalY + 10);
    
    // Add payment status section
    doc.moveDown(2);
    doc.fontSize(12).font('Helvetica');
    doc.text(`Payment Status: ${client.paymentStatus || 'Pending'}`);
    doc.text(`Payment Date: ${new Date(client.paymentDate || new Date()).toLocaleDateString()}`);
    
    // Add terms and conditions
    doc.moveDown(3);
    doc.fontSize(10).text('Terms and Conditions:', { underline: true });
    doc.fontSize(8);
    doc.text('1. Membership is non-transferable and non-refundable.');
    doc.text('2. Payment must be made in full before the start date.');
    doc.text('3. Membership can be renewed before the expiry date.');
    
    // Add footer
    doc.moveDown(2);
    doc.fontSize(10).text('Thank you for your business!', { align: 'center' });
    doc.text('This is a computer-generated invoice and does not require a signature.', { align: 'center' });
    
    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ message: 'Error generating invoice' });
  }
});

// Get client's own invoice
router.get('/my-invoice', async (req, res) => {
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

    // Calculate amount based on membership type
    const monthlyRate = 500; // 500 rupees per month
    let months = 0;
    switch (client.membershipType) {
      case '1month':
        months = 1;
        break;
      case '3month':
        months = 3;
        break;
      case '6month':
        months = 6;
        break;
      default:
        months = 1;
    }
    const totalAmount = months * monthlyRate;

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${client.username}.pdf`);
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Add header with logo and company info
    doc.fontSize(20).text('Gym Membership Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text('Gym Name: Fitness Pro', { align: 'center' });
    doc.text('Address: 123 Fitness Street, City', { align: 'center' });
    doc.text('Phone: +91 1234567890', { align: 'center' });
    doc.text('Email: info@fitnesspro.com', { align: 'center' });
    doc.moveDown();
    
    // Add invoice details
    doc.fontSize(12);
    doc.text(`Invoice Number: INV-${client._id.toString().slice(-6)}`, { align: 'right' });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.moveDown();
    
    // Add client details
    doc.fontSize(14).text('Bill To:', { underline: true });
    doc.fontSize(12);
    doc.text(`Username: ${client.username}`);
    doc.text(`Email: ${client.email}`);
    doc.text(`Phone: ${client.phone}`);
    doc.moveDown();

    // Create table for membership details
    const tableTop = doc.y;
    const tableLeft = 50;
    const col1 = 50;  // Description
    const col2 = 200; // Duration
    const col3 = 300; // Rate
    const col4 = 400; // Amount
    const rowHeight = 30;
    
    // Draw table header
    doc.fontSize(12).font('Helvetica-Bold');
    doc.rect(tableLeft, tableTop, 500, rowHeight).stroke();
    
    // Draw vertical lines
    doc.moveTo(col2, tableTop).lineTo(col2, tableTop + rowHeight).stroke();
    doc.moveTo(col3, tableTop).lineTo(col3, tableTop + rowHeight).stroke();
    doc.moveTo(col4, tableTop).lineTo(col4, tableTop + rowHeight).stroke();
    
    // Add header text
    doc.text('Description', col1 + 10, tableTop + 10);
    doc.text('Duration', col2 + 10, tableTop + 10);
    doc.text('Rate', col3 + 10, tableTop + 10);
    doc.text('Amount', col4 + 10, tableTop + 10);
    
    // Draw table row
    const rowY = tableTop + rowHeight;
    doc.fontSize(12).font('Helvetica');
    doc.rect(tableLeft, rowY, 500, rowHeight).stroke();
    
    // Draw vertical lines for row
    doc.moveTo(col2, rowY).lineTo(col2, rowY + rowHeight).stroke();
    doc.moveTo(col3, rowY).lineTo(col3, rowY + rowHeight).stroke();
    doc.moveTo(col4, rowY).lineTo(col4, rowY + rowHeight).stroke();
    
    // Add row content
    doc.text('Gym Membership', col1 + 10, rowY + 10);
    doc.text(`${months} Month${months > 1 ? 's' : ''}`, col2 + 10, rowY + 10);
    doc.text(`₹${monthlyRate}/month`, col3 + 10, rowY + 10);
    doc.text(`₹${totalAmount}`, col4 + 10, rowY + 10);
    
    // Add total section
    const totalY = rowY + rowHeight;
    doc.rect(tableLeft, totalY, 500, rowHeight).stroke();
    doc.moveTo(col3, totalY).lineTo(col3, totalY + rowHeight).stroke();
    doc.moveTo(col4, totalY).lineTo(col4, totalY + rowHeight).stroke();
    
    doc.fontSize(14).font('Helvetica-Bold');
    doc.text('Total Amount:', col3 + 10, totalY + 10);
    doc.text(`₹${totalAmount}`, col4 + 10, totalY + 10);
    
    // Add payment status section
    doc.moveDown(2);
    doc.fontSize(12).font('Helvetica');
    doc.text(`Payment Status: ${client.paymentStatus || 'Pending'}`);
    doc.text(`Payment Date: ${new Date(client.paymentDate || new Date()).toLocaleDateString()}`);
    
    // Add terms and conditions
    doc.moveDown(3);
    doc.fontSize(10).text('Terms and Conditions:', { underline: true });
    doc.fontSize(8);
    doc.text('1. Membership is non-transferable and non-refundable.');
    doc.text('2. Payment must be made in full before the start date.');
    doc.text('3. Membership can be renewed before the expiry date.');
    
    // Add footer
    doc.moveDown(2);
    doc.fontSize(10).text('Thank you for your business!', { align: 'center' });
    doc.text('This is a computer-generated invoice and does not require a signature.', { align: 'center' });
    
    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ message: 'Error generating invoice' });
  }
});

// Delete client
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Delete the associated user account
    await User.findByIdAndDelete(client.user);

    // Delete the client
    await client.deleteOne();

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ message: 'Error deleting client' });
  }
});

module.exports = router; 