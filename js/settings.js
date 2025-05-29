document.addEventListener('DOMContentLoaded', function() {
    // Settings panel functionality
    const settingsBtn = document.querySelector('.settings-btn');
    const settingsPanel = document.querySelector('.settings-panel');
    const settingsClose = document.querySelector('.settings-close');
    const settingsOverlay = document.querySelector('.settings-overlay');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const musicTabs = document.querySelectorAll('.music-tab');
    const musicContents = document.querySelectorAll('.music-content');
    const musicItems = document.querySelectorAll('.music-item');
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const nowPlaying = document.getElementById('now-playing');
    const volumeControl = document.getElementById('volume-control');
    const progressBar = document.getElementById('progress-bar');
    const progressFilled = document.getElementById('progress-filled');
    const currentTimeEl = document.querySelector('.current-time');
    const totalTimeEl = document.querySelector('.total-time');

    // Check if dark mode is enabled in localStorage
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }

    // Toggle settings panel
    settingsBtn.addEventListener('click', function() {
        settingsPanel.classList.add('active');
        settingsOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close settings panel
    settingsClose.addEventListener('click', closeSettings);
    settingsOverlay.addEventListener('click', closeSettings);

    function closeSettings() {
        settingsPanel.classList.remove('active');
        settingsOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Dark mode toggle
    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    // Music tabs functionality
    musicTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            musicTabs.forEach(t => t.classList.remove('active'));
            musicContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to selected tab and content
            this.classList.add('active');
            document.getElementById(tabId + '-music').classList.add('active');
        });
    });
}); 