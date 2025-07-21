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
┃ 📀 𝙐𝙨𝙖 𝙚𝙡 𝙘𝙤𝙢𝙖𝙣𝙙𝙤 𝙖𝙨í:
┃ 🧪 ${usedPrefix + command} <nombre>
┃ 💿 𝙀𝙟𝙚𝙢𝙥𝙡𝙤: ${usedPrefix + command} Enemy - Imagine Dragons
╰━━━━━━━━━━━━━━━━━━━━⬣
    `.trim());
  }

  m.react('🎧');

  try {
    const res = await fetch(`https://api.nekorinn.my.id/downloader/spotifyplay?q=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.result || !json.result.downloadUrl) {
      throw new Error('❌ No se encontró la canción.');
    }

    const { title, artist, duration, downloadUrl, thumbnail } = json.result;

    if (cacheSpotify.has(downloadUrl)) {
      return m.reply(`
╭━〔 *⚠️ 𝘾𝘼𝙉𝘾𝙄Ó𝙉 𝙍𝙀𝙋𝙀𝙏𝙄𝘿𝘼* 〕━⬣
┃ 🧠 𝙔𝙖 𝙛𝙪𝙚 𝙚𝙣𝙫𝙞𝙖𝙙𝙖 𝙧𝙚𝙘𝙞𝙚𝙣𝙩𝙚𝙢𝙚𝙣𝙩𝙚
╰━━━━━━━━━━━━━━━━━━━━⬣
      `.trim());
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
          body: `🌴 ᴅᴇꜱᴄᴀʀɢᴀ ᴄᴏᴍᴘʟᴇᴛᴀ 🌳`,
          thumbnail: await (await fetch(thumbnail)).buffer(),
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    await m.reply(`
╭━━━〔 *🎶 𝙎𝙋𝙊𝙏𝙄𝙁𝙔 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝘿𝘼* 〕━━⬣
┃ 🎵 𝙏í𝙩𝙪𝙡𝙤: *${title}*
┃ 🎙️ 𝘼𝙧𝙩𝙞𝙨𝙩𝙖: *${artist}*
┃ ⏱️ 𝘿𝙪𝙧𝙖𝙘𝙞ó𝙣: *${duration}*
┃ 🧩 𝙀𝙨𝙩𝙖𝙙𝙤: 𝘿𝙚𝙨𝙘𝙖𝙧𝙜𝙖 𝙚𝙭𝙞𝙩𝙤𝙨𝙖 ✅
╰━━━━━━━━━━━━━━━━━━━━⬣
    `.trim());

    m.react('✅');
  } catch (err) {
    console.error(err);
    await m.reply(`
╭━━〔 *⚠️ 𝙀𝙍𝙍𝙊𝙍* 〕━━⬣
┃ 😿 𝙉𝙤 𝙨𝙚 𝙥𝙪𝙙𝙤 𝙤𝙗𝙩𝙚𝙣𝙚𝙧 𝙡𝙖 𝙘𝙖𝙣𝙘𝙞ó𝙣.
┃ 📡 𝙍𝙚𝙫𝙞𝙨𝙖 𝙚𝙡 𝙣𝙤𝙢𝙗𝙧𝙚 𝙤 𝙞𝙣𝙩𝙚𝙣𝙩𝙖 𝙢á𝙨 𝙩𝙖𝙧𝙙𝙚.
╰━━━━━━━━━━━━━━━━━━━━⬣
    `.trim());
    m.react('❌');
  }
};

handler.help = ['music *<nombre>*'];
handler.tags = ['descargas'];
handler.command = ['music'];

export default handler;