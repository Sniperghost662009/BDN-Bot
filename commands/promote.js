module.exports.run = async (sock, m, args) => {
    const msg = m.messages[0];
    const from = msg.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    const sender = msg.key.participant || msg.key.remoteJid;

    // --- ID DEL CREADOR (Pon el tuyo aquí) ---
    const creador = '5214922108173@s.whatsapp.net'; 

    if (!isGroup) return sock.sendMessage(from, { text: '¿A quien vamos a ascender?.' });

    try {
        const groupMetadata = await sock.groupMetadata(from);
        const participants = groupMetadata.participants;

        const usuario = participants.find(p => p.id === sender);
        const esAdmin = usuario && (usuario.admin === 'admin' || usuario.admin === 'superadmin');
        const esCreador = sender === creador;

        if (!esAdmin && !esCreador) {
            return sock.sendMessage(from, { text: 'No tienes el rango para repartir coronas. Vuelve a tu rincón.' });
        }

        let victim = msg.message.extendedTextMessage?.contextInfo?.participant || 
                     msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

        if (!victim && args[0]) {
            victim = args[0].replace('@', '') + '@s.whatsapp.net';
        }

        if (!victim) return sock.sendMessage(from, { text: 'Menciona a alguien o responde a su mensaje para darle este poder temporal.' });

        // Ejecutar el ascenso
        await sock.groupParticipantsUpdate(from, [victim], 'promote');
        await sock.sendMessage(from, { text: 'Ahora eres admin. Úsalo para joder o para nada, me da igual.', quoted: msg });

    } catch (e) {
        await sock.sendMessage(from, { text: 'El sistema ha fallado.' });
    }
};