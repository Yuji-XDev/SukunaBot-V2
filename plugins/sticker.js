import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `✨ *Ejemplo:* ${usedPrefix + command} My melody`, m);
  }

  try {
    const res = await fetch(`https://delirius-apiofc.vercel.app/search/stickerly?query=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.estado || !json.datos || !json.datos.length) {
      return conn.reply(m.chat, `❌ No se encontraron packs de *${text}*.`, m);
    }

    const sections = [{
      title: `🌟 Resultados de: ${text}`,
      rows: json.datos.slice(0, 10).map((pack, i) => ({
        title: `💌 ${pack.nombre}`,
        description: `👤 ${pack.autor} · ${pack.número_de_pegatinas} stickers`,
        rowId: `${usedPrefix}verpack ${encodeURIComponent(pack.url)}`
      }))
    }];

    const listMessage = {
      text: `✨ *Resultados para:* ${text}\n\n🔍 Se encontraron ${json.datos.length} paquetes.`,
      footer: '🌟 Stickerly Explorer by @darlingg',
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