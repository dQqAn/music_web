import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'
import HoverPlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/hover.esm.js'
import RegionsPlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/regions.esm.js'
import {
    downloadSound,
    getSound,
    getStoredSoundIDs,
    isSoundIDStored,
    removeSoundID,
    soundListWaveSurfers
} from '../soundList.js'
import {setupPlaylistDiv} from '../playlist.js'
import {createFavDiv} from '../favourite.js'
import {setSoundInfos} from '../sound/sound.js'

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

document.addEventListener("DOMContentLoaded", async () => {
    const volumeInput = document.getElementById("mainVolume");
    const stemsOverlayContent = document.getElementById('stemsOverlayContent')

    if (volumeInput) {
        volumeInput.addEventListener("input", () => {
            const vol = parseFloat(volumeInput.value);
            mainWaveSurfer.setVolume(vol);

            currentTrack.volume = vol;
            localStorage.setItem("currentTrack", JSON.stringify(currentTrack));
        });
    }

    setInterval(() => {
        currentTrack.currentTime = mainWaveSurfer.getCurrentTime()
        localStorage.setItem("currentTrack", JSON.stringify(currentTrack));
    }, 5000);

    let savedTrack = localStorage.getItem("currentTrack");

    if (savedTrack) {
        currentTrack = JSON.parse(savedTrack);

        // let restoredTrack = JSON.parse(savedTrack);
        const {soundID, playlistID, currentTime, volume} = JSON.parse(savedTrack);

        const src = `/stream/sound/${encodeURIComponent(soundID)}`;
        mainWaveSurfer.load(src)
        mainWaveSurfer.className = "main_waveSurfer_" + soundID

        mainWaveSurfer.once('ready', () => {
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
    let isRepeatEnabled = false;
    const repeatButton = document.getElementById('musicBoxRepeat')
    repeatButton.addEventListener('click', () => {
        isRepeatEnabled = !isRepeatEnabled;
        repeatButton.classList.toggle('text-blue-600', isRepeatEnabled);
    });
    mainWaveSurfer.on('finish', () => {
        if (isRepeatEnabled) {
            mainWaveSurfer.seekTo(0);
            mainWaveSurfer.play();
        }

        if (getStoredSoundIDs().length > 0) {
            const soundID = mainWaveSurfer.className.split("_").pop();
            if (isSoundIDStored(soundID)) {
                removeSoundID(soundID)
            }

            const localSoundID = getStoredSoundIDs()[0]
            if (localSoundID) {
                const src = `/stream/sound/${encodeURIComponent(localSoundID)}`;
                mainWaveSurfer.load(src)
                mainWaveSurfer.className = "main_waveSurfer_" + localSoundID

                const listIcon = document.querySelector('.icon_' + localSoundID);
                if (listIcon) {
                    listIcon.setAttribute('data-lucide', 'pause');
                    lucide.createIcons();
                }

                mainWaveSurfer.once('ready', () => {
                    const rateInput = document.getElementById('mainRateInput');
                    if (rateInput) {
                        mainWaveSurfer.setPlaybackRate(rateInput.valueAsNumber);
                    }
                    mainWaveSurfer.play()
                })
            }
        }
    });
    mainWaveSurfer.on('ready', async () => {
        mainWaveReady = true;
        if (stemsOverlayContent) {
            stemsOverlayContent.setAttribute('sound-id', currentTrack.soundID)
        }

        //region Music Infos
        const mainPlaylistDiv = document.getElementById('mainPlaylistDiv')
        if (mainPlaylistDiv) {
            const sound = await getSound(currentTrack.soundID);
            if (sound) {
                setSoundInfos(sound, 'mainSoundImage', 'mainSoundName', 'mainArtistsName')
                await createFavDiv('mainFavDiv', sound.soundID, true)
                setupPlaylistDiv(sound, 'mainPlaylistDiv', 'mainPlaylistBtn',
                    'mainAddToPlaylistBtn', 'mainCreatePlaylist',
                    'mainPlaylistContainer', 'mainPlaylistCloseBtn',
                    'mainPlaylistResult', 'mainPlaylistInput')
            }
        }
        //endregion
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
        if (listIcon && listIcon.getAttribute('data-lucide') === 'play') {
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
        if (listIcon && listIcon.getAttribute('data-lucide') === 'pause') {
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

    //region Stems
    const stemsOverlay = document.getElementById('stemsOverlay')
    const openStems = document.getElementById('openStemsOverlay')
    const closeStems = document.getElementById('closeStemsOverlay')
    if (stemsOverlay) {
        stemsOverlay.addEventListener("click", (e) => {
            if (e.target === stemsOverlay) {
                stemsOverlayContent.innerHTML = ""
                for (const key in stemsListWaveSurfers) {
                    delete stemsListWaveSurfers[key];
                }
                for (const key in muteStemsListWaveSurfers) {
                    delete muteStemsListWaveSurfers[key];
                }
                for (const key in singleStemsListWaveSurfers) {
                    delete singleStemsListWaveSurfers[key];
                }
                stemsOverlay.classList.add("hidden");
            }
        });
        if (openStems) {
            openStems.addEventListener('click', () => {
                stemsOverlay.classList.remove("hidden");

                const soundID = stemsOverlayContent.getAttribute('sound-id')

                fetch(`/database/soundStems/${soundID}`, {
                    headers: {
                        'Accept': 'application/json'
                    }
                }).then(res => {
                    if (!res.ok) {
                        console.log(`HTTP error! Status: ${res.status}`);
                        throw new Error(`HTTP error! Status: ${res.status}`);
                    }
                    return res.json();
                }).then(stems => {
                    if (stems.length > 0) {
                        createStemsContent(stemsOverlayContent, stems, soundID)
                    }
                })
            })
        }
        if (closeStems) {
            closeStems.addEventListener('click', () => {
                stemsOverlayContent.innerHTML = ""
                for (const key in stemsListWaveSurfers) {
                    delete stemsListWaveSurfers[key];
                }
                for (const key in muteStemsListWaveSurfers) {
                    delete muteStemsListWaveSurfers[key];
                }
                for (const key in singleStemsListWaveSurfers) {
                    delete singleStemsListWaveSurfers[key];
                }
                stemsOverlay.classList.add("hidden");
            })
        }
    }

    //endregion

    //region Playlist Box
    const playlistOverlayContent = document.getElementById('playlistOverlayContent')
    const playlistOverlay = document.getElementById('playlistOverlay')
    const openPlaylist = document.getElementById('openPlaylistButton')
    const closePlaylist = document.getElementById('closePlaylistOverlay')

    if (playlistOverlay) {
        playlistOverlay.addEventListener("click", (e) => {
            if (e.target === playlistOverlay) {
                playlistOverlayContent.innerHTML = ""
                playlistOverlay.classList.add("hidden")
            }
        });
        if (openPlaylist) {
            openPlaylist.addEventListener("click", (e) => {
                playlistOverlay.classList.remove("hidden")
                createPlaylistContent(playlistOverlayContent, getStoredSoundIDs())
            });
        }
        if (closePlaylist) {
            closePlaylist.addEventListener("click", (e) => {
                playlistOverlayContent.innerHTML = ""
                playlistOverlay.classList.add("hidden")
            });
        }
    }
    //endregion

    lucide.createIcons();
});

const stemsListWaveSurfers = {}
const muteStemsListWaveSurfers = {}
const singleStemsListWaveSurfers = {}

async function createPlaylistContent(playlistOverlayContent, soundIDs) {
    playlistOverlayContent.innerHTML = "";

    for (const [index, soundID] of soundIDs.entries()) {
        const listItem = document.createElement('div');
        listItem.className = "w-full flex flex-col items-start mt-2 mb-2 p-2 border-b border-gray-300";

        const soundInfos = document.createElement('div');
        soundInfos.className = "text-base text-gray-800 flex flex-col gap-2";

        const imageContainer = document.createElement('div');
        imageContainer.className = "w-12 h-12 bg-gray-700 rounded overflow-hidden";

        const img = document.createElement('img');
        img.id = `soundImage_${soundID}`;
        img.className = "w-full h-full object-cover";
        img.alt = "";

        imageContainer.appendChild(img);

        const nameP = document.createElement('p');
        nameP.id = `soundName_${soundID}`;

        const artistDiv = document.createElement('div');
        artistDiv.id = `soundArtistName_${soundID}`;

        soundInfos.appendChild(imageContainer);
        soundInfos.appendChild(nameP);
        soundInfos.appendChild(artistDiv);

        listItem.appendChild(soundInfos);
        playlistOverlayContent.appendChild(listItem);

        const sound = await getSound(soundID);
        setSoundInfos(sound, img.id, nameP.id, artistDiv.id);

        const playButton = document.createElement('button')
        playButton.innerHTML = `<i data-lucide='play' class="${'playlist_icon_' + soundID} w-6 h-6"></i>`;

        listItem.appendChild(playButton);
        playlistOverlayContent.appendChild(listItem);

        playButton.onclick = () => {
            const icons = document.querySelectorAll('[data-lucide]');
            icons.forEach(otherIcon => {
                if (otherIcon.getAttribute('data-lucide') === 'pause') {
                    otherIcon.setAttribute('data-lucide', 'play');
                }
            });

            const src = `/stream/sound/${encodeURIComponent(soundID)}`;
            if (mainWaveSurfer.currentSrc === src) {
                if (mainWaveSurfer.isPlaying()) {
                    const icon = document.querySelector('.playlist_icon_' + soundID);
                    icon.setAttribute('data-lucide', 'play');
                    mainWaveSurfer.pause();
                    return;
                }
                if (mainWaveSurfer.currentSrc === src) {
                    const icon = document.querySelector('.playlist_icon_' + soundID);
                    icon.setAttribute('data-lucide', 'pause');
                    mainWaveSurfer.play();
                    return;
                }

                mainWaveSurfer.load(src);
                mainWaveSurfer.className = "main_waveSurfer_" + soundID
                mainWaveSurfer.once('ready', () => {
                    mainWaveSurfer.stop();
                    const icon = document.querySelector('.playlist_icon_' + soundID);
                    icon.setAttribute('data-lucide', 'pause');
                    mainWaveSurfer.play();
                    mainWaveSurfer.currentSrc = src;
                });
            } else {
                mainWaveSurfer.load(src);
                mainWaveSurfer.className = "main_waveSurfer_" + soundID
                mainWaveSurfer.once('ready', () => {
                    mainWaveSurfer.stop();
                    const icon = document.querySelector('.playlist_icon_' + soundID);
                    icon.setAttribute('data-lucide', 'pause');
                    mainWaveSurfer.play();
                    mainWaveSurfer.currentSrc = src;
                });
            }
        };
    }
    lucide.createIcons();
}

async function createStemsContent(stemsOverlayContent, stems, soundID) {
    const sound = await getSound(soundID);

    let mainStemWaveReady = false;

    const mainStemItem = document.createElement('div');
    mainStemItem.className = "w-full flex justify-between mt-4 mb-4 p-2"

    const mainInfos = document.createElement('div')
    mainInfos.className = "content-center items-center justify-start m-2"
    mainInfos.innerHTML = `
                <div class="flex items-center justify-center">
                    <div class="w-12 h-12 bg-gray-700 rounded overflow-hidden">
                        <img id="stemSoundImage" src=""
                             class="w-full h-full object-cover" alt="">
                    </div>
                </div>

                <div class="flex items-center justify-center w-full">
                    <h5>Name: </h5>
                    <div id="stemSoundName"></div>
                </div>

                <div class="flex items-center justify-center w-full">
                    <h5>Artists: </h5>
                    <div id="stemSoundArtistNames"></div>
                </div>
                `;

    mainStemItem.appendChild(mainInfos)
    stemsOverlayContent.appendChild(mainStemItem)

    if (sound) {
        setSoundInfos(sound, 'stemSoundImage', 'stemSoundName', 'stemSoundArtistNames')
    }

    const mainStemWaveSurferDiv = document.createElement('div');
    mainStemWaveSurferDiv.className = "w-full content-center items-center justify-center relative"
    mainStemWaveSurferDiv.style.border = "1px solid #ddd";

    mainStemItem.appendChild(mainStemWaveSurferDiv)
    stemsOverlayContent.appendChild(mainStemItem)

    const mainStemWaveSurfer = WaveSurfer.create({
        container: mainStemWaveSurferDiv,
        waveColor: 'rgb(200, 0, 200)',
        progressColor: 'rgb(100, 0, 100)',
        url: '',
        height: 50,
    })
    mainStemWaveSurfer.setMuted(true);
    stemsListWaveSurfers[soundID] = mainStemWaveSurfer

    const src = `/stream/sound/${encodeURIComponent(soundID)}`;
    mainStemWaveSurfer.load(src)
    mainStemWaveSurfer.className = "main_waveSurfer_" + soundID

    const mainStemPlayButton = document.createElement('button')
    mainStemPlayButton.textContent = "Play"
    mainStemPlayButton.className = "pointer border"

    const mainControllerDiv = document.createElement('div')
    mainControllerDiv.className = "flex flex-col items-center justify-center m-2"

    mainControllerDiv.appendChild(mainStemPlayButton)

    mainStemItem.appendChild(mainControllerDiv)
    stemsOverlayContent.appendChild(mainStemItem)

    mainStemWaveSurfer.on('decode', (duration) => {
        mainStemWaveReady = false
    })

    mainStemWaveSurfer.once('ready', () => {
        mainStemWaveReady = true
        mainStemPlayButton.onclick = () => {
            const mainStemItem = stemsListWaveSurfers[soundID];
            mainStemItem.playPause()

            const hasSingleSelected = Object.keys(singleStemsListWaveSurfers).length > 0;

            for (const key in stemsListWaveSurfers) {
                const stemItem = stemsListWaveSurfers[key];

                if (stemItem === mainStemItem) continue;

                stemItem.setMuted(true)

                if (hasSingleSelected) {
                    if (singleStemsListWaveSurfers[key]) {
                        stemItem.setMuted(false);
                    }
                } else {
                    if (!muteStemsListWaveSurfers[key]) {
                        stemItem.setMuted(false);
                    }
                }

                stemItem.playPause();
            }
        }
    })

    mainStemWaveSurferDiv.addEventListener('click', (e) => {
        const bbox = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - bbox.left;
        const percent = x / bbox.width;

        const duration = mainStemWaveSurfer.getDuration();
        if (duration && !isNaN(percent)) {
            for (const key in stemsListWaveSurfers) {
                if (stemsListWaveSurfers[soundID] !== stemsListWaveSurfers[key]) {
                    stemsListWaveSurfers[key].seekTo(percent);
                }
            }
        }
    });

    stems.forEach(stem => {
        let listStemWaveReady = false;

        const listItem = document.createElement('div');
        listItem.className = "w-full flex justify-between mt-4 mb-4 p-2"

        const infos = document.createElement('div')
        infos.className = "content-center items-center justify-start m-2"
        infos.innerHTML = `
                <p>${stem.name}</p>
            `;
        listItem.appendChild(infos)
        stemsOverlayContent.appendChild(listItem)

        const waveSurferDiv = document.createElement('div');
        waveSurferDiv.id = 'div_' + stem.stemID
        waveSurferDiv.className = "w-full content-center items-center justify-center relative"
        waveSurferDiv.style.border = "1px solid #ddd";

        listItem.appendChild(waveSurferDiv)
        stemsOverlayContent.appendChild(listItem)

        const stemWaveSurfer = WaveSurfer.create({
            container: waveSurferDiv,
            waveColor: 'rgb(200, 0, 200)',
            progressColor: 'rgb(100, 0, 100)',
            url: '',
            height: 50,
        })
        stemsListWaveSurfers[stem.stemID] = stemWaveSurfer

        stemWaveSurfer.on('decode', (duration) => {
            listStemWaveReady = false
        })
        stemWaveSurfer.once('ready', () => {
            listStemWaveReady = true
        })

        waveSurferDiv.addEventListener('click', (e) => {
            const bbox = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - bbox.left;
            const percent = x / bbox.width;

            const duration = mainStemWaveSurfer.getDuration();
            if (duration && !isNaN(percent)) {
                for (const key in stemsListWaveSurfers) {
                    if (stemsListWaveSurfers[stem.stemID] !== stemsListWaveSurfers[key]) {
                        stemsListWaveSurfers[key].seekTo(percent);
                    }
                }
            }
        });

        const src = `/stream/sound/${encodeURIComponent(soundID)}?stems=true&stemPath=${stem.stemPath}`;
        stemWaveSurfer.load(src)
        stemWaveSurfer.className = "stem_waveSurfer_" + soundID

        const downloadButton = document.createElement('button')
        downloadButton.textContent = "D"
        downloadButton.className = "pointer border"
        downloadButton.onclick = function () {
            downloadSound(soundID, true, stem.stemPath);
        };

        const singleCheckbox = document.createElement('input');
        singleCheckbox.type = 'checkbox';
        singleCheckbox.className = 'pointer';
        const singleLabel = document.createElement('label');
        singleLabel.textContent = 'S';
        singleLabel.appendChild(singleCheckbox);
        singleCheckbox.addEventListener('change', function () {
            if (singleCheckbox.checked) {
                muteCheckbox.checked = false

                singleStemsListWaveSurfers[stem.stemID] = stemWaveSurfer
                singleStemsListWaveSurfers[stem.stemID].setMuted(false);
            } else {
                delete singleStemsListWaveSurfers[stem.stemID]

                if (muteStemsListWaveSurfers[stem.stemID]) {
                    muteStemsListWaveSurfers[stem.stemID].setMuted(true);
                }
            }
        });

        const muteCheckbox = document.createElement('input');
        muteCheckbox.type = 'checkbox';
        muteCheckbox.className = 'pointer';
        const muteLabel = document.createElement('label');
        muteLabel.textContent = 'M';
        muteLabel.appendChild(muteCheckbox);
        muteCheckbox.addEventListener('change', function () {
            if (muteCheckbox.checked) {
                singleCheckbox.checked = false

                muteStemsListWaveSurfers[stem.stemID] = stemWaveSurfer
                muteStemsListWaveSurfers[stem.stemID].setMuted(true);
            } else {
                delete muteStemsListWaveSurfers[stem.stemID]

                if (singleStemsListWaveSurfers[stem.stemID]) {
                    singleStemsListWaveSurfers[stem.stemID].setMuted(false);
                }
            }
        });

        const controllerDiv = document.createElement('div')
        controllerDiv.className = "flex flex-col items-center justify-center m-2"
        controllerDiv.appendChild(downloadButton)
        controllerDiv.appendChild(muteLabel)
        controllerDiv.appendChild(singleLabel)

        listItem.appendChild(controllerDiv)
        stemsOverlayContent.appendChild(listItem)
    })
}

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
