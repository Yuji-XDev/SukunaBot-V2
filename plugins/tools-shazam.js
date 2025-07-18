import acrcloud from 'acrcloud';
import { writeFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomUUID } from 'crypto';

const acr = new acrcloud({
  host: 'identify-eu-west-1.acrcloud.com',
  access_key: 'c33c767d683f78bd17d4bd4991955d81',
  access_secret: 'bvgaIAEtADBTbLwiPGYlxupWqkNGIjT7J9Ag2vIu',
});

function msToTime(ms) {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${min}M ${sec}S`;
}

let handler = async (m, { conn }) => {
  let filepath;
  try {
    let q = m.quoted || m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';

    if (!/audio|video/.test(mime)) {
      return conn.reply(m.chat, '🎵 Responde a un audio o video para identificar la música.', m);
    }

    await m.react('🔍');

    let buffer = await q.download();
    if (!buffer || !Buffer.isBuffer(buffer)) {
      return conn.reply(m.chat, '❌ No se pudo descargar el archivo.', m);
    }

    if (buffer.length > 5 * 1024 * 1024) {
      return conn.reply(m.chat, '⚠️ El archivo es muy grande (max 5MB).', m);
    }

    // Guardar en archivo temporal
    const filename = `${randomUUID()}.mp3`;
    filepath = join(tmpdir(), filename);
    await writeFile(filepath, buffer);

    // Usamos archivo por compatibilidad total
    const result = await acr.identify(filepath);

    await unlink(filepath).catch(() => {});

    if (result.status?.msg !== 'Success') {
      return conn.reply(m.chat, '❌ No se detectó ninguna coincidencia.', m);
    }

    const song = result.metadata?.music?.[0];
    if (!song) {
      return conn.reply(m.chat, '❌ No se reconoció ninguna canción.', m);
    }

    const txt = `🎧 *Canción detectada:*\n\n` +
                `• *Título:* ${song.title || 'Desconocido'}\n` +
                `• *Artista:* ${song.artists?.[0]?.name || 'Desconocido'}\n` +
                `• *Álbum:* ${song.album?.name || 'Desconocido'}\n` +
                `• *Género:* ${song.genres?.map(g => g.name).join(', ') || 'Desconocido'}\n` +
                `• *Duración:* ${msToTime(song.duration_ms) || 'Desconocido'}\n` +
                `• *Lanzamiento:* ${song.release_date || 'Desconocido'}\n` +
                `• *YouTube:* ${song.external_metadata?.youtube?.vid ? `https://youtu.be/${song.external_metadata.youtube.vid}` : 'No disponible'}\n` +
                `• *Spotify:* ${song.external_metadata?.spotify?.track?.href || 'No disponible'}`;

    const img = song.album?.images?.[0]?.url;

    await conn.sendMessage(m.chat, {
      image: { url: img || '' },
      caption: txt
    }, { quoted: m });

  } catch (err) {
    console.error('[WHATMUSIC ❌]:', err);
    conn.reply(m.chat, '❌ Error al identificar el audio.', m);
  } finally {
    if (filepath) await unlink(filepath).catch(() => {});
  }
};

handler.command = ['whatmusic', 'shazam'];
handler.help = ['whatmusic'];
handler.tags = ['tools'];
handler.register = true;

export default handler;