const fs = require('fs');

const handler = async (sock, m) => {
    const msg = m.messages[0];
    if (!msg.message) return;

    const from = msg.key.remoteJid; // El ID del grupo o chat
    const sender = msg.key.participant || msg.key.remoteJid; // ¡AQUÍ ESTÁS TÚ!
    const nombre = msg.pushName || 'Desconocido';

    // Este log te dirá la verdad absoluta mañana:
    console.log(`--- REPORTE DE ACTIVIDAD ---`);
    console.log(`USUARIO: ${nombre}`);
    console.log(`ID PERSONAL: ${sender}`);
    console.log(`UBICACIÓN: ${from}`);
    console.log(`----------------------------`);
    


    // --- EL INTOCABLE (Tu ID) ---
    const creador = '5214922108173@s.whatsapp.net'; // Pon tu número real aquí

    // Cargar configuración
    let settings = JSON.parse(fs.readFileSync('./settings.json'));

    // --- FILTRO DE EXILIO (Ignorar si está en la lista negra de #ban) ---
    if (settings.bannedUsers.includes(sender) && !text.includes('unban')) return;

    // --- PROTOCOLO ANTILINK CON INMUNIDAD ---
    if (isGroup && settings.antilink && text.includes('chat.whatsapp.com')) {
        try {
            // Obtenemos info del grupo para verificar rangos
            const groupMetadata = await sock.groupMetadata(from);
            const participants = groupMetadata.participants;
            const usuario = participants.find(p => p.id === sender);
            
            const esAdmin = usuario && (usuario.admin === 'admin' || usuario.admin === 'superadmin');
            const esCreador = sender === creador;

            // Si es admin o creador, tiene permiso de spamear lo que quiera
            if (esAdmin || esCreador) {
                console.log(`[ANTILINK] Link detectado, pero ${sender} tiene inmunidad.`);
            } else {
                const miCodigo = await sock.groupInviteCode(from);
                
                // Si el link NO es de este grupo, procedemos a la ejecución
                if (!text.includes(miCodigo)) {
                    await sock.sendMessage(from, { text: 'Las reglas no son para los admins, pero sí para ti. Adiós.' });
                    await sock.groupParticipantsUpdate(from, [sender], 'remove');
                    return; // Detenemos el proceso para este mensaje
                }
            }
        } catch (e) {
            console.error("Error en el control de inmunidad antilink:", e);
        }
    }

    // --- PROCESADOR DE COMANDOS ---
    const prefijos = ['#', '.'];
    const esComando = prefijos.some(p => text.startsWith(p));
    if (!esComando) return;

    const comando = text.slice(1).split(' ')[0];
    const args = text.split(' ').slice(1);

    try {
        const cmdFile = require(`./commands/${comando}.js`);
        await cmdFile.run(sock, m, args, settings);
    } catch (e) {
        // El comando no existe, no nos importa el error.
    }
};

module.exports = { handler };