let handler = async (m, { conn }) => {
  try {
    let imgurl = 'https://files.catbox.moe/nmseef.png';

    // Palabras clave para detectar comandos de búsqueda
    const palabrasClave = ['search', 'buscar', 'find'];

    // Obtener comandos del bot desde global.plugins
    const comandosBusqueda = Object.values(global.plugins).filter(
      plugin => plugin?.command && (
        palabrasClave.some(palabra => (plugin?.tags || []).join().toLowerCase().includes(palabra)) ||
        palabrasClave.some(palabra => plugin?.help?.join(' ')?.toLowerCase().includes(palabra)) ||
        palabrasClave.some(palabra => Array.isArray(plugin.command) 
          ? plugin.command.some(c => typeof c === 'string' && c.includes(palabra)) 
          : typeof plugin.command === 'string' && plugin.command.includes(palabra))
      )
    );

    // Generar lista de comandos
    let listaComandos = comandosBusqueda.map(plugin => {
      const cmds = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
      return cmds.map(cmd => `യ ׄ🌲˚ #${cmd}`).join('\n');
    }).join('\n');

    // Plantilla del menú
    const texto = `ʜᴏʟᴀ
╔═══════ • ° ❁⊕❁ ° • ═══════╗
    💥⃢᭄͜═✩═[𝐌𝐄𝐍𝐔-𝐒𝐄𝐀𝐑𝐂𝐇]═✩═⃟⃢᭄͜🔎
╚═══════ • ° ❁⊕❁ ° • ═══════╝

> 🔍⊹ *𝐂𝐨𝐦𝐚𝐧𝐝𝐨𝐬 𝐝𝐞 𝐁𝐮́s𝐪𝐮𝐞𝐝𝐚* ⊹🔎

${listaComandos || '❌ No se encontraron comandos de búsqueda'}

> ${global.dev || '👑 Bot creado por Black Clover'}
`.trim();

    await conn.sendMessage(m.chat, {
      image: { url: imgurl },
      caption: texto,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: global.packname || '📦 Sukuna Bot MD',
          body: global.dev || '👑 Black Clover',
          thumbnailUrl: global.icono || imgurl,
          mediaType: 1,
          renderLargerThumbnail: false,
          showAdAttribution: true,
          mediaUrl: 'https://whatsapp.com/channel/0029VbAtbPA84OmJSLiHis2U',
          sourceUrl: 'https://whatsapp.com/channel/0029VbAtbPA84OmJSLiHis2U'
        }
      }
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    conn.reply(m.chat, '❌ Hubo un error al generar el menú dinámico.', m);
  }
};

handler.help = ['menusearch'];
handler.tags = ['menus'];
handler.command = ['menusearch', 'menuse2'];

export default handler;