import fetch from 'node-fetch';
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `✨ *Ejemplo:* ${usedPrefix + command} upmina`, m);

  try {
    const res = await fetch(`https://api.dorratz.com/v3/stickerly?query=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.success || !json.data || !json.data.length) {
      return conn.reply(m.chat, `❌ No se encontraron packs de *${text}*.`, m);
    }

    const resultados = json.data.slice(0, 3); // Los 3 primeros resultados
    const imagenIntro = 'https://telegra.ph/file/62034697e1be964da1f92.jpg'; // Puedes cambiarla

    const botones = resultados.map(pack => ({
      urlButton: {
        displayText: `${pack.name} (${pack.stickerCount})`,
        url: pack.url
      }
    }));

    const mensaje = {
      templateButtons: botones,
      image: { url: imagenIntro },
      caption: `🎀 *Resultado de:* ${text}\n\n${resultados.map((p, i) =>
        `*${i + 1}.* ${p.name}\n👤 ${p.author}\n🧩 ${p.stickerCount} stickers\n👁 ${p.viewCount} vistas\n🔗 ${p.url}\n`).join('\n')}`,
      footer: '🧷 Stickerly Search by Diego-OFC'
    };

    const msg = await generateWAMessageFromContent(m.chat, proto.Message.fromObject({
      templateMessage: {
        hydratedTemplate: {
          hydratedContentText: mensaje.caption,
          locationMessage: { jpegThumbnail: await (await fetch(imagenIntro)).buffer() },
          hydratedFooterText: mensaje.footer,
          hydratedButtons: botones
        }
      }
    }), { quoted: m });

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

  } catch (e) {
    console.error(e);
    conn.reply(m.chat, '❌ Ocurrió un error al buscar los stickers.', m);
  }
};

handler.help = ['stickerly <nombre>'];
handler.tags = ['sticker'];
handler.command = /^(stickerly|stickerpack|stickerlysearch)$/i;

export default handler;