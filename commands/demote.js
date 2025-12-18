module.exports.run = async (sock, m, args) => {
    const msg = m.messages[0];
    const from = msg.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    const sender = msg.key.participant || msg.key.remoteJid;

    const creador = '5214922108173@s.whatsapp.net'; 

    if (!isGroup) return sock.sendMessage(from, { text: 'No puedes degradar a nadie en un chat privado. Qué triste.' });

    try {
        const groupMetadata = await sock.groupMetadata(from);
        const participants = groupMetadata.participants;

        const usuario = participants.find(p => p.id === sender);
        const esAdmin = usuario && (usuario.admin === 'admin' || usuario.admin === 'superadmin');
        const esCreador = sender === creador;

        if (!esAdmin && !esCreador) {
            return sock.sendMessage(from, { text: '¿Tú quitando poderes? Intenta primero quitar tu propia vida.' });
        }

        let victim = msg.message.extendedTextMessage?.contextInfo?.participant || 
                     msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

        if (!victim && args[0]) {
            victim = args[0].replace('@', '') + '@s.whatsapp.net';
        }

        if (!victim) return sock.sendMessage(from, { text: '¿A quién le vamos a quitar los privilegios? Señálalo.' });

        // El creador es intocable, no puede ser degradado por su propio bot
        if (victim === creador) {
            return sock.sendMessage(from, { text: 'No.' });
        }

        // Ejecutar la degradación
        await sock.groupParticipantsUpdate(from, [victim], 'demote');
        await sock.sendMessage(from, { text: 'Privilegios revocados. Vuelve al montón con los demás.', quoted: msg });

    } catch (e) {
        await sock.sendMessage(from, { text: 'Error. Siguen siendo admin.' });
    }
};