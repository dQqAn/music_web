import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'
import {mainWaveSurfer} from '../js/audio_player/audio_player.js';
import {toSlug} from '../js/index/index.js'

let currentTrack = {
    soundID: "",
    playlistID: "",
    currentTime: 0.0,     // second
    volume: 1.0         // 0.0 - 1.0
};

export function soundList(containerID, sounds) {
    const container = document.getElementById(containerID)
    if (!container) return;
    container.innerHTML = '';

    sounds.forEach(item => {
        const listItem = document.createElement('div');
        listItem.className = "w-full flex justify-between mt-4 mb-4 p-2"

        const infos = document.createElement('div')
        infos.className = "content-center items-center justify-start m-2"
        infos.innerHTML = `
                <a href="/sound/?${toSlug(item.name)}&soundID=${item.soundID}">
                    <p>${item.name}</p>      
                </a>
                <p>${item.artistIDs}</p>
            `;
        listItem.appendChild(infos)
        container.appendChild(listItem)

        const waveSurferDiv = document.createElement('div');
        waveSurferDiv.id = 'div_' + item.soundID
        waveSurferDiv.className = "w-full content-center items-center justify-center"
        waveSurferDiv.style.border = "1px solid #ddd";

        listItem.appendChild(waveSurferDiv);
        container.appendChild(listItem);

        const listWaveSurfer = WaveSurfer.create({
            container: waveSurferDiv,
            waveColor: 'rgb(200, 0, 200)',
            progressColor: 'rgb(100, 0, 100)',
            url: '',
            height: 75,
        })

        const src = `/stream/sound/${encodeURIComponent(item.soundID)}`;
        listWaveSurfer.load(src)

        const playButton = document.createElement('button')
        playButton.className = "pointer"
        playButton.innerHTML = `<i data-lucide='play' class="${'icon_' + item.soundID} w-6 h-6"></i>`;

        listWaveSurfer.className = "waveSurfer_" + item.soundID
        listWaveSurfer.once('ready', () => {
            playButton.onclick = () => {

                if (listWaveSurfer.className !== mainWaveSurfer.className) {
                    mainWaveSurfer.className = "waveSurfer_" + item.soundID
                }

                const icon = document.querySelector('.icon_' + item.soundID);
                if (icon.getAttribute('data-lucide') === 'play') {
                    const icons = document.querySelectorAll('[data-lucide]');
                    icons.forEach(otherIcon => {
                        if (otherIcon.getAttribute('data-lucide') === 'pause') {
                            otherIcon.setAttribute('data-lucide', 'play');
                        }
                    });

                    icon.setAttribute('data-lucide', 'pause');
                    lucide.createIcons();

                    mainWaveSurfer.load(src)
                    mainWaveSurfer.once('ready', () => {
                        if (listWaveSurfer.className === mainWaveSurfer.className) {
                            if (!mainWaveSurfer.isPlaying()) {
                                mainWaveSurfer.play()
                            }
                        }
                    })
                } else {
                    icon.setAttribute('data-lucide', 'play');
                    lucide.createIcons();
                    mainWaveSurfer.pause()
                }
            }
        })

        waveSurferDiv.addEventListener('click', (e) => {
            if (listWaveSurfer.className === mainWaveSurfer.className) {
                const bbox = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - bbox.left;
                const percent = x / bbox.width;

                const duration = mainWaveSurfer.getDuration();
                if (duration && !isNaN(percent)) {
                    mainWaveSurfer.seekTo(percent);
                }
            }
        });

        listWaveSurfer.on('ready', () => {
            let isDragging = false;
            waveSurferDiv.addEventListener('mousedown', (e) => {
                if (listWaveSurfer.className === mainWaveSurfer.className) {
                    isDragging = true;
                    seek(e, mainWaveSurfer, listWaveSurfer, waveSurferDiv);
                }

            });
            window.addEventListener('mouseup', () => {
                if (listWaveSurfer.className === mainWaveSurfer.className) {
                    isDragging = false;
                }

            });
            waveSurferDiv.addEventListener('mousemove', (e) => {
                if (isDragging && listWaveSurfer.className === mainWaveSurfer.className) {
                    seek(e, mainWaveSurfer, listWaveSurfer, waveSurferDiv);
                }
            });
        })

        mainWaveSurfer.on('audioprocess', () => {
            if (listWaveSurfer.className === mainWaveSurfer.className) {
                if (!mainWaveSurfer.isPlaying()) return;
                const currentTime = mainWaveSurfer.getCurrentTime();
                listWaveSurfer.seekTo(currentTime / mainWaveSurfer.getDuration());
            }
        });

        mainWaveSurfer.on('play', () => {
            if (listWaveSurfer.className === mainWaveSurfer.className) {
                const currentTime = listWaveSurfer.getCurrentTime();
                mainWaveSurfer.seekTo(currentTime / listWaveSurfer.getDuration());

                const icon = document.querySelector('.icon_' + item.soundID);
                icon.setAttribute('data-lucide', 'pause');
                lucide.createIcons();

                currentTrack.soundID = item.soundID
                localStorage.setItem("currentTrack", JSON.stringify(currentTrack));
            }
        })

        mainWaveSurfer.on('pause', () => {
            if (listWaveSurfer.className === mainWaveSurfer.className) {
                const icon = document.querySelector('.icon_' + item.soundID);
                icon.setAttribute('data-lucide', 'play');
                lucide.createIcons();
            }
        })

        const controllerDiv = document.createElement('div')
        controllerDiv.className = "content-center items-center justify-end m-2"
        controllerDiv.appendChild(playButton)

        listItem.appendChild(controllerDiv)
        container.appendChild(listItem)
    });

    const paginationDiv = document.createElement('div')
    paginationDiv.id = "pagination"
    paginationDiv.className = "pointer pagination"
    container.appendChild(paginationDiv)
}

function seek(e, mainWave, listItemWave, listItemContainer) {
    const rect = listItemContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));

    listItemWave.seekTo(percent);
    mainWave.seekTo(percent);
}