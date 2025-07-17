import axios from 'axios';
import { prepareWAMessageMedia } from '@whiskeysockets/baileys';

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply(`💥 Por favor, ingresa lo que deseas buscar por Pinterest.`);

  try {
    await m.react('🕒');

    let results = await pins(text);
    if (!results.length) return conn.reply(m.chat, `✧ No se encontraron resultados para "${text}".`, m);

    let caption = `❀  Pinterest  -  Search  ❀\n\n✧ Búsqueda » "${text}"\n✐ Resultados » ${results.length}\n\n© Sukuna Bot MD`;

    // Solo mandamos las primeras 5 imágenes
    for (let i = 0; i < Math.min(5, results.length); i++) {
      let img = results[i].hd;

      await conn.sendMessage(m.chat, {
        image: { url: img },
        caption,
        mentions: [m.sender]
      }, { quoted: m });
    }

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (error) {
    console.error(error);
    conn.reply(m.chat, `⚠︎ Error:\n\n${error.message}`, m);
  }
};

handler.help = ['pinterest'];
handler.command = ['pinterest', 'pin'];
handler.tags = ['dl'];

export default handler;

const pins = async (query) => {
  try {
    const { data } = await axios.get(`https://delirius-apiofc.vercel.app/search/pinterest?text=${encodeURIComponent(query)}`);

    if (data?.status && data?.data?.length) {
      return data.data.map(item => ({
        hd: item.hd,
        mini: item.mini
      }));
    }

    return [];
  } catch (error) {
    console.error("Error al obtener imágenes de Pinterest:", error);
    return [];
  }
};