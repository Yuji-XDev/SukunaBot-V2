let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `🔥 Ingresa un número.\n\n*Ejemplo:* ${usedPrefix + command} @user`, m, rcanal);
  }

  let numero = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';

  try {
    let [user] = await conn.onWhatsApp(numero);
    if (!user?.lid) {
      return conn.reply(m.chat, '❌ No se pudo obtener el LID. Asegúrate de que el número sea correcto y esté registrado en WhatsApp.', m);
    }

    conn.reply(m.chat, `✅ *LID:*\n ${user.lid}`, m);
  } catch (e) {
    console.error(e);
    conn.reply(m.chat, '❌ Ocurrió un error al obtener el LID.', m);
  }
};

handler.command = ['lid']
handler.help = ['lid']
handler.tags = ['lid'];
export default handler;