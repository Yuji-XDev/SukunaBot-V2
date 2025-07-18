import fetch from 'node-fetch';

let handler = async (m, { args, conn }) => {
  const url = decodeURIComponent(args.join(' ')).trim();

  if (!url || !url.includes('sticker.ly')) {
    return m.reply('❌ Link no válido. Usa el botón del comando `.stickerly`');
  }

  try {
    const api = `https://api.zahwazein.xyz/downloader/stickerly?url=${url}`;
    const res = await fetch(api);
    const json = await res.json();

    if (!json.status || !json.result || !json.result.sticker || json.result.sticker.length === 0) {
      return m.reply('❌ No se encontraron stickers en ese pack.');
    }

    m.reply(`🌐 *Pack:* ${url}\n🎴 Enviando stickers (${json.result.sticker.length} disponibles)...`);

    for (let i = 0; i < Math.min(10, json.result.sticker.length); i++) {
      let stickerUrl = json.result.sticker[i];
      await conn.sendMessage(m.chat, { sticker: { url: stickerUrl } }, { quoted: m });
      await new Promise(res => setTimeout(res, 700));
    }

  } catch (e) {
    console.error(e);
    m.reply('❌ Ocurrió un error al descargar los stickers del pack.');
  }
};

handler.command = /^verpack$/i;
export default handler;