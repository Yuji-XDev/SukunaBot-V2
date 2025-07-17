import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text || !text.includes('youtu')) {
    return conn.reply(m.chat, `❌ *Ingresa un enlace válido de YouTube.*\n\nEjemplo:\n${usedPrefix + command} https://youtu.be/ryVgEcaJhwM`, m);
  }

  try {
    let res = await fetch(`https://dark-core-api.vercel.app/api/download/YTMP3?key=api&url=${encodeURIComponent(text)}`);
    let json = await res.json();

    if (!json.status || !json.download) {
      return conn.reply(m.chat, '⚠️ No se pudo obtener el audio. Asegúrate que el link es válido o intenta más tarde.', m);
    }

    await conn.sendMessage(m.chat, {
      audio: { url: json.download },
      fileName: `${json.title}.mp3`,
      mimetype: 'audio/mpeg'
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    conn.reply(m.chat, '💥 Ocurrió un error al procesar el enlace.', m);
  }
};

handler.help = ['ytmp3'];
handler.tags = ['downloader'];
handler.command = /^ytmp3|ytaudio$/i;

export default handler;