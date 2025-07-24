import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`╭━━〔 *🌌 Fondos Disponibles* 〕━━⬣
┃ ✨ Escribe el tipo de fondo que deseas:
┃ 🏎️ *autos*
┃ 👧 *waifu*
┃ 🚀 *space*
┃ 📱 *tecnologia*
┃
┃ ✨ Ejemplo de uso:
┃ ➤ ${usedPrefix + command} autos
╰━━━━━━━━━━━━━━━━━━⬣`);
  }

  try {
    const res = await fetch(`https://dark-core-api.vercel.app/api/imagenes?query=${encodeURIComponent(text)}`);
    const data = await res.json();

    if (!data || !data.result || data.result.length === 0) {
      return m.reply(`❌ No se encontraron imágenes para: *${text}*`);
    }

    let max = 10;
    let resultados = data.result.slice(0, max);

    for (let img of resultados) {
      await conn.sendFile(m.chat, img, 'fondo.jpg', `🖼️ *Fondo - ${text}*`, m);
    }
  } catch (e) {
    console.error(e);
    m.reply('❌ Ocurrió un error al obtener las imágenes. Intenta de nuevo más tarde.');
  }
};

handler.command = /^fondo$/i;
handler.help = ['fondo <categoría>'];
handler.tags = ['imagenes'];

export default handler;