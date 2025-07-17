import { exec } from 'child_process'
import speed from 'performance-now'

let handler = async (m, { conn, participants }) => {
  let start = speed()
  let latency = (speed() - start).toFixed(3)

  exec('neofetch --stdout', (_, stdout) => {
    let sys = stdout?.toString('utf-8').replace(/Memory:/g, 'Ram:') || ''
    let info = sys.split('\n').map(line => `┃ ${line}`).join('\n')

    let text = `
╭─⭑✔️︎・*SUKUNA BOT MODE*・,🎄⭑─╮
┃ 🧬 *Sistema activo:*  
┃ ⚡ *Latencia:* ${latency} ms
┃ 🛠️ *Detalles técnicos:*
${info}
╰━━━━━━━━━━━━━━━━━━━━⬣`.trim()

    conn.sendMessage(m.chat, {
      text,
      mentions: participants?.map(p => p.id) || [],
      contextInfo: {
        mentionedJid: participants?.map(p => p.id) || [],
        externalAdReply: {
          title: packname,
          body: dev,
          thumbnailUrl: logo,
          mediaType: 1,
          showAdAttribution: true,
          renderLargerThumbnail: true,
          sourceUrl: 'https://github.com/the-27/Rin-Itoshi-Bot-V2'
        }
      }
    }, { quoted: m })
  })
}

handler.help = ['ping']
handler.tags = ['info']
handler.command = ['ping', 'p']

export default handler