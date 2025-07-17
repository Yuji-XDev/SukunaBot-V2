let handler = async (m, { conn, usedPrefix }) => {
  const imgurl = 'https://files.catbox.moe/3gxuzq.jpg';
  const texto = `┌──〔🛰️ ᴘʀᴏғɪʟᴇ ɴᴏᴅᴇ ɪɴᴛᴇʀғᴀᴄᴇ〕──┐
│ [🎂] ${usedPrefix}setbirth     → ᴀñᴀᴅɪʀ ᴄᴜᴍᴘʟᴇᴀñᴏs
│ [🧨] ${usedPrefix}delbirth     → ʙᴏʀʀᴀʀ ᴄᴜᴍᴘʟᴇᴀñᴏs
│ [📄] ${usedPrefix}setdesc      → ᴇsᴄʀɪʙɪʀ ʙɪᴏɢʀᴀғɪ́ᴀ
│ [🔥] ${usedPrefix}deldesc      → ᴇʟɪᴍɪɴᴀʀ ʙɪᴏɢʀᴀғɪ́ᴀ
│ [👤] ${usedPrefix}setgenre     → ᴅᴇғɪɴɪʀ ɢᴇ́ɴᴇʀᴏ
│ [💀] ${usedPrefix}delgenre     → ʙᴏʀʀᴀʀ ɢᴇ́ɴᴇʀᴏ
│ [💍] ${usedPrefix}marry        → ᴄᴀsᴀʀsᴇ ᴄᴏɴ ᴀʟɢᴜɪᴇɴ
│ [☠️] ${usedPrefix}divorce      → ᴅɪᴠᴏʀᴄɪᴀʀsᴇ
│
│ 🧩 STATUS: ᴏɴʟɪɴᴇ | ᴀᴜᴛʜ: ✅
└──⟦ SΣC MODULΣ vX.1337 [ACTIVE] ⟧──┘`;

  await conn.sendMessage(m.chat, {
    image: { url: imgurl },
    caption: texto,
    footer: '⛩️ Sukuna Bot MD',
    buttons: [
      { buttonId: '#menu', buttonText: { displayText: '📜 ᴍᴇɴᴜ' }, type: 1 },
      { buttonId: '#perfil', buttonText: { displayText: '👤 ᴘᴇʀғɪʟ' }, type: 1 },
    ],
    headerType: 4,
    contextInfo: {
      mentionedJid: [m.sender],
      externalAdReply: {
        title: global.packname,
        body: global.dev,
        thumbnailUrl: global.icono || imgurl,
        mediaType: 1,
        renderLargerThumbnail: false,
        showAdAttribution: true,
        mediaUrl: 'https://whatsapp.com/channel/0029VbAtbPA84OmJSLiHis2U',
        sourceUrl: 'https://whatsapp.com/channel/0029VbAtbPA84OmJSLiHis2U'
      }
    }
  }, { quoted: m });

  await m.react('👻');
};

handler.command = ['perfildates', 'menuperfil'];
handler.tags = ['rg'];
handler.help = ['perfildates'];
handler.coin = 3;

export default handler;