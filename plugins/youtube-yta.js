// codigo creado por Dev.Shadow xD
// https://gituhb.com/Yuji-XDev

import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🌾 *Ejemplo de uso:*\n\n✎ ✧ \`${usedPrefix + command}\` https://youtube.com/watch?v=KHgllosZ3kA\n✎ ✧ \`${usedPrefix + command}\` DJ malam pagi slowed`);

  await m.react('🔍');

  const isUrl = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(text);
  let info = null;

  try {

    if (isUrl) {
      let res1 = await fetch(`https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(text)}`);
      let json1 = await res1.json();

      if (!json1?.resultado?.descarga?.url) throw '❌ Falló API 1';

      info = {
        title: json1.resultado.metadata.title,
        author: json1.resultado.metadata.author?.nombre,
        duration: json1.resultado.metadata.duración?.marca_de_tiempo,
        thumb: json1.resultado.metadata.image,
        download: json1.resultado.descarga.url,
        filename: json1.resultado.descarga.filename
      };
    }

    if (!info) {
      let res2 = await fetch(`https://api.vreden.my.id/api/ytplaymp3?query=${encodeURIComponent(text)}`);
      let json2 = await res2.json();

      if (!json2?.result?.download?.url) throw '❌ Falló API 2';

      info = {
        title: json2.result.metadata.title,
        author: json2.result.metadata.author?.name,
        duration: json2.result.metadata.duration?.timestamp,
        thumb: json2.result.metadata.thumbnail,
        download: json2.result.download.url,
        filename: json2.result.download.filename
      };
    }

    await conn.sendMessage(m.chat, {
      image: { url: info.thumb },
      caption: `≡ 🌴 *\`Título:\`* ${info.title}\n≡ 🐛 *\`Autor:\`* ${info.author}\n≡ ⏱️ *\`Duración:\`* ${info.duration}\n\n🌳 *Enviando MP3...*`,
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      audio: { url: info.download },
      fileName: info.filename,
      mimetype: 'audio/mpeg'
    }, { quoted: m });

    await m.react('✅');

  } catch (e) {
    console.error(e);
    await m.reply('❌ *No se pudo obtener el MP3.* Intenta con otro título o link.');
    await m.react('❌');
  }
};

handler.command = ['yta'];
handler.help = ['yta'].map(c => c + ' <enlace o texto>');
handler.tags = ['downloader'];

export default handler;