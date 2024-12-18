import SpotifyWebApi from 'spotify-web-api-node';

export const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_SECRET,
    redirectUri: 'http://localhost:8888/redirect'
});

interface Playlist {
    id: string;
    name: string;
    image: string;
    tracks: number;
}

interface Song {
    id: string;
    artista: string;
    album: string;
    dataLancamento: string;
    faixa: number;
}

const generateRandomString = (length: number): string => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

// Função para autenticar o usuário
export const spotifyAuth = async (): Promise<void> => {
    const scopes = ['playlist-read-private', 'playlist-modify-private', 'playlist-modify-public'];
    const state = generateRandomString(16);
    const authUrl = spotifyApi.createAuthorizeURL(scopes, state);
    console.log('Autorize o aplicativo acessando:', authUrl);

    const code = await new Promise<string>((resolve) => {
        console.log('Cole o código de autenticação aqui:');
        process.stdin.once('data', (data) => resolve(data.toString().trim()));
    });
    
    const data = await spotifyApi.authorizationCodeGrant(code);
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);
    console.log('Autenticação concluída!');
};

export const getPlaylists = async (): Promise<Playlist[]> => {
    const playlists = await spotifyApi.getUserPlaylists();
    return playlists.body.items.map((playlist) => ({
        id: playlist.id,
        name: playlist.name,
        image: playlist.images[0]?.url || '',
        tracks: playlist.tracks.total
    }));
};

export const getSongs = async (playlistId: string): Promise<Song[]> => {
    const tracks = await spotifyApi.getPlaylistTracks(playlistId);
    return tracks.body.items.map((item) => ({
        id: item.track?.id || '',
        artista: item.track?.artists[0]?.name || '',
        album: item.track?.album.name || '',
        dataLancamento: item.track?.album.release_date || '',
        faixa: item.track?.track_number || 0,
    }));
};

export const sortPlaylist = async (playlistId: string, musicas: Song[]): Promise<void> => {
    musicas.sort((a, b) => {
        if (a.artista.toLowerCase() < b.artista.toLowerCase()) return -1;
        if (a.artista.toLowerCase() > b.artista.toLowerCase()) return 1;

        // Ordenar por álbum
        if (a.album < b.album) return -1;
        if (a.album > b.album) return 1;

        // Ordenar por faixa
        return a.faixa - b.faixa;
    });

    const idsOrganizados = musicas.map((musica) => musica.id);
    await spotifyApi.replaceTracksInPlaylist(playlistId, idsOrganizados);
};
