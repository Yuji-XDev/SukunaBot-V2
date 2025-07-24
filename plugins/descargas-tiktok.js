import fetch from 'node-fetch';

var handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return conn.reply(m.chat, `*🧩 Necesito un enlace válido de TikTok. No hagas perder el tiempo.*`, m, rcanal);
    }

    try {
        await conn.reply(m.chat, `🌳 𝚂𝚘𝚕𝚒𝚌𝚒𝚝𝚞𝚍 𝚎𝚗 𝚌𝚞𝚛𝚜𝚘...  
𝙴𝚜𝚝𝚊𝚖𝚘𝚜 𝚊𝚝𝚎𝚗𝚍𝚒𝚎𝚗𝚍𝚘 𝚝𝚞 𝚙𝚎𝚝𝚒𝚌𝚒ó𝚗.  
𝙿𝚘𝚛 𝚏𝚊𝚟𝚘𝚛, 𝚝𝚎𝚗 𝚞𝚗 𝚙𝚘𝚌𝚘 𝚍𝚎 𝚙𝚊𝚌𝚒𝚎𝚗𝚌𝚒𝚊 🍵`, m);

        const tiktokData = await tiktokdl(args[0]);

        if (!tiktokData || !tiktokData.data || !tiktokData.data.play) {
            return conn.reply(m.chat, "⛔ Error: El video no pudo ser recuperado. Fallaste.", m);
        }

        const videoURL = tiktokData.data.play;
        const data = tiktokData.data;
        const texto = `╭━━〔 *📥 TikTok Downloader* 〕━━⬣  
📌 *Título:* ${data.title || 'Sin descripción'}

💖 *Likes:* ${data.digg_count || 0}
💬 *Comentarios:* ${data.comment_count || 0}  
👀 *Vistas:* ${data.play_count || 0}
🔁 *Compartido:* ${data.share_count || 0}
⏱️ *Duración:* ${data.duration || 'Desconocida'} seg
🖼️ *Calidad:* ${data.play.includes('hd') ? 'HD 🎞️' : 'Estándar 📺'}

╰─〔 🌪️ 𝙀𝙣𝙟𝙤𝙮 𝙮𝙤𝙪𝙧 𝙫𝙞𝙙𝙚𝙤! 🎬 〕⬣`;

        if (videoURL) {
            //await conn.sendFile(m.chat, videoURL, "tiktok.mp4", texto, fkontak);

            const thumb = await fetch("https://files.catbox.moe/zgvj8c.jpg").then(res => res.buffer());

            await conn.sendFile(
                m.chat,
                videoURL,
                'tiktok.mp4',
                texto,
                fkontak,
                false,
                {
                    contextInfo: {
                        externalAdReply: {
                            title: "『🔥』ＴＩＫＴＯＫ ＤＥＳＣＡＲＧＡＤＯ",
                            body: wm,
                            thumbnail: thumb,
                            mediaType: 2,
                            mediaUrl: videoURL,
                            sourceUrl: redes,
                            renderLargerThumbnail: true,
                            showAdAttribution: true
                        }
                    }
                }
            );
        } else {
            return conn.reply(m.chat, "🎭 No se pudo descargar. Tal vez no estás listo.", m);
        }
    } catch (error1) {
        return conn.reply(m.chat, `💢 Error: ${error1.message}`, m);
    }
};

handler.help = ['tiktok'].map((v) => v + ' *<link>*');
handler.tags = ['descargas'];
handler.command = ['tiktok', 'tt'];
//handler.group = true;
handler.register = true;
handler.coin = 2;
handler.limit = true;

export default handler;

async function tiktokdl(url) {
    let tikwm = `https://www.tikwm.com/api/?url=${url}?hd=1`;
    let response = await (await fetch(tikwm)).json();
    return response;
}