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

function msToTime(ms) {
  let m = Math.floor(ms / 60000);
  let s = Math.floor((ms % 60000) / 1000);
  return `${m}M ${s}S`;
}

let handler = async (m, { conn, command, usedPrefix }) => {
  let filepath;
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';
    if (!/audio|video/.test(mime)) return conn.reply(m.chat, `🎵 Responde a un audio o video para identificar la música.`, m);

    await m.react('🔍');
    let buffer = await q.download();
    if (!buffer || !Buffer.isBuffer(buffer)) return conn.reply(m.chat, `❌ No se pudo descargar el archivo.`, m);
    if (buffer.length > 5 * 1024 * 1024) return conn.reply(m.chat, `⚠️ Archivo demasiado grande. Usa uno menor a 5MB.`, m);

    let filename = `${randomUUID()}.mp3`;
    filepath = join(tmpdir(), filename);
    await writeFile(filepath, buffer);

    let result = await acr.identify(buffer);
    if (filepath) await unlink(filepath).catch(() => {});

    if (result.status?.msg !== 'Success') return conn.reply(m.chat, '❌ No se detectó ninguna coincidencia.', m);

    let song = result.metadata?.music?.[0];
    if (!song) return conn.reply(m.chat, '❌ No se reconoció ninguna canción.', m);

    let txt = `🎧 *Canción detectada:*\n\n` +
              `• *Título:* ${song.title || 'Desconocido'}\n` +
              `• *Artista:* ${song.artists?.[0]?.name || 'Desconocido'}\n` +
              `• *Álbum:* ${song.album?.name || 'Desconocido'}\n` +
              `• *Género:* ${song.genres?.map(g => g.name).join(', ') || 'Desconocido'}\n` +
              `• *Duración:* ${msToTime(song.duration_ms) || 'Desconocido'}\n` +
              `• *Lanzamiento:* ${song.release_date || 'Desconocido'}\n` +
              `• *YouTube:* ${song.external_metadata?.youtube?.vid ? `https://youtu.be/${song.external_metadata.youtube.vid}` : 'No disponible'}\n` +
              `• *Spotify:* ${song.external_metadata?.spotify?.track?.href || 'No disponible'}`;

    let thumb = song.album?.images?.[0]?.url;

    await conn.sendMessage(m.chat, {
      image: { url: thumb || '' },
      caption: txt,
    }, { quoted: m });

  } catch (e) {
    console.error('[❌ WHATMUSIC ERROR]:', e);
    conn.reply(m.chat, `❌ Hubo un error al procesar el audio.`, m);
  } finally {
    if (filepath) await unlink(filepath).catch(() => {});
  }
};

handler.help = ['whatmusic'];
handler.tags = ['tools'];
handler.command = ['whatmusic', 'shazam'];
handler.register = true;

export default handler;