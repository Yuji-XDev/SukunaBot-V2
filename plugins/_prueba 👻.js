import fetch from 'node-fetch';
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `✨ *Ejemplo:* ${usedPrefix + command} upmina`, m);
  }

  try {
    let res = await fetch(`https://api.dorratz.com/v3/stickerly?query=${encodeURIComponent(text)}`);
    let json = await res.json();

    if (!json.success || !json.data || !json.data.length) {
      return conn.reply(m.chat, `❌ No se encontraron packs de *${text}*.`, m);
    }

    let sections = json.data.map((pack, i) => ({
      title: `${i + 1}. ${pack.name}`,
      rows: [{
        title: `💌 ${pack.name}`,
        description: `👤 ${pack.author} · 🧩 ${pack.stickerCount} stickers · 👁 ${pack.viewCount} vistas`,
        rowId: pack.url
      }]
    }));

    let listMessage = {
      text: `✨ *Resultados para:* ${text}\n\n🔍 Se encontraron ${json.data.length} paquetes.`,
      footer: '🌟 Stickerly Explorer by Diego-OFC',
      title: `🎀 Pack de Stickers: ${text}`,
      buttonText: '📦 Ver Packs',
      sections
    };

    await conn.sendMessage(m.chat, listMessage, { quoted: m });
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, '❌ Ocurrió un error al buscar los paquetes.', m);
  }
};

handler.help = ['stickerpack', 'stickerlysearch'].map(v => v + ' <nombre>');
handler.tags = ['sticker'];
handler.command = /^(stickerpack|stickerlysearch|stickerly)$/i;

export default handler;