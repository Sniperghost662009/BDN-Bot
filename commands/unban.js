const fs = require('fs');

module.exports.run = async (sock, m, args, settings) => {
    const msg = m.messages[0];
    const from = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    const creador = '5214922108173@s.whatsapp.net'; 

    if (sender !== creador) return; // Ni siquiera respondemos si no eres tú

    let victim = msg.message.extendedTextMessage?.contextInfo?.participant || 
                 msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!victim && args[0]) {
        victim = args[0].replace('@', '') + '@s.whatsapp.net';
    }

    if (!victim) return;

    const index = settings.bannedUsers.indexOf(victim);
    if (index > -1) {
        settings.bannedUsers.splice(index, 1);
        fs.writeFileSync('./settings.json', JSON.stringify(settings, null, 2));
        await sock.sendMessage(from, { text: `@${victim.split('@')[0]} Ya puedo responderle.`, mentions: [victim] });
    }
};