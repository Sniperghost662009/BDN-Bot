module.exports.run = async (sock, m) => {
    await sock.sendMessage(m.messages[0].key.remoteJid, { text: 'Sigo aquí. ¿Satisfecho?' }, { quoted: m.messages[0] });
};