let handler = async (m, { conn, args }) => {
  let userId = m.mentionedJid?.[0] || m.sender
  let user = global.db.data.users[userId]
  let name = await conn.getName(userId) // Se necesita await
  let img = 'https://files.catbox.moe/ha863t.jpg'


  let botname = global.botname || 'Sukuna Bot MD'
  let banner = global.banner || 'https://files.catbox.moe/ha863t.jpg'
  let redes = global.redes || 'https://github.com'

  let perfiltext = ` ${name}
     ╔═══════ • ° ❁⊕❁ ° • ═══════╗
        💥⃢᭄͜═✩═[𝐌𝐄𝐍𝐔-𝐒𝐄𝐀𝐑𝐂𝐇]═✩═⃟⃢᭄͜🔎
    ╚═══════ • ° ❁⊕❁ ° • ═══════╝
      
> 🔍⊹ *𝐂𝐨𝐦𝐚𝐧𝐝𝐨𝐬 𝐝𝐞 𝐁𝐮́𝐬𝐪𝐮𝐞𝐝𝐚* ⊹🔎
  
━⃨⃛━╼─╍╍╍─╍▻◅╍─╍╍╼╼━⃨⃛╍╍
യ ׄ🌲˚ #sᴇᴀʀᴄʜʜᴇɴᴛᴀɪ
യ ׄ🌲˚ #ᴄᴜᴇᴠᴀɴᴀsᴇᴀʀᴄʜ
യ ׄ🌲˚ #ɢɪᴛʜᴜʙsᴇᴀʀᴄʜ
യ ׄ🌲˚ #ɢᴏᴏɢʟᴇ
യ ׄ🌲˚ #ɪᴍᴀɢᴇɴ *<ǫᴜᴇʀʏ>*
യ ׄ🌲˚ #ɪɴғᴏᴀɴɪᴍᴇ
യ ׄ🌲˚ #ɴᴘᴍᴊs
യ ׄ🌲˚ #ᴘɪɴᴛᴇʀᴇsᴛ  *<ǫᴜᴇʀʏ>*
യ ׄ🌲˚ #ᴘᴏʀɴʜᴜʙsᴇᴀʀᴄʜ
യ ׄ🌲˚ #sᴏᴜɴᴅᴄʟᴏᴜᴅsᴇᴀʀᴄʜ *<ᴛᴇxᴛᴏ>*
യ ׄ🌲˚ #sᴘᴏᴛɪғʏsᴇᴀʀᴄʜ *<ᴛᴇxᴛᴏ>*
യ ׄ🌲˚ #ᴛɪᴋᴛᴏᴋsᴇᴀʀᴄʜ *<ᴛᴇxᴛᴏ>*
യ ׄ🌲˚ #ᴛᴡᴇᴇᴛᴘᴏsᴛs
യ ׄ🌲˚ #xɴxxsᴇᴀʀᴄʜ *<ǫᴜᴇʀʏ>*
യ ׄ🌲˚ #xᴠɪᴅᴇᴏssᴇᴀʀᴄʜ
യ ׄ🌲˚ #ʏᴛsᴇᴀʀᴄʜ
യ ׄ🌲˚ #ʏᴛsᴇᴀʀᴄʜ2 *<ᴛᴇxᴛ>*
യ ׄ🌲˚ #ᴍᴏᴅs *<ǫᴜᴇʀʏ>*
യ ׄ🌲˚ #ɢɴᴜʟᴀ
യ ׄ🌲˚ #ᴀᴘᴋsᴇᴀʀᴄʜ
യ ׄ🌲˚ #ᴡɪᴋɪs
യ ׄ🌲˚ #ғᴅʀᴏɪᴅsᴇᴀʀᴄʜ *<ᴛᴇʀᴍɪɴᴏ>*
യ ׄ🌲˚ #ᴍᴏᴠɪᴇ *<ᴛᴇʀᴍɪɴᴏ>*
യ ׄ🌲˚ #ʜᴀᴘᴘʏᴍᴏᴅsᴇᴀʀᴄʜ *<ʙᴜsǫᴜᴇᴅᴀ>*
യ ׄ🌲˚ #ᴄɪɴᴇᴄᴀʟɪᴅᴀᴅsᴇᴀʀᴄʜ *<ʙᴜsǫᴜᴇᴅᴀ>*
യ ׄ🌲˚ #ʏᴀᴏᴏsᴇᴀʀᴄʜ *<ʙᴜsǫᴜᴇᴅᴀ>*

> ${dev}
`.trim()

  let buttons = [
    { buttonId: '.perfil', buttonText: { displayText: '♥ perfil ♥' }, type: 1 },
    { buttonId: '.menu', buttonText: { displayText: '♦ menu ♦' }, type: 1 }
  ]

  await conn.sendMessage(m.chat, {
    video: { url: img },
    caption: perfiltext,
    gifPlayback: true,
    buttons: buttons,
    headerType: 4,
    contextInfo: {
      mentionedJid: [m.sender, userId],
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: global.canalIdM,
        newsletterName: botname,
        serverMessageId: -1,
      },
      forwardingScore: 999,
      externalAdReply: {
        title: botname,
        body: dev,
        thumbnailUrl: banner,
        sourceUrl: redes,
        mediaType: 1,
        showAdAttribution: true,
        renderLargerThumbnail: true,
      },
    }
  }, { quoted: m })
}

handler.help = ['ayuda']
handler.tags = ['main']
handler.command = ['ayuda']

export default handler