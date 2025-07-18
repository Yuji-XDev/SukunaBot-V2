import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

let handler = async (m, { conn, usedPrefix, command }) => {

  let img = 'https://dark-core-api.vercel.app/api/random/ass?key=api';
  let text = '🍑 *Disfruta tu ración de... arte digital 🙈*';
  let footer = 'Solicitado por ' + m.pushName;

  const template = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
    templateMessage: {
      hydratedTemplate: {
        imageMessage: { url: img },
        hydratedContentText: text,
        hydratedFooterText: footer,
        hydratedButtons: [
          {
            quickReplyButton: {
              displayText: '➡️ Siguiente',
              id: usedPrefix + command
            }
          }
        ]
      }
    }
  }), { userJid: m.sender });

  await conn.relayMessage(m.chat, template.message, { messageId: template.key.id });
  m.react('✅');
};

handler.help = ['culo'];
handler.tags = ['nsfw'];
handler.command = ['culo'];

export default handler;