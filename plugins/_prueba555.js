import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const url = args[0];
  if (!url || !url.includes('spotify.com/album')) {
    return m.reply(`╭───〔 *📀 Descargador Spotify Álbum* 〕───⬣
┃ ✦ *Ejemplo:*
┃ ${usedPrefix + command} https://open.spotify.com/album/22DL6IRGNYNenKej7aw8pO
╰━━━━━━━━━━━━━━━━━━⬣`);
  }

  try {
    const res = await fetch(`https://delirius-apiofc.vercel.app/download/spotifyalbum?url=${url}`);
    if (!res.ok) throw '❌ Error al obtener datos del álbum.';
    
    const json = await res.json();
    if (!json.estado || !json.datos) throw '⚠️ Álbum no encontrado o datos incompletos.';

    const datos = json.datos;
    const pistas = json.pistas || [];

    let texto = `╭━━〔 *🎧 SPOTIFY ÁLBUM* 〕━━⬣
┃ 📀 *Nombre:* ${datos.nombre}
┃ 📅 *Publicado:* ${datos.publicar}
┃ 💿 *Total de pistas:* ${datos.total_pistas}
┃ 🏷 *Derechos:* ${datos['derechos de autor']}
┃ 🔗 *Enlace:* ${datos.enlace}
╰━━━━━━━━━━━━━━━━━━⬣\n\n`;

    texto += `╭───〔 *📝 Lista de Canciones* 〕───⬣\n`;
    pistas.forEach((track, index) => {
      texto += `┃ ${index + 1}. ${track.nombre} (${track.duracion})\n`;
    });
    texto += `╰━━━━━━━━━━━━━━━━━━⬣`;

    await conn.sendFile(m.chat, datos.imagen, 'cover.jpg', texto, m);
  } catch (e) {
    console.error(e);
    m.reply('❌ Ocurrió un error al obtener la información del álbum.');
  }
};

handler.command = ['spotifyalbum', 'albumspotify'];
handler.help = ['spotifyalbum <url>'];
handler.tags = ['descargas', 'spotify'];

export default handler;