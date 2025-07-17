let handler = async (m, { conn }) => {
  try {
    const imgurl = 'https://files.catbox.moe/nmseef.png';

    const toAesthetic = (text) => {
      const map = {
        a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ', h: 'ʜ',
        i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ',
        q: 'ǫ', r: 'ʀ', s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x',
        y: 'ʏ', z: 'ᴢ', '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹',
        '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿',
        '#': '#'
      };
      return text.toLowerCase().split('').map(c => map[c] || c).join('');
    };
    const palabrasClave = ['search', 'buscador'];


    const comandosBusqueda = Object.values(global.plugins).filter(
      plugin => plugin?.help && plugin.help.length > 0 &&
        (palabrasClave.some(palabra =>
          (plugin?.tags || []).join().toLowerCase().includes(palabra) ||
          plugin.help.join(' ').toLowerCase().includes(palabra)
        ))
    );

    const listaComandos = comandosBusqueda.map(plugin => {
      return plugin.help.map(cmd => `യ ׄ🌲˚ #${toAesthetic(cmd)}`).join('\n');
    }).join('\n');

 
    const texto = `ʜᴏʟᴀ
╔═══════ • ° ❁⊕❁ ° • ═══════╗
    💥⃢᭄͜═✩═[𝐌𝐄𝐍𝐔-𝐒𝐄𝐀𝐑𝐂𝐇]═✩═⃟⃢᭄͜🔎
╚═══════ • ° ❁⊕❁ ° • ═══════╝

> 🔍⊹ *ᴄᴏᴍᴀɴᴅᴏs ᴅᴇ ʙᴜ́sǫᴜᴇᴅᴀ* ⊹🔎

${listaComandos || '❌ ɴᴏ sᴇ ᴇɴᴄᴏɴᴛʀᴀʀᴏɴ ᴄᴏᴍᴀɴᴅᴏs ᴅᴇ ʙᴜ́sǫᴜᴇᴅᴀ'}

> ${global.dev || '👑 ʙᴏᴛ ᴘᴏʀ ʙʟᴀᴄᴋ ᴄʟᴏᴠᴇʀ'}
`.trim();


    await conn.sendMessage(m.chat, {
      image: { url: imgurl },
      caption: texto,
      footer: '⛩️ Sukuna Bot MD',
      buttons: [
        { buttonId: '#menulist', buttonText: { displayText: 'ᴍᴇɴᴜ ʟɪsᴛ' }, type: 1 },
        { buttonId: '#perfil', buttonText: { displayText: 'ᴘᴇʀғɪʟ' }, type: 1 },
      ],
      headerType: 4,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: global.packname || '📦 ꜱᴜᴋᴜɴᴀ ʙᴏᴛ ᴍᴅ',
          body: global.dev || '👑 ᴄʀᴇᴀᴅᴏ ᴘᴏʀ ʙʟᴀᴄᴋ ᴄʟᴏᴠᴇʀ',
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
    conn.reply(m.chat, '❌ ʜᴜʙᴏ ᴜɴ ᴇʀʀᴏʀ ᴀʟ ᴄᴀʀɢᴀʀ ᴇʟ ᴍᴇɴᴜ.', m);
  }
};

handler.help = ['prueba'];
handler.tags = ['menus'];
handler.command = ['prueba'];

export default handler;