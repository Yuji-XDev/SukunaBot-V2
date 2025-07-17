import fetch from 'node-fetch';
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('🎧 Ingresa el enlace de YouTube.\n*Ejemplo:* .ytmp3 https://youtu.be/TdrL3QxjyVw');

  try {
    await m.react('🎶');

    const api = `https://delirius-apiofc.vercel.app/download/ytmp3?url=${encodeURIComponent(text)}`;
    const res = await fetch(api);
    const json = await res.json();

    if (!json.estado) return m.reply('❌ No se pudo obtener el audio. Asegúrate de que el enlace sea válido.');

    const data = json.datos;
    const texto = `
🌸 *${data.nombre}*
🎙️ *Artistas:* ${data.artistas}
⏱️ *Duración:* ${data.duración}
📥 *Descarga disponible abajo*
`.trim();

    const message = {
      image: { url: data.imagen },
      caption: texto,
      footer: '✨ Sukuna - Bot MD',
      buttons: [
        {
          buttonId: data.descargar,
          buttonText: { displayText: '🎧 Descargar MP3' },
          type: 1
        }
      ],
      headerType: 4
    };

    await conn.sendMessage(m.chat, message, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('⚠️ Error al procesar la solicitud.');
  }
};

handler.command = ['mp3yt', 'ytmusica'];
export default handler;