import fetch from 'node-fetch'
import yts from 'yt-search'

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, '*🌳 Por favor, ingresa el nombre o link de una música para buscar.*', m)
    }

    let videoIdMatch = text.match(youtubeRegexID)
    let query = videoIdMatch ? 'https://youtu.be/' + videoIdMatch[1] : text
    let ytResults = await yts(query)

    let video = videoIdMatch
      ? ytResults.all.find(v => v.videoId === videoIdMatch[1])
      : ytResults.videos[0]

    if (!video) return m.reply('✧ No se encontraron resultados para tu búsqueda.', m)

    let { title, thumbnail, timestamp, views, ago, url, author } = video

    const infoMessage = `
\`\`\`╭━〔 乂 YOUTUBE - PLAY 〕━⬣\`\`\`
🎧 *${title || 'Sin título'}*

≡ ⏱ *Duración:* ${timestamp || 'Desconocida'}
≡ 📺 *Canal:* ${author?.name || 'Desconocido'}
≡ 👁️ *Vistas:* ${formatViews(views)}
≡ 📆 *Publicado:* ${ago || 'Desconocido'}
≡ 🔗 *Link:* ${url || 'No disponible'}
\`\`\`╰━━━〔 🎵 〕━━⬣\`\`\`
`.trim()

    const thumb = (await conn.getFile(thumbnail)).data

    const externalAd = {
      contextInfo: {
        externalAdReply: {
          title: wm,
          body: club,
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        },
      },
    }

    await conn.reply(m.chat, infoMessage, m, externalAd)

    if (['play', 'playaudio'].includes(command)) {
      await handleAudio(url, m, conn)
    } else if (['play2', 'mp4'].includes(command)) {
      await handleVideo(url, title, m, conn)
    } else {
      return conn.reply(m.chat, '✧︎ Comando no reconocido.', m)
    }

  } catch (err) {
    console.error(err)
    return m.reply(`⚠︎ Ocurrió un error inesperado:\n${err.message}`, m)
  }
}

handler.command = ['play', 'play2', 'playaudio', 'mp4']
handler.help = ['play', 'play2', 'playaudio', 'mp4']
handler.tags = ['descargas']
export default handler

async function handleAudio(url, m, conn) {
  try {
    const res = await fetch(`https://api.stellarwa.xyz/dow/ytmp3?url=${url}&apikey=diamond`)
    const json = await res.json()
    const audioURL = json.result?.download?.url
    const title = json.result?.title || 'audio'

    if (!audioURL) throw new Error('No se generó correctamente el enlace de audio.')

    await conn.sendMessage(m.chat, {
      audio: { url: audioURL },
      fileName: `${title}.mp3`,
      mimetype: 'audio/mpeg'
    }, { quoted: m })

  } catch (e) {
    return conn.reply(m.chat, '⚠︎ Error al enviar el audio. Intenta más tarde.', m)
  }
}

async function handleVideo(url, title, m, conn) {
  try {
    const res = await fetch(`https://api.stellarwa.xyz/dow/ytmp4?url=${url}&apikey=diamond`)
    const json = await res.json()
    const videoURL = json.data?.url
    const videoTitle = json.title || title

    if (!videoURL) throw new Error('No se generó correctamente el enlace del video.')

    await conn.sendFile(m.chat, videoURL, `${videoTitle}.mp4`, title, m)

  } catch (e) {
    return conn.reply(m.chat, '⚠︎ Error al enviar el video. Intenta más tarde.', m)
  }
}

function formatViews(views) {
  if (!views || typeof views !== 'number') return 'No disponible'

  if (views >= 1_000_000_000)
    return `${(views / 1_000_000_000).toFixed(1)}B`
  else if (views >= 1_000_000)
    return `${(views / 1_000_000).toFixed(1)}M`
  else if (views >= 1_000)
    return `${(views / 1_000).toFixed(1)}K`
  return views.toString()
}