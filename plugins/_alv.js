import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let query = args.join(' ');
  if (!query) {
    return m.reply(`❗ *Debes escribir el nombre o enlace de la playlist de Spotify.*\n\n📌 *Ejemplo:* \n${usedPrefix + command} This Is Chase Atlantic\n${usedPrefix + command} https://open.spotify.com/playlist/37i9dQZF1DZ06evO4gtw7S`);
  }

  try {
    let apiUrl = '';
    if (query.includes('open.spotify.com/playlist')) {

      apiUrl = `https://delirius-apiofc.vercel.app/download/spotifyplaylist?url=${query}`;
    } else {
    
      const search = await fetch(`https://delirius-apiofc.vercel.app/search/spotifyplaylist?query=${encodeURIComponent(query)}`);
      const result = await search.json();
      if (!result.status || !result.result?.url) {
        return m.reply('❌ No se encontró ninguna playlist con ese nombre.');
      }
      apiUrl = `https://delirius-apiofc.vercel.app/download/spotifyplaylist?url=${result.result.url}`;
    }

    const res = await fetch(apiUrl);
    const json = await res.json();

    if (!json.status || !json.data || !json.tracks || json.tracks.length === 0) {
      return m.reply('❌ No se pudo obtener la información de la playlist.');
    }

    const { name, description, image, followers } = json.data;
    const tracks = json.tracks.map((t, i) => `*${i + 1}. ${t.title}* - ${t.artist} (${t.duration})`).join('\n');

    const text = `
╭─〔 *🎧 PLAYLIST DE SPOTIFY* 〕─⬣
┃ 💿 *Nombre:* ${name}
┃ 📝 *Descripción:* ${description || 'Sin descripción'}
┃ 👥 *Seguidores:* ${followers}
┃ 🎶 *Canciones:* ${json.tracks.length}
╰──────────────⬣

${tracks.slice(0, 15)}${json.tracks.length > 15 ? '\n\n*⚠️ Lista recortada, hay más canciones...*' : ''}
`.trim();

    await conn.sendFile(m.chat, image, 'playlist.jpg', text, m);
  } catch (e) {
    console.error(e);
    m.reply('⚠️ Ocurrió un error al procesar la playlist.');
  }
};

handler.command = /^spotifyplaylist|spplaylist|playlist$/i;
export default handler;