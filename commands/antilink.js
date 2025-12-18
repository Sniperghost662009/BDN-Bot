const fs = require('fs');

module.exports.run = async (sock, m, args, settings) => {
    const msg = m.messages[0];
    const from = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
    const isGroup = from.endsWith('@g.us');

    // --- EL INTOCABLE (Tu ID) ---
    const creador = '5214922108173@s.whatsapp.net'; 

    if (!isGroup) return sock.sendMessage(from, { text: 'Este comando solo tiene sentido en grupos. Aquí no hay nada que proteger.' });

    try {
        // Verificamos si es admin o el creador
        const groupMetadata = await sock.groupMetadata(from);
        const participants = groupMetadata.participants;
        const usuario = participants.find(p => p.id === sender);
        
        const esAdmin = usuario && (usuario.admin === 'admin' || usuario.admin === 'superadmin');
        const esCreador = sender === creador;

        if (!esAdmin && !esCreador) {
            return sock.sendMessage(from, { 
                text: 'No tienes rango para tocar los sistemas de seguridad.',
                quoted: msg 
            });
        }

        if (!args[0]) return sock.sendMessage(from, { text: '¿On u off? Elige un estado para el antilink.' });

        if (args[0] === 'on') {
            settings.antilink = true;
            await sock.sendMessage(from, { text: '🛡️ *Antilink Activado.* La limpieza de links externos ha comenzado.' });
        } else if (args[0] === 'off') {
            settings.antilink = false;
            await sock.sendMessage(from, { text: '🔓 *Antilink Desactivado.* El grupo ahora es un campo libre para el spam.' });
        } else {
            return sock.sendMessage(from, { text: 'Comando inválido. Usa: #antilink on o #antilink off.' });
        }
        
        // Guardamos el cambio en el archivo settings.json
        fs.writeFileSync('./settings.json', JSON.stringify(settings, null, 2));

    } catch (e) {
        console.error("Error al cambiar estado de antilink:", e);
        await sock.sendMessage(from, { text: 'Hubo un error al intentar acceder a la configuración del grupo.' });
    }
};