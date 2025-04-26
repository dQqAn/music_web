import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'
// import Region from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/regions.esm.js'
// import EnvelopePlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/envelope.esm.js'

// Create an instance of WaveSurfer
export const wavesurfer = WaveSurfer.create({
    container: '#music_box',
    waveColor: 'rgb(200, 0, 200)',
    progressColor: 'rgb(100, 0, 100)',
    url: '',
})

/*const isMobile = top.matchMedia('(max-width: 900px)').matches*/

// Initialize the Envelope plugin"@tailwindcss/postcss": "^4.1.4",
//     "postcss": "^8.5.3",
//     "wavesurfer.js": "^7.9.4"
/*const envelope = wavesurfer.registerPlugin(
    EnvelopePlugin.create({
        volume: 0.8,
        lineColor: 'rgba(255, 0, 0, 0.5)',
        lineWidth: 4,
        dragPointSize: isMobile ? 20 : 12,
        dragLine: !isMobile,
        dragPointFill: 'rgba(0, 255, 255, 0.8)',
        dragPointStroke: 'rgba(0, 0, 0, 0.5)',

        points: [
            {time: 11.2, volume: 0.5},
            {time: 15.5, volume: 0.8},
        ],
    }),
)*/

/*envelope.on('points-change', (points) => {
    console.log('Envelope points changed', points)
})*/

// envelope.addPoint({time: 1, volume: 0.9})

// Randomize points
/*const randomizePoints = () => {
    const points = []
    const len = 5 * Math.random()
    for (let i = 0; i < len; i++) {
        points.push({
            time: Math.random() * wavesurfer.getDuration(),
            volume: Math.random(),
        })
    }
    envelope.setPoints(points)
}

document.querySelector('#randomize').onclick = randomizePoints*/

// Show the current volume
/*const volumeLabel = document.getElementById('tempLabel')
const showVolume = () => {
    const volume = envelope.getCurrentVolume().toFixed(2)
    volumeLabel.textContent = volume
}
envelope.on('volume-change', showVolume)
wavesurfer.on('ready', showVolume)*/

// Play/pause button
// const button = document.querySelector('#play')
const musicBoxPlayPause = document.querySelector('#musicBoxPlayPause')
wavesurfer.once('ready', () => {
    musicBoxPlayPause.onclick = () => {
        wavesurfer.playPause()
    }
})
wavesurfer.on('play', () => {
    const icon = document.getElementById('playPauseIcon');
    icon.setAttribute('data-lucide', 'pause');
    lucide.createIcons();
})
wavesurfer.on('pause', () => {
    const icon = document.getElementById('playPauseIcon');
    icon.setAttribute('data-lucide', 'play');
    lucide.createIcons();
})

//----------------------------
/*const timeDisplay = document.getElementById('timeDisplayMusicBox');
const progressBar = document.getElementById('progressBarMusicBox');
const slider = document.getElementById('sliderMusicBox');
const timeText = document.getElementById('timeTextMusicBox');

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

wavesurfer.on('ready', () => {
    const duration = wavesurfer.getDuration();
    timeText.textContent = `0:00 / ${formatTime(duration)}`;

    progressBar.style.width = `0%`;
    slider.style.left = `0%`;
});

wavesurfer.on('audioprocess', () => {
    const currentTime = wavesurfer.getCurrentTime();
    const duration = wavesurfer.getDuration();
    const progress = currentTime / duration;
    progressBar.style.width = `${progress * 100}%`;
    slider.style.left = `${progress * 100}%`;
    timeText.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
});

timeDisplay.addEventListener('click', (e) => {
    const rect = timeDisplay.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const progress = clickX / width;
    wavesurfer.seekTo(progress);
});

let isDragging = false;

timeDisplay.addEventListener('mousedown', (e) => {
    isDragging = true;
    seek(e);
});

timeDisplay.addEventListener('mouseup', (e) => {
    isDragging = false;
});

timeDisplay.addEventListener('mousemove', (e) => {
    if (isDragging) {
        seek(e);
    }
});

function seek(e) {
    const rect = timeDisplay.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    const progress = Math.min(Math.max(offsetX / width, 0), 1);
    wavesurfer.seekTo(progress);

    progressBar.style.width = `${progress * 100}%`;
    slider.style.left = `${progress * 100}%`;

    const duration = wavesurfer.getDuration();
    const currentTime = progress * duration;
    timeText.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
}*/
//----------------------------

/*function playSoundToMusicBox(soundID) {
    currentTrack.soundID = soundID
    localStorage.setItem("currentTrack", JSON.stringify(currentTrack));

    const src = `/stream/sound/${encodeURIComponent(soundID)}`;
    wavesurfer.load(src);
    wavesurfer.once('ready', () => {
        wavesurfer.playPause();
    })

    /!*setInterval(() => {
        currentTrack.volume = 1.0;
        localStorage.setItem("currentTrack", JSON.stringify(currentTrack));
    }, 5000);*!/
}

window.playSoundToMusicBox = playSoundToMusicBox;*/

document.addEventListener("DOMContentLoaded", () => {
    let savedTrack = localStorage.getItem("currentTrack");

    if (savedTrack) {
        let restoredTrack = JSON.parse(savedTrack);
        const src = `/stream/sound/${encodeURIComponent(restoredTrack.soundID)}`;
        wavesurfer.load(src)
    }

    lucide.createIcons();
});
