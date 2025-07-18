let handler = async (m, { conn, usedPrefix, command }) => {

  let img = 'https://dark-core-api.vercel.app/api/random/ass?key=api';
  let text = '🍑 *Disfruta tu ración de... arte digital 🙈*';

  const buttonMessage = {
    image: { url: img },
    caption: text,
    footer: 'Solicitado por ' + m.pushName,
    buttons: [
      {
        buttonId: '#culo',
        buttonText: { displayText: '➡️ Siguiente' },
        type: 1
      }
    ]
  };

  await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
  m.react('✅');
};

handler.help = ['culo'];
handler.tags = ['nsfw'];
handler.command = ['culo'];

export default handler;