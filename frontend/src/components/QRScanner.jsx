import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import QRScanForm from './QRScanForm';
import { 
  FaQrcode, 
  FaRedo, 
  FaDumbbell, 
  FaCheckCircle, 
  FaTimesCircle,
  FaKeyboard,
  FaCamera,
  FaArrowLeft
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const QRScanner = () => {
  const navigate = useNavigate();
  const [scannedCode, setScannedCode] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [scanner, setScanner] = useState(null);
  const [message, setMessage] = useState('');
  const [scanStatus, setScanStatus] = useState('ready');
  const [manualInput, setManualInput] = useState('');
  const [inputMode, setInputMode] = useState('scan'); // 'scan' or 'manual'
  const [isCodeValid, setIsCodeValid] = useState(false);

  const baseURL = import.meta.env.VITE_BACKEND_URL;

  // Sample valid codes - in a real app, you'd check against a database
  const validCodes = ['h6fuws42icj', 'abc123', 'qwerty'];

  useEffect(() => {
    if (inputMode === 'scan' && !showForm) {
      const html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      setScanStatus('scanning');
      html5QrcodeScanner.render(onScanSuccess, onScanFailure);
      setScanner(html5QrcodeScanner);

      return () => {
        if (scanner) {
          scanner.clear();
        }
      };
    }
  }, [inputMode, showForm]);

  const onScanSuccess = (decodedText) => {
    verifyCode(decodedText);
  };

  const onScanFailure = (error) => {
    console.warn(`QR Code scan error: ${error}`);
    setScanStatus('error');
    setTimeout(() => setScanStatus('scanning'), 2000);
  };

  const verifyCode = async (code) => {
    try {
      // First, check if the code exists in the database
      const response = await axios.get(`${baseURL}/api/qr/verify/${code}`);
      
      if (response.data.isValid) {
        setScannedCode(code);
        setShowForm(true);
        setScanStatus('success');
        setIsCodeValid(true);
        setMessage('');
        if (scanner) {
          scanner.clear();
        }
      } else {
        setScanStatus('error');
        setMessage('Invalid membership code. Please try again.');
        setIsCodeValid(false);
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      setScanStatus('error');
      setMessage('Error verifying code. Please try again.');
      setIsCodeValid(false);
    }
  };

  const handleScanAgain = () => {
    setShowForm(false);
    setScannedCode('');
    setMessage('');
    setScanStatus('scanning');
    setIsCodeValid(false);
    if (scanner) {
      scanner.render(onScanSuccess, onScanFailure);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      verifyCode(manualInput.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <FaArrowLeft className="text-white text-xl" />
          </motion.button>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center flex-1"
          >
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-r from-red-900 to-red-800 mb-6 shadow-lg">
              <FaQrcode className="text-white text-4xl" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">IRON TEMPLE CHECK-IN</h2>
            <p className="text-gray-200 text-lg">Scan your membership QR code or enter manually</p>
          </motion.div>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-gray-800/50 rounded-xl p-1.5 shadow-lg backdrop-blur-sm border border-gray-700">
            <button
              onClick={() => {
                setInputMode('scan');
                setShowForm(false);
                setMessage('');
              }}
              className={`px-6 py-3 rounded-lg flex items-center transition-all duration-300 ${
                inputMode === 'scan' 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg' 
                  : 'text-gray-200 hover:bg-gray-700/50'
              }`}
            >
              <FaCamera className="mr-2 text-lg" /> Scan QR
            </button>
            <button
              onClick={() => {
                setInputMode('manual');
                setShowForm(false);
                setMessage('');
              }}
              className={`px-6 py-3 rounded-lg flex items-center transition-all duration-300 ${
                inputMode === 'manual' 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg' 
                  : 'text-gray-200 hover:bg-gray-700/50'
              }`}
            >
              <FaKeyboard className="mr-2 text-lg" /> Enter Manually
            </button>
          </div>
        </div>

        {/* Main Content */}
        {showForm && isCodeValid ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gray-800/30 p-8 rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-white flex items-center">
                  {inputMode === 'scan' ? (
                    <FaQrcode className="text-red-400 mr-3 text-2xl" />
                  ) : (
                    <FaKeyboard className="text-red-400 mr-3 text-2xl" />
                  )}
                  {inputMode === 'scan' ? 'Scanned' : 'Entered'} Membership Code
                </h3>
                <span className="px-4 py-2 bg-green-900/30 text-green-300 text-sm rounded-full border border-green-700/50 font-medium">
                  VERIFIED
                </span>
              </div>
              
              <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700/50 mb-6">
                <p className="text-white font-mono break-all text-center text-lg">{scannedCode}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleScanAgain}
                  className="flex-1 flex items-center justify-center px-6 py-4 bg-gray-700/50 text-white rounded-xl hover:bg-gray-700 border border-gray-600 transition-all shadow-lg"
                >
                  <FaRedo className="mr-3 text-lg" />
                  {inputMode === 'scan' ? 'Scan Again' : 'Enter Different Code'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setInputMode(inputMode === 'scan' ? 'manual' : 'scan');
                    setShowForm(false);
                  }}
                  className="flex-1 flex items-center justify-center px-6 py-4 bg-gray-700/50 text-white rounded-xl hover:bg-gray-700 border border-gray-600 transition-all shadow-lg"
                >
                  {inputMode === 'scan' ? (
                    <>
                      <FaKeyboard className="mr-3 text-lg" />
                      Enter Manually
                    </>
                  ) : (
                    <>
                      <FaCamera className="mr-3 text-lg" />
                      Scan QR Code
                    </>
                  )}
                </motion.button>
              </div>
            </div>
            
            <QRScanForm code={scannedCode} setMessage={setMessage} />
          </motion.div>
        ) : inputMode === 'scan' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800/30 p-8 rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-sm"
          >
            <div className="relative">
              <div id="reader" className="w-full max-w-md mx-auto"></div>
              
              {/* Scanner status indicator */}
              <div className="absolute top-4 right-4">
                {scanStatus === 'scanning' && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="flex items-center text-yellow-300 bg-gray-900/80 px-3 py-2 rounded-full border border-yellow-500/30"
                  >
                    <div className="w-2 h-2 rounded-full bg-yellow-300 mr-2 animate-pulse"></div>
                    <span className="text-sm font-medium">SCANNING</span>
                  </motion.div>
                )}
                {scanStatus === 'success' && (
                  <div className="flex items-center text-green-300 bg-gray-900/80 px-3 py-2 rounded-full border border-green-500/30">
                    <FaCheckCircle className="mr-2 text-lg" />
                    <span className="text-sm font-medium">SUCCESS</span>
                  </div>
                )}
                {scanStatus === 'error' && (
                  <div className="flex items-center text-red-300 bg-gray-900/80 px-3 py-2 rounded-full border border-red-500/30">
                    <FaTimesCircle className="mr-2 text-lg" />
                    <span className="text-sm font-medium">ERROR</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center px-6 py-3 bg-gray-900/50 rounded-full border border-gray-700/50">
                <FaDumbbell className="text-red-400 mr-3 text-xl" />
                <span className="text-white text-base">Point camera at your membership QR code</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setInputMode('manual')}
                className="text-red-300 hover:text-red-200 text-base flex items-center justify-center mx-auto transition-colors"
              >
                <FaKeyboard className="mr-2" />
                Can't scan? Enter code manually
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/30 p-8 rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-sm"
          >
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <FaKeyboard className="text-red-400 mr-3 text-2xl" />
              Enter Membership Code
            </h3>
            
            <form onSubmit={handleManualSubmit}>
              <div className="mb-6">
                <label className="block text-white text-base mb-3 font-medium">
                  Your Membership QR Code Value
                </label>
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Enter your QR code value"
                  required
                />
                <p className="text-gray-400 text-sm mt-2">
                  Can be found in your membership email or app
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg flex items-center justify-center text-lg font-medium"
                >
                  <FaCheckCircle className="mr-3 text-xl" />
                  Verify Code
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setInputMode('scan')}
                  className="flex-1 px-6 py-4 bg-gray-700/50 text-white rounded-xl hover:bg-gray-700 border border-gray-600 transition-all shadow-lg flex items-center justify-center text-lg font-medium"
                >
                  <FaCamera className="mr-3 text-xl" />
                  Scan Instead
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Messages */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-6 rounded-xl border ${
              message.includes('success') 
                ? 'bg-green-900/20 border-green-700/50 text-green-200' 
                : 'bg-red-900/20 border-red-700/50 text-red-200'
            }`}
          >
            <div className="flex items-center text-lg">
              {message.includes('success') ? (
                <FaCheckCircle className="mr-3 text-xl" />
              ) : (
                <FaTimesCircle className="mr-3 text-xl" />
              )}
              <span>{message}</span>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center text-gray-300 text-base">
            <FaDumbbell className="mr-3 text-xl" />
            <span>IRON TEMPLE FITNESS CLUB</span>
          </div>
          <p className="text-gray-400 text-sm mt-3">
            Track your visits and progress with every check-in
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;