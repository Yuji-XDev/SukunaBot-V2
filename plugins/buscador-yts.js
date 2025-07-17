import fetch from 'node-fetch';
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🌪️ *Ejemplo:* ${usedPrefix + command} Bad Bunny`);
  await m.react('🕓');

  const apiURL = `https://dark-core-api.vercel.app/api/search/youtube?key=api&text=${encodeURIComponent(text)}`;
  const res = await fetch(apiURL);
  const json = await res.json();

  if (!json.success || !json.results || json.results.length === 0) {
    return m.reply('❌ No se encontraron resultados en YouTube.');
  }

  const videos = json.results.slice(0, 5); // menos para evitar límite de Baileys

  const sections = videos.map((video, i) => ({
    title: video.titulo,
    rows: [
      {
        title: `🎧 Descargar Audio`,
        description: `${video.duracion} | ${video.vistas} vistas`,
        rowId: `.ytmp3 ${video.url}`
      },
      {
        title: `📹 Descargar Video`,
        description: `Canal: ${video.canal}`,
        rowId: `.ytmp4 ${video.url}`
      }
    ]
  }));

  const listMessage = {
    text: `🎵 Resultados de: *${text}*`,
    footer: 'Selecciona una opción para continuar',
    title: '✨ YouTube Search',
    buttonText: '📂 Ver Resultados',
    sections
  };

  await conn.sendMessage(m.chat, listMessage, { quoted: m });
  await m.react('✅');
};

handler.help = ['ytsearch', 'yts'];
handler.tags = ['search'];
handler.command = ['ytsearch', 'yts'];

export default handler;