/*import fetch from 'node-fetch';

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

const cacheSpotify = new Set();

let handler = (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`
〔 *⛔ FALTA NOMBRE DE LA CANCIÓN* 〕
 📀 *Usa el comando así:*
 ⚙️ ${usedPrefix + command} <nombre de la canción>
 🧪 *Ejemplo:* ${usedPrefix + command} Enemy - Imagine Dragons
    `.trim());
  }

  m.react('🦠');

  fetch(`https://api.nekorinn.my.id/downloader/spotifyplay?q=${encodeURIComponent(text)}`)
    .then(res => res.json())
    .then(json => {
      if (!json.result || !json.result.downloadUrl) {
        throw new Error('❌ No se encontró la canción.');
      }

      const { title, artist, duration, downloadUrl } = json.result;

      if (cacheSpotify.has(downloadUrl)) {
        return m.reply(`
╭━〔 *⚠️ CANCIÓN REPETIDA* 〕━⬣
┃ 🧠 *Ya fue enviada recientemente.*
┃ 🧼 *Evita repetir la misma canción.*
╰━━━━━━━━━━━━━━━━━━━━⬣
        `.trim());
      }

      // Guardar en caché temporal
      cacheSpotify.add(downloadUrl);
      setTimeout(() => cacheSpotify.delete(downloadUrl), 60 * 1000); // Auto-limpiar en 1 minuto

      conn.sendMessage(m.chat, {
        audio: { url: downloadUrl },
        mimetype: 'audio/mpeg'
      }, { quoted: m });

      m.reply(`
╭━━━〔 *🔊 SPOTIFY DESCARGADO* 〕━━⬣
┃ 🎵 *Título:* ${title}
┃ 🎙️ *Artista:* ${artist}
┃ ⏱️ *Duración:* ${duration}
┃ 🧩 *Estado:* ¡Descarga exitosa!
╰━━━━━━━━━━━━━━━━━━━━⬣
      `.trim());

      m.react('🎶');
    })
    .catch(err => {
      console.error(err);
      m.reply(`
╭━━〔 *⚠️ ERROR* 〕━━⬣
┃ 😿 No se pudo obtener la canción.
┃ 📡 Revisa el nombre o intenta más tarde.
╰━━━━━━━━━━━━━━━━━━━━⬣
      `.trim());
      m.react('❌');
    });
};

handler.help = ['music *<nombre>*'];
handler.tags = ['descargas'];
handler.command = ['music'];

export default handler;