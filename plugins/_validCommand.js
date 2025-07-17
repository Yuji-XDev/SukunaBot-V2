//código hecho por Angelithoxyz no quites créditos 
// canal oficial 
//https://whatsapp.com/channel/0029Vaz6RTR0LKZIKwudX32x

export async function before(m) {
  if (!m.text || !global.prefix.test(m.text)) return

  const usedPrefix = global.prefix.exec(m.text)[0]
  const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase()
  if (!command || command === 'bot') return

  const validCommand = (cmd, plugins) => {
    for (let plugin of Object.values(plugins)) {
      if (!plugin.command) continue
      let cmds = Array.isArray(plugin.command) ? plugin.command : [plugin.command]
      if (cmds.includes(cmd)) return true
    }
    return false
  }

  if (validCommand(command, global.plugins)) {
    let chat = global.db.data.chats[m.chat]
    let user = global.db.data.users[m.sender]

    if (chat.isBanned) {
      const aviso = `🚫 *${botname}* está desactivado en este grupo, nya~ 💔\n\n🛡️ Un *admin-sama* puede activarlo con:\n➤ *${usedPrefix}bot on*`
      await m.reply(aviso)
      return
    }

    user.commands = (user.commands || 0) + 1
  } else {
    const comando = m.text.trim().split(' ')[0]
    const allCommands = []

    for (let plugin of Object.values(global.plugins)) {
      if (!plugin.command) continue
      let cmds = Array.isArray(plugin.command) ? plugin.command : [plugin.command]
      allCommands.push(...cmds.map(cmd => usedPrefix + cmd))
    }

    // 🌸 Función simple para buscar comandos parecidos
    function buscarSimilares(base, lista) {
      const puntuacion = (a, b) => {
        let iguales = 0
        for (let i = 0; i < Math.min(a.length, b.length); i++) {
          if (a[i] === b[i]) iguales++
        }
        return iguales / Math.max(a.length, b.length)
      }
      return lista
        .map(cmd => ({ cmd, score: puntuacion(base, cmd) }))
        .filter(e => e.score >= 0.3)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
    }

    const sugerencias = buscarSimilares(comando, allCommands)

    let respuesta = `💢 *Comando no encontrado, nya~*\n\n`
    respuesta += `🌸 El comando *${comando}* no existe o está mal escrito.\n`
    respuesta += `📖 Usa *${usedPrefix}help* para ver la lista completa de comandos.\n`

    if (sugerencias.length > 0) {
      respuesta += `\n💡 Quizás quisiste decir:\n`
      for (let s of sugerencias) {
        let porcentaje = (s.score * 100).toFixed(1)
        respuesta += `➤ ${s.cmd} (${porcentaje}%)\n`
      }
    }

    respuesta += `\n✨ ¡Sigue intentándolo, confío en ti~! >w<`

    await m.reply(respuesta)
  }
}