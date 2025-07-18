import fetch from "node-fetch";
import yts from 'yt-search';
import axios from 'axios';

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/;

const handler = async (m, { conn, text, usedPrefix, command, args }) => {
  try {
    if (!text?.trim()) {
      return conn.reply(m.chat, '*`✧ Ingresa el nombre de la música a descargar.`*', m);
    }

    const videoIdMatch = text.match(youtubeRegexID);
    const ytData = await yts(videoIdMatch ? `https://youtu.be/${videoIdMatch[1]}` : text);
    const videos = ytData.videos || ytData.all || [];
    const video = videoIdMatch ? videos.find(v => v.videoId === videoIdMatch[1]) : videos[0];

    if (!video) {
      return conn.reply(m.chat, '✖ No se encontraron resultados.', m);
    }

    const { title, thumbnail, timestamp, views, ago, url, author } = video;
    const thumb = await (await fetch(thumbnail)).buffer();

    const info = `
╭─━━━━━✦━━━━━─╮
🌾 Sukuna MD 🌷
╰─━━━━━✦━━━━━─╯

🎧 Título: ${title}
📺 Canal: ${author?.name || 'Desconocido'}
📊 Vistas: ${formatViews(views)}
⏱️ Duración: ${timestamp || 'Desconocida'}
📆 Publicado: ${ago || 'Desconocido'}
🔗 Link: ${url}`;

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

    // AUDIO 🎵
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

    // VIDEO 📹
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
              caption: "📽️ ¡Aquí está tu video! Disfrútalo~",
              thumbnail: thumb
            }, { quoted: m });
            break;
          }
        } catch (e) {
          console.error(`❌ Error con API ${apiUrl}:`, e.message);
        }
      }


      if (!success) {
        try {
          const json = await ytdl(url);
          const size = await getSize(json.url);
          const sizeStr = size ? await formatSize(size) : 'Desconocido';
          const cap = `🎥 *${json.title}*\n📦 Tamaño: ${sizeStr}\n\n🔗 Backup de descarga.`;

          await conn.sendFile(m.chat, await (await fetch(json.url)).buffer(), `${json.title}.mp4`, cap, m);
        } catch (e) {
          console.error(e);
          return conn.reply(m.chat, '❌ Ninguna API ni el método de respaldo pudieron descargar el video.', m);
        }
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


function formatViews(views) {
  if (!views) return "No disponible";
  if (views >= 1e9) return `${(views / 1e9).toFixed(1)}B (${views.toLocaleString()})`;
  if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M (${views.toLocaleString()})`;
  if (views >= 1e3) return `${(views / 1e3).toFixed(1)}K (${views.toLocaleString()})`;
  return views.toString();
}

async function ytdl(url) {
  const headers = {
    "accept": "*/*",
    "accept-language": "es-ES,es;q=0.9",
    "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\"",
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": "\"Android\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "Referer": "https://id.ytmp3.mobi/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  };

  const id = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/)?.[1];
  const init = await fetch(`https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=${Math.random()}`, { headers });
  const initData = await init.json();

  const convertURL = `${initData.convertURL}&v=${id}&f=mp4&_=${Math.random()}`;
  const convert = await (await fetch(convertURL, { headers })).json();

  let info = {};
  for (let i = 0; i < 3; i++) {
    const progressResponse = await fetch(convert.progressURL, { headers });
    info = await progressResponse.json();
    if (info.progress === 3) break;
  }

  return {
    url: convert.downloadURL,
    title: info.title || 'video'
  };
}

async function getSize(url) {
  try {
    const res = await axios.head(url);
    return parseInt(res.headers['content-length'] || '0', 10);
  } catch (e) {
    return null;
  }
}

async function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(2)} ${units[i]}`;
}