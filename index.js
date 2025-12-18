const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const { handler } = require('./handler'); // Importamos tu nuevo cerebro

async function iniciarBDN() {
    const { state, saveCreds } = await useMultiFileAuthState('sesion_bdn');
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        browser: ["BDN Bot", "Chrome", "1.0"]
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, qr } = update;
        if (qr) qrcode.generate(qr, { small: true });
        if (connection === 'open') console.log('BDN Bot: Conectado y Handler cargado.');
        if (connection === 'close') iniciarBDN(); // Reconexión automática
    });

    sock.ev.on('creds.update', saveCreds);

    // Aquí es donde sucede la magia: pasamos el mensaje al handler
    sock.ev.on('messages.upsert', async m => {
        await handler(sock, m);
    });
}

iniciarBDN();