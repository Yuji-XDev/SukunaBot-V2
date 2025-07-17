import fetch from 'node-fetch';

var handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return conn.reply(m.chat, `*🧩 Necesito un enlace válido de TikTok. No hagas perder el tiempo.*`, m, rcanal);
    }

    try {
        await conn.reply(m.chat, `🌪️\n> ⟢🏞️ 𝙀𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙤… 𝙏𝙪 𝙨𝙤𝙡𝙞𝙘𝙞𝙩𝙪𝙙 𝙚𝙨𝙩á 𝙨𝙞𝙚𝙣𝙙𝙤 𝙖𝙩𝙚𝙣𝙙𝙞𝙙𝙖. 𝙋𝙤𝙧 𝙛𝙖𝙫𝙤𝙧, 𝙢𝙖𝙣𝙩é𝙣 𝙡𝙖 𝙘𝙖𝙡𝙢𝙖.`, m);

        const tiktokData = await tiktokdl(args[0]);

        if (!tiktokData || !tiktokData.data || !tiktokData.data.play) {
            return conn.reply(m.chat, "⛔ Error: El video no pudo ser recuperado. Fallaste.", m);
        }

        const videoURL = tiktokData.data.play;
        const data = tiktokData.data;

        if (videoURL) {
            await conn.sendFile(m.chat, videoURL, "tiktok.mp4", `╭─❍「 TikTok Downloader 」
🌴 *Descripción:* ${data.title || 'Sin descripción'}

💞 *Likes:* ${data.digg_count || 0}
💬 *Comentarios:* ${data.comment_count || 0}
🏞️ *Vistas:* ${data.play_count || 0}
💥 *Compartido:* ${data.share_count || 0}
⏱ *Duración:* ${data.duration || 'Desconocida'} segundos
🖼️ *Calidad:* ${data.play.includes('hd') ? 'HD' : 'Estándar'}

⟢ 🌪️ 𝑨𝒒𝒖𝒊 𝒕𝒊𝒆𝒏𝒆𝒔 𝒕𝒖 𝒗𝒊𝒅𝒆𝒐
╰───────────────⬣`, fkontak);
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