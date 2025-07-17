let handler = async (m, { conn, args }) => {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
    let user = global.db.data.users[userId];
    let name = conn.getName(userId);
    let _uptime = process.uptime() * 1000;
    let uptime = clockString(_uptime);
    let totalreg = Object.keys(global.db.data.users).length;
    let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length;

    let txt = `
🌟 Hola, ${name} 🌟

> 📊 *Estadísticas del Bot*:
- \`Usuarios registrados:\` ${totalreg}
- \`Comandos disponibles:\` ${totalCommands}
- \`Tiempo activo:\` ${uptime}

> ✨ Usa los siguientes comandos para reproducir audios:

*☁️ _M E N U - A U D I O S_ ☁️*
======== • ✠ • ========
° _Tunometecabrasaramambiche_.
° _Me Anda Buscando Anonymous_.
° _Se Estan Riendiendo De Mi_.
° _Esto Va Ser Epico Papus_.
° _En Caso De Una Investigación_.
° _Elmo Sabe Donde Vives_.
° _Diagnosticado Con Gay_.
° _Esto Va Para Ti_.
° _Feliz Cumpleaños_.
° _Maldito Teni_.
° _Conoces a Miguel_.
° _Usted es Feo_.
° _Como Estan_.
° _Verdad Que Te Engañe_.
° _Hermoso Negro_.
° _Vivan Los Novios_.
° _Usted Esta Detenido_.
° _Su Nivel De Pendejo_.
° _Quien Es Tu Botsito_.
° _No Digas Eso Papus_.
° _No Me Hagas Usar Esto_.
° _No Me Hables_.
° _No Chupala_.
° _Nadie Te Pregunto_.
° _Mierda De Bot_.
° _Marica Tu_.
° _Ma Ma Masivo_.
° _La Oración_.
° _Lo Paltimos_.
° _Jesucristo_.
° _Juicioso_.
° _Homero Chino_.
° _Hora De Sexo_.
° _Gemidos_.
° _Gaspi Y La Minita_.
° _Gaspi Frase_.
° _Goku Pervertido_.
° _Fino Señores_.
° _Feliz Navidad_.
° _El Pepe_.
° _El Toxico_.
° _Corte Corte_.
° _Cambiate A Movistar_.
° _Buenas Noches_.
° _Bueno Si_.
° _Buenos Días_.
° _Bienvenido Wey_.
° _Bien Pensado Woody_.
° _Baneado_.
° _Basado_.
° _Ara Ara_.
° _Amongos_.
° _A Nadie Le Importa_.
° _Audio Hentai_.
° _Aguanta_.
° _OMG_.
° _Onichan_.
° _Orale_.
° _Pasa Pack_.
° _Pikachu_.
° _Pokemon_.
° _Potasio_.
° _Rawr_.
° _Siuuu_.
° _Takataka_.
° _Tarado_.
° _Teamo_.
° _TKA_.
° _Un Pato_.
° _WTF_.
° _Yamete_.
° _Yokese_.
° _Yoshi_.
° _ZZZZ_.
° _Bebesita_.
° _Calla Fan De BTS_.
° _Chiste_.
° _Contexto_.
° _Cagaste_.
° _Delibery_.
° _Donde Esta_.
° _Enojado_.
° _Entrada_.
° _Es Viernes_.
° _Estoy Triste_.
° _Feriado_.
° _Freefire_.
° _Hablame_.
° _Hey_.
° _In Your Area_.
° _Joder_.
° _Me Olvide_.
° _Me Pica Los Cocos_.
° _Me Voy_.
° _Mmmm_.
° _Momento XDS_.
° _Motivacion_.
° _Nico Nico_.
° _No Estes Tite_.
° _No Rompas Mas_.
° _Q Onda_.
° _Se Pubrio_.
° _Temazo_.
° _Tengo Los Calzones_.
° _Traiganle Una Falda_.
° _Una Pregunta_.
° _Vete A La VRG_.
° _:V_. 

 ──────────────────╮
.. ▶︎•||।||।।||।||।।|||।|||।। 0:43
╰──────────────────
⊰᯽⊱┈──╌❊╌──┈⊰᯽⊱
`.trim();

    await conn.sendMessage(m.chat, { 
        text: txt,
        contextInfo: {
            mentionedJid: [m.sender, userId],
            isForwarded: true,
            forwardingScore: 999,
            externalAdReply: {
                title: "MENU DE AUDIOS",
                body: "Comandos disponibles para reproducir audios",
                thumbnailUrl: 'https://files.catbox.moe/qnvpyq.jpg',
                sourceUrl: 'https://github.com/the-27/Rin-Itoshi-Bot-MD',
                mediaType: 1,
                showAdAttribution: true,
                renderLargerThumbnail: true,
            },
        },
    }, { quoted: m });
};

handler.help = ['menu2'];
handler.tags = ['menus'];
handler.command = ['menu2', 'menuaudios'];

export default handler;

function clockString(ms) {
    let seconds = Math.floor((ms / 1000) % 60);
    let minutes = Math.floor((ms / (1000 * 60)) % 60);
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return `${hours}h ${minutes}m ${seconds}s`;
}