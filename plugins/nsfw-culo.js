let handler = async (m, { conn, usedPrefix, command }) => {

  let img = 'https://dark-core-api.vercel.app/api/random/ass?key=api';
  let text = '🍑 *Disfruta tu ración de... arte digital 🙈*';
  let footer = 'Solicitado por ' + m.pushName;

  let message = {
    caption: text,
    image: { url: img },
    footer: footer,
    buttons: [
      {
        buttonId: usedPrefix + command,
        buttonText: { displayText: '➡️ Siguiente' },
        type: 1
      }
    ],
    headerType: 4
  };

  await conn.sendMessage(m.chat, message, { quoted: m });
  m.react('✅');
};

handler.help = ['culo'];
handler.tags = ['nsfw'];
handler.command = ['culo'];

export default handler;