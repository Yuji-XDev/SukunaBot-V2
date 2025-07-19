/*import fetch from 'node-fetch';

const handler = async (m, { conn, text, command }) => {
  if (!text || !text.includes('spotify.com')) {
    return m.reply('🎧 *Por favor, ingresa un enlace válido de Spotify.*');
  }

  await m.react('⏳');

  try {
    const res = await fetch(`https://api.nekorinn.my.id/downloader/spotifyplay?q=${encodeURIComponent(text)}`);
    if (!res.ok) throw new Error();

    const json = await res.json();
    if (!json.result?.downloadUrl) throw new Error();

    const info = json.result;

    let thumb = null;
    try {
      const img = await conn.getFile(info.cover);
      thumb = img?.data;
    } catch (e) {
      console.warn('No se pudo obtener la portada.');
    }

    await conn.sendMessage(m.chat, {
      audio: { url: info.downloadUrl },
      fileName: `${info.title}.mp3`,
      mimetype: 'audio/mpeg',
      ptt: false,
      contextInfo: {
        externalAdReply: {
          title: info.title,
          body: `Spotify Music`,
          thumbnail: thumb,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    await m.react('✅');
  } catch (e) {
    console.error('[SPOTIFY ERROR]', e);
    await m.reply('❌ Ocurrió un error al procesar la canción de Spotify.');
    await m.react('❌');
  }
};

handler.help = ['music <link>'];
handler.tags = ['descargas'];
handler.command = ['music'];
handler.register = true;
handler.limit = 2;

export default handler;*/

import axios from "axios";
import * as cheerio from "cheerio";

const client_id = "acc6302297e040aeb6e4ac1fbdfd62c3";
const client_secret = "0e8439a1280a43aba9a5bc0a16f3f009";
const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

const getToken = async () => {
  const res = await axios.post(
    TOKEN_ENDPOINT,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: "Basic " + basic,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return res.data.access_token;
};

const handler = async (m, { conn, text }) => {
  if (!text || !/https?:\/\/(open\.)?spotify\.com\/track\/[a-zA-Z0-9]+/.test(text))
    return m.reply("🌴 Ingresa una URL válida de Spotify (track).");

  await conn.sendMessage(m.chat, { react: { text: "⌛", key: m.key } });

  try {
    const token = await getToken();
    const id = text.split("/track/")[1].split("?")[0];
    const res = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const track = await res.json();
    const thumb = track.album.images[0]?.url;

    const data = new SpotMate();
    const info = await data.convert(track.external_urls.spotify);

    if (!info || !info.url) throw new Error("URL no disponible en SpotMate.");

    await conn.sendMessage(m.chat, {
      audio: { url: info.url },
      fileName: `${info.title || 'spotify_track'}.mp3`,
      mimetype: 'audio/mpeg',
      ptt: false,
      contextInfo: {
        externalAdReply: {
          title: info.title || track.name,
          body: 'Descarga completa 🌾',
          thumbnail: thumb,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    m.reply("❌ No se pudo obtener la canción. Intenta de nuevo más tarde.\n\n" + err.message);
  }
};

handler.help = ['music <link>'];
handler.tags = ['descargas'];
handler.command = ['music'];

export default handler;


class SpotMate {
  constructor() {
    this._cookie = null;
    this._token = null;
  }

  async _visit() {
    try {
      const response = await axios.get('https://spotmate.online/en', {
        headers: { 'user-agent': 'Mozilla/5.0' },
      });

      const setCookieHeader = response.headers['set-cookie'];
      if (setCookieHeader) {
        this._cookie = setCookieHeader.map((cookie) => cookie.split(';')[0]).join('; ');
      }

      const $ = cheerio.load(response.data);
      this._token = $('meta[name="csrf-token"]').attr('content');
      if (!this._token) throw new Error('Token CSRF no encontrado.');
    } catch (error) {
      throw new Error(`Error visitando SpotMate: ${error.message}`);
    }
  }

  async convert(spotifyUrl) {
    if (!this._cookie || !this._token) await this._visit();

    try {
      const response = await axios.post(
        'https://spotmate.online/convert',
        { urls: spotifyUrl },
        {
          headers: this._getHeaders(),
          transformResponse: [(data) => {
            try {
              return JSON.parse(data);
            } catch {
              throw new Error('Respuesta inválida de SpotMate (no es JSON válido).');
            }
          }]
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error al convertir canción: ${error.message}`);
    }
  }

  _getHeaders() {
    return {
      'accept': '*/*',
      'content-type': 'application/json',
      'cookie': this._cookie,
      'origin': 'https://spotmate.online',
      'referer': 'https://spotmate.online/en',
      'user-agent': 'Mozilla/5.0',
      'x-csrf-token': this._token,
    };
  }
}