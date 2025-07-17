// Shadow'Core
import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;

  const getPais = (numero) => {
    const paisesPorPrefijo = {
      "1": "🇺🇸 Estados Unidos",
      "34": "🇪🇸 España",
      "52": "🇲🇽 México",
      "54": "🇦🇷 Argentina",
      "55": "🇧🇷 Brasil",
      "56": "🇨🇱 Chile",
      "57": "🇨🇴 Colombia",
      "58": "🇻🇪 Venezuela",
      "591": "🇧🇴 Bolivia",
      "593": "🇪🇨 Ecuador",
      "595": "🇵🇾 Paraguay",
      "598": "🇺🇾 Uruguay",
      "502": "🇬🇹 Guatemala",
      "503": "🇸🇻 El Salvador",
      "504": "🇭🇳 Honduras",
      "505": "🇳🇮 Nicaragua",
      "506": "🇨🇷 Costa Rica",
      "507": "🇵🇦 Panamá",
      "51": "🇵🇪 Perú",
      "53": "🇨🇺 Cuba",
      "91": "🇮🇳 India"
    };
    for (let i = 1; i <= 3; i++) {
      const prefijo = numero.slice(0, i);
      if (paisesPorPrefijo[prefijo]) return paisesPorPrefijo[prefijo];
    }
    return "🌎 Desconocido";
  };

  const numeroUsuario = m.messageStubParameters[0].split('@')[0];
  const pais = getPais(numeroUsuario);

  
  const fecha = new Date().toLocaleDateString('es-PE', { timeZone: 'America/Lima' });
  const hora = new Date().toLocaleTimeString('es-PE', { timeZone: 'America/Lima' });

  const fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net"}

  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://files.catbox.moe/04u4qi.jpg');
  let img = await (await fetch(`${pp}`)).buffer();
  let chat = global.db.data.chats[m.chat];
  let txt = `🗙🖫︎⟆ 𝗕 𝗜 𝗘 𝗡 𝗩 𝗘 𝗡 𝗜 𝗗 𝗢⟆🗙🖫︎`;
  let txt1 = `🗙🖫︎⟆ 𝗔 𝗗 𝗜 𝗢 𝗦 ⟆🗙🖫`;
  let groupSize = participants.length;
  if (m.messageStubType == 27) groupSize++;
  else if (m.messageStubType == 28 || m.messageStubType == 32) groupSize--;

  if (chat.welcome && m.messageStubType == 27) {
    let bienvenida = `╭┈ ↷
│ ✐ ❮ 🌴 \`𝐖ᥱᥣᥴ᥆mᥱ\` 🌾  ❯
│ 🪷 *Usᴜᴀʀɪᴏ ▷* @${m.messageStubParameters[0].split`@`[0]}
│ 🎓 *Mɪᴇᴍʙʀᴏs:* ${groupSize}
│ 🧭 *Pᴀɪs:* ${pais}
│ 📜 *Fᴇᴄʜᴀ:* ${fecha}
│ 🕊️ *Hᴏʀᴀ:* ${hora}
│ 👻 *Gʀᴜᴘᴏ:*
│ ≡ ${groupMetadata.subject}
╰̇╌̣╌̇╌̣━̇━̣╴╴╴╴╴╴╴╴╴╴̣━̇━̣╌̇╌̣╌̇

> 🛠 \`\`\`ᴜsᴀ #ᴍᴇɴᴜ ᴘᴀʀᴀ ᴠᴇʀ ʟᴏs ᴄᴏᴍᴀɴᴅᴏs ᴅɪsᴘᴏɴɪʙʟᴇs.\`\`\``;

    await conn.sendMini(m.chat, txt, dev, bienvenida, img, img, redes, fkontak);
  }

  if (chat.welcome && (m.messageStubType == 28 || m.messageStubType == 32)) {
    let bye = `           *↷❮ 🎭 𝐀𝐃𝐈Ó𝐒 🎭 ❯*
🎯 𝐔sᥙᥲrі᥆ ⑄▷@${m.messageStubParameters[0].split`@`[0]}*
🧮 𝐌іᥱmᑲr᥆s : ${groupSize}
🗺️ 𝐏ᥲís : ${pais}
📆 𝐅ᥱᥴһᥲ : ${fecha}
🕒 𝐇᥆rᥲ : ${hora}
🏷️ 𝐆rᥙ⍴᥆ : ${groupMetadata.subject}

*${global.welcom2}*

> 🛠 \`\`\`ᴜsᴀ #ᴍᴇɴᴜ ᴘᴀʀᴀ ᴠᴇʀ ʟᴏs ᴄᴏᴍᴀɴᴅᴏs ᴅɪsᴘᴏɴɪʙʟᴇs.\`\`\``;

    await conn.sendMini(m.chat, txt1, dev, bye, img, img, redes, fkontak);
  }
}