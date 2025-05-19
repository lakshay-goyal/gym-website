import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaQrcode, FaDownload, FaTrash, FaEye } from 'react-icons/fa';
import { motion } from 'framer-motion';

const QRGenerator = () => {
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [qrCodes, setQrCodes] = useState([]);
  const [error, setError] = useState('');
  const [selectedQR, setSelectedQR] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const baseURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchQRCodes();
  }, []);

  const fetchQRCodes = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/qr/codes`);
      setQrCodes(response.data);
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      setError('Failed to fetch QR codes');
    }
  };

  const generateQR = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${baseURL}/api/qr/generate`);
      setQrCode(response.data.qrData);
      setCode(response.data.code);
      await fetchQRCodes();
    } catch (error) {
      console.error('Error generating QR code:', error);
      setError('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const deleteQR = async (code) => {
    try {
      await axios.delete(`${baseURL}/api/qr/${code}`);
      await fetchQRCodes();
      if (selectedQR?.code === code) {
        setSelectedQR(null);
        setShowPreview(false);
      }
    } catch (error) {
      console.error('Error deleting QR code:', error);
      setError('Failed to delete QR code');
    }
  };

  const downloadPDF = async (qrCode) => {
    try {
      const response = await axios.get(`${baseURL}/api/qr/export/${qrCode.code}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `qr-code-${qrCode.code}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setError('Failed to download PDF');
    }
  };

  const previewQR = async (qr) => {
    try {
      const response = await axios.post(`${baseURL}/api/qr/generate`, { code: qr.code });
      setSelectedQR({ ...qr, qrData: response.data.qrData });
      setShowPreview(true);
    } catch (error) {
      console.error('Error previewing QR code:', error);
      setError('Failed to preview QR code');
    }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
      }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">QR Code Generator</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex flex-col items-center space-y-6">
      <button
        onClick={generateQR}
        disabled={loading}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-300 flex items-center"
      >
            <FaQrcode className="mr-2" />
        {loading ? 'Generating...' : 'Generate QR Code'}
      </button>

      {qrCode && (
          <div className="mt-4 text-center">
              <img src={qrCode} alt="QR Code" className="mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-4">Code: {code}</p>
              <button
                onClick={() => downloadPDF({ code, qrData: qrCode })}
                className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-300 flex items-center"
              >
                <FaDownload className="mr-2" />
                Download PDF
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Generated QR Codes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {qrCodes.map((qr) => (
            <div key={qr._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">Code: {qr.code}</p>
                  <p className="text-xs text-gray-500">
                    Created: {new Date(qr.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => previewQR(qr)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Preview QR Code"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => downloadPDF(qr)}
                    className="text-gray-600 hover:text-gray-800"
                    title="Download PDF"
                  >
                    <FaDownload />
                  </button>
                  <button
                    onClick={() => deleteQR(qr.code)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete QR Code"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && selectedQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">QR Code Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="text-center">
              <img src={selectedQR.qrData} alt="QR Code" className="mx-auto mb-4 w-80" />
              <p className="text-sm text-gray-600 mb-4">Code: {selectedQR.code}</p>
            <button
                onClick={() => downloadPDF(selectedQR)}
                className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-300 flex items-center mx-auto"
            >
                <FaDownload className="mr-2" />
              Download PDF
            </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default QRGenerator;