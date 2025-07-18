import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  try {
    let res = await fetch(`https://dark-core-api.vercel.app/api/random/ass?key=api`);
    let json = await res.json();

    if (!json.status || !json.url) {
      return m.reply('❌ No se pudo obtener la imagen.');
    }

    await conn.sendMessage(m.chat, {
      image: { url: json.url },
      caption: `🍑 *Cuidado!* Contenido NSFW`
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('❌ Error al obtener la imagen.');
  }
};

handler.command = /^culo$/i;
handler.tags = ['nsfw'];
handler.help = ['culo'];

export default handler;