let handler = async (m, { conn, usedPrefix }) => {
  const imageUrl = 'https://files.catbox.moe/3gxuzq.jpg';
  const caption = `┌──〔🛰️ PROFILE NODE INTERFACE〕──┐
│ [💾] SYSTEM: BOOTING PROFILE MODULE...
│
│ [🎂] .setbirth    → Añadir cumpleaños
│ [🧨] .delbirth    → Borrar cumpleaños
│ [📄] .setdesc    → Escribir biografía
│ [🔥] .deldesc    → Eliminar biografía
│ [👤] .setgenre   → Definir género
│ [💀] .delgenre   → Borrar género
│ [💍] .marry      → Casarse con alguien
│ [☠️] .divorce     → Divorciarse
│
│ 🧩 STATUS: ONLINE | AUTH: OK
└──⟦ SΣC MODULΣ vX.1337 [ACTIVE] ⟧──┘`;

  const botones = [
    {
      type: 1,
      buttonId: `${usedPrefix}profile`,
      buttonText: { displayText: '🥀 Ver Perfil' }
    },
    {
      type: 1,
      buttonId: `${usedPrefix}menu`,
      buttonText: { displayText: '🌲 Menú Principal' }
    }
  ];

  const contexto = {
    forwardingScore: 1000,
    isForwarded: true,
    externalAdReply: {
      title: '🌪️ Configuración de Perfil',
      body: '⛩️ Administra tu identidad con Sukuna Bot ⛩️',
      thumbnailUrl: imageUrl,
      mediaType: 1,
      renderLargerThumbnail: true
    }
  };

  await conn.sendMessage(m.chat, {
    image: { url: icono },
    caption,
    footer: '🏞️ Sukuna Profile Manager',
    buttons: botones,
    viewOnce: true,
    contextInfo: contexto
  }, { quoted: m });

  await m.react('👻');
};

handler.command = ['perfildates', 'menuperfil'];
handler.tags = ['rg'];
handler.help = ['perfildates'];
handler.coin = 3;

export default handler;