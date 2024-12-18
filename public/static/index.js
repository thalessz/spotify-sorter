const carregarPlaylists = async () => {
    const response = await fetch('/auth');

    if (!response.ok) throw new Error('Erro ao carregar playlists');

    const playlists = await response.json();

    const ul = document.getElementById('playlists');
    ul.innerHTML = ''; 

    playlists.forEach((playlist) => {
        const li = document.createElement('li');
        li.textContent = `${playlist.name} (${playlist.tracks} faixas)`;
        li.dataset.id = playlist.id;

        ul.appendChild(li);

        li.addEventListener('click', () => {
            document.querySelectorAll('#playlists li').forEach(item => item.classList.remove('selected'));
            li.classList.add('selected');
        });
    });
};

document.getElementById('login').addEventListener('click', async () => {
    await carregarPlaylists();
    document.getElementById('organizar').style.display = 'block'; // Mostrar botão após login
});

document.getElementById('organizar').addEventListener('click', async () => {
    const selecionado = document.querySelector('#playlists li.selected');

    if (!selecionado) return alert('Selecione uma playlist!');

    const playlistId = selecionado.dataset.id;

    const response = await fetch(`/playlists/${playlistId}/sort`, { method: 'POST' });

    if (response.ok) {
        alert('Playlist organizada!');
    } else {
        alert('Erro ao organizar a playlist.');
    }
});

document.addEventListener('DOMContentLoaded', () => {
   document.getElementById('organizar').style.display = 'none'; // Esconde botão até logar
});
