import fetch from 'node-fetch';

const handler = async (m, { conn, usedPrefix }) => {
  await m.react('🌪️');

  try {
    const _muptime = process.uptime() * 1000;
    const muptime = clockString(_muptime);

    const hora = new Date().toLocaleTimeString('es-PE', { timeZone: 'America/Lima' });
    
    const fechaObj = new Date();
    const fecha = fechaObj.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Lima' });
    const dia = fechaObj.toLocaleDateString('es-PE', { weekday: 'long', timeZone: 'America/Lima' });

    const totalreg = Object.keys(global.db.data.users).length;
    const totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length;

    const texto = `╭̇╌̣╌̇╌̣━̇━̣╴╴╴╴╴╴╴╴╴╴̣━̇━̣╌̇╌̣╌̇╮
│👤╴╴╴❨ᴜ❩.s.ᴇ.ʀ╴╴╴╴╴╴╴𐃙
╰─⃜┈⃨𖨠̇⁕໑̣٨ִــִׁﮩ♡̫𝐇̣𑜰̣𝐥𑜅 ᴜ꯭ᴡ꯭ᴜ♡ִ̫ﮩ٨ﮩׅ᪤̇⁕⃨┈⃛⟡
𓍯   ─   ◦   ─   ◦   ─   ◦   ─   ◦   ─   ◦ 𓏲੭
        ͟ꤪꤨ ͞ 𝙈𝙚𝙣𝙪 𝙇𝙞𝙨𝙩 ͞  ͟ ꤪꤨ
╭┈ ↷ 𝐈𝐍𝐅𝐎 𝐁𝐎𝐓
• ✐; Cʀᴇᴀᴅᴏʀ » Dev.Shadow 🇦🇱
├┈・──・──・﹕₊˚ ✦・୨୧・
│ *👨💻 ᴄʀᴇᴀᴅᴏʀ:* [ wa.link/z1w9sq ]
│ *🔖 ᴠᴇʀsɪóɴ:* [ 2.2.0 ]
│ *👥 ᴜsᴜᴀʀɪᴏs:* [ ${totalreg} ]
│ *🖍️ ᴄᴏᴍᴀɴᴅᴏs:* [ ${totalCommands} ]
│ *🍫 ᴘʀᴇғɪᴊᴏ:* [ ${usedPrefix} ]
│ *📚 ʟɪʙʀᴇʀɪᴀ:* [ Baileys ]
│ *🛡️ ᴍᴏᴅᴏ:* [ Privado ]
│ *⏱️ ᴛɪᴇᴍᴘᴏ ᴀᴄᴛɪᴠᴏ:* [ ${muptime} ]
│ ✦ Info » System 🅢
╰────────────────•°•

╭┈ ↷
│ ✐ ꒷ꕤ👻 \`ɪɴғᴏ - ᴜsᴇʀ\` ☄︎
├┈・──・──・﹕₊˚ ✦・୨୧・
│ *🧬 ɪᴅ:* [ ${conn.getName(m.sender)} ]
│ *💰 ᴍᴏɴᴇᴅᴀ:* [ ${global.db.data.users[m.sender]?.coin || 0} ]
│ *📊 ɴɪᴠᴇʟ:* [ ${global.db.data.users[m.sender]?.level || 0} ]
│ *⚡ xᴘ ᴛᴏᴛᴀʟ:* [ ${global.db.data.users[m.sender]?.exp || 0} ]
│ *👑 ʀᴏʟ:* [ ${global.db.data.users[m.sender]?.role || '𝙎𝙞𝙣 𝙍𝙖𝙣𝙜𝙤'} ] 
│ ✦ Info » User 🅘
╰────────────────•°•

╭┈ ↷
│ ✐ ꒷ꕤ🍄ദ \`ɪɴғᴏ - ғᴇᴄʜᴀ\`  ☄
├┈・──・──・﹕₊˚ ✦・୨୧・
│ *🕒 ʜᴏʀᴀ:* ${hora}
│ *📅 ғᴇᴄʜᴀ:* ${fecha}
│ *🗓️ ᴅíᴀ:* ${dia}
│ ✦ Info » Time 🅣
╰────────────────•°•°

⌬━━━━━━━━━━━━━━━━━━━━⌬‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎

．                                         ∩_∩●
 ‧                                      ○(‟×  ᪶×‟)
╭━━┈ ─๋︩︪─☪︎︎︎̸⃘̸࣭ٜ࣪࣪࣪۬◌⃘۪֟፝֯۫۫︎⃪𐇽۫۬🌾⃪⃘۪۫۫۫۫۬֯፝֟◌⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸─ׅ─ׅ┈ ๋︪︩━∪̶∪̶━╮
🍥⧫̇❀̶࣭۪ٜ݊݊⃛᛫👻︎ 𝙈𝙚𝙣𝙪𝙨-𝘿𝙞𝙨𝙥𝙤𝙣𝙞𝙗𝙡𝙚𝙨 🌀👾᛫̶ִ۪۪ٜ⃛݊❀̇⧫ 
╰ׅ̩̥̩̥̩̥̩̥̩━ׅ┄─━┈ ─๋︩︪─☪︎︎︎̸⃘̸࣭ٜ࣪࣪࣪۬◌⃘۪֟፝֯۫۫︎⃪𐇽۫۬🌾⃪⃘۪۫۫۫۫۬֯፝֟◌⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸─ׅ─ׅ┈ ━๋︪︩━╯̩̥̩̥̩̥̩̥̩
╭̷ׄ┄̵̷ׅ۪۪۪ٜ─̶̸ׄ─̵̷ׅ─̵̷ׄ┈̶̸ׅ۪۪۪۪۪۪ٜ┈̵̷ׄ┈̵̸ׅ┈̶̸ׄ┈̵̷ׅ۪۪۪۪ٜ┈̵̷ׄ┈̶̸ׅ┈̵̷ׄ┈̵̷ׅ۪۪۪۪۪ٜ┈̶̸ׄ┈̵̷ׅ─̵̷ׄ─̶̸ׅ۪۪ٜ─̵̷ׄ┈̵̷ׅ╮
│•ꪶᳱꫂ \`#ᴍᴇɴᴜɢᴘ\`
│•ꪶᳱꫂ \`#ᴍᴇɴᴜʟᴏɢᴏs\`
│•ꪶᳱꫂ \`#ᴅᴇᴠ\`
│•ꪶᳱꫂ \`#ᴍᴇɴᴜ18\`
│•ꪶᳱꫂ \`#ᴍᴇɴᴜ2\`
│•ꪶᳱꫂ \`#ᴍᴇɴᴜsᴇᴀʀᴄʜ\`
│•ꪶᳱꫂ \`#ᴍᴇɴᴜᴅʟ\`
│•ꪶᳱꫂ \`#ᴍᴇɴᴜʀᴘɢ\`
│•ꪶᳱꫂ \`#ᴍᴇɴᴜsᴛɪᴄᴋᴇʀ\`
╰╌┈─━╌─━╌⃨╼⃛⬥⬥⃛╾⃨╌━─╌━─┈╌╯
`;

    const imagen = 'https://files.catbox.moe/35wxsf.jpg';
    const imgBuffer = await (await fetch(imagen)).buffer();

    const buttons = [
      { buttonId: `${usedPrefix}creador`, buttonText: { displayText: '✐ ꒷📞ദ ᴄʀᴇᴀᴅᴏʀ' }, type: 1 },
      { buttonId: `${usedPrefix}bots`, buttonText: { displayText: '✐ ꒷👤ദ ᴀᴜᴛᴏ ᴠᴇʀɪғɪᴄᴀʀ' }, type: 1 },
      { buttonId: `${usedPrefix}sistema`, buttonText: { displayText: '✐ ꒷🌾ദ ᴠᴇʀ sɪsᴛᴇᴍᴀ' }, type: 1 }
    ];

    const sections = [
      {
        title: "🥮 MENÚS DISPONIBLES 🐛",
        rows: [
          { title: "📥 Mᴇɴᴜ [ 𝗗𝗟 ]", description: "🎧 ᴠᴇʀ ғᴜɴᴄɪᴏɴᴇs ᴅᴇ ᴅᴇsᴄᴀʀɢᴀs", id: `${usedPrefix}menudl` },
          { title: "⛏️ Mᴇɴᴜ [ 𝗥𝗣𝗚 ]", description: "🎮 ᴠᴇʀ ᴍᴇɴᴜ ғᴜɴᴄɪᴏɴᴇs ʀᴘɢ", id: `${usedPrefix}menurpg` },
          { title: "🔍 Mᴇɴᴜ [ 𝗦𝗘𝗔𝗥𝗖𝗛 ]", description: "🌾 ᴠᴇʀ ᴍᴇɴᴜ ғᴜɴᴄɪᴏɴᴇs ᴅᴇ sᴇᴀʀᴄʜ", id: `${usedPrefix}menuse` },
          { title: "🖍️ Mᴇɴᴜ [ 𝗢𝗪𝗡𝗘𝗥 ]", description: "🧙‍♂️ ᴠᴇʀ ᴍᴇɴᴜ ғᴜɴᴄɪᴏɴᴇs ᴅᴇ ᴏᴡɴᴇʀ", id: `${usedPrefix}dev` },
          { title: "🌈 Mᴇɴᴜ [ 𝗔𝗨𝗗𝗜𝗢𝗦 ]", description: "🎃 ᴠᴇʀ ᴍᴇɴᴜ ғᴜɴᴄɪᴏɴᴇs ᴅᴇ ᴀᴜᴅɪᴏs", id: `${usedPrefix}menu2` },
          { title: "⛩️ Mᴇɴᴜ [ 𝗣𝗘𝗥𝗙𝗜𝗟 ]", description: "☂️ ᴠᴇʀ ᴍᴇɴᴜ ғᴜɴᴄɪᴏɴᴇs ᴘᴀʀᴀ ᴇᴅɪᴛᴀʀ ᴛᴜ ᴘᴇʀғɪʟ", id: `${usedPrefix}perfildates` },
          { title: "🌞 Mᴇɴᴜ [ 𝗚𝗥𝗨𝗣𝗢 ]", description: "💫 ᴠᴇʀ ᴍᴇɴᴜ ғᴜɴᴄɪᴏɴᴇs ᴘᴀʀᴀ ᴀᴅᴍɪɴɪsᴛʀᴀʀ ᴛᴜ ɢʀᴜᴘᴏ", id: `${usedPrefix}menugp` },
          { title: "🔞 Mᴇɴᴜ [ 𝗡𝗦𝗙𝗪 ]", description: "💨 ᴠᴇʀ ᴍᴇɴᴜ ғᴜɴᴄɪᴏɴᴇs ᴅᴇ ɴsғᴡ", id: `${usedPrefix}menu18` },
          { title: "💖 Mᴇɴᴜ [ 𝗟𝗢𝗚𝗢𝗧𝗜𝗣𝗢𝗦 ]", description: "🐥 ᴠᴇʀ ᴍᴇɴᴜ ғᴜɴᴄɪᴏɴᴇs ᴅᴇ ʟᴏɢᴏᴛɪᴘᴏs", id: `${usedPrefix}menulogos` },
          { title: "🐛 Mᴇɴᴜ [ 𝗦𝗧𝗜𝗖𝗞𝗘𝗥𝗦 ]", description: "🐾 ᴠᴇʀ ᴍᴇɴᴜ ғᴜɴᴄɪᴏɴᴇs ᴅᴇ sᴛɪᴄᴋᴇʀs", id: `${usedPrefix}menusticker` },
        ]
      }
    ];

    await conn.sendMessage(m.chat, {
      image: imgBuffer,
      caption: texto.trim(),
      footer: '⌬ Sistema Operativo: *SUᴋᴜɴᴀ.ᴇxᴇ*',
      buttons: [
        ...buttons,
        {
          type: 4,
          nativeFlowInfo: {
            name: 'single_select',
            paramsJson: JSON.stringify({
              title: '✐ ꒷ꕤ🎄ദ ʟɪsᴛ - ᴍᴇɴᴜ',
              sections
            })
          }
        }
      ],
      headerType: 1,
      viewOnce: true,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 1000,
        isForwarded: true
      }
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    await m.react('❌');
    await conn.reply(m.chat, '*❌ Error al mostrar el menú.*\n' + e.message, m);
  }
};

handler.help = ['menulist'];
handler.tags = ['menus'];
handler.command = ['menulist'];

export default handler;

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}