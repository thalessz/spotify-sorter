const carregarPlaylists = async () => {
    const response = await fetch('/auth');

    if (!response.ok) throw new Error('Erro ao carregar playlists');

    const playlists = await response.json();

    const ul = document.getElementById('playlists');
    ul.innerHTML = ''; 

    playlists.forEach((playlist) => {
        const li = document.createElement('li');
        li.textContent = `${playlist.name} (${playlist.tracks} faixas)`;

        const organizarButton = document.createElement('button');
        organizarButton.textContent = 'Organizar';
        organizarButton.addEventListener('click', async () => {
            await organizarPlaylist(playlist.id);
        });


        li.appendChild(organizarButton);
        ul.appendChild(li);
    });
};

// Função para organizar a playlist
const organizarPlaylist = async (playlistId) => {
    const response = await fetch(`/playlists/${playlistId}/sort`, { method: 'POST' });

    if (response.ok) {
        alert('Playlist organizada com sucesso!');
        carregarPlaylists(); 
    } else {
        alert('Erro ao organizar a playlist.');
    }
};

// Chame esta função quando a página for carregada ou após o login.
document.addEventListener('DOMContentLoaded', carregarPlaylists);
