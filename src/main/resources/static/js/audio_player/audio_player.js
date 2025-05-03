import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'
import HoverPlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/hover.esm.js'
import RegionsPlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/regions.esm.js'
import {soundListWaveSurfers} from '../soundList.js'

const regionsPlugin = RegionsPlugin.create()

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
        regionsPlugin
    ],
})

const musicBoxPlayPause = document.querySelector('#musicBoxPlayPause')
let currentTrack = {
    soundID: "",
    playlistID: "",
    currentTime: 0.0,     // second
    volume: 1.0         // 0.0 - 1.0
};

/*const hover = document.getElementById('mainHover')
            mainWaveDiv.addEventListener('mouseenter', () => {
                hover.style.opacity = '1';
            });
            mainWaveDiv.addEventListener('mouseleave', () => {
                hover.style.opacity = '0';
            });
            mainWaveDiv.addEventListener('pointermove', (e) => (hover.style.width = `${e.offsetX}px`))*/

let mainWaveReady = false;

const volumeInput = document.getElementById("mainVolume");

document.addEventListener("DOMContentLoaded", () => {
    let savedTrack = localStorage.getItem("currentTrack");

    if (savedTrack) {
        // let restoredTrack = JSON.parse(savedTrack);
        const {soundID, playlistID, currentTime, volume} = JSON.parse(savedTrack);

        const src = `/stream/sound/${encodeURIComponent(soundID)}`;
        mainWaveSurfer.load(src)
        mainWaveSurfer.className = "main_waveSurfer_" + soundID

        mainWaveSurfer.on('ready', () => {
            if (typeof volume === 'number') {
                mainWaveSurfer.setVolume(volume);
                volumeInput.value = volume.toFixed(2);
            }
            if (typeof currentTime === 'number') {
                const duration = mainWaveSurfer.getDuration();
                const percent = currentTime / duration;
                mainWaveSurfer.seekTo(percent);
            }
        })
    }

    const mainWaveDiv = document.getElementById('music_box')
    if (mainWaveDiv) {
        const playerExtensions = document.createElement('div');
        playerExtensions.innerHTML = `
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
                    <label>
                        <input id="mainLoopCheckbox" type="checkbox"/>
                        Loop regions
                    </label>
                    <button id="mainClearRegions">Clear Regions</button>
                </div>
                <div id="mainHover" style="position: absolute; left: 0; top: 0; z-index: 1010; 
                pointer-events: none; height: 100%; width: 0; mix-blend-mode: overlay; opacity: 0;
                background: rgba(255, 255, 255, 0.5); transition: opacity 0.2s ease;
                "></div>
            `;
        mainWaveDiv.appendChild(playerExtensions);
    }

    //region MainWaveSurfer
    const rateInput = document.getElementById('mainRateInput');
    const timeEl = document.getElementById('mainTime')
    const durationEl = document.getElementById('mainDuration')
    const rateDisplay = document.getElementById('mainRate');
    const slider = document.getElementById('mainZoomInput')

    //region Regions
    let regionCount = 1
    regionsPlugin.enableDragSelection({
        color: 'rgba(255,255,255,0.1)',
    })
    let loop = false
    document.getElementById('mainLoopCheckbox').onclick = (e) => {
        loop = e.target.checked
    }
    let activeRegion = null
    regionsPlugin.on('region-in', (region) => {
        activeRegion = region
    })
    regionsPlugin.on('region-out', (region) => {
        if (activeRegion === region) {
            if (loop) {
                region.play()
            } else {
                activeRegion = null
            }
        }
    })
    regionsPlugin.on('region-clicked', (region, e) => {
        e.stopPropagation() // prevent triggering a click on the waveform
        activeRegion = region
        region.play(true)
        region.setOptions({color: randomColor()})
    })
    regionsPlugin.on('region-created', (region) => {
        const regionId = `region-${regionCount++}`

        region.setOptions({id: regionId})

        const wrapper = document.createElement('div')
        wrapper.className = 'flex items-center gap-2 text-white text-xs'

        const button = document.createElement('button')
        button.textContent = 'X'
        button.className = 'bg-red-600 text-white'
        button.addEventListener('click', (e) => {
            if (region) region.remove()
        })

        wrapper.appendChild(button)
        region.element.appendChild(wrapper)
    })
    document.getElementById('mainClearRegions').addEventListener('click', () => {
        regionsPlugin.regions.forEach(region => region.remove())
    })
    //endregion

    //region Listeners
    mainWaveSurfer.on('ready', () => {
        mainWaveReady = true;
    });
    mainWaveSurfer.once('ready', () => {
        musicBoxPlayPause.onclick = () => {
            mainWaveSurfer.setPlaybackRate(rateInput.valueAsNumber);
            mainWaveSurfer.playPause()
        }
    })
    mainWaveSurfer.on('decode', (duration) => {
        mainWaveReady = false;

        const soundID = mainWaveSurfer.className.split("_").pop();
        const otherPlayer = soundListWaveSurfers[soundID];

        if (otherPlayer) {
            const currentTime = otherPlayer.getCurrentTime();
            const otherDuration = otherPlayer.getDuration();

            if (Number.isFinite(currentTime) && Number.isFinite(otherDuration) && otherDuration > 0) {
                const targetSeek = currentTime / otherDuration;
                if (Number.isFinite(targetSeek)) {
                    mainWaveSurfer.seekTo(targetSeek);
                }
            } else {
                console.log(`[decode] player is not ready: ${soundID}`, {currentTime, otherDuration});
            }
        }

        currentTrack.soundID = soundID
        localStorage.setItem("currentTrack", JSON.stringify(currentTrack));

        regionsPlugin.regions.forEach(region => region.remove())
        regionCount = 1
        fetchAndCreateRegions(currentTrack.soundID, regionCount, regionsPlugin)

        durationEl.textContent = formatTime(duration)

        slider.addEventListener('input', (e) => {
            const minPxPerSec = e.target.valueAsNumber
            mainWaveSurfer.zoom(minPxPerSec)
        })
    })
    mainWaveSurfer.on('interaction', () => {
        activeRegion = null
    })
    mainWaveSurfer.on('play', () => {
        mainWaveReady = true;

        const soundID = mainWaveSurfer.className.split("_").pop();
        const listIcon = document.querySelector('.icon_' + soundID);
        if (listIcon.getAttribute('data-lucide') === 'play') {
            listIcon.setAttribute('data-lucide', 'pause');
        }

        const icon = document.getElementById('playPauseIcon');
        icon.setAttribute('data-lucide', 'pause');
        lucide.createIcons();
    })
    mainWaveSurfer.on('pause', () => {
        mainWaveReady = false;

        const soundID = mainWaveSurfer.className.split("_").pop();
        const listIcon = document.querySelector('.icon_' + soundID);
        if (listIcon.getAttribute('data-lucide') === 'pause') {
            listIcon.setAttribute('data-lucide', 'play');
        }

        const icon = document.getElementById('playPauseIcon');
        icon.setAttribute('data-lucide', 'play');
        lucide.createIcons();
    })
    mainWaveSurfer.on('timeupdate', (currentTime) => {
        timeEl.textContent = formatTime(currentTime)
    })

    rateInput.addEventListener('input', (e) => {
        const speed = parseFloat(e.target.value);
        rateDisplay.textContent = speed.toFixed(1);
        mainWaveSurfer.setPlaybackRate(speed);
        mainWaveSurfer.play();
    });

    mainWaveSurfer.on('audioprocess', () => {
        if (!mainWaveReady || !mainWaveSurfer.isPlaying()) return;

        const soundID = mainWaveSurfer.className.split("_").pop();
        const otherPlayer = soundListWaveSurfers[soundID];

        if (!otherPlayer) return;

        const mainTime = mainWaveSurfer.getCurrentTime();
        const mainDuration = mainWaveSurfer.getDuration();

        if (!Number.isFinite(mainTime) || !Number.isFinite(mainDuration) || mainDuration <= 0) return;

        const seekTo = mainTime / mainDuration;
        if (Number.isFinite(seekTo)) {
            otherPlayer.seekTo(seekTo);
        }
    });

    //endregion

    //endregion

    lucide.createIcons();
});

export const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secondsRemainder = Math.round(seconds) % 60
    const paddedSeconds = `0${secondsRemainder}`.slice(-2)
    return `${minutes}:${paddedSeconds}`
}

const createRegion = (regionCount, regions, start, end, extraOptions = {}) => {
    const regionId = regionCount++

    const region = regions.addRegion({
        id: `region-${regionId}`,
        start,
        end,
        color: randomColor(),
        drag: false,
        resize: false,
        ...extraOptions,
    })

    /*const wrapper = document.createElement('div')
    wrapper.className = 'flex items-center gap-2 text-white text-xs'

    const button = document.createElement('button')
    button.textContent = `X`
    button.className = 'bg-red-600 text-white'
    button.addEventListener('click', (e) => {
        if (region) region.remove()
    })
    wrapper.appendChild(button)
    region.element.appendChild(wrapper)*/

    return region
}

const random = (min, max) => Math.random() * (max - min) + min
const randomColor = () => `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`

export function fetchAndCreateRegions(soundID, regionCount, regionsPlugin) {
    fetch(`/database/regions/${soundID}`)
        .then(response => response.json())
        .then(data => {
            if (data.regions?.length > 0) {
                data.regions.forEach(([start, end]) => {
                    createRegion(regionCount, regionsPlugin, start, end)
                });
            }
        });
}

volumeInput.addEventListener("input", () => {
    const vol = parseFloat(volumeInput.value);
    mainWaveSurfer.setVolume(vol);

    currentTrack.volume = vol;
    localStorage.setItem("currentTrack", JSON.stringify(currentTrack));
});

setInterval(() => {
    currentTrack.currentTime = mainWaveSurfer.getCurrentTime()
    localStorage.setItem("currentTrack", JSON.stringify(currentTrack));
}, 5000);

//region Stems
/*const showStems = document.getElementById('mainShowStems')
showStems.addEventListener('click', ()=>{


})*/
//endregion