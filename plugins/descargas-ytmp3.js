import fetch from 'node-fetch';
import yts from 'yt-search';

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text) {
      return conn.reply(m.chat, `*⛩️ Ingresa un link de YouTub'e 🌲*`, m, rcanal);
    }

    await conn.sendMessage(m.chat, { react: { text: '⏱️', key: m.key }});

    const search = await yts(text);
    const video = search.videos[0];

    if (!video) {
      return conn.reply(m.chat, '❌ No se encontraron resultados para tu búsqueda.', m);
    }

    const { title, timestamp, views, ago, url, author, thumbnail } = video;

    const canal = author?.name || 'Desconocido';
    const vistas = views.toLocaleString();

    const textoInfo = `╭━━〔 *⛩️  YOUTUBE - MP3 🌪️* 〕━━⬣\n`
      + `┃ ✦🌾 *Título:* ${title}\n`
      + `┃ ✦⏱️ *Duración:* ${timestamp}\n`
      + `┃ ✦🍰 *Canal:* ${canal}\n`
      + `┃ ✦🌧️ *Vistas:* ${vistas}\n`
      + `┃ ✦🌳 *Publicado:* ${ago}\n`
      + `┃ ✦🔗 *Enlace:* ${url}\n`
      + `╰━━━━━━━━━━━━━━━━━━⬣\n\n> *➭ El audio se está enviando, espera un momento...*`;

    const thumbnailBuffer = await (await fetch(thumbnail)).buffer();

    await conn.sendFile(m.chat, thumbnailBuffer, 'ytmp3.jpg', textoInfo, m);

    const api = `https://api.stellarwa.xyz/dow/ytmp3?url=${url}&apikey=stellar-7SQpl4Ah`;
    const res = await fetch(api);
    const json = await res.json();

    if (!json || !json.data || !json.data.dl) {
      throw new Error('⚠️ No se pudo generar el enlace de descarga.');
    }

    await conn.sendMessage(m.chat, {
      audio: { url: json.data.dl },
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: title,
          body: 'YOUTUBE • MP3',
          mediaType: 1,
          thumbnail: thumbnailBuffer,
          mediaUrl: url,
          sourceUrl: url,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: fkontak });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key }});

  } catch (e) {
    console.error('❌ Error en ytmp3:', e);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key }});
    return conn.reply(m.chat, `❌ *Error:* ${e.message}`, m);
  }
};

handler.command = ['ytmp3'];
handler.tags = ['descargas'];
handler.help = ['ytmp3 <nombre o link>'];

export default handler;