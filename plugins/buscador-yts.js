import fetch from 'node-fetch';
import FormData from 'form-data';
import { generateWAMessageContent, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`🌪️ *Ejemplo:* ${usedPrefix + command} Bad Bunny`);

  await m.react('🕓');

  const apiURL = `https://dark-core-api.vercel.app/api/search/youtube?key=api&text=${encodeURIComponent(text)}`;
  const res = await fetch(apiURL);
  const json = await res.json();

  if (!json.success || !json.results || json.results.length === 0) {
    return m.reply('❌ No se encontraron resultados en YouTube.');
  }

  const videos = json.results.slice(0, 10);
  shuffleArray(videos);

  const push = [];

  for (const video of videos) {
    const imageResponse = await fetch(video.miniatura);
    const imageBuffer = await imageResponse.buffer();
    const enhancedImage = await remini(imageBuffer, 'enhance');

    push.push({
      body: proto.Message.InteractiveMessage.Body.fromObject({
        text: `◦ *Título:* ${video.titulo}\n◦ *Duración:* ${video.duracion}\n◦ *Vistas:* ${video.vistas.toLocaleString()}`
      }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: `📺 Canal: ${video.canal}` }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        hasMediaAttachment: true,
        imageMessage: await createImage(enhancedImage, conn)
      }),
      nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        buttons: [
          {
            name: 'cta_copy',
            buttonParamsJson: JSON.stringify({
              display_text: '🎧 Descargar Audio',
              copy_code: `.ytmp3 ${video.url}`
            })
          },
          {
            name: 'cta_copy',
            buttonParamsJson: JSON.stringify({
              display_text: '📹 Descargar Video',
              copy_code: `.ytmp4 ${video.url}`
            })
          }
        ]
      })
    });
  }

  const message = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          body: { text: `*🍓 Resultados para:* *${text}*` },
          footer: { text: 'Toca "copiar", luego envía el comando 📥' },
          header: { hasMediaAttachment: false },
          carouselMessage: { cards: push }
        })
      }
    }
  }, { quoted: m });

  await conn.relayMessage(m.chat, message.message, { messageId: message.key.id });
  await m.react('✅');
};

handler.help = ['ytsearch', 'yts'];
handler.tags = ['search'];
handler.command = ['ytsearch', 'yts'];

export default handler;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function createImage(img, conn) {
  const { imageMessage } = await generateWAMessageContent({ image: img }, { upload: conn.waUploadToServer });
  return imageMessage;
}

async function remini(imageData, operation) {
  return new Promise((resolve, reject) => {
    const ops = ["enhance", "recolor", "dehaze"];
    operation = ops.includes(operation) ? operation : "enhance";
    const baseUrl = `https://inferenceengine.vyro.ai/${operation}.vyro`;

    const formData = new FormData();
    formData.append("image", Buffer.from(imageData), { filename: "image.jpg", contentType: "image/jpeg" });
    formData.append("model_version", 1);

    formData.submit({ url: baseUrl, protocol: "https:" }, (err, res) => {
      if (err) return reject(err);
      const chunks = [];
      res.on("data", chunk => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", err => reject(err));
    });
  });
}