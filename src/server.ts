import express, { Application, NextFunction, request, Request, Response } from 'express';
import path from 'path';
import { spotifyAuth, getPlaylists, sortPlaylist, getSongs } from './spotify';

const app: Application = express();
const PORT:  string | number  = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('../public')); 

app.get('/', (req: Request, res: Response): void => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

//autenticar e obter playlists
app.get('/auth', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await spotifyAuth();
        const playlists = await getPlaylists();
        res.json(playlists);
    } catch (error) {
        next(error);
    }
});

//obter musicas da playlist
app.get('/playlists/:id/songs', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const songs = await getSongs(req.params.id);
        res.json(songs);
    } catch (error) {
        next(error);
    }
});

//organiza a playlist 
app.post('/playlists/:id/sort', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const songs = await getSongs(req.params.id);
        await sortPlaylist(req.params.id, songs);
        res.send('Playlist organizada com sucesso!');
    } catch (error) {
        next(error); 
    }
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof Error) {
        res.status(500).json({ message: err.message });
    } else {
        res.status(500).json({ message: 'Um erro desconhecido ocorreu.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
