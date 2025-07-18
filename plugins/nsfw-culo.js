let handler = async(m, { conn }) => {

let img = 'https://dark-core-api.vercel.app/api/random/ass?key=api';

let text = '🍑 *Disfruta tu ración de... arte digital 🙈*';

conn.sendMessage(m.chat, { image: { url: img }, caption: text }, { quoted: m });
m.react('✅');
}

handler.help = ['culo'];
handler.tags = ['nsfw'];
handler.command = ['culo'];

export default handler;