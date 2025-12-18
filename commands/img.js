const axios = require('axios');

module.exports.run = async (sock, m, args) => {
    const from = m.messages[0].key.remoteJid;
    const prompt = args.join(" ");

    if (!prompt) return sock.sendMessage(from, { text: 'Dime qué quieres ver.' }, { quoted: m.messages[0] });

    await sock.sendMessage(from, { text: 'Generando tu alucinación visual... espera.' });

    try {
        // Usamos Pollinations porque es gratis y no pide explicaciones
        const url = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${Math.floor(Math.random() * 1000)}&nologo=true`;
        
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'utf-8');

        await sock.sendMessage(from, { 
            image: buffer, 
            caption: `*Resultado para:* ${prompt}\n\n_Cortesía del BDN Bot._` 
        }, { quoted: m.messages[0] });

    } catch (e) {
        console.error("Error al generar imagen:", e);
        await sock.sendMessage(from, { text: 'El generador de imágenes ha colapsado. Quizás pediste algo demasiado edgy.' });
    }
};