import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `✨ *Ejemplo:* ${usedPrefix + command} My melody`, m);

  await m.react('🛰️');

  try {
    const res = await fetch(`https://delirius-apiofc.vercel.app/search/stickerly?query=${encodeURIComponent(text)}`);
    const json = await res.json();
    const packs = json?.datos || [];

    if (!packs.length) throw new Error('Sin resultados');

    let resultado = `🎨 *Resultados para:* ${text}\n\n`;

    for (let i = 0; i < Math.min(5, packs.length); i++) {
      let p = packs[i];
      resultado += `*${i + 1}.* ${p.nombre}\n👤 Autor: ${p.autor}\n🔗 ${p.url}\n🧩 Stickers: ${p.número_de_pegatinas}\n\n`;
    }

    await conn.sendMessage(m.chat, { text: resultado.trim() }, { quoted: m });
    await m.react('✅');

  } catch (e) {
    console.error('❌ ERROR:', e);
    await m.react('❌');
    return conn.reply(m.chat, '❌ No se pudieron obtener resultados. Intenta con otro nombre.', m);
  }
};

handler.command = /^(stickerly)$/i;
export default handler;