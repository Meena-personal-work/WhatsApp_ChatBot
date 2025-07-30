// const { Client, LocalAuth } = require('whatsapp-web.js');
// const qrcode = require('qrcode-terminal');
// const qrcodeImage = require('qrcode');
// const puppeteer = require('puppeteer');
// const cors = require('cors');
// const path = require('path');
// const fs = require('fs');
// require('dotenv').config();
// const express = require('express');

// const app = express();
// app.use(express.json());
// app.use(cors({ origin: '*' }));
// // Serve static React files
// app.use('/static', express.static(path.join(__dirname, '/../client/build/static')));

// const PORT = process.env.SERVER_PORT || 3001;
// const NODE_ENV = process.env.NODE_ENV;



// let qrCodeString = '';
// let isClientReady = false;
// let clientStatus = 'initializing';

// let client;

// // ==========================
// // Initialize WhatsApp Client
// // ==========================
// function createClient() {
//   client = new Client({
//     authStrategy: new LocalAuth(),
//     puppeteer: {
//       headless: true, // or false if you want to see the browser GUI
//       // executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser', // <--- REMOVE OR COMMENT OUT THIS LINE FOR LOCAL
//       args: [
//         '--no-sandbox',
//         '--disable-setuid-sandbox',
//         '--disable-gpu',
//         '--disable-dev-shm-usage',
//         '--single-process'
//       ]
//     }
//   });

//   client.on('qr', (qr) => {
//     qrCodeString = qr;
//     clientStatus = 'qr';
//     console.log('📱 QR received - waiting for scan...');
//     qrcode.generate(qr, { small: true }); // For terminal
//   });

//   client.on('ready', () => {
//     isClientReady = true;
//     clientStatus = 'ready';
//     qrCodeString = '';
//     console.log('✅ WhatsApp client is ready!');
//   });

//   client.on('authenticated', () => {
//     console.log('🔐 Client authenticated');
//   });

//   client.on('auth_failure', msg => {
//     console.error('❌ Auth failure:', msg);
//     clientStatus = 'auth_failed';
//   });

//   client.on('disconnected', async reason => {
//     console.warn('🔌 Client disconnected:', reason);
//     isClientReady = false;
//     clientStatus = 'disconnected';

//     try {
//       if (typeof client.destroy === 'function') {
//         await client.destroy();
//         console.log('🧹 Client destroyed');
//       }

//       // Re-initialize after delay
//       setTimeout(() => {
//         console.log('♻️ Restarting client...');
//         createClient();
//         client.initialize();
//         clientStatus = 'restarting';
//       }, 3000);

//     } catch (err) {
//       console.error('⚠️ Error during disconnect:', err.message);
//     }
//   });

//   client.on('message', async (message) => {
//     const text = message.body.toLowerCase().trim();
//     console.log(`📩 ${message.from}: ${text}`);

//     const responses = {
//       hi: `Hi! How can I help you?\n1. Name\n2. Phone\n3. Email`,
//       '1': 'My name is M. Meena ka...',
//       '2': '8999898989',
//       '3': 'meenakshi.732@gmail.com'
//     };

//     const reply = responses[text] || "Sorry, I didn't understand. Please type 'hi' to see options.";
//     await message.reply(reply);
//   });
// }

// // Initial client creation
// createClient();
// client.initialize();

// // ==========================
// // Routes
// // ==========================

// // 📸 Get QR Code
// app.get('/qr', async (req, res) => {
//   console.log("Running /qr");
  
//   if (isClientReady) {
//     return res.send('✅ Already authenticated');
//   }

//   if (!qrCodeString) {
//     return res.send('⚠️ QR not yet generated. Please wait...');
//   }

//   try {
//     const image = await qrcodeImage.toDataURL(qrCodeString);
//     res.send(`<img src="${image}" alt="Scan QR Code" />`);
//   } catch (err) {
//     res.status(500).send('❌ Failed to generate QR image');
//   }
// });

// // 💬 Send Message
// app.post('/send-message', async (req, res) => {
//   const { number, message } = req.body;

//   if (!isClientReady) {
//     return res.status(503).json({ error: 'Client not ready' });
//   }

//   if (!number || !message) {
//     return res.status(400).json({ error: 'number and message are required' });
//   }

//   try {
//     const chatId = number.includes('@c.us') ? number : `${number}@c.us`;
//     await client.sendMessage(chatId, message);
//     res.json({ status: '✅ Message sent' });
//   } catch (err) {
//     console.error('Send Error:', err);
//     res.status(500).json({ error: '❌ Failed to send message' });
//   }
// });

// // 📶 Status Check
// app.get('/status', (req, res) => {
//   res.json({ ready: isClientReady, status: clientStatus });
// });

// // 🔄 Serve index.html (for React SPA)
// if (NODE_ENV === 'production' || NODE_ENV === 'DIT') {
//   const indexPath = path.join(__dirname, 'public', 'index.html');
//   app.use(express.static(path.join(__dirname, 'public')));

//   app.get('*', (req, res) => {
//     res.sendFile(indexPath);
//   });
// }


// // 🚀 Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// });

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const qrcodeImage = require('qrcode');
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
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--single-process'
      ]
    }
  });

  client.on('qr', (qr) => {
    qrCodeString = qr;
    clientStatus = 'qr';
    console.log('📱 QR received - waiting for scan...');
    qrcode.generate(qr, { small: true });
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

      setTimeout(() => {
        console.log('♻️ Restarting client...');
        createClient(); // ✅ DON'T call initialize here again
      }, 3000);

    } catch (err) {
      console.error('⚠️ Error during disconnect:', err.message);
    }
  });

  client.on('message', async (message) => {
    console.log(`🔔 Message received: ${message.body} from ${message.from}`);

    const text = message.body.toLowerCase().trim();
    const responses = {
      hi: `Hi! How can I help you?\n1. Name\n2. Phone\n3. Email`,
      '1': 'My name is M. Meena ka...',
      '2': '8999898989',
      '3': 'meenakshi.732@gmail.com'
    };

    const reply = responses[text] || "Sorry, I didn't understand. Please type 'hi' to see options.";
    await message.reply(reply);
  });

  client.initialize();
}

// Start the client
createClient();

// ==========================
// Express Routes
// ==========================

app.use('/static', express.static(path.join(__dirname, '/../client/build/static')));

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

app.get('/status', (req, res) => {
  res.json({ ready: isClientReady, status: clientStatus });
});

if (NODE_ENV === 'production' || NODE_ENV === 'DIT') {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  app.use(express.static(path.join(__dirname, 'public')));

  app.get('*', (req, res) => {
    res.sendFile(indexPath);
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
