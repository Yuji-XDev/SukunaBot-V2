import chalk from 'chalk'
import fetch from 'node-fetch'
import ws from 'ws'
let WAMessageStubType = (await import('@whiskeysockets/baileys')).default
import { readdirSync, unlinkSync, existsSync, promises as fs, rmSync } from 'fs'
import path from 'path'

let handler = m => m
handler.before = async function (m, { conn, participants, groupMetadata }) {
if (!m.messageStubType || !m.isGroup) return
const fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net"}  
let chat = global.db.data.chats[m.chat]
let usuario = `@${m.sender.split`@`[0]}`
let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://files.catbox.moe/xr2m6u.jpg'
let nombre, foto, edit, newlink, status, admingp, noadmingp
nombre = `╭─⃟⃝🦋𖥔 ˚ ༘♡ ⋆｡˚ ❀ ˚༄𖥔🦋⃟⃝─╮
┃ ✦ 𝑨𝑪𝑻𝑼𝑨𝑳𝑰𝒁𝑨𝑪𝑰𝑶́𝑵 𝑫𝑬𝑳 𝑵𝑶𝑴𝑩𝑹𝑬
┃
┃ ☯️ 𝙐𝙨𝙪𝙖𝙧𝙞𝙤: *${usuario}*
┃ 🖋️ 𝘼𝙘𝙖𝙗𝙖 𝙙𝙚 𝙢𝙤𝙙𝙞𝙛𝙞𝙘𝙖𝙧 𝙚𝙡 𝙣𝙤𝙢𝙗𝙧𝙚 𝙙𝙚𝙡 𝙜𝙧𝙪𝙥𝙤.
┃
┃ 🪄 𝙉𝙪𝙚𝙫𝙤 𝙣𝙤𝙢𝙗𝙧𝙚:
┃ ❝ *${m.messageStubParameters[0]}* ❞
╰───╼⃝🦋𖥔﹏﹏𖥔⃟🦋⃟⃝╾───╯`

foto = `╭─⃝💥 𖥔 𝙄𝙈𝘼𝙂𝙀𝙉 𝙀𝙉 𝘾𝘼𝙈𝘽𝙄𝙊 𖥔 💖⃝─╮
┃  
┃ 🎄 𝙀𝙡 𝙪𝙨𝙪𝙖𝙧𝙞𝙤 *${usuario}*
┃ ha actualizado la imagen del grupo.
┃  
╰─╼⃝🎴𖥔✧⊹˚₊‧✦‧₊˚⊹✧𖥔🎴⃝╾─╯`

edit = `╭─⃟⚙️༺ 𝘾𝙊𝙉𝙁𝙄𝙂 𝙂𝙍𝙐𝙋𝘼𝙇 ༻⚙️⃟─╮
┃  
┃ ✎ 𝙐𝙨𝙪𝙖𝙧𝙞𝙤: *${usuario}*
┃ 🔄 𝙃𝙖 𝙘𝙖𝙢𝙗𝙞𝙖𝙙𝙤 𝙡𝙖 𝙘𝙤𝙣𝙛𝙞𝙜𝙪𝙧𝙖𝙘𝙞𝙤́𝙣.
┃  
${m.messageStubParameters[0] == 'on' ?
'┃ 🔒 𝙈𝙤𝙙𝙤: *Solo administradores* pueden configurar.'
:
'┃ 🔓 𝙈𝙤𝙙𝙤: *Todos los miembros* pueden configurar.'}
╰──────⚙️𓂃 ✦ 𓂃⚙️──────╯`


newlink = `╭─⃟🔗༺ 𝙀𝙉𝙇𝘼𝘾𝙀 𝙍𝙀𝙂𝙀𝙉𝙀𝙍𝘼𝘿𝙊 ༻🔗⃟─╮
┃  
┃ 👤 𝘼𝙪𝙩𝙤𝙧: *${usuario}*
┃ 🌐 𝙎𝙚 𝙝𝙖 𝙘𝙧𝙚𝙖𝙙𝙤 𝙪𝙣 𝙣𝙪𝙚𝙫𝙤 𝙚𝙣𝙡𝙖𝙘𝙚 𝙙𝙚 𝙞𝙣𝙫𝙞𝙩𝙖𝙘𝙞𝙤́𝙣.
╰───────🔗𖥔⚜️𖥔🔗───────╯`


status = `
╭─⃝🛡️༺ 𝙈𝙊𝘿𝙊 𝘿𝙀 𝙂𝙍𝙐𝙋𝙊 ༻🛡️⃝─╮
┃  
┃ ⚙️ Acción de: *${usuario}*
${m.messageStubParameters[0] == 'on' ?
'┃ 🔒 Grupo cerrado — *Solo admins* pueden escribir.'
:
'┃ 🔓 Grupo abierto — *Todos* pueden participar.'}
╰─────🛡️──𓆩⚖️𓆪──🛡️─────╯`


admingp = `╭─⃝༺ 𝘼𝘿𝙈𝙄𝙉 𝙉𝙊𝙈𝘽𝙍𝘼𝘿𝙊 ༻⃝─╮
┃  
┃ 🧬 *@${m.messageStubParameters[0].split`@`[0]}*
┃ 𝘼𝙝𝙤𝙧𝙖 𝙩𝙞𝙚𝙣𝙚 𝙥𝙤𝙙𝙚𝙧 𝙚𝙣 𝙚𝙡 𝙜𝙧𝙪𝙥𝙤.
┃  
┃ 📜 Otorgado por: *${usuario}*
╰─────👑𖥔─⚔️─𖥔👑─────╯`


noadmingp = `╭─⃝༺ 𝘼𝙐𝙏𝙊𝙍𝙄𝘿𝘼𝘿 𝙍𝙀𝙑𝙊𝘾𝘼𝘿𝘼 ༻⃝─╮
┃  
┃ 🔻 *@${m.messageStubParameters[0].split`@`[0]}*
┃ 𝙃𝙖 𝙥𝙚𝙧𝙙𝙞𝙙𝙤 𝙨𝙪 𝙥𝙤𝙨𝙞𝙘𝙞𝙤́𝙣 𝙙𝙚 𝙖𝙙𝙢𝙞𝙣.
┃
┃ 🗡️ Ejecutado por: *${usuario}*
╰──────⚠️𖥔─💢─𖥔⚠️──────╯`

if (chat.detect && m.messageStubType == 2) {
const uniqid = (m.isGroup ? m.chat : m.sender)
const sessionPath = './Sessions/'
for (const file of await fs.readdir(sessionPath)) {
if (file.includes(uniqid)) {
await fs.unlink(path.join(sessionPath, file))
console.log(`${chalk.yellow.bold('[ Archivo Eliminado ]')} ${chalk.greenBright(`'${file}'`)}\n` +
`${chalk.blue('(Session PreKey)')} ${chalk.redBright('que provoca el "undefined" en el chat')}`
)}}

} else if (chat.detect && m.messageStubType == 21) {
await this.sendMessage(m.chat, { text: nombre, mentions: [m.sender] }, { quoted: fkontak })  
} else if (chat.detect && m.messageStubType == 22) {
await this.sendMessage(m.chat, { image: { url: pp }, caption: foto, mentions: [m.sender] }, { quoted: fkontak })
} else if (chat.detect && m.messageStubType == 23) {
await this.sendMessage(m.chat, { text: newlink, mentions: [m.sender] }, { quoted: fkontak })
} else if (chat.detect && m.messageStubType == 25) {
await this.sendMessage(m.chat, { text: edit, mentions: [m.sender] }, { quoted: fkontak })  
} else if (chat.detect && m.messageStubType == 26) {
await this.sendMessage(m.chat, { text: status, mentions: [m.sender] }, { quoted: fkontak })  
} else if (chat.detect && m.messageStubType == 29) {
await this.sendMessage(m.chat, { text: admingp, mentions: [`${m.sender}`,`${m.messageStubParameters[0]}`] }, { quoted: fkontak })
} else if (chat.detect && m.messageStubType == 30) {
await this.sendMessage(m.chat, { text: noadmingp, mentions: [`${m.sender}`,`${m.messageStubParameters[0]}`] }, { quoted: fkontak })
} else {
if (m.messageStubType == 2) return
console.log({messageStubType: m.messageStubType,
messageStubParameters: m.messageStubParameters,
type: WAMessageStubType[m.messageStubType], 
})
}}
export default handler
