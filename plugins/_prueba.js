import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`✳️ *Ingresa un enlace de Spotify válido.*\n📌 Ejemplo: ${usedPrefix + command} https://open.spotify.com/track/6UR5tB1wVm7qvH4xfsHr8m`);
  }

  await m.react('🎧');

  try {
    let api = `https://api.dorratz.com/spotifydl?url=${encodeURIComponent(text)}`;
    let res = await fetch(api);
    let json = await res.json();

    let caption = `🎵 *${json.nombre}*\n👤 *${json.artistas}*\n🕒 *Duración:* ${(json.duración_ms / 60000).toFixed(2)} minutos`;

    await conn.sendMessage(m.chat, {
      image: { url: json.imagen },
      caption,
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      audio: { url: json.URL },
      mimetype: 'audio/mpeg',
      fileName: `${json.nombre} - ${json.artistas}.mp3`
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('⚠️ *Error al procesar la canción.* Intenta nuevamente.');
  }
};

handler.help = ['spotifydl <url>'];
handler.tags = ['downloader'];
handler.command = /^spotify(dl)?$/i;

export default handler;