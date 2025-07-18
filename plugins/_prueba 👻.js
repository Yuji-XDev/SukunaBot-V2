import fetch from 'node-fetch';
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`✨ *Ejemplo:* ${usedPrefix + command} upmina`);

  try {
    const res = await fetch(`https://api.dorratz.com/v3/stickerly?query=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.success || !json.data || json.data.length === 0) {
      return m.reply(`❌ No se encontraron resultados para *${text}*`);
    }

    const packs = json.data.slice(0, 3); // Primeros 3 packs
    const imagen = logo;

    const contentText = `🎀 *Resultados de:* ${text}\n\n` + packs.map((p, i) => 
      `*${i + 1}.* ${p.name}\n👤 ${p.author}\n🧩 ${p.stickerCount} stickers\n👁 ${p.viewCount} vistas\n🔗 ${p.url}`
    ).join('\n\n');

    const buttons = packs.map(p => ({
      index: 1,
      urlButton: {
        displayText: p.name,
        url: p.url
      }
    }));

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {},
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({
              text: contentText
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: '🧷 Stickerly Search by Diego-OFC'
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              title: `✨ Packs encontrados`,
              hasMediaAttachment: true,
              image: {
                url: imagen
              }
            }),
            nativeFlowMessage: {
              buttons
            }
          })
        }
      }
    }, { quoted: m });

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

  } catch (e) {
    console.error(e);
    m.reply('❌ Error al buscar los stickers.');
  }
};

handler.command = /^(stickerly|stickerpack)$/i;
handler.tags = ['sticker'];
handler.help = ['stickerly <nombre>'];

export default handler;