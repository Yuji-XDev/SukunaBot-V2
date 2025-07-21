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

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`
╭━━〔 *⛔ 𝙁𝘼𝙇𝙏𝘼 𝙀𝙇 𝙉𝙊𝙈𝘽𝙍𝙀 𝘿𝙀 𝙇𝘼 𝘾𝘼𝙉𝘾𝙄𝙊𝙉* 〕━━⬣
┃ 📀 Usa el comando así:
┃ 🧪 ${usedPrefix + command} <nombre>
┃ 💿 Ejemplo: ${usedPrefix + command} Enemy - Imagine Dragons
╰━━━━━━━━━━━━━━━━━━━━⬣
    `);
  }

  m.react('🎧');

  try {
    let res = await fetch(`https://api.nekorinn.my.id/downloader/spotifyplay?q=${encodeURIComponent(text)}`);
    let json = await res.json();

 
    if (!json?.result?.downloadUrl) {
      let fallback = await fetch(`https://api.lolhuman.xyz/api/spotifysearch?apikey=GataDios&query=${encodeURIComponent(text)}`);
      let search = await fallback.json();
      if (!search.result || !search.result[0]?.link) throw '❌ No se pudo encontrar la canción.';

      let link = search.result[0].link;
      let backup = await fetch(`https://api.stellarwa.xyz/dow/spotify?url=${link}&apikey=stellar-7SQpl4Ah`);
      let data = await backup.json();
      if (!data.datos?.download) throw '❌ No se pudo descargar la canción.';

      json = {
        result: {
          title: data.datos.título,
          artist: data.datos.artista,
          duration: data.datos.duración,
          thumbnail: data.datos.imagen,
          downloadUrl: data.datos.download
        }
      };
    }

    const { title, artist, duration, downloadUrl, thumbnail } = json.result;

    if (cacheSpotify.has(downloadUrl)) {
      return m.reply(`
╭━〔 *⚠️ 𝘾𝘼𝙉𝘾𝙄Ó𝙉 𝙍𝙀𝙋𝙀𝙏𝙄𝘿𝘼* 〕━⬣
┃ 🧠 Ya fue enviada recientemente
╰━━━━━━━━━━━━━━━━━━━━⬣
      `);
    }

    cacheSpotify.add(downloadUrl);
    setTimeout(() => cacheSpotify.delete(downloadUrl), 60 * 1000);

    await conn.sendMessage(m.chat, {
      audio: { url: downloadUrl },
      fileName: `${title}.mp3`,
      mimetype: 'audio/mpeg',
      ptt: false,
      contextInfo: {
        externalAdReply: {
          title: title,
          body: `🌴 Descarga de Spotify completa`,
          thumbnail: await (await fetch(thumbnail)).buffer(),
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    await m.reply(`
╭━━━〔 *🎶 𝙎𝙋𝙊𝙏𝙄𝙁𝙔 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝘿𝘼* 〕━━⬣
┃ 🎵 Título: *${title}*
┃ 🎙️ Artista: *${artist}*
┃ ⏱️ Duración: *${duration}*
┃ ✅ Estado: Descarga exitosa
╰━━━━━━━━━━━━━━━━━━━━⬣
    `);

    m.react('✅');
  } catch (err) {
    console.error(err);
    await m.reply(`
╭━━〔 *⚠️ 𝙀𝙍𝙍𝙊𝙍* 〕━━⬣
┃ 😿 No se pudo obtener la canción.
┃ 📡 Revisa el nombre o intenta más tarde.
╰━━━━━━━━━━━━━━━━━━━━⬣
    `);
    m.react('❌');
  }
};

handler.help = ['music'];
handler.tags = ['descargas'];
handler.command = ['music'];

export default handler;