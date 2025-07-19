let handler = async (m, { conn, args }) => {
  let userId = m.mentionedJid?.[0] || m.sender
  let user = global.db.data.users[userId]
  let name = await conn.getName(userId)
  let img = 'https://files.catbox.moe/ha863t.jpg'


  let botname = global.botname || 'Sukuna Bot MD'
  let banner = global.banner || 'https://files.catbox.moe/ha863t.jpg'
  let redes = global.redes || 'https://github.com'

  let prueba = `
   
> ${dev}
`.trim()

  let buttons = [
    { buttonId: '.perfil', buttonText: { displayText: ' perfil ' }, type: 1 },
    { buttonId: '.menu', buttonText: { displayText: 'menu all' }, type: 1 }
  ]

  await conn.sendMessage(m.chat, {
    video: { url: img },
    caption: prueba,
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