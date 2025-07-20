import ws from 'ws';

let handler = async (m, { conn }) => {

  const connsActivas = global.conns.filter(conn =>
    conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED
  );
  
  const _muptime = process.uptime() * 1000
  const uptime = clockString(_muptime)

  const vistos = new Set();
  const subbotsUnicos = connsActivas.filter(conn => {
    const jid = conn.user?.jid || '';
    if (vistos.has(jid)) return false;
    vistos.add(jid);
    return true;
  });

  function convertirMsADiasHorasMinutosSegundos(ms) {
    let segundos = Math.floor(ms / 1000);
    let minutos = Math.floor(segundos / 60);
    let horas = Math.floor(minutos / 60);
    let dias = Math.floor(horas / 24);
    segundos %= 60;
    minutos %= 60;
    horas %= 24;

    let resultado = '';
    if (dias) resultado += `${dias}D, `;
    if (horas) resultado += `${horas}H, `;
    if (minutos) resultado += `${minutos}M, `;
    if (segundos) resultado += `${segundos}S`;
    return resultado.trim();
  }

  const totalSubs = subbotsUnicos.length;

  const lista = subbotsUnicos.map((bot, i) => {
    return `✦ 🧩 𝑩𝑶𝑻 #${i + 1} 
🧸 \`Usuario: ${bot.user?.name || '𝑺𝒖𝒃 𝑩𝒐𝒕'}
📲 \`Link:\` wa.me/${(bot.user?.jid || '').replace(/[^0-9]/g, '')}
⏳ \`En linea:\` ${bot.uptime ? convertirMsADiasHorasMinutosSegundos(Date.now() - bot.uptime) : '𝘿𝙚𝙨𝙘𝙤𝙣𝙤𝙘𝙞𝙙𝙤'}`;
  }).join('\n\n');

  const textoSubbots = totalSubs === 0
    ? '𝙉𝙤 𝙝𝙖𝙮 𝙎𝙪𝙗-𝘽𝙤𝙩𝙨 𝙖𝙘𝙩𝙞𝙫𝙤𝙨 𝙥𝙤𝙧 𝙖𝙝𝙤𝙧𝙖. 🌙'
    : `*✦ Subs Activos de SukunaBot-MD ✦*

> ⌛ *Tiempo Activo:* ${uptime}
> 🎄 *Subs conectados:* ${totalSubs}

  -  List de Subs Conectados  -

${lista}

> ${club}`;

  await conn.sendMessage(m.chat, {
    contextInfo: {
      externalAdReply: {
        title: "𝑺𝒖𝒃 𝑩𝒐𝒕𝒔 𝑶𝒏𝒍𝒊𝒏𝒆",
        body: "Sukuna Bot MD",
        thumbnailUrl: "https://files.catbox.moe/vm6opf.jpg",
        sourceUrl: redes,
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: false
      }
    },
    text: `${textoSubbots}`
  }, { quoted: fkontak });
};

handler.command = ['sockets', 'bots', 'socket'];
handler.tags = ['jadibot'];
handler.help = ['sockets'];

export default handler;


function clockString(ms) {
let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')}