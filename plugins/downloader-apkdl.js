import fs from 'fs';
import fetch from 'node-fetch';

let apkSession = new Map();
let handler = async (m, { conn, text, usedPrefix, command }) => {

  if (command === 'apk2' && text) {
    
    try {
    
      const response = await fetch(`https://delirius-apiofc.vercel.app/download/apk?query=${encodeURIComponent(text)}`);
      const data = await response.json();
      if (!data.status || !data.data)
        throw new Error("No se encontró la aplicación.");
      
      const app = data.data;
      apkSession.set(m.chat, { app });
      
      
      let description = `\`\`\`◜Apk - Download◞\`\`\`\n\n`;
      description += `🌴 *\`Nombre:\`* ${app.name}\n`;
      description += `👤 *\`Desarrollador:\`* ${app.developer}\n`;
      description += `💾 *\`Publicado:\`* ${app.publish}\n`;
      description += `⚙️ *\`Tamaño:\`* ${app.size}\n`;
      description += `🖇️ *\`Descargas:\`* ${app.stats.downloads.toLocaleString()}\n`;
      description += `> ${dev}`;
      

      const buttons = [
        {
          buttonId: `${usedPrefix}apk_download`,
          buttonText: { displayText: "📥 Descargar" },
          type: 1
        }
      ];
      
      await conn.sendMessage(
        m.chat,
        {
          image: { url: app.image },
          caption: description,
          buttons: buttons,
          viewOnce: true
        },
        { quoted: m }
      );
    } catch (error) {
      console.error("❌ Error:", error);
      await conn.sendMessage(
        m.chat,
        { react: { text: '❌', key: reactionMessage.key } },
        { quoted: m }
      );
      await conn.sendMessage(
        m.chat,
        { text: `❌ Ocurrió un error: ${error.message || "Error desconocido"}` },
        { quoted: m }
      );
    }
    return;
  }
  
  // Rama: Al pulsar el botón de descarga (.apk_download)
  if (command === 'apk_download') {
    let session = apkSession.get(m.chat);
    if (!session) {
      return conn.sendMessage(
        m.chat,
        { text: `❗ No hay sesión activa. Realiza una búsqueda usando ${usedPrefix}apk <nombre de la aplicación>.` },
        { quoted: m }
      );
    }
    let { app } = session;
    const downloadUrl = app.download;
    // Enviar el archivo APK como documento
    /*
    await conn.sendMessage(
      m.chat,
      {
        document: { url: downloadUrl },
        mimetype: "application/vnd.android.package-archive",
        fileName: `${app.name}.apk`,
        caption: `🌪️ ${app.name}\n> ⋆⬪࣪ꥈ🥮★ 𝖯𑄜𝗐𝖾𝗋𝖾𝖽 𝖻𝗒 𝖲𝗁⍺𝖽ᦅ𝗐′core 𝖢𝗅𝗎𝖻𓆪`
      },
      { quoted: m }*/
      
      
     const caption = `*${app.name}*\n> ${club}`;
    await conn.sendMessage(m.chat, {
      document: { url: downloadUrl },
      fileName: `${app.name}.apk`,
      mimetype: 'application/vnd.android.package-archive',
      caption,
      thumbnail: app.image,
      contextInfo: {
        externalAdReply: {
          title: app.name,
          body: bot,
          mediaUrl: null,
          sourceUrl: null,
          thumbnailUrl: app.image,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });
    return;
  }


  if (command === 'apk2' && !text) {
    let example = `${usedPrefix}apk WhatsApp`;
    return conn.sendMessage(
      m.chat,
      { text: `*❗ Ingresa un término de búsqueda.*\n\n\`Ejemplo:\` ${example}` },
      { quoted: m }
    );
  }
};

handler.tags = ['descargas']; 
handler.help = ['apk2', 'apk_download']; 
handler.command = ['apk2', 'apk_download'];
export default handler;