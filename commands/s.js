const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

module.exports.run = async (sock, m) => {
    const msg = m.messages[0];
    if (Object.keys(msg.message)[0] !== 'imageMessage') return;
    const stream = await downloadContentFromMessage(msg.message.imageMessage, 'image');
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
    const sticker = new Sticker(buffer, { pack: 'BDN Bot', author: 'BDN', type: StickerTypes.FULL });
    await sock.sendMessage(msg.key.remoteJid, { sticker: await sticker.toBuffer() }, { quoted: msg });
};