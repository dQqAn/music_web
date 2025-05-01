import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'
import HoverPlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/hover.esm.js'
// import Region from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/regions.esm.js'
// import EnvelopePlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/envelope.esm.js'

// Create an instance of WaveSurfer
export const mainWaveSurfer = WaveSurfer.create({
    container: '#music_box',
    waveColor: 'rgb(200, 0, 200)',
    progressColor: 'rgb(100, 0, 100)',
    url: '',
    height: 75,
    // dragToSeek: true, // minPxPerSec: 100,
    plugins: [HoverPlugin.create({
        lineColor: '#ff0000', lineWidth: 2, labelBackground: '#555', labelColor: '#fff', labelSize: '11px',
    }),],
})

// const isMobile = top.matchMedia('(max-width: 900px)').matches

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
mainWaveSurfer.once('ready', () => {
    musicBoxPlayPause.onclick = () => {
        mainWaveSurfer.playPause()
    }
})
mainWaveSurfer.on('play', () => {
    const icon = document.getElementById('playPauseIcon');
    icon.setAttribute('data-lucide', 'pause');
    lucide.createIcons();
})
mainWaveSurfer.on('pause', () => {
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
        mainWaveSurfer.load(src)
    }

    const mainWaveDiv = document.getElementById('music_box')
    if (mainWaveDiv) {
        const formatTime = (seconds) => {
            const minutes = Math.floor(seconds / 60)
            const secondsRemainder = Math.round(seconds) % 60
            const paddedSeconds = `0${secondsRemainder}`.slice(-2)
            return `${minutes}:${paddedSeconds}`
        }

        const soundRate = document.createElement('div');
        soundRate.innerHTML = `
                <div class="flex space-x-2">
                    <label>
                        Playback rate: <span id="mainRate">1.0</span>x
                    </label>
                    <label>
                        0.5x <input id="mainRateInput" type="range" min="0.5" max="2" step="0.5" value="1" /> 2x
                    </label>
                    <label>
                        Zoom: <input id="mainZoomInput" type="range" min="10" max="200" value="100" />
                    </label>
                    <p id="mainTime">0:00</p>
                    <p id="mainDuration">0:00</p>
                </div>
                <div id="mainHover" style="position: absolute; left: 0; top: 0; z-index: 1010; 
                pointer-events: none; height: 100%; width: 0; mix-blend-mode: overlay; opacity: 0;
                background: rgba(255, 255, 255, 0.5); transition: opacity 0.2s ease;
                "></div>
            `;
        mainWaveDiv.appendChild(soundRate);

        const rateDisplay = document.getElementById('mainRate');
        const rateInput = document.getElementById('mainRateInput');

        rateInput.addEventListener('input', (e) => {
            const speed = parseFloat(e.target.value);
            rateDisplay.textContent = speed.toFixed(1);
            mainWaveSurfer.setPlaybackRate(speed);
            mainWaveSurfer.play();
        });

        const slider = document.getElementById('mainZoomInput')
        mainWaveSurfer.once('decode', () => {
            slider.addEventListener('input', (e) => {
                const minPxPerSec = e.target.valueAsNumber
                mainWaveSurfer.zoom(minPxPerSec)
            })
        })

        const hover = document.getElementById('mainHover')
        mainWaveDiv.addEventListener('mouseenter', () => {
            hover.style.opacity = '1';
        });
        mainWaveDiv.addEventListener('mouseleave', () => {
            hover.style.opacity = '0';
        });
        mainWaveDiv.addEventListener('pointermove', (e) => (hover.style.width = `${e.offsetX}px`))

        const timeEl = document.getElementById('mainTime')
        const durationEl = document.getElementById('mainDuration')
        mainWaveSurfer.on('decode', (duration) => (durationEl.textContent = formatTime(duration)))
        mainWaveSurfer.on('timeupdate', (currentTime) => (timeEl.textContent = formatTime(currentTime)))
    }
    lucide.createIcons();
});
