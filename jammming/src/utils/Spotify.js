// src/utils/Spotify.js
const clientId = '57d9c5bcf55f4985a6cc6224c481b8af';
const redirectUri = 'http://127.0.0.1:5173/';
const TOKEN_KEY = 'spotify_access_token';

function getStoredToken() {
  const stored = localStorage.getItem(TOKEN_KEY);
  if (!stored) return null;
  const { token, expiresAt } = JSON.parse(stored);
  if (Date.now() > expiresAt) {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
  return token;
}

function storeToken(token, expiresIn) {
  const expiresAt = Date.now() + expiresIn * 1000;
  localStorage.setItem(TOKEN_KEY, JSON.stringify({ token, expiresAt }));
}

// 生成随机字符串
function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// 生成 code challenge
async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// 发起 PKCE 授权流程
async function startPKCEAuth() {
  const codeVerifier = generateRandomString(128);
  sessionStorage.setItem('spotify_code_verifier', codeVerifier);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&code_challenge_method=S256&code_challenge=${codeChallenge}&scope=playlist-modify-public`;

  window.location = authUrl;
}

// 用 code 换 token
async function fetchAccessToken(authCode) {
  const codeVerifier = sessionStorage.getItem('spotify_code_verifier');
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: authCode,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier,
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const data = await res.json();
  if (data.access_token) {
    storeToken(data.access_token, data.expires_in);
    return data.access_token;
  } else {
    console.error('Failed to fetch token:', data);
    return null;
  }
}

const Spotify = {
  async getAccessToken() {
    let token = getStoredToken();
    if (token) return token;

    // 检查 URL 是否带有 code
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      token = await fetchAccessToken(code);
      window.history.replaceState({}, document.title, '/'); // 清掉 URL
      return token;
    }

    // 否则发起 PKCE 授权
    await startPKCEAuth();
    return null; // 等用户授权回来
  },

  async search(term) {
    const token = await Spotify.getAccessToken();
    if (!token) return []; // token 不存在直接返回

    try {
      console.log('Search term:', term);
      const res = await fetch(
        `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      console.log('Search JSON:', data);

      if (!data.tracks) return [];
      return data.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri,
      }));
    } catch (err) {
      console.error('Spotify search error:', err);
      return [];
    }
  },

  async savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) return;

    const token = await Spotify.getAccessToken();
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    try {
      // 获取用户 ID
      const userRes = await fetch('https://api.spotify.com/v1/me', { headers });
      const userData = await userRes.json();
      const userId = userData.id;

      // 创建歌单
      const playlistRes = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers,
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      const playlistData = await playlistRes.json();
      const playlistId = playlistData.id;

      // 添加歌曲
      await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers,
        method: 'POST',
        body: JSON.stringify({ uris: trackUris }),
      });
      console.log('Playlist saved:', name);
    } catch (err) {
      console.error('Spotify savePlaylist error:', err);
    }
  },
};

export default Spotify;
