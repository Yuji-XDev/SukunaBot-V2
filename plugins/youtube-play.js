import yts from 'yt-search';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `*❗ Ingresa un título para buscar en YouTube.*`, m, rcanal);
  }

  try {
    const search = await yts(text);
    const videoInfo = search.all?.[0];

    if (!videoInfo) {
      return conn.reply(m.chat, '⚠️ No se encontró ningún video. Intenta con otro título.', m);
    }

  
    const title = videoInfo.title || 'Título desconocido';
    const duration = videoInfo.timestamp || 'Duración desconocida';
    const views = typeof videoInfo.views === 'number' ? videoInfo.views.toLocaleString() : 'No disponible';
    const canal = videoInfo.author?.name || 'Autor desconocido';
    const ago = videoInfo.ago || 'Desconocido';
    const url = videoInfo.url || '';
    const thumbnail = videoInfo.thumbnail || null;

    const body = `╭  ✦ \`\`\`Result Play\`\`\` ✦  ╮  
˖✿✨ *Titulo:* ${title}
˖✿🕰️ *Duracion:* ${duration}
˖✿📊 *Vistas:* ${views}
˖✿🎤 *Canal:* ${canal}
˖✿📅 *Publicado:* ${ago}
˖✿🔗 *Link:* ${url}`;

    await conn.sendMessage(
      m.chat,
      {
        image: { url: thumbnail },
        caption: body,
        footer: `© ⍴᥆ᥕᥱrᥱძ ᑲᥡ sʜᴀᴅᴏᴡ•ᴄᴏʀᴇ`,
        buttons: [
          { buttonId: `${usedPrefix}ytmp3 ${url}`, buttonText: { displayText: '🎧 ᴅᴇsᴄᴀʀɢᴀʀ ᴀᴜᴅɪᴏ' }, type: 1 },
          { buttonId: `${usedPrefix}ytmp4 ${url}`, buttonText: { displayText: '📽️ ᴅᴇsᴄᴀʀɢᴀʀ ᴠɪᴅᴇ' }, type: 1 },
          { buttonId: `${usedPrefix}ytmp3doc ${url}`, buttonText: { displayText: '🌴 ᴀᴜᴅɪᴏ • ᴍᴘ3 ᴅᴏᴄ' }, type: 1 },
          { buttonId: `${usedPrefix}ytmp4doc ${url}`, buttonText: { displayText: '🌴 ᴀᴜᴅɪᴏ • ᴍᴘ4 ᴅᴏᴄ' }, type: 1 },
        ],
        viewOnce: true,
        headerType: 4,
      },
      { quoted: m }
    );

    await m.react('✅');
  } catch (error) {
    console.error(error);
    return conn.reply(m.chat, `❗ Ocurrió un error: ${error.message}`, m);
  }
};

handler.command = ['play3'];
handler.tags = ['descargas'];
handler.limit = 6;

export default handler;