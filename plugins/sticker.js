import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `✨ *Ejemplo:* ${usedPrefix + command} My melody`, m);

  await m.react('🛰️');

  try {
    const res = await fetch(`https://delirius-apiofc.vercel.app/search/stickerly?query=${encodeURIComponent(text)}`);

    // Asegura que la respuesta tenga contenido
    if (!res.ok) throw new Error(`Código HTTP: ${res.status}`);

    const json = await res.json();

    // Asegura que 'datos' existe y es un array
    const packs = Array.isArray(json.datos) ? json.datos : [];

    if (!packs.length) throw new Error('API vacía o sin resultados');

    let msg = `🎨 *Resultados para:* ${text}\n\n`;
    for (let i = 0; i < Math.min(5, packs.length); i++) {
      const p = packs[i];
      msg += `*${i + 1}.* ${p.nombre}\n👤 *${p.autor}* | 🧩 *${p.número_de_pegatinas} stickers*\n🔗 ${p.url}\n\n`;
    }

    await conn.sendMessage(m.chat, { text: msg.trim() }, { quoted: m });
    await m.react('✅');

  } catch (err) {
    console.error('[ERROR]', err);
    await m.react('❌');
    conn.reply(m.chat, '❌ La API no respondió o no encontró nada. Intenta con otro nombre o más tarde.', m);
  }
};

handler.command = /^(stickerly)$/i;
export default handler;