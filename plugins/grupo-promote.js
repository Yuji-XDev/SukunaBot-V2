//código creado por 🐉𝙉𝙚𝙤𝙏𝙤𝙠𝙮𝙤 𝘽𝙚𝙖𝙩𝙨
var handler = async (m, { conn, usedPrefix, command, text }) => {
  let number;

  if (!text && !m.quoted) {
    return conn.reply(m.chat, `📌 *¿Eh?*  
Debes mencionar o responder a alguien si quieres que lo haga admin~ 💅`, m);
  }

  if (isNaN(text)) {
    if (text.includes('@')) {
      number = text.split('@')[1];
    }
  } else {
    number = text;
  }

  if (!number && m.quoted) {
    number = m.quoted.sender.split('@')[0];
  }

  if (!number) {
    return conn.reply(m.chat, `🙃 *Nop~* No encontré a nadie válido para promover.`, m);
  }

  if (number.length > 13 || number.length < 10) {
    return conn.reply(m.chat, `⚠️ *Ese número no es válido, baka...* 😤`, m);
  }

  let user = number + '@s.whatsapp.net';

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
    conn.reply(m.chat, `🎀 *¡Listo~!*  
@${number} ahora es admin del grupo. ¡Más te vale que no abuses de tu poder! 😌`, m, { mentions: [user] });
  } catch (e) {
    conn.reply(m.chat, `❌ *¡Oops!* No pude hacer admin a esa persona...  
¿Estás segura de que tengo permisos suficientes? 😔`, m);
  }
};

handler.help = ['promote'];
handler.tags = ['grupo'];
handler.command = ['promote', 'darpija', 'promover'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.fail = null;

export default handler;
