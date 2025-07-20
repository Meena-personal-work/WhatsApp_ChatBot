import React, { useState, useEffect } from 'react';

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

      // Clear any existing timer
      if (timer) clearTimeout(timer);

      // Set 20-second timer to hide note
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
    // Cleanup timer when component unmounts
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>WhatsApp Web QR Integration</h2>
      <button
        onClick={fetchQr}
        style={{
          padding: '10px 20px',
          marginBottom: '10px',
          backgroundColor: '#25D366',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Get QR
      </button>

      {qrHtml && (
        <div
          style={{
            marginTop: '10px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '8px',
          }}
          dangerouslySetInnerHTML={{ __html: qrHtml }}
        />
      )}

      {showNote && (
        <p style={{ marginTop: '10px', color: '#888' }}>
          ⚠️ QR will expire in 20 seconds.
        </p>
      )}

      <button
        onClick={fetchQr}
        style={{
          marginTop: '10px',
          padding: '8px 16px',
          backgroundColor: '#128C7E',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Reload QR
      </button>
    </div>
  );
};

export default WhatsappQR;