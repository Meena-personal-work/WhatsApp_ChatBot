// // // // // index.js
// // // // const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
// // // // const qrcode = require('qrcode-terminal');
// // // // const qrcodeImage = require('qrcode');
// // // // const puppeteer = require('puppeteer');
// // // // const cors = require('cors');
// // // // const path = require('path');
// // // // const fs = require('fs');
// // // // require('dotenv').config();
// // // // const express = require('express');

// // // // const app = express();
// // // // const PORT = process.env.PORT || 3001;
// // // // const NODE_ENV = process.env.NODE_ENV;

// // // // app.use(express.json());
// // // // app.use(cors({ origin: '*' }));

// // // // let qrCodeString = '';
// // // // let isClientReady = false;
// // // // let clientStatus = 'initializing';
// // // // let client;

// // // // /* ==========================
// // // //    Paths (point to client/public)
// // // //    ========================== */
// // // // const PUBLIC_DIR = path.join(__dirname, '..', 'client', 'public');
// // // // const PDF_DIR = path.join(PUBLIC_DIR, 'pdf');
// // // // const IMAGE_DIR = path.join(PUBLIC_DIR, 'image');

// // // // console.log('📂 PUBLIC_DIR  =>', PUBLIC_DIR);
// // // // console.log('📂 PDF_DIR     =>', PDF_DIR);
// // // // console.log('📂 IMAGE_DIR   =>', IMAGE_DIR);

// // // // /* ==========================
// // // //    Menus & Messages
// // // //    ========================== */
// // // // const sessions = new Map(); // key: message.from -> { state: 'ROOT' | 'FAMILY' | 'GIFT' }

// // // // const MAIN_MENU = [
// // // //   'Hi! Welcome to Jai Ganesh Agency.',
// // // //   'Please choose a category:',
// // // //   '1. Family Pack',
// // // //   '2. Gift Pack',
// // // //   '3. Loose Crackers',
// // // //   '',
// // // //   "Type the number of your choice.",
// // // //   "Type 'menu' anytime to return here."
// // // // ].join('\n');

// // // // const FAMILY_MENU = [
// // // //   '🎆 Family Pack Options:',
// // // //   '4. Rs. 2,000/- Family Pack',
// // // //   '5. Rs. 3,000/- Family Pack',
// // // //   '6. Rs. 4,000/- Family Pack',
// // // //   '7. Rs. 5,000/- Family Pack',
// // // //   '8. Rs. 7,500/- Family Pack',
// // // //   '9. Rs. 10,000/- Family Pack',
// // // //   '',
// // // //   "Type the number to view more or 'back' to go to categories."
// // // // ].join('\n');

// // // // /* ✅ UPDATED: Gift menu reflects your images (options 10–16) */
// // // // const GIFT_MENU = [
// // // //   '🎁 Gift Pack Options:',
// // // //   '10. Gift Pack - 21 items',
// // // //   '11. Gift Pack - 25 items',
// // // //   '12. Gift Pack - 30 items',
// // // //   '13. Gift Pack - 35 items',
// // // //   '14. Gift Pack - 40 items',
// // // //   '15. Gift Pack - 50 items',
// // // //   '16. Gift Pack - 60 items',
// // // //   '',
// // // //   "Type the number to view more or 'back' to go to categories."
// // // // ].join('\n');

// // // // // Thank-you messages after successful media send
// // // // const THANKS_PDF =
// // // //   "🙏 Thank you for choosing Jai Ganesh Agency.\nIf you need further assistance, contact Meena — 00022255.";
// // // // const THANKS_IMAGE =
// // // //   "🙏 Thank you for choosing Jai Ganesh Agency.\nIf you need further assistance, contact Fisheee — 55665455.";

// // // // // Loose crackers link (no submenu)
// // // // const LOOSE_ORDER_LINK = 'https://jaiganeshagency.netlify.app/';
// // // // const LOOSE_ORDER_MSG =
// // // //   `🧨 Loose Crackers\nPlease go to this link to order the crackers:\n${LOOSE_ORDER_LINK}`;

// // // // /* ==========================
// // // //    Option → File mapping
// // // //    ========================== */
// // // // // Family: map to specific PDFs (ensure files exist in client/public/pdf)
// // // // const familyOptions = {
// // // //   '4': { label: 'Rs. 2,000/- Family Pack', file: path.join(PDF_DIR, 'family_2000.pdf') },
// // // //   '5': { label: 'Rs. 3,000/- Family Pack', file: path.join(PDF_DIR, 'family_3000.pdf') },
// // // //   '6': { label: 'Rs. 4,000/- Family Pack', file: path.join(PDF_DIR, 'family_4000.pdf') },
// // // //   '7': { label: 'Rs. 5,000/- Family Pack', file: path.join(PDF_DIR, 'family_5000.pdf') },
// // // //   '8': { label: 'Rs. 7,500/- Family Pack', file: path.join(PDF_DIR, 'family_7500.pdf') },
// // // //   '9': { label: 'Rs. 10,000/- Family Pack', file: path.join(PDF_DIR, 'family_10000.pdf') }
// // // // };

// // // // /* ✅ UPDATED: Gift options 10–16 mapped to your image files */
// // // // const giftOptions = {
// // // //   '10': { label: 'Gift Pack - 21 items', file: path.join(IMAGE_DIR, 'gift_21items.jpg') },
// // // //   '11': { label: 'Gift Pack - 25 items', file: path.join(IMAGE_DIR, 'gift_25items.jpg') },
// // // //   '12': { label: 'Gift Pack - 30 items', file: path.join(IMAGE_DIR, 'gift_30items.jpg') },
// // // //   '13': { label: 'Gift Pack - 35 items', file: path.join(IMAGE_DIR, 'gift_35items.jpg') },
// // // //   '14': { label: 'Gift Pack - 40 items', file: path.join(IMAGE_DIR, 'gift_40items.jpg') },
// // // //   '15': { label: 'Gift Pack - 50 items', file: path.join(IMAGE_DIR, 'gift_50items.jpg') },
// // // //   '16': { label: 'Gift Pack - 60 items', file: path.join(IMAGE_DIR, 'gift_60items.jpg') }
// // // // };

// // // // /* Helper to send a media file if it exists */
// // // // async function trySendMedia(chatId, absPath, caption) {
// // // //   if (!absPath) return false;
// // // //   if (!fs.existsSync(absPath)) {
// // // //     console.warn('⚠️ File not found:', absPath);
// // // //     return false;
// // // //   }
// // // //   const media = await MessageMedia.fromFilePath(absPath);
// // // //   await client.sendMessage(chatId, media, caption ? { caption } : undefined);
// // // //   return true;
// // // // }

// // // // /* ==========================
// // // //    WhatsApp Client
// // // //    ========================== */
// // // // function createClient() {
// // // //   client = new Client({
// // // //     authStrategy: new LocalAuth(),
// // // //     puppeteer: {
// // // //       headless: true,
// // // //       // executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
// // // //       args: [
// // // //         '--no-sandbox',
// // // //         '--disable-setuid-sandbox',
// // // //         '--disable-gpu',
// // // //         '--disable-dev-shm-usage',
// // // //         '--single-process'
// // // //       ]
// // // //     }
// // // //   });

// // // //   client.on('qr', (qr) => {
// // // //     qrCodeString = qr;
// // // //     clientStatus = 'qr';
// // // //     console.log('📱 QR received - waiting for scan...');
// // // //     qrcode.generate(qr, { small: true });
// // // //   });

// // // //   client.on('ready', () => {
// // // //     isClientReady = true;
// // // //     clientStatus = 'ready';
// // // //     qrCodeString = '';
// // // //     console.log('✅ WhatsApp client is ready!');
// // // //   });

// // // //   client.on('authenticated', () => console.log('🔐 Client authenticated'));
// // // //   client.on('auth_failure', (msg) => { console.error('❌ Auth failure:', msg); clientStatus = 'auth_failed'; });

// // // //   client.on('disconnected', async (reason) => {
// // // //     console.warn('🔌 Client disconnected:', reason);
// // // //     isClientReady = false;
// // // //     clientStatus = 'disconnected';
// // // //     try {
// // // //       if (typeof client.destroy === 'function') {
// // // //         await client.destroy();
// // // //         console.log('🧹 Client destroyed');
// // // //       }
// // // //       setTimeout(() => {
// // // //         console.log('♻️ Restarting client...');
// // // //         createClient();
// // // //         client.initialize();
// // // //         clientStatus = 'restarting';
// // // //       }, 3000);
// // // //     } catch (err) {
// // // //       console.error('⚠️ Error during disconnect:', err.message);
// // // //     }
// // // //   });

// // // //   // ===== Message handler (global shortcuts + media send + custom thank-you + loose link only)
// // // //   client.on('message', async (message) => {
// // // //     const chatId = message.from;
// // // //     const textRaw = (message.body || '').trim();
// // // //     const text = textRaw.toLowerCase();
// // // //     console.log(`📩 ${chatId}: ${textRaw}`);

// // // //     if (!sessions.has(chatId)) sessions.set(chatId, { state: 'ROOT' });
// // // //     const session = sessions.get(chatId);

// // // //     // Global menu commands
// // // //     if (['hi', 'hello', 'menu', 'start'].includes(text)) {
// // // //       sessions.set(chatId, { state: 'ROOT' });
// // // //       await message.reply(MAIN_MENU);
// // // //       return;
// // // //     }

// // // //     // Global category shortcuts
// // // //     if (text === '1' || text === 'family') {
// // // //       sessions.set(chatId, { state: 'FAMILY' });
// // // //       await message.reply(FAMILY_MENU);
// // // //       return;
// // // //     }
// // // //     if (text === '2' || text === 'gift') {
// // // //       sessions.set(chatId, { state: 'GIFT' });
// // // //       await message.reply(GIFT_MENU);
// // // //       return;
// // // //     }
// // // //     if (text === '3' || text === 'loose' || text === 'loose crackers') {
// // // //       // Send only the link and keep user at ROOT for easy navigation after
// // // //       sessions.set(chatId, { state: 'ROOT' });
// // // //       await message.reply(LOOSE_ORDER_MSG);
// // // //       return;
// // // //     }

// // // //     // Back to categories
// // // //     if (text === 'back') {
// // // //       sessions.set(chatId, { state: 'ROOT' });
// // // //       await message.reply(MAIN_MENU);
// // // //       return;
// // // //     }

// // // //     // State machine
// // // //     switch (session.state) {
// // // //       case 'ROOT': {
// // // //         await message.reply(`Sorry, I didn't understand.\n\n${MAIN_MENU}`);
// // // //         break;
// // // //       }
// // // //       case 'FAMILY': {
// // // //         const option = familyOptions[text];
// // // //         if (option) {
// // // //           await message.reply(`You chose: ${option.label}`);
// // // //           const sent = await trySendMedia(chatId, option.file, `📄 ${option.label}`);
// // // //           if (!sent) {
// // // //             await message.reply('🔍 PDF not found for this option.');
// // // //           } else {
// // // //             await message.reply(THANKS_PDF);
// // // //           }
// // // //         } else {
// // // //           await message.reply(`Please choose a valid option.\n\n${FAMILY_MENU}`);
// // // //         }
// // // //         break;
// // // //       }
// // // //       case 'GIFT': {
// // // //         const option = giftOptions[text];
// // // //         if (option) {
// // // //           await message.reply(`You chose: ${option.label}`);
// // // //           const sent = await trySendMedia(chatId, option.file, `🖼️ ${option.label}`);
// // // //           if (!sent) {
// // // //             await message.reply('📎 File/image not available for this gift pack.');
// // // //           } else {
// // // //             await message.reply(THANKS_IMAGE);
// // // //           }
// // // //         } else {
// // // //           await message.reply(`Please choose a valid option.\n\n${GIFT_MENU}`);
// // // //         }
// // // //         break;
// // // //       }
// // // //       default: {
// // // //         sessions.set(chatId, { state: 'ROOT' });
// // // //         await message.reply(MAIN_MENU);
// // // //       }
// // // //     }
// // // //   });
// // // // }

// // // // // Start WhatsApp client
// // // // createClient();
// // // // client.initialize();

// // // // /* ==========================
// // // //    Express routes (optional)
// // // //    ========================== */

// // // // // Serve built React static files if you deploy the client
// // // // app.use('/static', express.static(path.join(__dirname, '..', 'client', 'build', 'static')));

// // // // // QR page
// // // // app.get('/qr', async (req, res) => {
// // // //   if (isClientReady) return res.send('✅ Already authenticated');
// // // //   if (!qrCodeString) return res.send('⚠️ QR not yet generated. Please wait...');
// // // //   try {
// // // //     const image = await qrcodeImage.toDataURL(qrCodeString);
// // // //     res.send(`<img src="${image}" alt="Scan QR Code" />`);
// // // //   } catch {
// // // //     res.status(500).send('❌ Failed to generate QR image');
// // // //   }
// // // // });

// // // // // Send message API
// // // // app.post('/send-message', async (req, res) => {
// // // //   const { number, message } = req.body || {};
// // // //   if (!isClientReady) return res.status(503).json({ error: 'Client not ready' });
// // // //   if (!number || !message) return res.status(400).json({ error: 'number and message are required' });

// // // //   try {
// // // //     const chatId = number.includes('@c.us') ? number : `${number}@c.us`;
// // // //     await client.sendMessage(chatId, message);
// // // //     res.json({ status: '✅ Message sent' });
// // // //   } catch (err) {
// // // //     console.error('Send Error:', err);
// // // //     res.status(500).json({ error: '❌ Failed to send message' });
// // // //   }
// // // // });

// // // // // Status
// // // // app.get('/status', (req, res) => {
// // // //   res.json({ ready: isClientReady, status: clientStatus });
// // // // });

// // // // // // Serve client build (SPA) in prod
// // // // // if (NODE_ENV === 'production' || NODE_ENV === 'DIT') {
// // // // //   const indexPath = path.join(__dirname, '..', 'client', 'build', 'index.html');
// // // // //   app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
// // // // //   app.get('*', (req, res) => res.sendFile(indexPath));
// // // // // }

// // // // if (NODE_ENV === 'production' || NODE_ENV === 'DIT') {
// // // //   const indexPath = path.join(__dirname, 'public', 'index.html');
// // // //   app.use(express.static(path.join(__dirname, 'public')));

// // // //   app.get('*', (req, res) => {
// // // //     res.sendFile(indexPath);
// // // //   });
// // // // }

// // // // // Start server
// // // // app.listen(PORT, () => {
// // // //   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// // // // });
// // // // ==========================
// // // // Imports and Setup
// // // // ==========================
// // // const { Client, LocalAuth } = require('whatsapp-web.js');
// // // const qrcode = require('qrcode-terminal');
// // // const qrcodeImage = require('qrcode');
// // // const cors = require('cors');
// // // const path = require('path');
// // // const express = require('express');

// // // require('dotenv').config();

// // // const app = express();
// // // const PORT = process.env.PORT || 3001;
// // // const NODE_ENV = process.env.NODE_ENV;

// // // app.use(express.json());
// // // app.use(cors({ origin: '*' }));

// // // // ==========================
// // // // WhatsApp Client State Management
// // // // ==========================
// // // let qrCodeString = '';
// // // let isClientReady = false;
// // // let clientStatus = 'initializing';
// // // let client;

// // // // ==========================
// // // // WhatsApp Client Initialization
// // // // ==========================
// // // function createClient() {
// // //   console.log('Attempting to create and initialize WhatsApp client...');

// // //   client = new Client({
// // //     authStrategy: new LocalAuth({ clientId: 'session-1' }),
    
// // //     // ====================================================================
// // //     // !!! CRITICAL FOR DEPLOYMENT: PUPPETEER CONFIGURATION !!!
// // //     // This configuration ensures Puppeteer works correctly on various hosting platforms.
// // //     // We use a custom executable path from an environment variable, which is a best practice.
// // //     // We also include all necessary arguments to run the browser in a sandboxed, headless environment.
// // //     // ====================================================================
// // //     puppeteer: {
// // //       headless: true, // Should always be true for deployment
// // //       executablePath: process.env.PUPPETEER_EXECUTABLE_PATH, // Set this ENV variable
// // //       args: [
// // //         '--no-sandbox',
// // //         '--disable-setuid-sandbox',
// // //         '--disable-gpu',
// // //         '--disable-dev-shm-usage',
// // //         '--single-process', // Necessary for certain environments
// // //       ]
// // //     }
// // //   });

// // //   // --- Client Event Handlers ---
// // //   client.on('qr', (qr) => {
// // //     qrCodeString = qr;
// // //     clientStatus = 'qr';
// // //     console.log('📱 QR received - waiting for scan...');
// // //     qrcode.generate(qr, { small: true });
// // //   });

// // //   client.on('ready', () => {
// // //     isClientReady = true;
// // //     clientStatus = 'ready';
// // //     qrCodeString = '';
// // //     console.log('✅ WhatsApp client is ready!');
// // //   });

// // //   client.on('authenticated', () => {
// // //     console.log('🔐 Client authenticated');
// // //   });

// // //   client.on('auth_failure', msg => {
// // //     console.error('❌ Auth failure:', msg);
// // //     clientStatus = 'auth_failed';
// // //     // Consider destroying the client on auth failure to allow a new attempt
// // //     client.destroy();
// // //   });

// // //   client.on('disconnected', async reason => {
// // //     console.warn('🔌 Client disconnected:', reason);
// // //     isClientReady = false;
// // //     clientStatus = 'disconnected';

// // //     try {
// // //       if (client) {
// // //         await client.destroy();
// // //         console.log('🧹 Client destroyed successfully.');
// // //       }
// // //     } catch (err) {
// // //       console.error('⚠️ Error during client destroy:', err.message);
// // //     }
    
// // //     setTimeout(() => {
// // //       console.log('♻️ Restarting client in 5 seconds...');
// // //       createClient();
// // //     }, 5000);
// // //   });

// // //   client.on('message', async (message) => {
// // //     console.log(`🔔 Message received: ${message.body} from ${message.from}`);

// // //     const text = message.body.toLowerCase().trim();
// // //     const responses = {
// // //       hi: `Hi! How can I help you?\n1. Name\n2. Phone\n3. Email`,
// // //       '1': 'My name is M. Meena ka...',
// // //       '2': '8999898989',
// // //       '3': 'meenakshi.732@gmail.com'
// // //     };

// // //     const reply = responses[text] || "Sorry, I didn't understand. Please type 'hi' to see options.";
// // //     await message.reply(reply);
// // //   });
  
// // //   client.on('change_state', state => {
// // //     console.log('➡️ Client state changed:', state);
// // //   });
  
// // //   client.initialize().catch(err => {
// // //     console.error("❌ Error initializing client:", err.message);
// // //     if (err.message.includes('ENOENT')) {
// // //         console.error("\nTROUBLESHOOTING: The browser executable was not found. This is common in deployment.");
// // //         console.error("Please ensure you have set the PUPPETEER_EXECUTABLE_PATH environment variable correctly.");
// // //         console.error("For some platforms, you might need to install Chromium as a buildpack or a dependency.");
// // //     }
// // //   });
// // // }

// // // // Start the client on server startup
// // // createClient();

// // // // ==========================
// // // // Express Routes
// // // // ==========================

// // // app.use(express.static(path.join(__dirname, 'public')));
// // // app.use('/static', express.static(path.join(__dirname, '/../client/build/static')));

// // // app.get('/qr', async (req, res) => {
// // //   if (isClientReady) {
// // //     return res.status(200).send('✅ Already authenticated');
// // //   }

// // //   if (!qrCodeString) {
// // //     return res.status(200).send('⚠️ QR not yet generated. Please wait...');
// // //   }

// // //   try {
// // //     const image = await qrcodeImage.toDataURL(qrCodeString);
// // //     res.send(`<img src="${image}" alt="Scan QR Code" />`);
// // //   } catch (err) {
// // //     console.error('QR Image Error:', err);
// // //     res.status(500).send('❌ Failed to generate QR image');
// // //   }
// // // });

// // // app.post('/send-message', async (req, res) => {
// // //   const { number, message } = req.body;

// // //   if (!isClientReady) {
// // //     return res.status(503).json({ error: 'Client not ready' });
// // //   }

// // //   if (!number || !message) {
// // //     return res.status(400).json({ error: 'number and message are required' });
// // //   }

// // //   try {
// // //     const sanitizedNumber = number.includes('@c.us') ? number : `${number}@c.us`;
// // //     await client.sendMessage(sanitizedNumber, message);
// // //     res.status(200).json({ status: '✅ Message sent' });
// // //   } catch (err) {
// // //     console.error('Send Error:', err);
// // //     res.status(500).json({ error: `❌ Failed to send message: ${err.message}` });
// // //   }
// // // });

// // // app.get('/status', (req, res) => {
// // //   res.status(200).json({ ready: isClientReady, status: clientStatus });
// // // });

// // // if (NODE_ENV === 'production' || NODE_ENV === 'DIT') {
// // //   app.get('*', (req, res) => {
// // //     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// // //   });
// // // }

// // // app.listen(PORT, () => {
// // //   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// // // });

// // // ==========================
// // // Imports and Setup
// // // ==========================
// // // ==========================
// // // Imports and Setup
// // // ==========================
// // // ==========================
// // // Imports and Setup
// // // ==========================
// // const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
// // const qrcode = require('qrcode-terminal');
// // const qrcodeImage = require('qrcode');
// // const cors = require('cors');
// // const path = require('path');
// // const express = require('express');
// // const fs = require('fs');

// // require('dotenv').config();

// // const app = express();
// // const PORT = process.env.PORT || 3001;
// // const NODE_ENV = process.env.NODE_ENV;

// // app.use(express.json());
// // app.use(cors({ origin: '*' }));

// // // =======================================================================
// // // NEW: Pre-load the PDF file into memory for faster access
// // // =======================================================================
// // let detailsPDFMedia;
// // // Corrected path to look inside the 'server/public' folder
// // const pdfPath = path.join(__dirname, 'public', 'pdf', 'family_2000.pdf');

// // try {
// //   if (fs.existsSync(pdfPath)) {
// //     console.log('📄 Pre-loading PDF file into memory...');
// //     const fileData = fs.readFileSync(pdfPath);
// //     detailsPDFMedia = new MessageMedia('application/pdf', fileData.toString('base64'), 'family_2000.pdf');
// //   } else {
// //     console.error('⚠️ PDF file not found at:', pdfPath);
// //     console.error('⚠️ The path checked was:', path.resolve(pdfPath));
// //   }
// // } catch (err) {
// //   console.error('❌ Error pre-loading PDF file:', err);
// // }

// // // ==========================
// // // WhatsApp Client State Management
// // // ==========================
// // let qrCodeString = '';
// // let isClientReady = false;
// // let clientStatus = 'initializing';
// // let client;

// // // ==========================
// // // WhatsApp Client Initialization
// // // ==========================
// // function createClient() {
// //   console.log('Attempting to create and initialize WhatsApp client...');

// //   client = new Client({
// //     authStrategy: new LocalAuth({ clientId: 'session-1' }),

// //     puppeteer: {
// //       headless: true,
// //       executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
// //       args: [
// //         '--no-sandbox',
// //         '--disable-setuid-sandbox',
// //         '--disable-gpu',
// //         '--disable-dev-shm-usage',
// //         '--single-process'
// //       ]
// //     }
// //   });

// //   // --- Client Event Handlers ---
// //   client.on('qr', (qr) => {
// //     qrCodeString = qr;
// //     clientStatus = 'qr';
// //     console.log('📱 QR received - waiting for scan...');
// //     qrcode.generate(qr, { small: true });
// //   });

// //   client.on('ready', () => {
// //     isClientReady = true;
// //     clientStatus = 'ready';
// //     qrCodeString = '';
// //     console.log('✅ WhatsApp client is ready!');
// //   });

// //   client.on('authenticated', () => {
// //     console.log('🔐 Client authenticated');
// //   });

// //   client.on('auth_failure', msg => {
// //     console.error('❌ Auth failure:', msg);
// //     clientStatus = 'auth_failed';
// //     client.destroy();
// //   });

// //   client.on('disconnected', async reason => {
// //     console.warn('🔌 Client disconnected:', reason);
// //     isClientReady = false;
// //     clientStatus = 'disconnected';

// //     try {
// //       if (client) {
// //         await client.destroy();
// //         console.log('🧹 Client destroyed successfully.');
// //       }
// //     } catch (err) {
// //       console.error('⚠️ Error during client destroy:', err.message);
// //     }

// //     setTimeout(() => {
// //       console.log('♻️ Restarting client in 5 seconds...');
// //       createClient();
// //     }, 5000);
// //   });

// //   client.on('message', async (message) => {
// //     console.log(`🔔 Message received: ${message.body} from ${message.from}`);

// //     const text = message.body.toLowerCase().trim();

// //     if (text === '1') {
// //       if (detailsPDFMedia) {
// //         await message.reply(detailsPDFMedia, null, { caption: 'Here are the details you requested.' });
// //         console.log('✅ Pre-loaded PDF file sent successfully.');
// //       } else {
// //         await message.reply("Sorry, the PDF file is not available.");
// //       }
// //     } else {
// //       const responses = {
// //         hi: `Hi! How can I help you?\n1. Get details (PDF)\n2. Phone\n3. Email`,
// //         '2': '8999898989',
// //         '3': 'meenakshi.732@gmail.com'
// //       };
      
// //       const reply = responses[text] || "Sorry, I didn't understand. Please type 'hi' to see options.";
// //       await message.reply(reply);
// //     }
// //   });

// //   client.on('change_state', state => {
// //     console.log('➡️ Client state changed:', state);
// //   });

// //   client.initialize().catch(err => {
// //     console.error("❌ Error initializing client:", err.message);
// //     if (err.message.includes('ENOENT')) {
// //       console.error("\nTROUBLESHOOTING: The browser executable was not found. This is common in deployment.");
// //       console.error("Please ensure you have set the PUPPETEER_EXECUTABLE_PATH environment variable.");
// //     }
// //   });
// // }

// // createClient();

// // // ==========================
// // // Express Routes
// // // ==========================
// // app.use(express.static(path.join(__dirname, 'public')));
// // app.use('/static', express.static(path.join(__dirname, '/../client/build/static')));

// // app.get('/qr', async (req, res) => {
// //   if (isClientReady) {
// //     return res.status(200).send('✅ Already authenticated');
// //   }

// //   if (!qrCodeString) {
// //     return res.status(200).send('⚠️ QR not yet generated. Please wait...');
// //   }

// //   try {
// //     const image = await qrcodeImage.toDataURL(qrCodeString);
// //     res.send(`<img src="${image}" alt="Scan QR Code" />`);
// //   } catch (err) {
// //     console.error('QR Image Error:', err);
// //     res.status(500).send('❌ Failed to generate QR image');
// //   }
// // });

// // app.post('/send-message', async (req, res) => {
// //   const { number, message } = req.body;

// //   if (!isClientReady) {
// //     return res.status(503).json({ error: 'Client not ready' });
// //   }

// //   if (!number || !message) {
// //     return res.status(400).json({ error: 'number and message are required' });
// //   }

// //   try {
// //     const sanitizedNumber = number.includes('@c.us') ? number : `${number}@c.us`;
// //     await client.sendMessage(sanitizedNumber, message);
// //     res.status(200).json({ status: '✅ Message sent' });
// //   } catch (err) {
// //     console.error('Send Error:', err);
// //     res.status(500).json({ error: `❌ Failed to send message: ${err.message}` });
// //   }
// // });

// // app.get('/status', (req, res) => {
// //   res.status(200).json({ ready: isClientReady, status: clientStatus });
// // });

// // if (NODE_ENV === 'production' || NODE_ENV === 'DIT') {
// //   app.get('*', (req, res) => {
// //     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// //   });
// // }

// // app.listen(PORT, () => {
// //   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// // });

// // ==========================
// // Imports and Setup
// // ==========================
// const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
// const qrcode = require('qrcode-terminal');
// const qrcodeImage = require('qrcode');
// const cors = require('cors');
// const path = require('path');
// const express = require('express');
// const fs = require('fs');

// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3001;
// const NODE_ENV = process.env.NODE_ENV;

// app.use(express.json());
// app.use(cors({ origin: '*' }));

// // =======================================================================
// // Chat State and Media Pre-loading
// // =======================================================================
// // A Map to store the session state for each chat
// const sessionState = new Map();
// const PDF_DIR = path.join(__dirname, 'public', 'pdf');
// const IMAGE_DIR = path.join(__dirname, 'public', 'image');

// // Map of family pack options with paths and pre-loaded media
// const familyOptions = {
//   '4': { label: 'Rs. 2,000/- Family Pack', file: path.join(PDF_DIR, 'family_2000.pdf') },
//   '5': { label: 'Rs. 3,000/- Family Pack', file: path.join(PDF_DIR, 'family_3000.pdf') },
//   '6': { label: 'Rs. 4,000/- Family Pack', file: path.join(PDF_DIR, 'family_4000.pdf') },
//   '7': { label: 'Rs. 5,000/- Family Pack', file: path.join(PDF_DIR, 'family_5000.pdf') },
//   '8': { label: 'Rs. 7,500/- Family Pack', file: path.join(PDF_DIR, 'family_7500.pdf') },
//   '9': { label: 'Rs. 10,000/- Family Pack', file: path.join(PDF_DIR, 'family_10000.pdf') }
// };

// // Map of gift pack options with paths and pre-loaded media
// const giftOptions = {
//   '10': { label: 'Gift Pack - 21 items', file: path.join(IMAGE_DIR, 'gift_21items.jpg') },
//   '11': { label: 'Gift Pack - 25 items', file: path.join(IMAGE_DIR, 'gift_25items.jpg') },
//   '12': { label: 'Gift Pack - 30 items', file: path.join(IMAGE_DIR, 'gift_30items.jpg') },
//   '13': { label: 'Gift Pack - 35 items', file: path.join(IMAGE_DIR, 'gift_35items.jpg') },
//   '14': { label: 'Gift Pack - 40 items', file: path.join(IMAGE_DIR, 'gift_40items.jpg') },
//   '15': { label: 'Gift Pack - 50 items', file: path.join(IMAGE_DIR, 'gift_50items.jpg') },
//   '16': { label: 'Gift Pack - 60 items', file: path.join(IMAGE_DIR, 'gift_60items.jpg') }
// };

// /**
//  * Pre-loads all media files from disk into memory for fast sending.
//  */
// function preloadMedia() {
//   console.log('⏳ Pre-loading all media files...');
  
//   // Pre-load Family Pack PDFs
//   for (const option in familyOptions) {
//     const filePath = familyOptions[option].file;
//     try {
//       if (fs.existsSync(filePath)) {
//         const fileData = fs.readFileSync(filePath);
//         familyOptions[option].media = new MessageMedia('application/pdf', fileData.toString('base64'), path.basename(filePath));
//         console.log(`✅ Loaded PDF: ${path.basename(filePath)}`);
//       } else {
//         console.warn(`⚠️ PDF not found: ${filePath}`);
//       }
//     } catch (err) {
//       console.error(`❌ Error loading PDF: ${filePath}`, err);
//     }
//   }

//   // Pre-load Gift Pack Images
//   for (const option in giftOptions) {
//     const filePath = giftOptions[option].file;
//     try {
//       if (fs.existsSync(filePath)) {
//         const fileData = fs.readFileSync(filePath);
//         giftOptions[option].media = new MessageMedia('image/jpeg', fileData.toString('base64'), path.basename(filePath));
//         console.log(`✅ Loaded Image: ${path.basename(filePath)}`);
//       } else {
//         console.warn(`⚠️ Image not found: ${filePath}`);
//       }
//     } catch (err) {
//       console.error(`❌ Error loading Image: ${filePath}`, err);
//     }
//   }
// }
// preloadMedia(); // Call the function to preload media on startup

// // ==========================
// // WhatsApp Client State Management
// // ==========================
// let qrCodeString = '';
// let isClientReady = false;
// let clientStatus = 'initializing';
// let client;

// // ==========================
// // WhatsApp Client Initialization
// // ==========================
// function createClient() {
//   console.log('Attempting to create and initialize WhatsApp client...');

//   client = new Client({
//     authStrategy: new LocalAuth({ clientId: 'session-1' }),
//     puppeteer: {
//       headless: true,
//       executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
//       args: [
//         '--no-sandbox',
//         '--disable-setuid-sandbox',
//         '--disable-gpu',
//         '--disable-dev-shm-usage',
//         '--single-process'
//       ]
//     }
//   });

//   // --- Client Event Handlers ---
//   client.on('qr', (qr) => {
//     qrCodeString = qr;
//     clientStatus = 'qr';
//     console.log('📱 QR received - waiting for scan...');
//     qrcode.generate(qr, { small: true });
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
//     client.destroy();
//   });

//   client.on('disconnected', async reason => {
//     console.warn('🔌 Client disconnected:', reason);
//     isClientReady = false;
//     clientStatus = 'disconnected';

//     try {
//       if (client) {
//         await client.destroy();
//         console.log('🧹 Client destroyed successfully.');
//       }
//     } catch (err) {
//       console.error('⚠️ Error during client destroy:', err.message);
//     }

//     setTimeout(() => {
//       console.log('♻️ Restarting client in 5 seconds...');
//       createClient();
//     }, 5000);
//   });

//   // =======================================================================
//   // !!! MAIN LOGIC: Multi-level conversational menu handler !!!
//   // =======================================================================
//   client.on('message', async (message) => {
//     console.log(`🔔 Message received: ${message.body} from ${message.from}`);
//     const text = message.body.toLowerCase().trim();
//     const chatId = message.from;
    
//     // Get the user's current state, default to 'main'
//     let state = sessionState.get(chatId) || 'main';

//     // Handle 'back' command universally
//     if (text === 'back' || text === 'hi' || text === 'hello') {
//       state = 'main';
//       sessionState.set(chatId, state);
//     }
    
//     // Switch on the current conversation state
//     switch (state) {
//       case 'main':
//         handleMainMenu(message, text, chatId);
//         break;
//       case 'family':
//         handleFamilyPackMenu(message, text, chatId);
//         break;
//       case 'gift':
//         handleGiftPackMenu(message, text, chatId);
//         break;
//       default:
//         handleMainMenu(message, text, chatId);
//         break;
//     }
//   });

//   client.on('change_state', state => {
//     console.log('➡️ Client state changed:', state);
//   });

//   client.initialize().catch(err => {
//     console.error("❌ Error initializing client:", err.message);
//     if (err.message.includes('ENOENT')) {
//       console.error("\nTROUBLESHOOTING: The browser executable was not found. This is common in deployment.");
//       console.error("Please ensure you have set the PUPPETEER_EXECUTABLE_PATH environment variable.");
//     }
//   });
// }

// // =======================================================================
// // Menu-specific handlers
// // =======================================================================

// const mainMenuText = `Hi! How can I help you?\n1. 🎆 Family Pack\n2. 🎁 Gift Pack\n3. 🧨 Loose Crackers\n\nType the number to choose a category.`;
// const familyPackMenuText = `🎆 Family Pack Options:\n${Object.keys(familyOptions).map(key => `${key}. ${familyOptions[key].label}`).join('\n')}\n\nType the number to view more or 'back' to go to categories.`;
// const giftPackMenuText = `🎁 Gift Pack Options:\n${Object.keys(giftOptions).map(key => `${key}. ${giftOptions[key].label}`).join('\n')}\n\nType the number to view more or 'back' to go to categories.`;
// const looseCrackersText = `🧨 Loose Crackers\nPlease go to this link to order the crackers: https://jaiganeshagency.netlify.app/`;

// async function handleMainMenu(message, text, chatId) {
//   switch (text) {
//     case '1':
//       await message.reply(familyPackMenuText);
//       sessionState.set(chatId, 'family');
//       break;
//     case '2':
//       await message.reply(giftPackMenuText);
//       sessionState.set(chatId, 'gift');
//       break;
//     case '3':
//       await message.reply(looseCrackersText);
//       // Stay in 'main' state
//       break;
//     default:
//       await message.reply(mainMenuText);
//       break;
//   }
// }

// async function handleFamilyPackMenu(message, text, chatId) {
//   const option = familyOptions[text];
//   if (option && option.media) {
//     await message.reply(option.media, null, { caption: `Details for ${option.label}` });
//     await message.reply('🙏 Thank you for choosing Jai Ganesh Agency.\nIf you need further assistance, contact Meena — 00022255.');
//     sessionState.set(chatId, 'main'); // Go back to main menu after sending
//   } else {
//     await message.reply(`Sorry, that's not a valid option. Please choose a number from the list or type 'back' to return.\n\n${familyPackMenuText}`);
//   }
// }

// async function handleGiftPackMenu(message, text, chatId) {
//   const option = giftOptions[text];
//   if (option && option.media) {
//     await message.reply(option.media, null, { caption: `Details for ${option.label}` });
//     await message.reply('🙏 Thank you for choosing Jai Ganesh Agency.\nIf you need further assistance, contact Fisheee — 55665455.');
//     sessionState.set(chatId, 'main'); // Go back to main menu after sending
//   } else {
//     await message.reply(`Sorry, that's not a valid option. Please choose a number from the list or type 'back' to return.\n\n${giftPackMenuText}`);
//   }
// }

// createClient();

// // ==========================
// // Express Routes
// // ==========================
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/static', express.static(path.join(__dirname, '/../client/build/static')));

// app.get('/qr', async (req, res) => {
//   if (isClientReady) {
//     return res.status(200).send('✅ Already authenticated');
//   }

//   if (!qrCodeString) {
//     return res.status(200).send('⚠️ QR not yet generated. Please wait...');
//   }

//   try {
//     const image = await qrcodeImage.toDataURL(qrCodeString);
//     res.send(`<img src="${image}" alt="Scan QR Code" />`);
//   } catch (err) {
//     console.error('QR Image Error:', err);
//     res.status(500).send('❌ Failed to generate QR image');
//   }
// });

// app.post('/send-message', async (req, res) => {
//   const { number, message } = req.body;

//   if (!isClientReady) {
//     return res.status(503).json({ error: 'Client not ready' });
//   }

//   if (!number || !message) {
//     return res.status(400).json({ error: 'number and message are required' });
//   }

//   try {
//     const sanitizedNumber = number.includes('@c.us') ? number : `${number}@c.us`;
//     await client.sendMessage(sanitizedNumber, message);
//     res.status(200).json({ status: '✅ Message sent' });
//   } catch (err) {
//     console.error('Send Error:', err);
//     res.status(500).json({ error: `❌ Failed to send message: ${err.message}` });
//   }
// });

// app.get('/status', (req, res) => {
//   res.status(200).json({ ready: isClientReady, status: clientStatus });
// });

// if (NODE_ENV === 'production' || NODE_ENV === 'DIT') {
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
//   });
// }

// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// });

// const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
// const qrcode = require('qrcode-terminal');
// const qrcodeImage = require('qrcode');
// const cors = require('cors');
// const path = require('path');
// const express = require('express');
// const fs = require('fs');

// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3001;
// const NODE_ENV = process.env.NODE_ENV;

// app.use(express.json());
// app.use(cors({ origin: '*' }));

// // =======================================================================
// // Chat State and Media Pre-loading
// // =======================================================================
// // A Map to store the session state for each chat
// const sessionState = new Map();
// const PDF_DIR = path.join(__dirname, 'public', 'pdf');
// const IMAGE_DIR = path.join(__dirname, 'public', 'image');
// const VOICE_DIR = path.join(__dirname, 'public', 'voice');

// // Map of family pack options with paths and pre-loaded media
// const familyOptions = {
//   '4': { label: 'Rs. 2,000/- Family Pack', file: path.join(PDF_DIR, 'family_2000.pdf') },
//   '5': { label: 'Rs. 3,000/- Family Pack', file: path.join(PDF_DIR, 'family_3000.pdf') },
//   '6': { label: 'Rs. 4,000/- Family Pack', file: path.join(PDF_DIR, 'family_4000.pdf') },
//   '7': { label: 'Rs. 5,000/- Family Pack', file: path.join(PDF_DIR, 'family_5000.pdf') },
//   '8': { label: 'Rs. 7,500/- Family Pack', file: path.join(PDF_DIR, 'family_7500.pdf') },
//   '9': { label: 'Rs. 10,000/- Family Pack', file: path.join(PDF_DIR, 'family_10000.pdf') }
// };

// // Map of gift pack options with paths and pre-loaded media
// const giftOptions = {
//   '10': { label: 'Gift Pack - 21 items', file: path.join(IMAGE_DIR, 'gift_21items.jpg') },
//   '11': { label: 'Gift Pack - 25 items', file: path.join(IMAGE_DIR, 'gift_25items.jpg') },
//   '12': { label: 'Gift Pack - 30 items', file: path.join(IMAGE_DIR, 'gift_30items.jpg') },
//   '13': { label: 'Gift Pack - 35 items', file: path.join(IMAGE_DIR, 'gift_35items.jpg') },
//   '14': { label: 'Gift Pack - 40 items', file: path.join(IMAGE_DIR, 'gift_40items.jpg') },
//   '15': { label: 'Gift Pack - 50 items', file: path.join(IMAGE_DIR, 'gift_50items.jpg') },
//   '16': { label: 'Gift Pack - 60 items', file: path.join(IMAGE_DIR, 'gift_60items.jpg') }
// };

// // Pre-loaded voice message variable
// let helloVoice;

// /**
//  * Pre-loads all media files from disk into memory for fast sending.
//  */
// function preloadMedia() {
//   console.log('⏳ Pre-loading all media files...');

//   // Pre-load Family Pack PDFs
//   for (const option in familyOptions) {
//     const filePath = familyOptions[option].file;
//     try {
//       if (fs.existsSync(filePath)) {
//         const fileData = fs.readFileSync(filePath);
//         familyOptions[option].media = new MessageMedia('application/pdf', fileData.toString('base64'), path.basename(filePath));
//         console.log(`✅ Loaded PDF: ${path.basename(filePath)}`);
//       } else {
//         console.warn(`⚠️ PDF not found: ${filePath}`);
//       }
//     } catch (err) {
//       console.error(`❌ Error loading PDF: ${filePath}`, err);
//     }
//   }

//   // Pre-load Gift Pack Images
//   for (const option in giftOptions) {
//     const filePath = giftOptions[option].file;
//     try {
//       if (fs.existsSync(filePath)) {
//         const fileData = fs.readFileSync(filePath);
//         giftOptions[option].media = new MessageMedia('image/jpeg', fileData.toString('base64'), path.basename(filePath));
//         console.log(`✅ Loaded Image: ${path.basename(filePath)}`);
//       } else {
//         console.warn(`⚠️ Image not found: ${filePath}`);
//       }
//     } catch (err) {
//       console.error(`❌ Error loading Image: ${filePath}`, err);
//     }
//   }

//   // Pre-load the 'hello' voice recording
//   const helloVoicePath = path.join(VOICE_DIR, 'hello.mp3');
//   try {
//     if (fs.existsSync(helloVoicePath)) {
//       const fileData = fs.readFileSync(helloVoicePath);
//       // The MIME type is crucial for WhatsApp to render it as a voice note.
//       helloVoice = new MessageMedia('audio/mpeg; codecs=opus', fileData.toString('base64'), 'hello.ogg');
//       console.log(`✅ Loaded Voice Recording: ${path.basename(helloVoicePath)}`);
//     } else {
//       console.warn(`⚠️ Voice file not found: ${helloVoicePath}`);
//     }
//   } catch (err) {
//     console.error(`❌ Error loading voice file: ${helloVoicePath}`, err);
//   }
// }
// preloadMedia(); // Call the function to preload media on startup

// // ==========================
// // WhatsApp Client State Management
// // ==========================
// let qrCodeString = '';
// let isClientReady = false;
// let clientStatus = 'initializing';
// let client;

// // ==========================
// // WhatsApp Client Initialization
// // ==========================
// function createClient() {
//   console.log('Attempting to create and initialize WhatsApp client...');

//   client = new Client({
//     authStrategy: new LocalAuth({ clientId: 'session-1' }),
//     puppeteer: {
//       headless: true,
//       executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
//       args: [
//         '--no-sandbox',
//         '--disable-setuid-sandbox',
//         '--disable-gpu',
//         '--disable-dev-shm-usage',
//         '--single-process'
//       ]
//     }
//   });

//   // --- Client Event Handlers ---
//   client.on('qr', (qr) => {
//     qrCodeString = qr;
//     clientStatus = 'qr';
//     console.log('📱 QR received - waiting for scan...');
//     qrcode.generate(qr, { small: true });
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
//     client.destroy();
//   });

//   client.on('disconnected', async reason => {
//     console.warn('🔌 Client disconnected:', reason);
//     isClientReady = false;
//     clientStatus = 'disconnected';

//     try {
//       if (client) {
//         await client.destroy();
//         console.log('🧹 Client destroyed successfully.');
//       }
//     } catch (err) {
//       console.error('⚠️ Error during client destroy:', err.message);
//     }

//     setTimeout(() => {
//       console.log('♻️ Restarting client in 5 seconds...');
//       createClient();
//     }, 5000);
//   });

//   // =======================================================================
//   // !!! MAIN LOGIC: Multi-level conversational menu handler !!!
//   // =======================================================================
//   client.on('message', async (message) => {
//     console.log(`🔔 Message received: ${message.body} from ${message.from}`);
//     const text = message.body.toLowerCase().trim();
//     const chatId = message.from;

//     // Get the user's current state, default to 'main'
//     let state = sessionState.get(chatId) || 'main';

//     // Handle 'back' command or greetings universally
//     if (text === 'back' || text === 'hi' || text === 'hello') {
//       state = 'main';
//       sessionState.set(chatId, state);
//     }

//     // Switch on the current conversation state
//     switch (state) {
//       case 'main':
//         await handleMainMenu(message, text, chatId);
//         break;
//       case 'family':
//         await handleFamilyPackMenu(message, text, chatId);
//         break;
//       case 'gift':
//         await handleGiftPackMenu(message, text, chatId);
//         break;
//       default:
//         await handleMainMenu(message, text, chatId);
//         break;
//     }
//   });

//   client.on('change_state', state => {
//     console.log('➡️ Client state changed:', state);
//   });

//   client.initialize().catch(err => {
//     console.error("❌ Error initializing client:", err.message);
//     if (err.message.includes('ENOENT')) {
//       console.error("\nTROUBLESHOOTING: The browser executable was not found. This is common in deployment.");
//       console.error("Please ensure you have set the PUPPETEER_EXECUTABLE_PATH environment variable.");
//     }
//   });
// }

// // =======================================================================
// // Menu-specific handlers
// // =======================================================================

// const mainMenuText = `👋 Welcome to Jai Ganesh Agency!\nHow can we assist you today?\n\n1. 🎆 Family Pack\n2. 🎁 Gift Pack\n3. 🧨 Loose Crackers\n\nPlease type the number of your choice.`;
// const familyPackMenuText = `🎆 Family Pack Options:\n${Object.keys(familyOptions).map(key => `${key}. ${familyOptions[key].label}`).join('\n')}\n\nPlease type the number of your choice or type 'back' to return to the main categories.`;
// const giftPackMenuText = `🎁 Gift Pack Options:\n${Object.keys(giftOptions).map(key => `${key}. ${giftOptions[key].label}`).join('\n')}\n\nPlease type the number of your choice or type 'back' to return to the main categories.`;
// const looseCrackersText = `🧨 Loose Crackers\nPlease click the link to order the needed crackers: https://jaiganeshagency.netlify.app/ \n\nPlease wait until the Bot reply😇`;

// async function handleMainMenu(message, text, chatId) {
//   // Check for 'hi' or 'hello' to send the voice note and main menu text
//   if (text === 'hi' || text === 'hello') {
//     if (helloVoice) {
//       // Send the voice recording first, with the option to send it as a voice note
//       await client.sendMessage(chatId, helloVoice, { sendAudioAsVoice: true });
//     }
//     // Then, send the main menu text
//     await client.sendMessage(chatId, mainMenuText);
//     sessionState.set(chatId, 'main'); // Stay in main state
//     return; // Exit the function to prevent the default case from running
//   }else {
//     await message.reply(`Sorry, that's not a valid option. Please choose a number from the list\n\n1. 🎆 Family Pack\n2. 🎁 Gift Pack\n3. 🧨 Loose Crackers\n\nPlease type the number of your choice.\n\n${familyPackMenuText}`);
//   }

//   switch (text) {
//     case '1':
//       await message.reply(familyPackMenuText);
//       sessionState.set(chatId, 'family');
//       break;
//     case '2':
//       await message.reply(giftPackMenuText);
//       sessionState.set(chatId, 'gift');
//       break;
//     case '3':
//       await message.reply(looseCrackersText);
//       // Stay in 'main' state
//       break;
//     default:
//       await message.reply(mainMenuText);
//       break;
//   }
// }

// async function handleFamilyPackMenu(message, text, chatId) {
//   const option = familyOptions[text];
//   if (option && option.media) {
//     await message.reply(option.media, null, { caption: `Details for ${option.label}` });
//     await message.reply('🙏 Thank you for choosing Jai Ganesh Agency.\nIf you need further assistance, contact Meena — 00022255.');
//     sessionState.set(chatId, 'main'); // Go back to main menu after sending
//   } else {
//     await message.reply(`Sorry, that's not a valid option. Please choose a number from the list or type 'back' to return.\n\n${familyPackMenuText}`);
//   }
// }

// async function handleGiftPackMenu(message, text, chatId) {
//   const option = giftOptions[text];
//   if (option && option.media) {
//     await message.reply(option.media, null, { caption: `Details for ${option.label}` });
//     await message.reply('🙏 Thank you for choosing Jai Ganesh Agency.\nIf you need further assistance, contact Fisheee — 55665455.');
//     sessionState.set(chatId, 'main'); // Go back to main menu after sending
//   } else {
//     await message.reply(`Sorry, that's not a valid option. Please choose a number from the list or type 'back' to return.\n\n${giftPackMenuText}`);
//   }
// }

// createClient();

// // ==========================
// // Express Routes
// // ==========================
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/static', express.static(path.join(__dirname, '/../client/build/static')));

// app.get('/qr', async (req, res) => {
//   if (isClientReady) {
//     return res.status(200).send('✅ Already authenticated');
//   }

//   if (!qrCodeString) {
//     return res.status(200).send('⚠️ QR not yet generated. Please wait...');
//   }

//   try {
//     const image = await qrcodeImage.toDataURL(qrCodeString);
//     res.send(`<img src="${image}" alt="Scan QR Code" />`);
//   } catch (err) {
//     console.error('QR Image Error:', err);
//     res.status(500).send('❌ Failed to generate QR image');
//   }
// });

// app.post('/send-message', async (req, res) => {
//   const { number, message } = req.body;

//   if (!isClientReady) {
//     return res.status(503).json({ error: 'Client not ready' });
//   }

//   if (!number || !message) {
//     return res.status(400).json({ error: 'number and message are required' });
//   }

//   try {
//     const sanitizedNumber = number.includes('@c.us') ? number : `${number}@c.us`;
//     await client.sendMessage(sanitizedNumber, message);
//     res.status(200).json({ status: '✅ Message sent' });
//   } catch (err) {
//     console.error('Send Error:', err);
//     res.status(500).json({ error: `❌ Failed to send message: ${err.message}` });
//   }
// });

// app.get('/status', (req, res) => {
//   res.status(200).json({ ready: isClientReady, status: clientStatus });
// });

// if (NODE_ENV === 'production' || NODE_ENV === 'DIT') {
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
//   });
// }

// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// });

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const qrcodeImage = require('qrcode');
const cors = require('cors');
const path = require('path');
const express = require('express');
const fs = require('fs');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV;

app.use(express.json());
app.use(cors({ origin: '*' }));

// =======================================================================
// Chat State and Media Pre-loading
// =======================================================================
// A Map to store the session state for each chat
const sessionState = new Map();
const PDF_DIR = path.join(__dirname, 'public', 'pdf');
const IMAGE_DIR = path.join(__dirname, 'public', 'image');
const VOICE_DIR = path.join(__dirname, 'public', 'voice');

// Map of family pack options with paths and pre-loaded media
const familyOptions = {
  '4': { label: 'Rs. 2,000/- Family Pack', file: path.join(PDF_DIR, 'family_2000.pdf') },
  '5': { label: 'Rs. 3,000/- Family Pack', file: path.join(PDF_DIR, 'family_3000.pdf') },
  '6': { label: 'Rs. 4,000/- Family Pack', file: path.join(PDF_DIR, 'family_4000.pdf') },
  '7': { label: 'Rs. 5,000/- Family Pack', file: path.join(PDF_DIR, 'family_5000.pdf') },
  '8': { label: 'Rs. 7,500/- Family Pack', file: path.join(PDF_DIR, 'family_7500.pdf') },
  '9': { label: 'Rs. 10,000/- Family Pack', file: path.join(PDF_DIR, 'family_10000.pdf') }
};

// Map of gift pack options with paths and pre-loaded media
const giftOptions = {
  '10': { label: 'Gift Pack - 21 items', file: path.join(IMAGE_DIR, 'gift_21items.jpg') },
  '11': { label: 'Gift Pack - 25 items', file: path.join(IMAGE_DIR, 'gift_25items.jpg') },
  '12': { label: 'Gift Pack - 30 items', file: path.join(IMAGE_DIR, 'gift_30items.jpg') },
  '13': { label: 'Gift Pack - 35 items', file: path.join(IMAGE_DIR, 'gift_35items.jpg') },
  '14': { label: 'Gift Pack - 40 items', file: path.join(IMAGE_DIR, 'gift_40items.jpg') },
  '15': { label: 'Gift Pack - 50 items', file: path.join(IMAGE_DIR, 'gift_50items.jpg') },
  '16': { label: 'Gift Pack - 60 items', file: path.join(IMAGE_DIR, 'gift_60items.jpg') }
};

// Pre-loaded voice message variables
let helloVoice;
let familyPackVoice;
let giftPackVoice;

/**
 * Pre-loads all media files from disk into memory for fast sending.
 */
function preloadMedia() {
  console.log('⏳ Pre-loading all media files...');

  // Pre-load Family Pack PDFs
  for (const option in familyOptions) {
    const filePath = familyOptions[option].file;
    try {
      if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath);
        familyOptions[option].media = new MessageMedia('application/pdf', fileData.toString('base64'), path.basename(filePath));
        console.log(`✅ Loaded PDF: ${path.basename(filePath)}`);
      } else {
        console.warn(`⚠️ PDF not found: ${filePath}`);
      }
    } catch (err) {
      console.error(`❌ Error loading PDF: ${filePath}`, err);
    }
  }

  // Pre-load Gift Pack Images
  for (const option in giftOptions) {
    const filePath = giftOptions[option].file;
    try {
      if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath);
        giftOptions[option].media = new MessageMedia('image/jpeg', fileData.toString('base64'), path.basename(filePath));
        console.log(`✅ Loaded Image: ${path.basename(filePath)}`);
      } else {
        console.warn(`⚠️ Image not found: ${filePath}`);
      }
    } catch (err) {
      console.error(`❌ Error loading Image: ${filePath}`, err);
    }
  }

  // Pre-load the 'hello' voice recording
  const helloVoicePath = path.join(VOICE_DIR, 'hello.mp3');
  try {
    if (fs.existsSync(helloVoicePath)) {
      const fileData = fs.readFileSync(helloVoicePath);
      helloVoice = new MessageMedia('audio/mpeg', fileData.toString('base64'), 'hello.mp3');
      console.log(`✅ Loaded Voice Recording: ${path.basename(helloVoicePath)}`);
    } else {
      console.warn(`⚠️ Voice file not found: ${helloVoicePath}`);
    }
  } catch (err) {
    console.error(`❌ Error loading voice file: ${helloVoicePath}`, err);
  }

  // Pre-load family pack voice note
  const familyPackVoicePath = path.join(VOICE_DIR, 'familypack_items_showcase.mp3');
  try {
    if (fs.existsSync(familyPackVoicePath)) {
      const fileData = fs.readFileSync(familyPackVoicePath);
      familyPackVoice = new MessageMedia('audio/mpeg', fileData.toString('base64'), 'familypack_items_showcase.mp3');
      console.log(`✅ Loaded Family Pack Voice: ${path.basename(familyPackVoicePath)}`);
    } else {
      console.warn(`⚠️ Family Pack Voice file not found: ${familyPackVoicePath}`);
    }
  } catch (err) {
    console.error(`❌ Error loading family pack voice file: ${familyPackVoicePath}`, err);
  }

  // Pre-load gift pack voice note
  const giftPackVoicePath = path.join(VOICE_DIR, 'giftpack_items_showcase.mp3');
  try {
    if (fs.existsSync(giftPackVoicePath)) {
      const fileData = fs.readFileSync(giftPackVoicePath);
      giftPackVoice = new MessageMedia('audio/mpeg', fileData.toString('base64'), 'giftpack_items_showcase.mp3');
      console.log(`✅ Loaded Gift Pack Voice: ${path.basename(giftPackVoicePath)}`);
    } else {
      console.warn(`⚠️ Gift Pack Voice file not found: ${giftPackVoicePath}`);
    }
  } catch (err) {
    console.error(`❌ Error loading gift pack voice file: ${giftPackVoicePath}`, err);
  }
}

preloadMedia(); // Call the function to preload media on startup

// ==========================
// WhatsApp Client State Management
// ==========================
let qrCodeString = '';
let isClientReady = false;
let clientStatus = 'initializing';
let client;

// ==========================
// WhatsApp Client Initialization
// ==========================
function createClient() {
  console.log('Attempting to create and initialize WhatsApp client...');

  client = new Client({
    authStrategy: new LocalAuth({ clientId: 'session-1' }),
    puppeteer: {
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--single-process'
      ]
    }
  });

  // --- Client Event Handlers ---
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
    client.destroy();
  });

  client.on('disconnected', async reason => {
    console.warn('🔌 Client disconnected:', reason);
    isClientReady = false;
    clientStatus = 'disconnected';

    try {
      if (client) {
        await client.destroy();
        console.log('🧹 Client destroyed successfully.');
      }
    } catch (err) {
      console.error('⚠️ Error during client destroy:', err.message);
    }

    setTimeout(() => {
      console.log('♻️ Restarting client in 5 seconds...');
      createClient();
    }, 5000);
  });

  // =======================================================================
  // !!! MAIN LOGIC: Multi-level conversational menu handler !!!
  // =======================================================================
  client.on('message', async (message) => {
    console.log(`🔔 Message received: ${message.body} from ${message.from}`);
    const text = message.body.toLowerCase().trim();
    const chatId = message.from;

    // Get the user's current state, default to 'main'
    let state = sessionState.get(chatId) || 'main';

    // Handle 'back' command or greetings universally
    if (text === 'back' || text === 'hi' || text === 'hello') {
      state = 'main';
      sessionState.set(chatId, state);
    }

    // Switch on the current conversation state
    switch (state) {
      case 'main':
        await handleMainMenu(message, text, chatId);
        break;
      case 'family':
        await handleFamilyPackMenu(message, text, chatId);
        break;
      case 'gift':
        await handleGiftPackMenu(message, text, chatId);
        break;
      default:
        await handleMainMenu(message, text, chatId);
        break;
    }
  });

  client.on('change_state', state => {
    console.log('➡️ Client state changed:', state);
  });

  client.initialize().catch(err => {
    console.error("❌ Error initializing client:", err.message);
    if (err.message.includes('ENOENT')) {
      console.error("\nTROUBLESHOOTING: The browser executable was not found. This is common in deployment.");
      console.error("Please ensure you have set the PUPPETEER_EXECUTABLE_PATH environment variable.");
    }
  });
}

// =======================================================================
// Menu-specific handlers
// =======================================================================

const mainMenuText = `👋 Welcome to Jai Ganesh Agency!\nHow can we assist you today?\n\n1. 🎆 Family Pack\n2. 🎁 Gift Pack\n3. 🧨 Loose Crackers\n\nPlease type the number of your choice.`;
const familyPackMenuText = `🎆 Family Pack Options:\n${Object.keys(familyOptions).map(key => `${key}. ${familyOptions[key].label}`).join('\n')}\n\nPlease type the number of your choice or type 'back' to return to the main categories.`;
const giftPackMenuText = `🎁 Gift Pack Options:\n${Object.keys(giftOptions).map(key => `${key}. ${giftOptions[key].label}`).join('\n')}\n\nPlease type the number of your choice or type 'back' to return to the main categories.`;
const looseCrackersText = `🧨 Loose Crackers\nPlease click the link to order the needed crackers: https://jaiganeshagency.netlify.app/ \n\nPlease wait until the Bot reply😇`;

async function handleMainMenu(message, text, chatId) {
  // Check for 'hi' or 'hello' to send the voice note and main menu text
  if (text === 'hi' || text === 'hello') {
    if (helloVoice) {
      // Send the voice recording first, with the option to send it as a voice note
      await client.sendMessage(chatId, helloVoice, { sendAudioAsVoice: true });
    }
    // Then, send the main menu text
    await client.sendMessage(chatId, mainMenuText);
    sessionState.set(chatId, 'main'); // Stay in main state
    return; // Exit the function to prevent the default case from running
  }

  switch (text) {
    case '1':
      if (familyPackVoice) {
        await client.sendMessage(chatId, familyPackVoice, { sendAudioAsVoice: true });
      }
      await message.reply(familyPackMenuText);
      sessionState.set(chatId, 'family');
      break;
    case '2':
      if (giftPackVoice) {
        await client.sendMessage(chatId, giftPackVoice, { sendAudioAsVoice: true });
      }
      await message.reply(giftPackMenuText);
      sessionState.set(chatId, 'gift');
      break;
    case '3':
      await message.reply(looseCrackersText);
      // Stay in 'main' state
      break;
    default:
      await message.reply(`Sorry, that's not a valid option. Please choose a number from the list\n\n${mainMenuText}`);
      break;
  }
}

async function handleFamilyPackMenu(message, text, chatId) {
  const option = familyOptions[text];
  if (option && option.media) {
    await message.reply(option.media, null, { caption: `Details for ${option.label}` });
    await message.reply('🙏 Thank you for choosing Jai Ganesh Agency.\nIf you need further assistance, contact Meena — 00022255.');
    sessionState.set(chatId, 'main'); // Go back to main menu after sending
  } else {
    await message.reply(`Sorry, that's not a valid option. Please choose a number from the list or type 'back' to return.\n\n${familyPackMenuText}`);
  }
}

async function handleGiftPackMenu(message, text, chatId) {
  const option = giftOptions[text];
  if (option && option.media) {
    await message.reply(option.media, null, { caption: `Details for ${option.label}` });
    await message.reply('🙏 Thank you for choosing Jai Ganesh Agency.\nIf you need further assistance, contact Fisheee — 55665455.');
    sessionState.set(chatId, 'main'); // Go back to main menu after sending
  } else {
    await message.reply(`Sorry, that's not a valid option. Please choose a number from the list or type 'back' to return.\n\n${giftPackMenuText}`);
  }
}

createClient();

// ==========================
// Express Routes
// ==========================
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, '/../client/build/static')));

app.get('/qr', async (req, res) => {
  if (isClientReady) {
    return res.status(200).send('✅ Already authenticated');
  }

  if (!qrCodeString) {
    return res.status(200).send('⚠️ QR not yet generated. Please wait...');
  }

  try {
    const image = await qrcodeImage.toDataURL(qrCodeString);
    res.send(`<img src="${image}" alt="Scan QR Code" />`);
  } catch (err) {
    console.error('QR Image Error:', err);
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
    const sanitizedNumber = number.includes('@c.us') ? number : `${number}@c.us`;
    await client.sendMessage(sanitizedNumber, message);
    res.status(200).json({ status: '✅ Message sent' });
  } catch (err) {
    console.error('Send Error:', err);
    res.status(500).json({ error: `❌ Failed to send message: ${err.message}` });
  }
});

app.get('/status', (req, res) => {
  res.status(200).json({ ready: isClientReady, status: clientStatus });
});

if (NODE_ENV === 'production' || NODE_ENV === 'DIT') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});