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

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    await conn.sendMessage(m.chat, { text: `🎧 Ingresa el enlace de una canción de Spotify.\n\n📌 Ejemplo:\n${usedPrefix + command} https://open.spotify.com/track/7HxY2FrvAhEvjxGa3YR93q` }, { quoted: m });
    return;
  }

  const url = args[0];
  if (!url.includes('spotify.com')) return;

  try {
    const api = `https://api.sylphy.xyz/download/spotify?url=${encodeURIComponent(url)}&apikey=sylphy-c519`;
    const res = await fetch(api);
    const json = await res.json();

    if (!json.status || !json.data?.audio) return;

    const { title, artist, duration, image, audio } = json.data;

    let caption = `
🎵 *Título:* ${title}
🎤 *Artista:* ${artist}
⏱️ *Duración:* ${duration}
🔗 *Enlace:* ${url}
`.trim();

    await conn.sendFile(m.chat, image, 'cover.jpg', caption, m); // Imagen
    await conn.sendMessage(m.chat, { audio: { url: audio }, mimetype: 'audio/mp4' }, { quoted: m });
  } catch (e) {
    console.error(e);
  }
};

handler.help = ['music'].map(v => v + ' <enlace>');
handler.tags = ['descargas'];
handler.command = /^music$/i;

export default handler;