import fetch from 'node-fetch';

export async function before(m, { conn }) {
  if (!m.text || !global.prefix.test(m.text)) return;

  const usedPrefix = global.prefix.exec(m.text)[0];
  const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase();

  if (!command) return;
  if (command === "bot") return;

  const isValidCommand = (command, plugins) => {
    for (let plugin of Object.values(plugins)) {
      const cmdList = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
      if (cmdList.includes(command)) return true;
    }
    return false;
  };

  if (isValidCommand(command, global.plugins)) {
    let chat = global.db.data.chats[m.chat];
    let user = global.db.data.users[m.sender];

    if (chat?.isBanned) {
      const avisoDesactivado = `《✦》𝑬𝒍 𝑩𝒐𝒕 *${bot}* 𝒆𝒔𝒕𝒂 𝒅𝒆𝒔𝒂𝒄𝒕𝒊𝒗𝒂𝒅𝒐 𝒆𝒏 𝒆𝒔𝒕𝒆 𝒈𝒓𝒖𝒑𝒐.

> 🧠 𝑺𝒊𝒏 𝒆𝒍 𝒔𝒊𝒔𝒕𝒆𝒎𝒂 𝒂𝒄𝒕𝒊𝒗𝒐, 𝒏𝒐 𝒉𝒂𝒚 𝒋𝒖𝒆𝒈𝒐 𝒒𝒖𝒆 𝒑𝒖𝒆𝒅𝒂𝒔 𝒈𝒂𝒏𝒂𝒓.

> 🎄 𝑼𝒏 *𝒂𝒅𝒎𝒊𝒏𝒊𝒔𝒕𝒓𝒂𝒅𝒐𝒓* 𝒅𝒆𝒃𝒆 𝒂𝒄𝒕𝒊𝒗𝒂𝒓𝒍𝒐 𝒖𝒔𝒂𝒏𝒅𝒐:

> » *${usedPrefix}bot on*`;
      await m.reply(avisoDesactivado);
      return;
    }

    if (!user.commands) user.commands = 0;
    user.commands += 1;

  } else {
    const mensajesNoEncontrado = [
      `╭─⭑❨ ⚠️ 𝐂𝐨𝐦𝐚𝐧𝐝𝐨 𝐈𝐧𝐯𝐚́𝐥𝐢𝐝𝐨 ❩⭑─╮
│ 🌸 El comando *"${command}"* no existe.
│ 
│ 🧁 Usa *${usedPrefix}menu* para ver todos los comandos.
╰────────────────────────╯`,

      `╭─⭑❨ 💫 𝐂𝐨𝐦𝐚𝐧𝐝𝐨 𝐍𝐨 𝐄𝐧𝐜𝐨𝐧𝐭𝐫𝐚𝐝𝐨 ❩⭑─╮
│ 🪷 *"${command}"* no está disponible en el sistema.
│ 
│ 🫧 Revisa el menú con *${usedPrefix}menu*.
╰────────────────────────╯`,

      `╭─⭑❨ 🐰 𝐄𝐫𝐫𝐨𝐫 𝐝𝐞 𝐂𝐨𝐦𝐚𝐧𝐝𝐨 ❩⭑─╮
│ 🐚 El comando *"${command}"* no forma parte del bot.
│ 
│ 🍡 Usa *${usedPrefix}menu* para orientarte mejor.
╰────────────────────────╯`,

      `⭑❨ 🌙 𝐂𝐨𝐦𝐚𝐧𝐝𝐨 𝐃𝐞𝐬𝐜𝐨𝐧𝐨𝐜𝐢𝐝𝐨 ❩⭑
🧸 No se encontró *"${command}"* en la lista de comandos.

🦢 Consulta el menú con *${usedPrefix}menu*.`
    ];

    const mensaje = mensajesNoEncontrado[Math.floor(Math.random() * mensajesNoEncontrado.length)];

    const miniLogo = await fetch(global.icono || 'https://files.catbox.moe/bs0ecf.png')
      .then(res => res.buffer())
      .catch(() => null);

    await conn.sendMessage(m.chat, {
      text: mensaje,
      footer: '⛩️ Sukuna Bot MD 🎄',
      buttons: [
        { buttonId: '#menu', buttonText: { displayText: '🌾 ᴍᴇɴᴜ ᴀʟʟ' }, type: 1 },
      ],
      headerType: 1,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: global.packname || '📦 ꜱᴜᴋᴜɴᴀ ʙᴏᴛ ᴍᴅ',
          body: global.dev || '👑 ᴄʀᴇᴀᴅᴏ ᴘᴏʀ ʙʟᴀᴄᴋ',
          thumbnailUrl: global.icono || 'https://files.catbox.moe/bs0ecf.png',
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: true,
          jpegThumbnail: miniLogo,
          mediaUrl: 'https://whatsapp.com/channel/0029VbAtbPA84OmJSLiHis2U',
          sourceUrl: 'https://whatsapp.com/channel/0029VbAtbPA84OmJSLiHis2U'
        }
      }
    }, { quoted: m });
  }
}