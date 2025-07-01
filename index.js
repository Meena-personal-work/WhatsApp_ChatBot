const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs');

// Initialize the WhatsApp Client with session storage
const client = new Client({
    authStrategy: new LocalAuth(), // Stores session automatically
    puppeteer: {
        headless: true, // Runs in the background
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Generate QR Code for Authentication (Only needed once)
client.on('qr', (qr) => {
    console.log('Scan this QR Code to login:');
    qrcode.toString(qr, { type: 'terminal', small: true, }, (err, url) => {
        if (err) {
            console.error('Failed to generate QR code:', err);
        } else {
            console.log(url);
        }
    });
});
// Log when the client is ready
client.on('ready', () => {
    console.log('✅ WhatsApp bot is ready!');
});

// Handle Incoming Messages
client.on('message', async (message) => {
    console.log(`📩 Message from ${message.from}: ${message.body}`);

    if (message.body.toLowerCase() === 'hi') {
        const menu = `Hello! How can I help you today? Please choose an option:\n\n` +
            `1. Location 📍\n` +
            `2. Crackers PDF 🎇\n` +
            `3. Giftbox PDF 🎁`;
        message.reply(menu);
    } else if (message.body === '1') {
        client.sendMessage(message.from, 'Here is our location:');
        client.sendMessage(message.from, {
            location: {
                latitude: 12.971598, // Example latitude
                longitude: 77.594566 // Example longitude
            }
        });
    } else if (message.body === '2') {
        sendPDF(message.from, './crackers.pdf');
    } else if (message.body === '3') {
        sendPDF(message.from, './giftbox.pdf');
    } else {
        message.reply("Sorry, I didn't understand that. Please reply with:\n1 for Location 📍\n2 for Crackers PDF 🎇\n3 for Giftbox PDF 🎁.");
    }
});

// Function to Send a PDF
async function sendPDF(to, filePath) {
    if (fs.existsSync(filePath)) {
        const media = MessageMedia.fromFilePath(filePath);
        client.sendMessage(to, media);
    } else {
        client.sendMessage(to, "❌ Sorry, the requested PDF file is not available.");
    }
}

// Handle Errors
client.on('auth_failure', (msg) => {
    console.error('❌ Authentication failed:', msg);
});

client.on('disconnected', (reason) => {
    console.log('⚠️ WhatsApp client disconnected:', reason);
});

// Start the Client
client.initialize();




