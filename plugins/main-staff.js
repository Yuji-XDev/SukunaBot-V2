let handler = async (m, { conn, command, usedPrefix }) => {
let img = './src/catalogo.jpg'
let staff = `ᥫ᭡ *EQUIPO DE AYUDANTES* ❀
✰ *Dueño* ${creador}
✦ *Bot:* ${botname}
⚘ *Versión:* ${vs}
❖ *Libreria:* ${libreria} ${baileys}

❍ *Creador:*

ᰔᩚ Dev.Angel.Xyz.Li
> 🜸 Rol » *Creador*
> ✧ GitHub » https://github.com/Angelithoxz

❒ *Colaboradores:*

ᰔᩚ Barboza
> 🜸 Rol » *Developer*
> ✧ GitHub » https://github.com/Elrebelde1

ᰔᩚ Niño Piña
> 🜸 Rol » *Developer*
> ✧ GitHub » https://github.com/WillZek

✧ Izumi
> 🜸 Rol » *Developer*
> ✧ GitHub » https://github.com/Izumi-kzx

✧ Neo Tokio
> 🜸 Rol » *Developer*
> ✧ GitHub » https://github.com/TOKIO5025`
await conn.sendFile(m.chat, img, 'nino.jpg', staff.trim(), m)
}
  
handler.help = ['staff']
handler.command = ['colaboradores', 'staff']
handler.register = true
handler.tags = ['main']

export default handler
