/*import fetch from 'node-fetch';

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
export default handler;*/


import fetch from 'node-fetch';
import { sticker } from '../lib/sticker.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `❌ *Debes ingresar un enlace de Sticker.ly!*\n\n📌 Ejemplo:\n${usedPrefix + command} https://sticker.ly/s/4I2FC0`, m);
  }

  try {
    m.react('🕐');
    
    const api = `https://delirius-apiofc.vercel.app/download/stickerly?url=${encodeURIComponent(text)}`;
    const res = await fetch(api);
    const json = await res.json();

    if (!json.estado || !json.datos?.pegatinas?.length) {
      return conn.reply(m.chat, `⚠️ No se pudieron obtener los stickers. Asegúrate de que el enlace sea correcto.`, m);
    }

    m.reply(`✨ *Enviando ${json.datos.pegatinas.length} stickers del pack "${json.datos.nombre}" creado por ${json.datos.autor}...*`);

    for (let i = 0; i < json.datos.pegatinas.length; i++) {
      let stickerURL = json.datos.pegatinas[i];
      try {
        let stiker = await sticker(false, stickerURL, global.packname, global.author);
        if (stiker) await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m });
      } catch (e) {
        console.log(`❌ Error enviando sticker ${i + 1}:`, e);
      }
    }

    m.react('✅');
  } catch (err) {
    console.error(err);
    m.reply(`❌ Error al obtener el pack. Intenta más tarde.`);
  }
};

handler.help = ['stickerly <url>'];
handler.tags = ['sticker'];
handler.command = ['stickerly', 'stkly', 'verpack'];

export default handler;