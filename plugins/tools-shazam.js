// alv xD
// https://github.com/Yuji-XDev

import acrcloud from 'acrcloud';
import { writeFile, unlink, readFile } from 'fs/promises';
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
    return conn.reply(m.chat, `🌪️ Responde a un *audio o video* con el comando *${usedPrefix + command}* para reconocer la música.`, m);
  }

  try {
    await m.react('🔍');

    const buffer = await q.download();
    if (!buffer || buffer.length === 0) throw '❌ No se pudo descargar correctamente el archivo.';
    if (buffer.length > 1024 * 1024 * 5) throw '*⚠️ El archivo es muy grande. Usa uno menor a 5MB.*';

    const tempPath = join(tmpdir(), `${randomUUID()}.mp3`);
    await writeFile(tempPath, buffer);
    const fileBuffer = await readFile(tempPath);

    const res = await acr.identify(fileBuffer);
    await unlink(tempPath);

    if (res.status.msg !== 'Success') throw '❌ No se detectó ninguna coincidencia.';
    const meta = res.metadata?.music?.[0];
    if (!meta) throw '❌ No se reconoció ninguna canción.';

    const duration = meta.duration_ms ? msToTime(meta.duration_ms) : 'Desconocido';
    const genres = meta.genres?.map(v => v.name).join(', ') || 'Desconocido';
    const title = meta.title || 'Desconocido';
    const artist = meta.artists?.[0]?.name || 'Desconocido';
    const album = meta.album?.name || 'Desconocido';
    const image = meta.album?.images?.[0]?.url || 'https://i.imgur.com/yYUk4Yr.jpg';
    const release = meta.release_date || 'Desconocido';


    let youtubeUrl = meta.external_metadata?.youtube?.vid
      ? `https://youtu.be/${meta.external_metadata.youtube.vid}`
      : '';

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

    const txt = `╭─⬣「 *🌾 WHATMUSIC TOOLS* 🇦🇱 」⬣
│ 🌾 *\`Título:\`* ${title}
│ 👻 *\`Artista:\`* ${artist}
│ 🧁 *\`Álbum:\`* ${album}
│ 👾 *\`Género:\`* ${genres}
│ 💥 *\`Lanzamiento:\`* ${release}
│ ⏱️ *\`Duración:\`* ${duration}
│
│ 🎄 *\`YouTube:\`* ${youtubeUrl || 'No encontrado'}
│ 🔥 *\`Spotify:\`* ${spotifyUrl || 'No encontrado'}
╰⬣`;

    await conn.sendMessage(m.chat, {
      text: txt,
      contextInfo: {
        externalAdReply: {
          title: title,
          body: artist,
          thumbnailUrl: image,
          sourceUrl: youtubeUrl || spotifyUrl,
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
      buttons: [
        {
          buttonId: `${usedPrefix}play ${youtubeUrl}`,
          buttonText: { displayText: '📥 ᴅᴇsᴄᴀʀɢᴀʀ' },
          type: 1
        },
        {
          buttonId: `${usedPrefix}ytsearch ${title}`,
          buttonText: { displayText: '🔎 ʙᴜsᴄᴀʀ' },
          type: 1
        }
      ],
      footer: '💿 WhatMusic by Black.OFC',
    }, { quoted: m });

  } catch (e) {
    console.error('[WHATMUSIC ❌]:', e);
    conn.reply(m.chat, `❌ *No se pudo reconocer la música.*\n\n🔁 Intenta con otro audio (mínimo 10s y buena calidad).\n📛 *Error técnico:* ${e}`, m);
  }
};

handler.help = ['whatmusic'];
handler.tags = ['tools'];
handler.command = ['whatmusic', 'shazam'];
handler.register = true;

export default handler;