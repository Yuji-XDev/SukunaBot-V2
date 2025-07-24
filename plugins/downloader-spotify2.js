/*mport fetch from 'node-fetch';

const handler = async (m, { conn, text, command }) => {
  if (!text || !text.includes('spotify.com')) {
    return m.reply('🎧 *Por favor, ingresa un enlace válido de Spotify.*');
  }

  await m.react('⏳');

  try {
    const res = await fetch(`https://api.nekorinn.my.id/downloader/spotifyplay?q=${encodeURIComponent(text)}`);
    if (!res.ok) throw new Error();

    const json = await res.json();
    if (!json.result?.downloadUrl) throw new Error();

    const info = json.result;

    let thumb = null;
    try {
      const img = await conn.getFile(info.cover);
      thumb = img?.data;
    } catch (e) {
      console.warn('No se pudo obtener la portada.');
    }

    await conn.sendMessage(m.chat, {
      audio: { url: info.downloadUrl },
      fileName: `${info.title}.mp3`,
      mimetype: 'audio/mpeg',
      ptt: false,
      contextInfo: {
        externalAdReply: {
          title: info.title,
          body: `🌴 ᴅᴇsᴄᴀʀɢᴀ ᴄᴏᴍᴘʟᴇᴛᴀ 🌳`,
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

export default handler;*/

import fetch from 'node-fetch';

let handler = async (m, { conn, args, command, usedPrefix }) => {
  const text = args.join(" ");
  if (!text) {
    return m.reply(
      `╭━━〔 *🔊 Reproductor de Música* 〕━━⬣
┃ ✨ *Uso correcto del comando:*
┃ ➤ ${usedPrefix}${command} shakira soltera
╰━━━━━━━━━━━━━━━━━━⬣`
    );
  }

  await m.react('🎧');

  try {
    const res = await fetch(`https://api.nekorinn.my.id/downloader/spotifyplay?q=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.status || !json.result?.downloadUrl) {
      return m.reply(
        `╭━━〔 *🔍 Resultado no encontrado* 〕━━⬣
┃ ❌ *No se encontró nada para:* ${text}
╰━━━━━━━━━━━━━━━━━━⬣`
      );
    }

    const { title, artist, duration, cover, url } = json.result.metadata;
    const audio = json.result.downloadUrl;

    await conn.sendMessage(m.chat, {
      image: { url: cover },
      caption: `╭━━〔 *🎶 Detalles de la Canción* 〕━━⬣
┃ 🏷️ *Título:* ${title}
┃ 🎤 *Artista:* ${artist}
┃ ⏱️ *Duración:* ${duration}
┃ 🌐 *Spotify:* ${url}
╰━━━━━━━━━━━━━━━━━━⬣`
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      audio: { url: audio },
      fileName: `${title}.mp3`,
      mimetype: 'audio/mpeg',
      ptt: false,
      contextInfo: {
        externalAdReply: {
          title: title,
          body: '🌟 ᴅᴇsᴄᴀʀɢᴀ ᴄᴏᴍᴘʟᴇᴛᴀ 🎶',
          thumbnailUrl: cover,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: url
        }
      }
    }, { quoted: m });

    await m.react('✅');

  } catch (e) {
    console.error(e);
    return m.reply(
      `╭━━〔 *⚠️ Error inesperado* 〕━━⬣
┃ Ocurrió un problema al procesar tu solicitud.
┃ Por favor, intenta más tarde.
╰━━━━━━━━━━━━━━━━━━⬣`
    );
  }
};


handler.command = /^((music|song|playmusic|spotify))$/i;

handler.help = ['music <nombre>'];
handler.tags = ['descargas'];
handler.register = true;

export default handler;
