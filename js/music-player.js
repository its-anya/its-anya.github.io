document.addEventListener('DOMContentLoaded', function() {
    const musicItems = document.querySelectorAll('.music-item');
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const nowPlaying = document.getElementById('now-playing');
    const volumeControl = document.getElementById('volume-control');
    const progressBarContainer = document.querySelector('.progress-bar-container');
    const progressFilled = document.getElementById('progress-filled');
    const currentTimeEl = document.querySelector('.current-time');
    const totalTimeEl = document.querySelector('.total-time');

    // Audio player functionality
    let currentTrack = null;
    let isPlaying = false;

    // Set initial volume
    audioPlayer.volume = volumeControl.value;

    // Format time in minutes:seconds
    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' + sec : sec}`;
    }

    // Update progress bar as audio plays
    audioPlayer.addEventListener('timeupdate', updateProgress);
    
    function updateProgress() {
        if (isPlaying || audioPlayer.currentTime > 0) {
            const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressFilled.style.width = percent + '%';
            currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
            totalTimeEl.textContent = formatTime(audioPlayer.duration || 0);
        }
    }
    
    // Allow clicking on progress bar to seek
    progressBarContainer.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const seekPosition = (e.clientX - rect.left) / rect.width;
        
        if (audioPlayer.duration) {
            audioPlayer.currentTime = seekPosition * audioPlayer.duration;
            updateProgress();
        } else {
            // For demo purposes where audio might not be loaded
            const totalSeconds = 102; // 1:42 shown in the image
            simulateTimeUpdate(seekPosition * totalSeconds);
        }
    });

    // For demo purposes - simulate time update when no audio is loaded
    function simulateTimeUpdate(seconds) {
        if (!audioPlayer.duration) {
            const totalSeconds = 102; // 1:42
            progressFilled.style.width = (seconds / totalSeconds * 100) + '%';
            currentTimeEl.textContent = formatTime(seconds);
            totalTimeEl.textContent = "1:42";
        }
    }

    // Volume control
    volumeControl.addEventListener('input', function() {
        audioPlayer.volume = this.value;
    });

    // Play/Pause button
    playBtn.addEventListener('click', function() {
        if (!currentTrack) {
            // If no track is selected, play the first one
            const firstTrack = document.querySelector('.music-content.active .music-item');
            if (firstTrack) {
                playTrack(firstTrack);
            }
            return;
        }

        if (isPlaying) {
            audioPlayer.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            isPlaying = false;
        } else {
            audioPlayer.play().catch(error => {
                console.log("Audio playback error (expected in demo): ", error);
                simulatePlay();
            });
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            isPlaying = true;
        }
    });

    // Simulate playing for demo purposes
    function simulatePlay() {
        let currentTime = parseFloat(currentTimeEl.textContent.split(':')[0]) * 60 + 
                         parseFloat(currentTimeEl.textContent.split(':')[1]);
        
        if (window.playInterval) clearInterval(window.playInterval);
        
        window.playInterval = setInterval(() => {
            currentTime += 1;
            if (currentTime > 102) currentTime = 0; // 1:42 = 102 seconds
            simulateTimeUpdate(currentTime);
        }, 1000);
    }

    // Previous button
    prevBtn.addEventListener('click', function() {
        if (!currentTrack) return;
        
        const activeList = document.querySelector('.music-content.active .music-list');
        const tracks = Array.from(activeList.querySelectorAll('.music-item'));
        const currentIndex = tracks.indexOf(currentTrack);
        
        const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
        playTrack(tracks[prevIndex]);
    });

    // Next button
    nextBtn.addEventListener('click', function() {
        if (!currentTrack) return;
        
        const activeList = document.querySelector('.music-content.active .music-list');
        const tracks = Array.from(activeList.querySelectorAll('.music-item'));
        const currentIndex = tracks.indexOf(currentTrack);
        
        const nextIndex = (currentIndex + 1) % tracks.length;
        playTrack(tracks[nextIndex]);
    });

    // Track ended event
    audioPlayer.addEventListener('ended', function() {
        // Play next track automatically
        nextBtn.click();
    });

    // Play track when clicked
    musicItems.forEach(item => {
        item.addEventListener('click', function() {
            playTrack(this);
        });
    });

    function playTrack(trackElement) {
        // Stop any existing simulated playback
        if (window.playInterval) {
            clearInterval(window.playInterval);
        }
        
        // Remove playing class from all tracks
        musicItems.forEach(item => item.classList.remove('playing'));
        
        // Add playing class to current track
        trackElement.classList.add('playing');
        
        // Set current track
        currentTrack = trackElement;
        
        // Get track source
        const trackSrc = trackElement.getAttribute('data-src');
        const trackName = trackElement.querySelector('span').textContent;
        
        // Set audio source
        audioPlayer.src = trackSrc;
        
        // Play audio
        audioPlayer.play().catch(error => {
            console.log("Audio playback error (expected in demo): ", error);
            // We'll simulate playback for demo purposes
            nowPlaying.textContent = "Now playing: " + trackName;
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            isPlaying = true;
            
            // Initialize progress to beginning
            currentTimeEl.textContent = "0:00";
            totalTimeEl.textContent = "1:42"; // Default time for demo
            progressFilled.style.width = '0%';
            
            // Start simulated playback
            simulatePlay();
        });
        
        // Update now playing text
        nowPlaying.textContent = "Now playing: " + trackName;
        
        // Update play button icon
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        isPlaying = true;
    }
}); 