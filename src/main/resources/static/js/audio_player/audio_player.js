import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'
import HoverPlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/hover.esm.js'
import RegionsPlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/regions.esm.js'

export const regions = RegionsPlugin.create()

export const mainWaveSurfer = WaveSurfer.create({
    container: '#music_box',
    waveColor: 'rgb(200, 0, 200)',
    progressColor: 'rgb(100, 0, 100)',
    url: '',
    height: 75,
    // dragToSeek: true, // minPxPerSec: 100,
    plugins: [
        HoverPlugin.create({
            lineColor: '#ff0000', lineWidth: 2, labelBackground: '#555', labelColor: '#fff', labelSize: '11px',
        }),
        regions
    ],
})

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

document.addEventListener("DOMContentLoaded", () => {
    let savedTrack = localStorage.getItem("currentTrack");

    if (savedTrack) {
        let restoredTrack = JSON.parse(savedTrack);
        const src = `/stream/sound/${encodeURIComponent(restoredTrack.soundID)}`;
        mainWaveSurfer.load(src)
    }

    const mainWaveDiv = document.getElementById('music_box')
    if (mainWaveDiv) {
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

export const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secondsRemainder = Math.round(seconds) % 60
    const paddedSeconds = `0${secondsRemainder}`.slice(-2)
    return `${minutes}:${paddedSeconds}`
}
