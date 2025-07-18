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

    // Imagen decorativa
    const imagenIntro = 'https://telegra.ph/file/62034697e1be964da1f92.jpg'; // puedes cambiarla

    await conn.sendMessage(m.chat, {
      image: { url: imagenIntro },
      caption: `🎀 *Buscando stickers de:* ${text}\n📦 Encontrados: ${json.data.length} packs.\n\nToca "Ver Packs" para explorarlos.`,
    }, { quoted: m });

    // Construir el menú tipo lista
    let sections = json.data.map((pack, i) => ({
      title: `${i + 1}. ${pack.name}`,
      rows: [{
        title: `✨ ${pack.name}`,
        description: `👤 ${pack.author} · 🧩 ${pack.stickerCount} · 👁 ${pack.viewCount}`,
        rowId: `${pack.url}` // Esto hará que al presionar se muestre y funcione como link
      }]
    }));

    let listMessage = {
      text: `🌟 *Resultados para:* ${text}`,
      footer: '🧷 Stickerly Search by DIEGO-OFC',
      title: '🎴 Selecciona un paquete:',
      buttonText: '📦 Ver Packs',
      sections
    };

    await conn.sendMessage(m.chat, listMessage, { quoted: m });

  } catch (e) {
    console.error(e);
    conn.reply(m.chat, '❌ Error al buscar los stickers.', m);
  }
};

handler.help = ['stickerly <nombre>'];
handler.tags = ['sticker'];
handler.command = /^(stickerly|stickerpack|stickerlysearch)$/i;

export default handler;