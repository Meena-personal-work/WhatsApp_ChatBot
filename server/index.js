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
// });

const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const qrcodeImage = require('qrcode');
const puppeteer = require('puppeteer');
const app = express();
const cors = require('cors');

const PORT = 3001;
app.use(express.json());
app.use(cors({ origin: '*' }));
let qrCodeString = '';
let isClientReady = false;
let clientStatus = 'initializing';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath: puppeteer.executablePath(),
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    qrCodeString = qr;
    console.log('🔄 QR RECEIVED - Please scan again');
    qrcode.generate(qr, { small: true }); // For terminal
});

client.on('ready', () => {
    isClientReady = true;
    console.log('✅ Client is ready!');
});

client.on('authenticated', () => {
    console.log('🔐 Authenticated');
});

client.on('auth_failure', msg => {
    console.error('❌ Authentication failure', msg);
});

client.on('disconnected', async (reason) => {
    console.log('🔌 Disconnected:', reason);
    isClientReady = false;

    try {
        if (typeof client.destroy === 'function') {
            await client.destroy();
        } else {
            console.warn('⚠️ client.destroy is not a function');
        }

        console.log('♻️ Restarting client after disconnect...');
        setTimeout(() => client.initialize(), 3000);
    } catch (err) {
        console.error('⚠️ Error destroying client:', err);
    }
});

client.on('message', async message => {
    const text = message.body.toLowerCase().trim();
    console.log(`📩 Message from ${message.from}: ${text}`);

    if (text === 'hi') {
        await message.reply(
            `Hi, how can I help you?\n1. Name\n2. Phone No\n3. Mail`
        );
    } else if (text === '1') {
        await message.reply('My name is M. Meena ka....');
    } else if (text === '2') {
        await message.reply('8999898989');
    } else if (text === '3' || text.includes('mail')) {
        await message.reply('meenakshi.732@gmail.com');
    } else {
        await message.reply("Sorry, I didn't understand. Please type 'hi' to see options.");
    }
});

client.initialize();

// =====================
// API Routes
// =====================

// Get QR as base64 image
app.get('/qr', async (req, res) => {
    if (qrCodeString) {
        const qrImage = await qrcodeImage.toDataURL(qrCodeString);
        res.send(`<img src="${qrImage}" alt="Scan QR Code to Login" />`);
    } else {
        res.send('✅ Already authenticated or QR not available.');
    }

    if (clientStatus === 'disconnected' || clientStatus === 'restarting') {
        return res.json({ message: 'Client is restarting, please wait...', status: clientStatus });
    }

    // Serve QR code if client not authenticated
    client.on('qr', (qr) => {
        const qrImage = qrTerminal.generate(qr, { small: true });
        return res.json({ qr, status: 'scan_required' });
    });
});

// Send message
app.post('/send-message', async (req, res) => {
    const { number, message } = req.body;
    if (!number || !message) {
        return res.status(400).json({ error: 'number and message are required' });
    }

    try {
        const chatId = number.includes('@c.us') ? number : `${number}@c.us`;
        await client.sendMessage(chatId, message);
        res.json({ status: 'Message sent' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Check client status
app.get('/status', (req, res) => {
    res.json({ ready: isClientReady });
});

// Start Express server
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});