import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `✨ *Ejemplo:* ${usedPrefix + command} My melody`, m);
  }

  try {
    // Reacciona mientras busca
    await m.react('🛰️');

    const res = await fetch(`https://delirius-apiofc.vercel.app/search/stickerly?query=${encodeURIComponent(text)}`);
    const json = await res.json();

    const resultados = json?.datos || [];

    const sections = [{
      title: `🌟 Resultados de: ${text}`,
      rows: resultados.slice(0, 10).map((pack, i) => ({
        title: `💌 ${pack.nombre}`,
        description: `👤 ${pack.autor} · ${pack.número_de_pegatinas} stickers`,
        rowId: `${usedPrefix}verpack ${pack.url}`
      }))
    }];

    const listMessage = {
      text: `✨ *Resultados para:* ${text}`,
      footer: '🌟 Stickerly Explorer by @darlingg',
      title: '📦 Packs encontrados:',
      buttonText: '🔍 Ver Packs',
      sections
    };

    await conn.sendMessage(m.chat, listMessage, { quoted: m });

    // Reacciona cuando termina
    await m.react('✅');

  } catch (e) {
    console.error('[ERROR STICKERLY]', e);
    await m.react('❌');
    conn.reply(m.chat, '❌ Error al buscar los paquetes de stickers.', m);
  }
};

handler.command = /^(stickerly|stickerpack)$/i;
export default handler;