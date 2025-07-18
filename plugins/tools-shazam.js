/*import acrcloud from 'acrcloud';
import { writeFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomUUID } from 'crypto';

let acr = new acrcloud({
  host: 'identify-eu-west-1.acrcloud.com',
  access_key: 'c33c767d683f78bd17d4bd4991955d81',
  access_secret: 'bvgaIAEtADBTbLwiPGYlxupWqkNGIjT7J9Ag2vIu',
});

function msToTime(duration) {
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  return `${minutes}M ${seconds}S`;
}

let handler = async (m, { conn, command, usedPrefix }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || q.mediaType || '';

  if (!/audio|video/.test(mime)) {
    return conn.reply(m.chat, `🌪️ Responde a un *audio o video* con el comando *${usedPrefix + command}* para reconocer la música.`, m);
  }

  try {
    await m.react('🔍');
    let buffer = await q.download();
    if (!buffer) throw '❌ No se pudo descargar el archivo.';
    if (buffer.length > 1024 * 1024 * 5) throw '*⚠️ El archivo es muy grande. Usa uno menor a 5MB.*';

    const res = await acr.identify(buffer);

    if (res.status.msg !== 'Success') throw '❌ No se detectó ninguna coincidencia.';

    const meta = res.metadata?.music?.[0];
    if (!meta) throw '❌ No se reconoció ninguna canción.';

    const duration = meta.duration_ms ? msToTime(meta.duration_ms) : 'Desconocido';
    const genres = meta.genres?.map(v => v.name).join(', ') || 'Desconocido';

    const title = meta.title || 'Desconocido';
    const artist = meta.artists?.[0]?.name || 'Desconocido';
    const album = meta.album?.name || 'Desconocido';
    const image = meta.album?.images?.[0]?.url || '';
    const release = meta.release_date || 'Desconocido';

    // Corrección de enlaces
    const youtubeId = meta.external_metadata?.youtube?.vid;
    const youtubeUrl = youtubeId ? `https://youtu.be/${youtubeId}` : 'No disponible';
    const spotifyUrl = meta.external_metadata?.spotify?.track?.external_urls?.spotify || 'No disponible';

    const txt = `╭─⬣「 *🎧 WHATMUSIC DETECTADO* 」⬣
│ ✦ *Título:* ${title}
│ ✦ *Artista:* ${artist}
│ ✦ *Álbum:* ${album}
│ ✦ *Género:* ${genres}
│ ✦ *Lanzamiento:* ${release}
│ ✦ *Duración:* ${duration}
│ ✦ *YouTube:* ${youtubeUrl}
│ ✦ *Spotify:* ${spotifyUrl}
╰⬣`;

    await conn.sendMessage(m.chat, {
      text: txt,
      contextInfo: {
        externalAdReply: {
          title: title,
          body: artist,
          thumbnailUrl: image,
          sourceUrl: youtubeId ? `https://youtu.be/${youtubeId}` : undefined,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      },
      buttons: [
        {
          buttonId: `${usedPrefix}play ${title}`,
          buttonText: { displayText: '📥 Descargar' },
          type: 1
        },
        {
          buttonId: `${usedPrefix}ytsearch ${title}`,
          buttonText: { displayText: '🔎 Buscar' },
          type: 1
        }
      ],
      footer: '🎶 Usa los botones para continuar',
    }, { quoted: m });

  } catch (e) {
    console.error('[WHATMUSIC ❌]:', e);
    conn.reply(m.chat, `❌ Error: ${e}`, m);
  }
};

handler.help = ['whatmusic'];
handler.tags = ['tools'];
handler.command = ['whatmusic', 'shazam'];
handler.register = true;

export default handler;*/



import acrcloud from 'acrcloud';
import { writeFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomUUID } from 'crypto';
import yts from 'yt-search';
import fetch from 'node-fetch';

let acr = new acrcloud({
  host: 'identify-eu-west-1.acrcloud.com',
  access_key: 'c33c767d683f78bd17d4bd4991955d81',
  access_secret: 'bvgaIAEtADBTbLwiPGYlxupWqkNGIjT7J9Ag2vIu',
});

function msToTime(duration) {
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  return `${minutes}M ${seconds}S`;
}

let handler = async (m, { conn, command, usedPrefix }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || q.mediaType || '';

  if (!/audio|video/.test(mime)) {
    return conn.reply(m.chat, `🌪️ Responde a un *audio o video* con el comando *${usedPrefix + command}* para reconocer la música.`, m, rcanal);
  }

  try {
    await m.react('🔍');
    let buffer = await q.download();
    if (!buffer) throw '❌ No se pudo descargar el archivo.';
    if (buffer.length > 1024 * 1024 * 5) throw '*⚠️ El archivo es muy grande. Usa uno menor a 5MB.*';

    const res = await acr.identify(buffer);
    if (res.status.msg !== 'Success') throw '❌ No se detectó ninguna coincidencia.';

    const meta = res.metadata?.music?.[0];
    if (!meta) throw '❌ No se reconoció ninguna canción.';

    const duration = meta.duration_ms ? msToTime(meta.duration_ms) : 'Desconocido';
    const genres = meta.genres?.map(v => v.name).join(', ') || 'Desconocido';
    const title = meta.title || 'Desconocido';
    const artist = meta.artists?.[0]?.name || 'Desconocido';
    const album = meta.album?.name || 'Desconocido';
    const image = meta.album?.images?.[0]?.url || '';
    const release = meta.release_date || 'Desconocido';


    const ytId = meta.external_metadata?.youtube?.vid;
    let youtubeUrl = ytId ? `https://youtu.be/${ytId}` : '';
    let spotifyUrl = meta.external_metadata?.spotify?.track?.external_urls?.spotify || '';

    if (!youtubeUrl) {
      const yt = await yts(`${title} ${artist}`);
      const video = yt.videos[0];
      if (video) youtubeUrl = video.url;
    }

    if (!spotifyUrl) {
      const sp = await fetch(`https://delirius-apiofc.vercel.app/search/spotify?q=${encodeURIComponent(title + ' ' + artist)}`);
      const json = await sp.json();
      if (json?.datos?.length) {
        spotifyUrl = json.datos[0]?.url || '';
      }
    }

    const txt = `╭─⬣「 *🎧 WHATMUSIC DETECTADO* 」⬣
│ ✦ *Título:* ${title}
│ ✦ *Artista:* ${artist}
│ ✦ *Álbum:* ${album}
│ ✦ *Género:* ${genres}
│ ✦ *Lanzamiento:* ${release}
│ ✦ *Duración:* ${duration}
│
│ ✦ *YouTube:* ${youtubeUrl || 'No encontrado'}
│ ✦ *Spotify:* ${spotifyUrl || 'No encontrado'}
╰⬣`;

    await conn.sendMessage(m.chat, {
      text: txt,
      contextInfo: {
        externalAdReply: {
          title: title,
          body: artist,
          thumbnailUrl: image,
          sourceUrl: youtubeUrl,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      },
      buttons: [
        {
          buttonId: `${usedPrefix}play ${title}`,
          buttonText: { displayText: '📥 Descargar' },
          type: 1
        },
        {
          buttonId: `${usedPrefix}ytsearch ${title}`,
          buttonText: { displayText: '🔎 Buscar' },
          type: 1
        }
      ],
      footer: '🎶 Usa los botones para continuar',
    }, { quoted: m });

  } catch (e) {
    console.error('[WHATMUSIC ❌]:', e);
    conn.reply(m.chat, `❌ Error: ${e}`, m);
  }
};

handler.help = ['whatmusic'];
handler.tags = ['tools'];
handler.command = ['whatmusic', 'shazam'];
handler.register = true;

export default handler;