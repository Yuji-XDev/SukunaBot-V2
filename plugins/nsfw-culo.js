import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  try {
    const res = await fetch('https://dark-core-api.vercel.app/api/random/ass?key=api');
    const json = await res.json();

    if (json?.url) {
      await conn.sendMessage(m.chat, {
        image: { url: json.url },
        caption: `🍑 *Disfruta tu ración de... arte digital 🙈*`
      }, { quoted: m });
    }

  } catch (e) {
    console.error('[ERROR ASS]', e);
  }
};

handler.command = /^culo$/i;
handler.tags = ['nsfw'];
handler.help = ['culo'];

export default handler;