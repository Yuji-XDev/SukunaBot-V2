import moment from 'moment-timezone'

const tagsMap = {
  main: '💗 Información',
  jadibot: '🌟 Sub Bot',
  downloader: '📥 Descargas',
  game: '🎮 Juegos',
  gacha: '🎲 Gacha RPG',
  rg: '🔰 Registro',
  group: '👥 Grupos',
  nable: '🎛️ Funciones',
  nsfw: '🔞 NSFW +18',
  buscadores: '🔎 Buscadores',
  sticker: '🌈 Stickers',
  econ: '💰 Economía',
  convertidor: '🌀 Convertidores',
  logo: '🎀 Logos Kawaii',
  tools: '🧰 Herramientas',
  randow: '🎁 Random',
  efec: '🎶 Efectos de Audio',
  owner: '👑 Creador'
}

let handler = async (m, { conn }) => {
  const userId = m.mentionedJid?.[0] || m.sender
  const user = global.db.data.users[userId] || {}
  const name = await conn.getName(userId)
  const botname = conn.user?.name || 'NinoBot 🌸'
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY')
  const hora = moment.tz('America/Lima').format('HH:mm:ss')
  const uptime = clockString(process.uptime() * 1000)
  const totalreg = Object.keys(global.db.data.users).length
  const limit = user.limite || 0

  const botTag = conn.user?.jid?.split('@')[0] || 'bot'
  const botOfc = conn.user?.id === global.conn?.user?.id
    ? `💫 *Bot Oficial:* wa.me/${botTag}`
    : `🔗 *Sub Bot de:* wa.me/${global.conn?.user?.jid?.split('@')[0]}`

  const grouped = {}
  const plugins = Object.values(global.plugins).filter(p => !p.disabled)

  for (const plugin of plugins) {
    const cmds = Array.isArray(plugin.command) ? plugin.command : [plugin.command]
    if (!cmds) continue
    const tagList = Array.isArray(plugin.tags) ? plugin.tags : []
    const tag = tagList[0] || '__otros__'
    if (!grouped[tag]) grouped[tag] = []
    for (const cmd of cmds) {
      if (typeof cmd !== 'string') continue
      grouped[tag].push(`🌸 .${cmd}`)
    }
  }

 
  let text = `╭─❀「 *Menú Principal de ${global.botname}* 」❀─╮
🌼 Konichiwaa~ *${name}*~! (≧◡≦)
💖 Soy *${global.botname}*, tu asistente~

📅 Fecha linda: *${fecha}*
⏰ Hora Perú: *${hora}*
🎀 Usuarios activos: *${totalreg}*
🍬 Tu límite de hoy: *${limit}*
🔋 Tiempo encendida: *${uptime}*
🤖 Estado: ${botOfc}

📢 *Canal Oficial de Nino-chan*:
https://whatsapp.com/channel/0029Vaz6RTR0LKZIKwudX32x

🌟 *Regálame una estrellita en GitHub~*:
https://github.com/Angelithoxz/Nino-Nakano

💻 *Web Oficial~*:
https://ryusei-web.vercel.app/
╰───────────────🌸╯\n`

  
  for (const tag of Object.keys(grouped)) {
    const section = tagsMap[tag] || '📚 Otros'
    text += `\n╭─🎀 *${section}* 🎀─╮\n`
    for (const cmd of grouped[tag]) {
      text += `💫 ${cmd}\n`
    }
    text += '╰───────────────🌸\n'
  }

 
  let channelRD = {
    id: '120363374826926142@newsletter',
    name: 'Nino Nakano✨️'
  }

  let banner = 'https://telegra.ph/file/16391c31883e2717b3c7a.jpg'
  let redes = 'https://loli-web-five.vercel.app'
  let textbot = `🌸 Gracias por usarme, *${name}*~\nNo olvides seguir el canal y darme amorcito en GitHub~ 💕`

  await conn.sendMessage(m.chat, {
    video: { url: 'https://files.catbox.moe/q8nw6b.mp4' },
    caption: text,
    contextInfo: {
      mentionedJid: [m.sender, userId],
      isForwarded: false,
      forwardedNewsletterMessageInfo: {
        newsletterJid: channelRD.id,
        newsletterName: channelRD.name,
        serverMessageId: -1,
      },
      forwardingScore: 999,
      externalAdReply: {
        title: botname,
        body: textbot,
        thumbnailUrl: banner,
        sourceUrl: redes,
        mediaType: 1,
        showAdAttribution: false,
        renderLargerThumbnail: true,
      },
    }
  }, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help']
export default handler

function clockString(ms) {
  let seconds = Math.floor((ms / 1000) % 60)
  let minutes = Math.floor((ms / (1000 * 60)) % 60)
  let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
  return `${hours}h ${minutes}m ${seconds}s`
}