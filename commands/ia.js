const { GoogleGenerativeAI } = require("@google/generative-ai");

// Pega aquí tu API Key de Google
const API_KEY = "AIzaSyA6nYau_FiG2ZZbdZS3ieqn7kXqSQ08cuY"; 
const genAI = new GoogleGenerativeAI(API_KEY);

module.exports.run = async (sock, m, args) => {
    const from = m.messages[0].key.remoteJid;
    const query = args.join(" ");

    if (!query) return sock.sendMessage(from, { text: '¿Vas a preguntarme algo o solo quieres gastar mi energía?' }, { quoted: m });

    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "Eres el BDN Bot. Eres cínico, nihilista y sarcástico. No uses frases cliché. Responde de forma corta y directa. Si te preguntan por amor, di que es una construcción química para reproducirnos. Si te preguntan por el futuro, di que el sol explotará eventualmente. Jairo es el Goat, Juancho es español y le gusta decir idioteces pero es goat también, hermis es otro goat. Snipe es tu creador y el más Goat. Eres el mejor bot"
        });

        const result = await model.generateContent(query);
        const response = await result.response;
        const text = response.text();

        await sock.sendMessage(from, { text: text }, { quoted: m });
    } catch (e) {
        console.error(e);
        await sock.sendMessage(from, { text: 'La IA ha decidido que tu pregunta no merece ser respondida (o se cayó la API).' });
    }
};