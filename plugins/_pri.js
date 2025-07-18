let handler = async (m, { args }) => {
  let url = decodeURIComponent(args[0]);
  if (!url || !url.includes('sticker.ly')) return m.reply('❌ URL no válida');
  m.reply(`🌐 *Aquí tienes tu pack:*\n${url}`);
};

handler.command = /^verpack$/i;
export default handler;