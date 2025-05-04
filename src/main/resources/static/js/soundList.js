import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'
import HoverPlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/hover.esm.js'
import RegionsPlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/regions.esm.js'
import {formatTime, mainWaveSurfer} from '../js/audio_player/audio_player.js';
import {toSlug} from '../js/index/index.js'

export const soundListWaveSurfers = {}

export function soundList(containerID, sounds) {
    const container = document.getElementById(containerID)
    if (!container) return;
    container.innerHTML = '';

    sounds.forEach(item => {
        const regions = RegionsPlugin.create()

        const listItem = document.createElement('div');
        listItem.className = "w-full flex justify-between mt-4 mb-4 p-2"

        const infos = document.createElement('div')
        infos.className = "content-center items-center justify-start m-2"
        infos.innerHTML = `
                <a href="/sound/?${toSlug(item.name)}&soundID=${item.soundID}">
                    <p>${item.name}</p>      
                </a>
                ${item.artistInfos.map(artist => `
                    <p>
                      <a href="/artistProfile/${artist.id}">${artist.name}</a>
                    </p>
                `).join("")}
            `;
        listItem.appendChild(infos)
        container.appendChild(listItem)

        const waveSurferDiv = document.createElement('div');
        waveSurferDiv.id = 'div_' + item.soundID
        waveSurferDiv.className = "w-full content-center items-center justify-center relative"
        waveSurferDiv.style.border = "1px solid #ddd";

        listItem.appendChild(waveSurferDiv);
        container.appendChild(listItem);

        /*const soundListHoverDiv = document.createElement('div');
        soundListHoverDiv.innerHTML = `
                <div id="listSoundHover_${item.soundID}" style="position: absolute; left: 0; top: 0; z-index: 1010;
                    pointer-events: none; height: 100%; width: 0; mix-blend-mode: overlay; opacity: 0;
                    background: rgba(255, 255, 255, 0.5); transition: opacity 0.2s ease;">
                </div>
                `;
        listItem.appendChild(soundListHoverDiv);
        container.appendChild(listItem)
        const hoverID = "listSoundHover_" + item.soundID
        const soundListHover = document.getElementById(hoverID);
        waveSurferDiv.addEventListener('mouseenter', () => {
            soundListHover.style.opacity = '1';
        });
        waveSurferDiv.addEventListener('mouseleave', () => {
            soundListHover.style.opacity = '0';
        });
        waveSurferDiv.addEventListener('pointermove', (e) => (soundListHover.style.width = `${e.offsetX}px`))*/

        const listWaveSurfer = WaveSurfer.create({
            container: waveSurferDiv,
            waveColor: 'rgb(200, 0, 200)',
            progressColor: 'rgb(100, 0, 100)',
            url: '',
            height: 75,
            // dragToSeek: true, // minPxPerSec: 100,
            plugins: [
                HoverPlugin.create({
                    lineColor: '#ff0000',
                    lineWidth: 2,
                    labelBackground: '#555',
                    labelColor: '#fff',
                    labelSize: '11px',
                }),
                regions
            ],
        })

        soundListWaveSurfers[item.soundID] = listWaveSurfer

        const durationInfos = document.createElement('div');
        durationInfos.innerHTML = `
                    <p id="time_${item.soundID}">0:00</p>
                    <p id="duration_${item.soundID}">0:00</p>
                `;
        listItem.appendChild(durationInfos);
        container.appendChild(listItem);
        const timeID = 'time_' + item.soundID
        const durationID = 'duration_' + item.soundID
        const timeEl = document.getElementById(timeID)
        const durationEl = document.getElementById(durationID)
        listWaveSurfer.on('decode', (duration) => (durationEl.textContent = formatTime(duration)))
        listWaveSurfer.on('timeupdate', (currentTime) => (timeEl.textContent = formatTime(currentTime)))

        const src = `/stream/sound/${encodeURIComponent(item.soundID)}`;
        listWaveSurfer.load(src)
        listWaveSurfer.className = "waveSurfer_" + item.soundID
        // listWaveSurfer.id = "waveSurfer_" + item.soundID

        const playButton = document.createElement('button')
        playButton.className = "pointer"
        playButton.innerHTML = `<i data-lucide='play' class="${'icon_' + item.soundID} w-6 h-6"></i>`;

        listWaveSurfer.once('ready', () => {
            playButton.onclick = () => {
                const icon = document.querySelector('.icon_' + item.soundID);
                if (icon.getAttribute('data-lucide') === 'play') {
                    const icons = document.querySelectorAll('[data-lucide]');
                    icons.forEach(otherIcon => {
                        if (otherIcon.getAttribute('data-lucide') === 'pause') {
                            otherIcon.setAttribute('data-lucide', 'play');
                        }
                    });

                    mainWaveSurfer.load(src)
                    mainWaveSurfer.className = "main_waveSurfer_" + item.soundID

                    // const currentTime = listWaveSurfer.getCurrentTime();
                    // mainWaveSurfer.seekTo(currentTime / listWaveSurfer.getDuration());

                    const listIcon = document.querySelector('.icon_' + item.soundID);
                    listIcon.setAttribute('data-lucide', 'pause');

                    mainWaveSurfer.once('ready', () => {
                        const rateInput = document.getElementById('mainRateInput');
                        if (rateInput) {
                            mainWaveSurfer.setPlaybackRate(rateInput.valueAsNumber);
                        }
                        mainWaveSurfer.play()
                    })
                } else {
                    mainWaveSurfer.pause()
                    const listIcon = document.querySelector('.icon_' + item.soundID);
                    listIcon.setAttribute('data-lucide', 'play');
                }
                lucide.createIcons();
            }
        })

        waveSurferDiv.addEventListener('click', (e) => {
            const soundID = mainWaveSurfer.className.split("_").pop();
            const className = 'waveSurfer_' + soundID
            if (listWaveSurfer.className === className) {
                const bbox = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - bbox.left;
                const percent = x / bbox.width;

                const duration = mainWaveSurfer.getDuration();
                if (duration && !isNaN(percent)) {
                    mainWaveSurfer.seekTo(percent);
                }
            }
        });

        /*listWaveSurfer.on('ready', () => {
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
        })*/

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