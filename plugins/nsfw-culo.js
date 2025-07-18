import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command }) => {
  m.react('🕑');

  const gp = global.db.data.chats[m.chat] || {};
  if (!gp.nsfw && m.isGroup) return m.reply('[❗] *El contenido `NSFW` está desactivado en este grupo.*\n> Un administrador puede activarlo con el comando » *#nsfw on*');

  let txt = '🍑 *Disfruta tu ración de... arte digital 🙈*';
  let img = 'https://dark-core-api.vercel.app/api/random/ass?key=api';

  m.react('✅');
  
  await conn.sendMessage(m.chat, {
    image: { url: img },
    caption: txt,
    footer: '🔥 Sukuna Bot MD',
    buttons: [
      {
        buttonId: '#culo',
        buttonText: { displayText: '⏩ Siguiente' },
        type: 1
      }
    ],
    headerType: 4
  }, { quoted: m });
};

handler.help = ['culo'];
handler.tags = ['nsfw'];
handler.command = ['culo'];

export default handler;