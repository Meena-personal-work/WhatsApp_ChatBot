// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WhatsappQR from './Chatbot/WhatsappQR';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WhatsappQR />} />
      </Routes>
    </Router>
  );
}

export default App;
