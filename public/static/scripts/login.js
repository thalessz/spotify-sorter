const setupEventListeners = () => {
    document.getElementById('login').addEventListener('click', handleLogin);
    document.getElementById('github').addEventListener('click', handleGitHub);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
};

const handleLogin = () => {
    window.location.href = '/auth'; 
};

const handleGitHub = () => {
    window.open('https://github.com/thalessz/spotify-sorter', '_blank'); 
};

const toggleTheme = () => {
    const body = document.body;
    const header = document.getElementById('header');
    const headerTitle = document.getElementById('header-title');
    const connectText = document.getElementById('connect-text');
    const languageButton = document.getElementById('languageDropdownButton');

    body.classList.toggle('bg-dark');
    body.classList.toggle('bg-light');

    header.classList.toggle('bg-dark');
    header.classList.toggle('bg-light');

    if (body.classList.contains('bg-light')) {
        headerTitle.classList.remove('text-light');
        headerTitle.classList.add('text-dark'); 
        connectText.classList.remove('text-light');
        connectText.classList.add('text-dark');

        languageButton.classList.remove('btn-dark');
        languageButton.classList.add('btn-light'); 

        const themeToggle = document.getElementById('themeToggle');
        themeToggle.classList.remove('btn-dark');
        themeToggle.classList.add('btn-light'); 
    } else {
        headerTitle.classList.remove('text-dark');
        headerTitle.classList.add('text-light'); 
        connectText.classList.remove('text-dark');
        connectText.classList.add('text-light');

        languageButton.classList.remove('btn-light');
        languageButton.classList.add('btn-dark'); 

        const themeToggle = document.getElementById('themeToggle');
        themeToggle.classList.remove('btn-light');
        themeToggle.classList.add('btn-dark'); 
    }
};

// Traduções
const translations = {
    pt: {
        title: "💿 Organify",
        connectText: "Conectar-se ao Spotify",
        loginButton: "Entrar",
        githubButton: "GitHub",
        spotifyButton: "Conectar-se ao Spotify"
    },
    es: {
        title: "💿 Organify",
        connectText: "Conectar a Spotify",
        loginButton: "Entrar",
        githubButton: "GitHub",
        spotifyButton: "Conectar a Spotify"
    },
    en: {
        title: "💿 Organify",
        connectText: "Connect to Spotify",
        loginButton: "Login",
        githubButton: "GitHub",
        spotifyButton: "Connect to Spotify"
    }
};

function changeLanguage(lang) {
    document.getElementById('header-title').innerText = translations[lang].title;
    document.getElementById('connect-text').innerText = translations[lang].connectText;
    document.getElementById('login-button').innerText = translations[lang].loginButton;
    document.getElementById('github').innerText = translations[lang].githubButton;

    const loginButton = document.getElementById('login');
    
    // Atualiza o texto do botão de login mantendo a imagem
    loginButton.innerHTML = `<img class='icon' src='./static/images/spotify_logo_white.png' alt='Spotify'> ${translations[lang].spotifyButton}`;

    const languageDropdownButton = document.getElementById('languageDropdownButton');
    languageDropdownButton.innerText = lang === 'pt' ? '🇧🇷' : lang === 'es' ? '🇪🇸' : '🇺🇸';
}

// Inicializa os event listeners ao carregar o script
setupEventListeners();
