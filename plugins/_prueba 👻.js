import fetch from 'node-fetch';
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `✨ *Ejemplo:* ${usedPrefix + command} upmina`, m);

  try {
    let res = await fetch(`https://api.dorratz.com/v3/stickerly?query=${encodeURIComponent(text)}`);
    let json = await res.json();

    if (!json.success || !json.data || !json.data.length) {
      return conn.reply(m.chat, `❌ No se encontraron packs de *${text}*.`, m);
    }

    for (let i = 0; i < Math.min(3, json.data.length); i++) {
      const pack = json.data[i];
      const msg = {
        text: `🎀 *${pack.name}*\n👤 Autor: ${pack.author}\n🧩 Stickers: ${pack.stickerCount}\n👁 Vistas: ${pack.viewCount}`,
        footer: '🌟 Stickerly by Diego-OFC',
        buttons: [
          {
            buttonId: `.menu`, // puedes cambiar esto por otro comando tuyo si deseas
            buttonText: { displayText: '📂 Más' },
            type: 1
          },
          {
            type: 2,
            buttonText: { displayText: '🌐 Ver en Sticker.ly' },
            urlButton: { displayText: '🌐 Ver en Sticker.ly', url: pack.url }
          }
        ],
        headerType: 4,
        image: { url: pack.thumbnailUrl }
      };

      const template = await generateWAMessageFromContent(m.chat, {
        templateMessage: {
          hydratedTemplate: {
            hydratedContentText: msg.text,
            locationMessage: { jpegThumbnail: await (await fetch(pack.thumbnailUrl)).buffer() },
            hydratedFooterText: msg.footer,
            hydratedButtons: msg.buttons
          }
        }
      }, { quoted: m });

      await conn.relayMessage(m.chat, template.message, { messageId: template.key.id });
    }

  } catch (e) {
    console.error(e);
    conn.reply(m.chat, '❌ Ocurrió un error al buscar los paquetes.', m);
  }
};

handler.help = ['stickerly <nombre>'];
handler.tags = ['sticker'];
handler.command = /^(stickerly|stickerpack|stickerlysearch)$/i;

export default handler;