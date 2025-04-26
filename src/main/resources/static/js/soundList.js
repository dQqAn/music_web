import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'
import {wavesurfer} from '../js/audio_player/audio_player.js';

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
                <p>${item.name}</p>
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
        })
        const src = `/stream/sound/${encodeURIComponent(item.soundID)}`;
        listWaveSurfer.load(src)

        const playButton = document.createElement('button')
        playButton.className = "pointer"
        playButton.innerHTML = `<i data-lucide="play" class="${'icon_' + item.soundID} w-6 h-6"></i>`;

        listWaveSurfer.once('ready', () => {
            playButton.onclick = () => {
                listWaveSurfer.playPause()

                wavesurfer.load(src)
                currentTrack.soundID = item.soundID
                localStorage.setItem("currentTrack", JSON.stringify(currentTrack));
            }
        })
        listWaveSurfer.on('play', () => {
            const icon = document.querySelector('.icon_' + item.soundID);
            icon.setAttribute('data-lucide', 'pause');
            lucide.createIcons();
        })
        listWaveSurfer.on('pause', () => {
            const icon = document.querySelector('.icon_' + item.soundID);
            icon.setAttribute('data-lucide', 'play');
            lucide.createIcons();
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