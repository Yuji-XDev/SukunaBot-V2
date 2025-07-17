var handler = async (m, { conn, participants, usedPrefix, command }) => {
  // Verifica si se mencionó o respondió a alguien
  if (!m.mentionedJid[0] && !m.quoted) {
    return conn.reply(m.chat, `📌 *¡Hey tú!*  
¿A quién se supone que debo sacar? 🙄  
Menciona a alguien o respóndeme un mensaje~ 💅`, m);
  }

  let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;

  const groupInfo = await conn.groupMetadata(m.chat);
  const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
  const ownerBot = global.owner[0][0] + '@s.whatsapp.net';

  // Protecciones especiales al estilo Nino ✨
  if (user === conn.user.jid) {
    return conn.reply(m.chat, `🙃 ¿En serio quieres que me saque yo solita? Qué gracioso... pero no.`, m);
  }

  if (user === ownerGroup) {
    return conn.reply(m.chat, `👑 *¡Ni se te ocurra!* Ese es el dueño del grupo. Incluso yo tengo límites, ¿sabes? 🙄`, m);
  }

  if (user === ownerBot) {
    return conn.reply(m.chat, `🛡️ *¿Eh?* ¡Ese es mi creador! No lo voy a sacar, ¡jamás! 😤`, m);
  }

  // Ejecuta la expulsión
  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
    conn.reply(m.chat, `💥 ¡Listo! Usuario eliminado con estilo~ 💖`, m);
  } catch (e) {
    conn.reply(m.chat, `❌ *¡Ups!* No pude sacarlo… tal vez no tengo permisos suficientes 😔`, m);
  }
};

handler.help = ['kick'];
handler.tags = ['grupo'];
handler.command = ['kick', 'echar', 'hechar', 'sacar', 'ban'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;
handler.register = true;

export default handler;
