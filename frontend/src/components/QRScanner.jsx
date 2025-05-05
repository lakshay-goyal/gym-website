import React, { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import QRScanForm from './QRScanForm';

const QRScanner = () => {
  const [scannedCode, setScannedCode] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [scanner, setScanner] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    setScanner(html5QrcodeScanner);

    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, []);

  const onScanSuccess = (decodedText) => {
    setScannedCode(decodedText);
    setShowForm(true);
    if (scanner) {
      scanner.clear();
    }
  };

  const onScanFailure = (error) => {
    console.warn(`QR Code scan error: ${error}`);
  };

  const handleScanAgain = () => {
    setShowForm(false);
    setScannedCode('');
    setMessage('');
    if (scanner) {
      scanner.render(onScanSuccess, onScanFailure);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">QR Code Scanner</h2>
        
        {!showForm ? (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div id="reader" className="w-full max-w-md mx-auto"></div>
            <div className="mt-4 text-center">
              <p className="text-gray-600">Scan the QR code to check in/out</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Scanned Code</h3>
              <p className="text-gray-600">{scannedCode}</p>
              <button
                onClick={handleScanAgain}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Scan Again
              </button>
            </div>
            
            <QRScanForm code={scannedCode} />
          </div>
        )}

        {message && (
          <div className={`mt-4 p-4 rounded ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner; 