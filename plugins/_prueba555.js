import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const domain = args[0];

  if (!domain) {
    return m.reply(`❗ *Debes proporcionar un dominio*\n\nEjemplo:\n${usedPrefix + command} github.com`);
  }

  try {
    const res = await fetch(`https://api.eliasaryt.pro/api/resolvedns?domain=${domain}`);
    const json = await res.json();

    if (json.Estado !== 0) {
      return m.reply(`❌ Error al resolver el dominio.`);
    }

    let respuesta = json.Respuesta?.map(r => `🌐 *IP:* ${r.datos}\n📦 *TTL:* ${r.TTL}`).join("\n\n") || "Sin respuesta DNS.";

    let texto = `╭━━〔 *🔍 DNS Lookup* 〕━━⬣
┃ 🧿 *Dominio:* ${domain}
┃ 📥 *Resuelto:* ${json.RD ? 'Sí' : 'No'}
┃ 📡 *Recursivo:* ${json.RA ? 'Sí' : 'No'}
┃ 💬 *Comentario:* ${json.Comentario}
┃ 👤 *API:* ${json.Creador}
╰━━─⊰

${respuesta}
`;

    await m.reply(texto);
  } catch (e) {
    console.error(e);
    m.reply('⚠️ Error al obtener los datos. Intenta más tarde.');
  }
};

handler.help = ['dnslookup <dominio>'];
handler.tags = ['tools'];
handler.command = ['dnslookup', 'resolvedns'];

export default handler;