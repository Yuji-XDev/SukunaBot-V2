import fetch from 'node-fetch';

let handler = async (m, { conn, command, usedPrefix, text }) => {
  const query = text || 'Minecraft';
  const url = `https://api.dorratz.com/v2/wallpaper-s?q=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url);
    const json = await res.json();

    if (!json || !json.result || json.result.length === 0)
      return m.reply(`❗ No se encontraron resultados para: *${query}*`);

    const images = json.result.slice(0, 10);

    for (let img of images) {
      await conn.sendFile(m.chat, img, 'wallpaper.jpg', `🖼️ *Wallpaper:* ${query}`, m);
      await new Promise(resolve => setTimeout(resolve, 1500)); 
    }

  } catch (e) {
    console.error(e);
    m.reply('⚠️ Hubo un error al obtener los wallpapers. Intenta nuevamente más tarde.');
  }
};

handler.help = ['wallpaper <tema>'];
handler.tags = ['internet'];
handler.command = /^wallpaper$/i;

export default handler;