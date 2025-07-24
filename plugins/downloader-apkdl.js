import fs from 'fs';
import fetch from 'node-fetch';

let apkSession = new Map();

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (command === 'apk2' && text) {
    try {
      const response = await fetch(`https://delirius-apiofc.vercel.app/download/apk?query=${encodeURIComponent(text)}`);
      const data = await response.json();
      if (!data.status || !data.data) throw new Error("No se encontró la aplicación.");
      
      const app = data.data;
      apkSession.set(m.chat, { app });

      let description = `\`\`\`◜ Apk - Download ◞\`\`\`\n\n`;
      description += `🌴 *Nombre:* ${app.name}\n`;
      description += `👤 *Desarrollador:* ${app.developer}\n`;
      description += `💾 *Publicado:* ${app.publish}\n`;
      description += `⚙️ *Tamaño:* ${app.size}\n`;
      description += `🖇️ *Descargas:* ${app.stats.downloads.toLocaleString()}\n`;

      const message = {
        image: { url: app.image },
        caption: description.trim(),
        footer: '📥 ¿Deseas descargar esta app?',
        templateButtons: [
          {
            index: 1,
            quickReplyButton: {
              displayText: '📥 Descargar',
              id: `${usedPrefix}apk_download`
            }
          }
        ]
      };

      await conn.sendMessage(m.chat, message, { quoted: m });

    } catch (error) {
      console.error("❌ Error:", error);
      await conn.sendMessage(m.chat, { text: `❌ Ocurrió un error: ${error.message || "Error desconocido"}` }, { quoted: m });
    }
    return;
  }

  // Botón de descarga
  if (command === 'apk_download') {
    let session = apkSession.get(m.chat);
    if (!session) {
      return conn.sendMessage(
        m.chat,
        { text: `❗ No hay sesión activa. Usa ${usedPrefix}apk <nombre>` },
        { quoted: m }
      );
    }

    let { app } = session;
    await conn.sendMessage(
      m.chat,
      {
        document: { url: app.download },
        mimetype: "application/vnd.android.package-archive",
        fileName: `${app.name}.apk`,
        caption: `🌪️ ${app.name}\n> 𝖯𑄜𝗐𝖾𝗋𝖾𝖽 𝖻𝗒 Shadow Core Club 💫`
      },
      { quoted: m }
    );
    return;
  }

  // Sin texto
  if (command === 'apk2' && !text) {
    return conn.sendMessage(
      m.chat,
      { text: `*❗ Ingresa el nombre de una aplicación para buscar.*\n\n📌 Ejemplo:\n${usedPrefix}apk2 WhatsApp` },
      { quoted: m }
    );
  }
};

handler.tags = ['descargas'];
handler.help = ['apk2', 'apk_download'];
handler.command = ['apk2', 'apk_download'];

export default handler;