import fetch from "node-fetch";
import yts from 'yt-search';

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/;

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text?.trim()) {
      return conn.reply(m.chat, `*✧ Ingresa el nombre de la música a descargar.*`, m, rcanal);
    }

    const videoIdMatch = text.match(youtubeRegexID);
    const ytData = await yts(videoIdMatch ? `https://youtu.be/${videoIdMatch[1]}` : text);
    const videos = ytData.videos || ytData.all || [];

    const video = videoIdMatch
      ? videos.find(v => v.videoId === videoIdMatch[1])
      : videos[0];

    if (!video) {
      return conn.reply(m.chat, '✖ No se encontraron resultados para tu búsqueda.', m);
    }

    const { title, thumbnail, timestamp, views, ago, url, author } = video;

    const info = `
╭─━━━━━✦━━━━━─╮
     🌾 Sukuna MD 🌷
╰─━━━━━✦━━━━━─╯

🎧 *Título:* ${title}
📺 *Canal:* ${author?.name || 'Desconocido'}
📊 *Vistas:* ${formatViews(views)}
⏱️ *Duración:* ${timestamp || 'Desconocida'}
📆 *Publicado:* ${ago || 'Desconocido'}
🔗 *Link:* ${url}`;

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

    // 🎵 AUDIO
    if (['play', 'playaudio', 'mp3'].includes(command)) {
      try {
        const res = await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`);
        const json = await res.json();
        const audioURL = json?.result?.download?.url;

        if (!audioURL) throw new Error('⚠ Enlace inválido o vacío');

        await conn.sendMessage(m.chat, {
          audio: { url: audioURL },
          fileName: `${json.result.title}.mp3`,
          mimetype: 'audio/mpeg'
        }, { quoted: m });

      } catch (e) {
        console.error(e);
        return conn.reply(m.chat, '⚠ No se pudo enviar el audio. Puede ser muy pesado o falló la API.', m);
      }
    }

    // 📹 VIDEO
    else if (['play2', 'playvideo', 'mp4'].includes(command)) {
      const sources = [
        `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
        `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
        `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
        `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`
      ];

      let success = false;

      for (let apiUrl of sources) {
        try {
          const res = await fetch(apiUrl);
          const json = await res.json();

          const downloadUrl =
            json?.data?.dl ||
            json?.result?.download?.url ||
            json?.downloads?.url ||
            json?.data?.download?.url;

          if (downloadUrl) {
            success = true;
            await conn.sendMessage(m.chat, {
              video: { url: downloadUrl },
              fileName: `${title}.mp4`,
              mimetype: "video/mp4",
              caption: "📽️ ¡Aquí está tu video! Disfrútalo~ firmado por *Nino Nakano* 💗",
              thumbnail: thumb
            }, { quoted: m });
            break;
          }
        } catch (e) {
          console.error(`❌ Error con API ${apiUrl}:`, e.message);
        }
      }

      if (!success) {
        return conn.reply(m.chat, '❌ Ninguna API pudo descargar el video. Intenta más tarde.', m);
      }
    }
    
    else {
      return conn.reply(m.chat, '✖ Comando no reconocido.', m);
    }

  } catch (err) {
    console.error(err);
    return conn.reply(m.chat, `⚠ Ocurrió un error: ${err.message}`, m);
  }
};

handler.command = ['play', 'playaudio', 'mp3', 'play2', 'playvideo', 'mp4'];
handler.help = handler.command;
handler.tags = ['descargas'];
handler.group = true;

export default handler;

// Formateador de vistas
function formatViews(views) {
  if (!views) return "No disponible";
  if (views >= 1e9) return `${(views / 1e9).toFixed(1)}B (${views.toLocaleString()})`;
  if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M (${views.toLocaleString()})`;
  if (views >= 1e3) return `${(views / 1e3).toFixed(1)}K (${views.toLocaleString()})`;
  return views.toString();
}