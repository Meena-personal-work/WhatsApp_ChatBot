import React, { useState, useEffect } from 'react';
import './Whatsapp.css';

const WhatsappQR = () => {
  const [qrHtml, setQrHtml] = useState('');
  const [showNote, setShowNote] = useState(false);
  const [timer, setTimer] = useState(null);

  const fetchQr = async () => {
    try {
      const response = await fetch('http://localhost:3001/qr');
      const text = await response.text();
      setQrHtml(text);
      setShowNote(true);

      if (timer) clearTimeout(timer);

      const timeout = setTimeout(() => {
        setShowNote(false);
        setQrHtml('<p>⚠️ QR expired. Please click Reload to get a new one.</p>');
      }, 20000);

      setTimer(timeout);
    } catch (error) {
      console.error('Error fetching QR:', error);
      setQrHtml('<p>❌ Failed to load QR. Try again later.</p>');
    }
  };

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  return (
    <div className="container">
      <h2>WhatsApp Web QR Integration</h2>

      <button onClick={fetchQr} className="getQR">
        Get QR
      </button>

      {qrHtml && (
        <div className="qr-box" dangerouslySetInnerHTML={{ __html: qrHtml }} />
      )}

      {showNote && (
        <p className="qr-note">⚠️ QR will expire in 20 seconds.</p>
      )}

      <button onClick={fetchQr} className="reloadQR">
        Reload QR
      </button>
    </div>
  );
};

export default WhatsappQR;
