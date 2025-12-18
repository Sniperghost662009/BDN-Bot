const fs = require('fs');

module.exports.run = async (sock, m, args, settings) => {
    const msg = m.messages[0];
    const from = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;

    // EL CREADOR (Tu ID)
    const creador = '5214922108173@s.whatsapp.net'; 

    if (sender !== creador) {
        return sock.sendMessage(from, { text: 'Tú no puedes banear.' });
    }

    let victim = msg.message.extendedTextMessage?.contextInfo?.participant || 
                 msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (!victim && args[0]) {
        victim = args[0].replace('@', '') + '@s.whatsapp.net';
    }

    if (!victim) return sock.sendMessage(from, { text: 'Señala a quién quieres borrar de mi existencia.' });
    if (victim === creador) return sock.sendMessage(from, { text: 'No puedo banearte a ti.' });

    if (!settings.bannedUsers.includes(victim)) {
        settings.bannedUsers.push(victim);
        fs.writeFileSync('./settings.json', JSON.stringify(settings, null, 2));
        await sock.sendMessage(from, { text: `Listo. @${victim.split('@')[0]} ha sido exiliado. No volveré a responderle hasta que tú lo digas.`, mentions: [victim] });
    } else {
        await sock.sendMessage(from, { text: 'Esa persona ya está en el olvido.' });
    }
};