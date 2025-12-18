module.exports.run = async (sock, m, args) => {
    const msg = m.messages[0];
    const from = msg.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    const sender = msg.key.participant || msg.key.remoteJid;

    // --- EL INTOCABLE ---
    // Asegúrate de poner AQUÍ tu ID real (el que sacaste de la terminal)
    const creador = '5214922108173@s.whatsapp.net'; 

    if (!isGroup) return sock.sendMessage(from, { text: '¿A quién vas a sacar de aquí? Solo estamos tú y yo perdiendo el tiempo.' });

    try {
        // 1. Obtenemos la información del grupo
        const groupMetadata = await sock.groupMetadata(from);
        const participants = groupMetadata.participants;

        // 2. Verificamos si el que envía el comando es admin o el creador
        const usuario = participants.find(p => p.id === sender);
        const esAdmin = usuario && (usuario.admin === 'admin' || usuario.admin === 'superadmin');
        const esCreador = sender === creador;

        // Si no es admin ni el creador, le cerramos la puerta en la cara
        if (!esAdmin && !esCreador) {
            return sock.sendMessage(from, { 
                text: 'Intento de golpe de estado, pero no eres administrador. Vuelve cuando tengas algo de poder real en este chat.',
                quoted: msg 
            });
        }

        // 3. Identificamos a la víctima
        let victim = msg.message.extendedTextMessage?.contextInfo?.participant || 
                     msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

        if (!victim && args[0]) {
            victim = args[0].replace('@', '') + '@s.whatsapp.net';
        }

        if (!victim) return sock.sendMessage(from, { text: 'Necesito un objetivo. Menciona a alguien o responde a su mensaje.' });

        // Seguro anti-traición: El creador no puede ser pateado
        if (victim === creador) {
            return sock.sendMessage(from, { 
                text: '¿Intentas que elimine a mi creador?',
                quoted: msg 
            });
        }

        // 4. Ejecutamos el Kick
        await sock.groupParticipantsUpdate(from, [victim], 'remove');
        await sock.sendMessage(from, { text: 'Misión cumplida. Un estorbo menos en este sistema.', quoted: msg });

    } catch (e) {
        console.error("Error en el comando kick:", e);
        await sock.sendMessage(from, { 
            text: 'No pude hacerlo. Probablemente no soy admin o el sistema ha decidido que hoy no quiere trabajar.' 
        });
    }
};