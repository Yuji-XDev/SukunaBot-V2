import fetch from 'node-fetch';

const handler = async (m, { conn, text, command }) => {
  if (!text || !text.includes('spotify.com')) {
    return m.reply('🎧 *Por favor, ingresa un enlace válido de Spotify.*');
  }

  await m.react('⏳');

  try {
    const res = await fetch(`https://api.nekorinn.my.id/downloader/spotifyplay?q=${encodeURIComponent(text)}`);
    if (!res.ok) throw new Error('API caída o sin respuesta.');

    const json = await res.json();
    if (!json.result?.downloadUrl) throw new Error('No se pudo obtener el audio.');

    const info = json.result;
    const caption = `*♬ SPOTIFY DOWNLOADER ♬*\n\n` +
      `🎼 *Título:* ${info.title || 'Desconocido'}\n` +
      `🎤 *Artista:* ${info.artists?.join(', ') || 'Desconocido'}\n` +
      `📀 *Álbum:* ${info.album?.name || 'Desconocido'}\n` +
      `🕒 *Duración:* ${info.duration || 'N/A'}\n` +
      `🔗 *Link:* ${info.url || text}`;

 
    let thumb = null;
    try {
      const img = await conn.getFile(info.cover);
      thumb = img?.data;
    } catch (e) {
      console.warn('No se pudo obtener la portada.');
    }

 
    if (thumb) {
      await conn.sendFile(m.chat, thumb, 'cover.jpg', caption, m);
    } else {
      await m.reply(caption);
    }

 
    await conn.sendMessage(m.chat, {
      audio: { url: info.downloadUrl },
      fileName: `${info.title}.mp3`,
      mimetype: 'audio/mpeg',
      ptt: false,
      contextInfo: {
        externalAdReply: {
          title: info.title,
          body: `Spotify Music`,
          thumbnail: thumb,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    await m.react('✅');
  } catch (e) {
    console.error('[SPOTIFY ERROR]', e);
    await m.reply('❌ Ocurrió un error al procesar la canción de Spotify.');
    await m.react('❌');
  }
};

handler.help = ['music <link>'];
handler.tags = ['descargas'];
handler.command = ['music'];
handler.register = true;
handler.limit = 2;

export default handler;