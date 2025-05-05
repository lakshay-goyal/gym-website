const { jsPDF } = require('jspdf');
const autoTable = require('jspdf-autotable');
const path = require('path');
const fs = require('fs');

const generateInvoice = async (client, membershipType) => {
  const doc = new jsPDF();
  
  // Constants
  const MONTHLY_CHARGE = 500;
  const membershipMonths = {
    '1month': 1,
    '3month': 3,
    '6month': 6
  };
  
  const months = membershipMonths[membershipType];
  const subtotal = MONTHLY_CHARGE * months;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;
  
  // Generate invoice number
  const invoiceNumber = `INV-${Date.now()}`;
  
  // Add header with logo and company details
  doc.setFontSize(24);
  doc.setTextColor(41, 128, 185); // Blue color
  doc.text('FITNESS HUB', 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0); // Black color
  doc.text('123 Gym Street, Fitness City', 14, 30);
  doc.text('Phone: +91 1234567890', 14, 35);
  doc.text('Email: info@fitnesshub.com', 14, 40);
  
  // Add invoice title
  doc.setFontSize(16);
  doc.text('INVOICE', 14, 60);
  
  // Add invoice details
  doc.setFontSize(10);
  doc.text(`Invoice Number: ${invoiceNumber}`, 14, 70);
  doc.text(`Issue Date: ${new Date().toLocaleDateString()}`, 14, 75);
  doc.text(`Due Date: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}`, 14, 80);
  
  // Add client details
  doc.text('Bill To:', 14, 90);
  doc.text(`Name: ${client.username}`, 14, 95);
  doc.text(`Email: ${client.email}`, 14, 100);
  doc.text(`Phone: ${client.phone}`, 14, 105);
  
  // Add items table
  autoTable(doc, {
    startY: 115,
    head: [['Description', 'Quantity', 'Unit Price', 'Total']],
    body: [
      [
        `${months} Month Gym Membership`,
        months,
        `₹${MONTHLY_CHARGE}`,
        `₹${subtotal}`
      ]
    ],
    theme: 'grid',
    headStyles: { 
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold'
    },
    styles: { 
      fontSize: 10,
      cellPadding: 5
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 30, halign: 'right' }
    },
    margin: { left: 14 }
  });
  
  // Add totals
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(10);
  doc.text(`Subtotal: ₹${subtotal}`, 14, finalY);
  doc.text(`GST (18%): ₹${tax}`, 14, finalY + 5);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text(`Total: ₹${total}`, 14, finalY + 15);
  
  // Add payment terms
  doc.setFont(undefined, 'normal');
  doc.setFontSize(8);
  doc.text('Payment Terms:', 14, finalY + 30);
  doc.text('Payment is due within 7 days of invoice date.', 14, finalY + 35);
  doc.text('Please make payment to:', 14, finalY + 40);
  doc.text('Account Name: FITNESS HUB', 14, finalY + 45);
  doc.text('Account Number: 1234567890', 14, finalY + 50);
  doc.text('Bank: Fitness Bank', 14, finalY + 55);
  doc.text('IFSC: FITB0001234', 14, finalY + 60);
  
  // Add footer
  doc.setFontSize(8);
  doc.text('Thank you for your business!', 14, finalY + 70);
  doc.text('For any queries, please contact us at support@fitnesshub.com', 14, finalY + 75);
  
  // Save the PDF
  const uploadsDir = path.join(__dirname, '../uploads/invoices');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  const filename = `${invoiceNumber}.pdf`;
  const filePath = path.join(uploadsDir, filename);
  doc.save(filePath);
  
  return {
    invoiceNumber,
    subtotal,
    tax,
    total,
    pdfUrl: `/uploads/invoices/${filename}`
  };
};

module.exports = generateInvoice; 