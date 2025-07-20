// const express = require('express');
// const { Client, LocalAuth } = require('whatsapp-web.js');
// const qrcode = require('qrcode-terminal');
// const qrcodeImage = require('qrcode');
// const puppeteer = require('puppeteer');
// const app = express();
// const cors = require('cors');

// const PORT = 3001;
// app.use(express.json());
// app.use(cors({origin: '*'}))
// let qrCodeString = '';
// let isClientReady = false;

// const client = new Client({
//     authStrategy: new LocalAuth(),
//     puppeteer: {
//         headless: true,
//         executablePath: puppeteer.executablePath(),
//         args: ['--no-sandbox', '--disable-setuid-sandbox']
//     }
// });

// client.on('qr', (qr) => {
//     qrCodeString = qr;
//     console.log('🔄 QR RECEIVED - Please scan again');
//     qrcode.generate(qr, { small: true }); // For terminal
// });

// client.on('ready', () => {
//     isClientReady = true;
//     console.log('✅ Client is ready!');
// });

// client.on('authenticated', () => {
//     console.log('🔐 Authenticated');
// });

// client.on('auth_failure', msg => {
//     console.error('❌ Authentication failure', msg);
// });

// client.on('disconnected', async (reason) => {
//     console.log('🔌 Disconnected:', reason);
//     isClientReady = false;

//     try {
//         await client.destroy();
//         console.log('♻️ Restarting client after disconnect...');
//         setTimeout(() => client.initialize(), 3000);
//     } catch (err) {
//         console.error('⚠️ Error destroying client:', err);
//     }
// });

// client.on('message', async message => {
//     const text = message.body.toLowerCase().trim();
//     console.log(`📩 Message from ${message.from}: ${text}`);

//     if (text === 'hi') {
//         await message.reply(
//             `Hi, how can I help you?\n1. Name\n2. Phone No\n3. Mail`
//         );
//     } else if (text === '1') {
//         await message.reply('My name is M. Meena ka....');
//     } else if (text === '2') {
//         await message.reply('8999898989');
//     } else if (text === '3' || text.includes('mail')) {
//         await message.reply('meenakshi.732@gmail.com');
//     } else {
//         await message.reply("Sorry, I didn't understand. Please type 'hi' to see options.");
//     }
// });

// client.initialize();

// // =====================
// // API Routes
// // =====================

// // Get QR as base64 image
// app.get('/qr', async (req, res) => {
//     if (qrCodeString) {
//         const qrImage = await qrcodeImage.toDataURL(qrCodeString);
//         res.send(`<img src="${qrImage}" alt="Scan QR Code to Login" />`);
//     } else {
//         res.send('✅ Already authenticated or QR not available.');
//     }
// });

// // Send message
// app.post('/send-message', async (req, res) => {
//     const { number, message } = req.body;
//     if (!number || !message) {
//         return res.status(400).json({ error: 'number and message are required' });
//     }

//     try {
//         const chatId = number.includes('@c.us') ? number : `${number}@c.us`;
//         await client.sendMessage(chatId, message);
//         res.json({ status: 'Message sent' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Failed to send message' });
//     }
// });

// // Check client status
// app.get('/status', (req, res) => {
//     res.json({ ready: isClientReady });
// });

// // Start Express server
// app.listen(PORT, () => {
//     console.log(`🚀 Server is running at http://localhost:${PORT}`);
// });const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const qrcodeImage = require('qrcode');
const puppeteer = require('puppeteer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV;

app.use(express.json());
app.use(cors({ origin: '*' }));

let qrCodeString = '';
let isClientReady = false;
let clientStatus = 'initializing';

let client;

// ==========================
// Initialize WhatsApp Client
// ==========================
function createClient() {
  client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: true,
      executablePath: puppeteer.executablePath(),
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  });

  client.on('qr', (qr) => {
    qrCodeString = qr;
    clientStatus = 'qr';
    console.log('📱 QR received - waiting for scan...');
    qrcode.generate(qr, { small: true }); // For terminal
  });

  client.on('ready', () => {
    isClientReady = true;
    clientStatus = 'ready';
    qrCodeString = '';
    console.log('✅ WhatsApp client is ready!');
  });

  client.on('authenticated', () => {
    console.log('🔐 Client authenticated');
  });

  client.on('auth_failure', msg => {
    console.error('❌ Auth failure:', msg);
    clientStatus = 'auth_failed';
  });

  client.on('disconnected', async reason => {
    console.warn('🔌 Client disconnected:', reason);
    isClientReady = false;
    clientStatus = 'disconnected';

    try {
      if (typeof client.destroy === 'function') {
        await client.destroy();
        console.log('🧹 Client destroyed');
      }

      // Re-initialize after delay
      setTimeout(() => {
        console.log('♻️ Restarting client...');
        createClient();
        client.initialize();
        clientStatus = 'restarting';
      }, 3000);

    } catch (err) {
      console.error('⚠️ Error during disconnect:', err.message);
    }
  });

  client.on('message', async (message) => {
    const text = message.body.toLowerCase().trim();
    console.log(`📩 ${message.from}: ${text}`);

    const responses = {
      hi: `Hi! How can I help you?\n1. Name\n2. Phone\n3. Email`,
      '1': 'My name is M. Meena ka...',
      '2': '8999898989',
      '3': 'meenakshi.732@gmail.com'
    };

    const reply = responses[text] || "Sorry, I didn't understand. Please type 'hi' to see options.";
    await message.reply(reply);
  });
}

// Initial client creation
createClient();
client.initialize();

// ==========================
// Routes
// ==========================

// Serve static React files
app.use('/static', express.static(path.join(__dirname, '/../client/build/static')));

// 📸 Get QR Code
app.get('/qr', async (req, res) => {
  if (isClientReady) {
    return res.send('✅ Already authenticated');
  }

  if (!qrCodeString) {
    return res.send('⚠️ QR not yet generated. Please wait...');
  }

  try {
    const image = await qrcodeImage.toDataURL(qrCodeString);
    res.send(`<img src="${image}" alt="Scan QR Code" />`);
  } catch (err) {
    res.status(500).send('❌ Failed to generate QR image');
  }
});

// 💬 Send Message
app.post('/send-message', async (req, res) => {
  const { number, message } = req.body;

  if (!isClientReady) {
    return res.status(503).json({ error: 'Client not ready' });
  }

  if (!number || !message) {
    return res.status(400).json({ error: 'number and message are required' });
  }

  try {
    const chatId = number.includes('@c.us') ? number : `${number}@c.us`;
    await client.sendMessage(chatId, message);
    res.json({ status: '✅ Message sent' });
  } catch (err) {
    console.error('Send Error:', err);
    res.status(500).json({ error: '❌ Failed to send message' });
  }
});

// 📶 Status Check
app.get('/status', (req, res) => {
  res.json({ ready: isClientReady, status: clientStatus });
});

// 🔄 Serve index.html (for React SPA)
if (NODE_ENV === 'DIT') {
  const indexPath = path.join(__dirname, '/../client/build/index.html');
  app.all('*', (req, res) => {
    res.sendFile(indexPath);
  });
}

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});