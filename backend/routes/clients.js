const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Client = require('../models/Client');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

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
    const hashedPassword = await bcrypt.hash(username, 10);
    const user = new User({
      username,
      password: hashedPassword,
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
      trainer: trainer || null
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

    const startDate = new Date(client.startDate);
    const endDate = new Date(client.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (startDate > today) {
      const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      return res.json({
        ...client.toObject(),
        daysRemaining: totalDays
      });
    }

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

// Helper function to generate professional invoice
const generateInvoice = async (client, res) => {
  try {
    // Calculate amount based on membership type
    const membershipRates = {
      '1month': 1500,
      '3month': 4000,
      '6month': 7500
    };
    
    const amount = membershipRates[client.membershipType] || 1500;
    const taxRate = 0.18; // 18% GST
    const taxAmount = amount * taxRate;
    const totalAmount = amount + taxAmount;

    // Format dates
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    };

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      bufferPages: true
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Invoice_${client.username}.pdf`);
    
    // Pipe PDF to response
    doc.pipe(res);

    // Add header with company info
    doc.fillColor('#444444')
       .fontSize(20)
       .text('MYO-PLUS FITNESS', 50, 50)
       .fontSize(10)
       .text('123 Fitness Street, City', 200, 50, { align: 'right' })
       .text('Bangalore, Karnataka 560001', 200, 65, { align: 'right' })
       .text('GSTIN: 29ABCDE1234F1Z5', 200, 80, { align: 'right' })
       .moveDown();

    // Draw horizontal line
    doc.strokeColor('#aaaaaa')
       .lineWidth(1)
       .moveTo(50, 120)
       .lineTo(550, 120)
       .stroke();

    // Add invoice title and details
    doc.fontSize(20)
       .text('INVOICE', 50, 140)
       .fontSize(10)
       .text(`Invoice #: INV-${client._id.toString().slice(-6).toUpperCase()}`, 50, 170)
       .text(`Invoice Date: ${new Date().toLocaleDateString('en-IN')}`, 50, 185)
       .text(`Due Date: ${formatDate(client.startDate)}`, 50, 200)
       .text(`Membership Period: ${formatDate(client.startDate)} - ${formatDate(client.endDate)}`, 50, 215)
       .moveDown();

    // Add client details
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('Bill To:', 50, 250)
       .font('Helvetica')
       .text(client.username, 50, 265)
       .text(client.email, 50, 280)
       .text(client.phone, 50, 295)
       .moveDown();

    // Create table for invoice items
    const tableTop = 350;
    const itemCodeX = 50;
    const descriptionX = 100;
    const periodX = 300;
    const amountX = 400;
    const taxX = 475;
    const lineY = tableTop + 20;

    // Table header
    doc.font('Helvetica-Bold')
       .fontSize(10)
       .text('Code', itemCodeX, tableTop)
       .text('Description', descriptionX, tableTop)
       .text('Period', periodX, tableTop)
       .text('Amount', amountX, tableTop)
       .text('Tax (18%)', taxX, tableTop)
       .moveTo(50, tableTop + 15)
       .lineTo(550, tableTop + 15)
       .stroke();

    // Table row
    doc.font('Helvetica')
       .text('GYM001', itemCodeX, lineY)
       .text(`Gym Membership (${client.membershipType})`, descriptionX, lineY)
       .text(`${client.membershipType.replace('month', ' month')}`, periodX, lineY)
       .text(`₹${amount.toLocaleString('en-IN')}`, amountX, lineY)
       .text(`₹${taxAmount.toLocaleString('en-IN')}`, taxX, lineY)
       .moveTo(50, lineY + 20)
       .lineTo(550, lineY + 20)
       .stroke();

    // Summary section
    const summaryY = lineY + 40;
    doc.font('Helvetica-Bold')
       .text('Subtotal:', amountX, summaryY)
       .text(`₹${amount.toLocaleString('en-IN')}`, taxX, summaryY)
       .text('Tax (18%):', amountX, summaryY + 20)
       .text(`₹${taxAmount.toLocaleString('en-IN')}`, taxX, summaryY + 20)
       .moveTo(400, summaryY + 35)
       .lineTo(550, summaryY + 35)
       .stroke()
       .fontSize(12)
       .text('Total Amount:', amountX, summaryY + 40)
       .text(`₹${totalAmount.toLocaleString('en-IN')}`, taxX, summaryY + 40)
       .moveTo(400, summaryY + 55)
       .lineTo(550, summaryY + 55)
       .stroke();

    // Payment information
    doc.fontSize(10)
       .text('Payment Method: Bank Transfer', 50, summaryY + 80)
       .text('Bank Name: State Bank of India', 50, summaryY + 95)
       .text('Account Name: Myo-Plus Fitness', 50, summaryY + 110)
       .text('Account Number: 123456789012', 50, summaryY + 125)
       .text('IFSC Code: SBIN0001234', 50, summaryY + 140)
       .text(`Payment Status: ${client.paymentStatus || 'Pending'}`, 50, summaryY + 155);

    // Terms and conditions
    doc.fontSize(8)
       .text('Terms & Conditions:', 50, 650)
       .text('1. Membership is non-transferable and non-refundable.', 50, 665)
       .text('2. Payment must be made in full before the start date.', 50, 680)
       .text('3. Late payments may result in membership suspension.', 50, 695)
       .text('4. Please bring this invoice for any queries.', 50, 710);

    // Footer
    doc.fontSize(8)
       .text('Thank you for choosing Myo-Plus Fitness!', 50, 730, { align: 'center' })
       .text('For any queries, contact: support@myoplus.com | Phone: +91 9876543210', 50, 745, { align: 'center' })
       .text('This is a computer generated invoice and does not require a signature.', 50, 760, { align: 'center' });

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error('Error generating invoice:', error);
    throw error;
  }
};

// Generate client invoice (admin)
router.get('/invoice/:clientId', verifyAdmin, async (req, res) => {
  try {
    const client = await Client.findById(req.params.clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    await generateInvoice(client, res);
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

    await generateInvoice(client, res);
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

    await User.findByIdAndDelete(client.user);
    await client.deleteOne();

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ message: 'Error deleting client' });
  }
});

// Update client profile
router.put('/profile', async (req, res) => {
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

    const { username, email, phone } = req.body;

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

    client.username = username;
    client.email = email;
    client.phone = phone;

    await client.save();
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

module.exports = router;