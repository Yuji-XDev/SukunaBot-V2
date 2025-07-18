import fetch from 'node-fetch';

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

    // Generar secciones para lista
    let sections = [{
      title: `🌟 Resultados de: ${text}`,
      rows: json.data.slice(0, 10).map((pack, i) => ({
        title: `💌 ${pack.name}`,
        description: `👤 ${pack.author} · ${pack.stickerCount} stickers`,
        rowId: `${usedPrefix}verpack ${encodeURIComponent(pack.url)}`
      }))
    }];

    let listMessage = {
      text: `✨ *Resultados para:* ${text}\n\n🔍 Se encontraron ${json.data.length} paquetes.`,
      footer: '🌟 Stickerly Explorer by Dev.Shadow',
      title: '📦 Packs encontrados:',
      buttonText: '🔍 Ver Packs',
      sections
    };

    await conn.sendMessage(m.chat, listMessage, { quoted: m });

  } catch (e) {
    console.error(e);
    conn.reply(m.chat, '❌ Ocurrió un error al buscar los paquetes.', m);
  }
};

handler.command = /^(stickerly|stickerpack)$/i;
export default handler;