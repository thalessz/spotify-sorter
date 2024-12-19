import express, { Application, NextFunction, Request, Response } from 'express';
import path from 'path';
import { spotifyAuth, getPlaylists, sortPlaylist, getSongs } from './spotify';
import SpotifyWebApi from 'spotify-web-api-node';

const app: Application = express();
const PORT: string | number = process.env.PORT || 8888;

// Middleware para interpretar requisições JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public'))); // Serve arquivos estáticos da pasta public

// Configuração do Spotify API
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_SECRET,
    redirectUri: 'http://localhost:8888/callback' // URL de redirecionamento
});

// Rota principal que serve a tela de login
app.get('/', (req: Request, res: Response): void => {
    res.sendFile(path.join(__dirname, '../public/login.html')); // Serve a tela de login
});

// Rota para autenticar e redirecionar para a URL do Spotify
app.get('/auth', (req: Request, res: Response): void => {
    const authUrl = spotifyAuth(); // Gera a URL de autenticação
    res.redirect(authUrl); // Redireciona o usuário para a URL do Spotify
});

// Endpoint de callback após a autenticação
app.get('/callback', async (req: Request, res: Response): Promise<void> => {
    const code = req.query.code; // Obtém o código da query string

    // Verifica se o código é uma string
    if (typeof code !== 'string') {
        return res.status(400).send('Código não fornecido.');
    }

    try {
        const data = await spotifyApi.authorizationCodeGrant(code); // Troca o código por tokens
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);

        // Redireciona para a tela principal após autenticação bem-sucedida
        res.redirect('/main'); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao obter playlists.');
    }
});

// Rota principal para exibir as playlists
app.get('/main', async (req: Request, res: Response): Promise<void> => {
    try {
        const playlists = await getPlaylists(); // Obtém as playlists

        // Renderiza a página principal com as playlists
        res.sendFile(path.join(__dirname, '../public/index.html')); // Serve a tela principal
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao obter playlists.');
    }
});

// Rota para obter músicas de uma playlist específica
app.get('/playlists/:id/songs', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const songs = await getSongs(req.params.id);
        res.json(songs);
    } catch (error) {
        next(error); // Passa o erro para o manipulador de erros
    }
});

// Rota para organizar a playlist
app.post('/playlists/:id/sort', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const songs = await getSongs(req.params.id); // Obtém as músicas da playlist
        await sortPlaylist(req.params.id, songs); // Organiza a playlist
        res.send('Playlist organizada com sucesso!');
    } catch (error) {
        next(error); // Passa o erro para o manipulador de erros
    }
});

// Manipulador de erros
app.use((err: unknown, req: Request, res: Response): void => {
    if (err instanceof Error) {
        res.status(500).json({ message: err.message });
    } else {
        res.status(500).json({ message: 'Um erro desconhecido ocorreu.' });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});
