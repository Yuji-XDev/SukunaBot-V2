import fetch from "node-fetch";
import yts from 'yt-search';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text?.trim()) {
      return conn.reply(m.chat, `🌾 *¿Qué música deseas descargar?*`, m, fake);
    }

    const search = await yts(text);
    if (!search?.all?.length) {
      return m.reply('❌ No se encontraron resultados para tu búsqueda.');
    }

    const videoInfo = search.all[0];
    const { title, thumbnail, timestamp, views, ago, url, author } = videoInfo || {};

    if (!title || !thumbnail || !timestamp || !views || !ago || !url || !author) {
      return m.reply('⚠️ Información incompleta del video.');
    }

    const vistas = formatViews(views);
    const canal = author.name || 'Desconocido';

    const infoMessage = `╭━〔 乂 YOUTUBE - PLAY 〕━⬣
🎧 *${title}*

≡ ⏱ *Duración:* ${timestamp}
≡ 📺 *Canal:* ${canal}
≡ 👁️ *Vistas:* ${vistas}
≡ 📆 *Publicado:* ${ago}
≡ 🔗 *Link:* ${url}
╰━━━━━━━━━━━━⬣`;

    const thumb = (await conn.getFile(thumbnail))?.data;

    const JT = {
      contextInfo: {
        externalAdReply: {
          title: wm,
          body: club,
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        },
      },
    };

    await conn.reply(m.chat, infoMessage, m, JT);


    if (command === 'mp3' || command === 'playaudio') {
      try {
        const apiAudioUrl = `https://api.stellarwa.xyz/dow/ytmp3?url=${url}&apikey=stellar-7SQpl4Ah`;
        const res = await fetch(apiAudioUrl);
        const json = await res.json();
        const { title, dl } = json.data;

        if (!dl) throw new Error('No se generó el enlace de audio.');

        await conn.sendMessage(
          m.chat,
          { audio: { url: dl }, fileName: `${title}.mp3`, mimetype: 'audio/mpeg' },
          { quoted: m }
        );
      } catch (e) {
        console.error('Audio Error:', e.message);
        return conn.reply(m.chat, '⚠️ No se pudo enviar el audio. Puede que sea muy pesado o haya fallado la descarga. Intenta más tarde.', m);
      }
    }


    else if (command === 'mp4' || command === 'playvideo') {
      try {
        const apiVideoUrl = `https://api.stellarwa.xyz/dow/ytmp4?url=${url}&apikey=diamond`;
        const res = await fetch(apiVideoUrl);
        const json = await res.json();
        const { title, dl } = json.data;

        if (!dl) throw new Error('No se generó el enlace de video.');

        await conn.sendMessage(
          m.chat,
          { video: { url: dl }, fileName: `${title}.mp4`, mimetype: 'video/mp4' },
          { quoted: m }
        );
      } catch {
        try {
          const fallback = await fetch(`https://api.vreden.my.id/api/ytmp4?url=${url}`);
          const json = await fallback.json();
          const resultad = json.result;
          const resultado = resultad?.download?.url;

          if (!resultado) throw new Error('No se generó el enlace de video.');

          await conn.sendMessage(
            m.chat,
            {
              video: { url: resultado },
              fileName: `${resultad.title || 'video'}.mp4`,
              mimetype: 'video/mp4',
              caption: '🎬 Aquí tienes tu video descargado.',
            },
            { quoted: m }
          );
        } catch (e) {
          console.error('Video Error:', e.message);
          return conn.reply(m.chat, '⚠️ No se pudo enviar el video. Puede que sea muy pesado o haya fallado la descarga. Intenta más tarde.', m);
        }
      }
    }

  } catch (error) {
    console.error(error);
    return m.reply(`⚠️ Ocurrió un error:\n\n${error.message}`);
  }
};

handler.command = handler.help = ['mp3', 'playaudio', 'mp4', 'playvideo'];
handler.tags = ['downloader'];

export default handler;

function formatViews(views) {
  if (typeof views !== 'number') return "No disponible";

  if (views >= 1e9) return `${(views / 1e9).toFixed(1)}B (${views.toLocaleString()})`;
  if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M (${views.toLocaleString()})`;
  if (views >= 1e3) return `${(views / 1e3).toFixed(1)}k (${views.toLocaleString()})`;
  return views.toString();
}