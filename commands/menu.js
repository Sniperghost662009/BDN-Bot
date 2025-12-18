const fs = require('fs');
const path = require('path');

module.exports.run = async (sock, m, args, settings) => {
    const from = m.messages[0].key.remoteJid;
    
    const texto = `╭──「 *BDN BOT* 」
│
│ *Antilink:* ${settings.antilink ? '✅' : '❌'}
│
├─「 *Comandos* 」
│ ➢ #s - Stickers
│ ➢ #antilink on/off
│ ➢ #ping - Estado
│ ➢ #menu - Ver esto
│ ➢ #ia [pregunta] - Gemini
│ ➢ #img [Prompt] - Crear imagenes
│ ➢ #kick - Saca a alguien
│ ➢ #demote - Ascender a admin
│ ➢ #promote - quitar admin
╰──────────────────`.trim();

    try {
        // Buscamos el archivo .jpeg que mencionaste
        const nombreArchivo = 'menu.jpeg'; 
        const pathImagen = path.join(__dirname, '..', nombreArchivo); 
        
        if (fs.existsSync(pathImagen)) {
            const img = fs.readFileSync(pathImagen);
            await sock.sendMessage(from, { 
                image: img, 
                caption: texto 
            }, { quoted: m.messages[0] });
        } else {
            // Si no lo encuentra, lanza un error para que el 'catch' lo maneje
            throw new Error(`No encontré el archivo: ${nombreArchivo}`);
        }
    } catch (e) {
        console.error("Fallo técnico:", e.message);
        // Enviamos solo texto si la imagen decidió no presentarse al servicio
        await sock.sendMessage(from, { text: texto }, { quoted: m.messages[0] });
    }
};