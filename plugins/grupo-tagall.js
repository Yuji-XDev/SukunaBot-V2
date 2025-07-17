import fetch from 'node-fetch';

const handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command, usedPrefix }) => {
  if (usedPrefix.toLowerCase() === 'a') return;

  const customEmoji = global.db.data.chats[m.chat]?.customEmoji || '🌲';
  await m.react(customEmoji);

  if (!(isAdmin || isOwner)) {
    global.dfail?.('admin', m, conn);
    throw false;
  }

  const pesan = args.length ? args.join(' ') : 'Pu***';
  const mj = `°◦⃝📑 *𝙼𝙴𝙽𝚂𝙰𝙹𝙴:*\n│ ${pesan}`;
  const groupName = await conn.getName(m.chat);

 
  let teks = [
  `╭───〔 🔱 𝙎𝙐𝙆𝙐𝙉𝘼 𝘽𝙊𝙏 ⚡ 〕───╮`,
  `│ 🩸 𝙈𝙀𝙉𝘾𝙄𝙊𝙉 𝘿𝙀𝙈𝙊𝙉í𝘼𝘾𝘼`,
  `│ 🕷️ 𝙈𝙄𝙀𝙈𝘽𝙍𝙊𝙎: *${participants.length}*`,
  `│ 🕸️ 𝙂𝙍𝙐𝙋𝙊: *${groupName}*`,
  `├⫸ 👁️‍🗨️ ${mj}`,
  `╰─➤`
  ];

  for (const mem of participants) {
    teks.push(`│ യ ׄ${customEmoji}˚ @${mem.id.split('@')[0]}`);
  }

  teks.push(`╰──────────────༓`);
  const finalText = teks.join('\n');

  await conn.sendMessage(m.chat, {
    text: finalText,
    mentions: participants.map(p => p.id),
    contextInfo: {
      mentionedJid: participants.map(p => p.id),
      externalAdReply: {
        title: '✧ 𝐈𝐍𝐕𝐎𝐂𝐀𝐍𝐃𝐎 𝐄𝐒𝐏𝐈𝐑𝐈𝐓𝐔𝐒ꦿ✧',
        body: '🌴 ʙᴏᴛ ᴅᴇ ᴛʜᴇ_ʙʟᴀᴄᴋ ⚡',
        thumbnailUrl: logo,
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true,
        sourceUrl: 'https://whatsapp.com/channel/0029VbAtbPA84OmJSLiHis2U',
      }
    }
  }, { quoted: fkontak });
};

handler.help = ['todos *<mensaje opcional>*'];
handler.tags = ['grupo'];
handler.command = ['todos', 'invocar', 'tagall', 'marcar'];
handler.admin = true;
handler.group = true;

export default handler;