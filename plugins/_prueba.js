let handler = async (m, { conn, commands }) => {
  try {
    const imgurl = 'https://files.catbox.moe/nmseef.png';
    const keywords = ['search', 'buscar', 'finder']; // palabras clave para filtrar comandos

    // Filtrar comandos por tags relacionados con búsqueda
    let busquedas = Object.values(commands).filter(
      (cmd) =>
        cmd?.tags?.some(tag => keywords.some(k => tag.toLowerCase().includes(k))) ||
        keywords.some(k => cmd?.command?.toString()?.toLowerCase()?.includes(k))
    );

    // Eliminar comandos duplicados o inválidos
    busquedas = [...new Set(busquedas)].filter(v => v?.command);

    // Construir el texto del menú
    const texto = `ʜᴏʟᴀ
╔═══════ • ° ❁⊕❁ ° • ═══════╗
    💥⃢᭄͜═✩═[𝐌𝐄𝐍𝐔-𝐒𝐄𝐀𝐑𝐂𝐇]═✩═⃟⃢᭄͜🔎
╚═══════ • ° ❁⊕❁ ° • ═══════╝

> 🔍⊹ *𝐂𝐨𝐦𝐚𝐧𝐝𝐨𝐬 𝐝𝐞 𝐁𝐮́s𝐪𝐮𝐞𝐝𝐚* ⊹🔎
${busquedas.map((v) => {
  const cmd = Array.isArray(v.command) ? v.command[0] : v.command;
  return `യ ׄ🌲˚ *${typeof cmd === 'string' && !cmd.startsWith('.') ? `#${cmd}` : cmd}*`;
}).join('\n')}

> ${global.dev || '👑 Desarrollado por Black Clover'}
`.trim();

    await conn.sendMessage(m.chat, {
      image: { url: imgurl },
      caption: texto,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: global.packname || '🤖 Menú de Búsqueda',
          body: global.dev || 'Bot creado por Black Clover',
          thumbnailUrl: global.icono || imgurl,
          mediaType: 1,
          renderLargerThumbnail: false,
          showAdAttribution: true,
          mediaUrl: 'https://whatsapp.com/channel/0029VbAtbPA84OmJSLiHis2U',
          sourceUrl: 'https://whatsapp.com/channel/0029VbAtbPA84OmJSLiHis2U'
        }
      }
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    conn.reply(m.chat, '⚠️ Hubo un error al generar el menú.', m);
  }
};

handler.help = ['menusearch'];
handler.tags = ['menus'];
handler.command = ['menusearch', 'menuse2'];

export default handler;