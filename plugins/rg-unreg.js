let handler = async (m, { conn, text }) => {

let user = global.db.data.users[m.sender]

user.registered = false
return conn.reply(m.chat,`╔══❖═══『⚠️』═══❖══╗
     ${emoji} *Registro eliminado*
╚══❖══════❖═══════╝

🕯️ 𝘛𝘶 𝘳𝘢𝘴𝘵𝘳𝘰 𝘧𝘶𝘦 𝘣𝘰𝘳𝘳𝘢𝘥𝘰 𝘥𝘦 𝘭𝘢 𝘣𝘢𝘴𝘦 𝘥𝘦 𝘥𝘢𝘵𝘰𝘴...
📜 𝘛𝘶 𝘩𝘪𝘴𝘵𝘰𝘳𝘪𝘢 𝘲𝘶𝘦𝘥𝘢 𝘢𝘩𝘰𝘳𝘢 𝘦𝘯 𝘭𝘰𝘴 𝘳𝘦𝘤𝘶𝘦𝘳𝘥𝘰𝘴...

🥀 𝙎𝙤𝙡𝙤 𝙦𝙪𝙚𝙙𝙖 𝙚𝙡 𝙨𝙞𝙡𝙚𝙣𝙘𝙞𝙤...`, m, rcanal);

}
handler.help = ['unreg']
handler.tags = ['rg']
handler.command = ['unreg']
handler.register = true
export default handler
