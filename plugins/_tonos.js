import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    let query = text || 'iphone';
    let apiUrl = `https://api.dorratz.com/v3/tonos-s?title=${encodeURIComponent(query)}`;

    const res = await fetch(apiUrl);
    const json = await res.json();

    if (!json.status || !json.result || json.result.length === 0) {
      return m.reply('❌ No se encontraron tonos.');
    }

    let result = json.result[0]; // puedes cambiar el índice para más resultados

    let texto = `🎵 *Nombre:* ${result.title}\n📦 *Tamaño:* ${result.size}\n📥 *Link:* ${result.audio}`;

    await conn.sendMessage(m.chat, {
      document: { url: result.audio },
      fileName: result.title + '.mp3',
      mimetype: 'audio/mpeg',
      caption: texto
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('❌ Hubo un error al buscar el tono.');
  }
};

handler.command = ['tono', 'tonomp3', 'ringtonemp3'];
handler.help = ['tono <nombre>'];
handler.tags = ['descargas'];

export default handler;