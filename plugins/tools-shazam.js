import acrcloud from 'acrcloud';
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
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';

    if (!/audio|video/.test(mime)) {
      return conn.reply(
        m.chat,
        `🌪️ Etiqueta un audio o video con el comando *${usedPrefix + command}* para reconocer la música.`,
        m
      );
    }

    await m.react('⏱️');

    let buffer = await q.download();
    if (!buffer) throw '❌ Ocurrió un error al descargar el archivo.';
    if (buffer.length > 1024 * 1024 * 5)
      throw '⚠️ El archivo es muy grande. Usa uno menor a 5MB.';

    let filename = `${randomUUID()}.mp3`;
    let filepath = join(tmpdir(), filename);
    await writeFile(filepath, buffer);

    let res = await acr.identify(buffer);

    await unlink(filepath);

    if (res.status.msg !== 'Success') throw '❌ No se encontró coincidencia.';

    let meta = res.metadata?.music?.[0];
    if (!meta) throw '❌ No se detectó ninguna canción.';

    let duration = meta.duration_ms ? msToTime(meta.duration_ms) : 'Desconocido';
    let genres = meta.genres || [];

    // URLs disponibles
    let youtubeUrl = meta.external_metadata?.youtube?.vid ? `https://youtu.be/${meta.external_metadata.youtube.vid}` : meta.external_metadata?.youtube?.url || '';
    let spotifyUrl = meta.external_metadata?.spotify?.track?.href || '';

    let txt = `╭─⬣「 *🎧 WHATMUSIC DETECTADO* 」⬣
│ ✦ *Título:* ${meta.title || 'Desconocido'}
│ ✦ *Artista:* ${meta.artists?.[0]?.name || 'Desconocido'}
│ ✦ *Álbum:* ${meta.album?.name || 'Desconocido'}
│ ✦ *Género:* ${genres.map(g => g.name).join(', ') || 'Desconocido'}
│ ✦ *Lanzamiento:* ${meta.release_date || 'Desconocido'}
│ ✦ *Duración:* ${duration}
│
│ ✦ *YouTube:* ${youtubeUrl || 'No disponible'}
│ ✦ *Spotify:* ${spotifyUrl || 'No disponible'}
╰⬣`;

    let thumbnail = meta.album?.images?.[0]?.url || '';

    // Construir botones solo si el título existe
    let buttons = [];
    if (meta.title) {
      buttons.push({
        buttonId: `${usedPrefix}play ${meta.title}`,
        buttonText: { displayText: '📥 Descargar' },
        type: 1,
      });
    }

    await conn.sendMessage(
      m.chat,
      {
        image: { url: thumbnail },
        caption: txt,
        contextInfo: {
          externalAdReply: {
            title: meta.title || 'Canción detectada',
            body: meta.artists?.[0]?.name || '',
            thumbnailUrl: thumbnail,
            sourceUrl: youtubeUrl || spotifyUrl || '',
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
        buttons,
        footer: '🎶 Usa el botón para descargar',
      },
      { quoted: m }
    );
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, `❌ Error: ${e}`, m);
  }
};

handler.help = ['whatmusic'];
handler.tags = ['tools'];
handler.command = ['whatmusic', 'shazam'];
handler.register = true;

export default handler;