import React, { useState } from 'react';
import axios from 'axios';

const QRGenerator = () => {
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');

  const generateQR = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/qr/generate');
      setQrCode(response.data.qrData);
      setCode(response.data.code);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/qr/export/${code}`, {
        responseType: 'blob'
      });
      
      // Create a blob URL for the PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `qr-code-${code}.pdf`);
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">QR Code Generator</h2>
      <button
        onClick={generateQR}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Generating...' : 'Generate QR Code'}
      </button>

      {qrCode && (
        <div className="mt-4">
          <img src={qrCode} alt="QR Code" className="mx-auto" />
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-2">Code: {code}</p>
            <button
              onClick={downloadPDF}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRGenerator; 