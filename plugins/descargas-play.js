import fetch from "node-fetch";
import yts from 'yt-search';
import axios from "axios";

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/;

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text?.trim()) {
      return conn.reply(m.chat, `✦ Por favor, ingresa el nombre o link de YouTube para descargar.`, m);
    }

    let videoIdMatch = text.match(youtubeRegexID);
    let ytData = await yts(videoIdMatch ? 'https://youtu.be/' + videoIdMatch[1] : text);
    let videos = ytData.videos || ytData.all || [];

    let video = videoIdMatch
      ? videos.find(v => v.videoId === videoIdMatch[1])
      : videos[0];

    if (!video) return conn.reply(m.chat, '✖ No se encontraron resultados para tu búsqueda.', m);

    const { title, thumbnail, timestamp, views, ago, url, author } = video;

    const info = `╭─────『 𝙸𝙽𝙵𝙾 𝙳𝙴 𝚃𝚄 𝙱𝚄𝚂𝚀𝚄𝙴𝙳𝙰 』─────╮
🎧 *Título:* ${title}
📺 *Canal:* ${author?.name || 'Desconocido'}
📊 *Vistas:* ${formatViews(views)}
⏱️ *Duración:* ${timestamp || 'Desconocida'}
📆 *Publicado:* ${ago || 'Desconocido'}
🔗 *Link:* ${url}
╰────────────────────────────╯`;

    const thumb = await (await fetch(thumbnail)).buffer();

    const externalReply = {
      contextInfo: {
        externalAdReply: {
          title: global.botname,
          body: global.dev,
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        },
      },
    };

    await conn.reply(m.chat, info, m, externalReply);

    if (['play', 'playaudio', 'mp3'].includes(command)) {
      try {
        const api = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)).json();
        const audioURL = api?.result?.download?.url;

        if (!audioURL) throw new Error('⚠ Enlace inválido');

        await conn.sendMessage(m.chat, {
          audio: { url: audioURL },
          fileName: `${api.result.title}.mp3`,
          mimetype: 'audio/mpeg'
        }, { quoted: m });

      } catch {
        return conn.reply(m.chat, '⚠ No se pudo enviar el audio. Puede ser muy pesado o falló la API.', m);
      }
    }

    else if (['play2', 'playvideo', 'mp4'].includes(command)) {
      try {
        const res = await fetch(`https://api.neoxr.eu/api/youtube?url=${url}&type=video&quality=480p&apikey=GataDios`);
        const json = await res.json();

        if (!json?.data?.url) throw new Error();

        await conn.sendFile(m.chat, json.data.url, `${json.title}.mp4`, title, m);

      } catch {
        return conn.reply(m.chat, '⚠ No se pudo enviar el video. Puede ser muy pesado o falló la API.', m);
      }
    }

    else {
      return conn.reply(m.chat, '✖ Comando no reconocido.', m);
    }

  } catch (err) {
    return conn.reply(m.chat, `⚠ Ocurrió un error: ${err.message}`, m);
  }
};

handler.command = ['play', 'playaudio', 'mp3', 'play2', 'playvideo', 'mp4'];
handler.help = handler.command;
handler.tags = ['descargas'];
handler.group = true;

export default handler;

// 🔁 Formatear vistas
function formatViews(views) {
  if (!views) return "No disponible";
  if (views >= 1e9) return `${(views / 1e9).toFixed(1)}B (${views.toLocaleString()})`;
  if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M (${views.toLocaleString()})`;
  if (views >= 1e3) return `${(views / 1e3).toFixed(1)}K (${views.toLocaleString()})`;
  return views.toString();
}