import {downloadSound, getSound} from '../soundList.js'
import {setupPlaylistDiv} from '../playlist.js'
import {createFavDiv} from '../favourite.js'
import {mainWaveSurfer} from "../audio_player/audio_player.js";

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const soundID = params.get('soundID')

    const soundPlaylistDiv = document.getElementById('soundPlaylistDiv')
    if (soundPlaylistDiv) {
        const sound = await getSound(soundID);
        if (sound) {
            setSoundInfos(sound, 'soundImage', 'soundName', 'soundArtistNames')
            await createFavDiv('soundFavDiv', sound.soundID)
            setupPlaylistDiv(sound, 'soundPlaylistDiv', 'soundPlaylistBtn',
                'soundAddToPlaylistBtn', 'soundCreatePlaylist',
                'soundPlaylistContainer', 'soundPlaylistCloseBtn',
                'soundPlaylistResult', 'soundPlaylistInput')

            document.getElementById('soundDownload').onclick = () => {
                downloadSound(sound.soundID)
            }

            setCategories(sound, 'soundCategories')

            const playButton = document.getElementById('soundPlay')
            playButton.innerHTML = `<i data-lucide='play' class="${'icon_' + soundID} w-6 h-6"></i>`;
            playButton.onclick = () => {
                const src = `/stream/sound/${encodeURIComponent(soundID)}`;
                if (mainWaveSurfer.isPlaying()) {
                    mainWaveSurfer.pause();
                    return;
                }
                if (mainWaveSurfer.currentSrc === src) {
                    mainWaveSurfer.play();
                    return;
                }

                mainWaveSurfer.load(src);
                mainWaveSurfer.className = "main_waveSurfer_" + soundID
                mainWaveSurfer.once('ready', () => {
                    mainWaveSurfer.stop();
                    mainWaveSurfer.play();
                    mainWaveSurfer.currentSrc = src;
                });
            };
            lucide.createIcons();
        }
    }
})

export function setSoundInfos(sound, soundImageDivID, soundNameDivID, artistsNameDivID) {
    const image = document.getElementById(soundImageDivID)
    const name = document.getElementById(soundNameDivID)
    const artists = document.getElementById(artistsNameDivID)

    image.src = sound.image1Path
    image.classList.add('items-center')
    name.textContent = sound.name
    name.classList.add('items-center')
    artists.classList.add('items-center')
    artists.innerHTML = `
                    ${sound.artistInfos.map(artist => `
                        <p>
                          <a href="/artistProfile/${artist.id}">${artist.name}</a>
                        </p>
                        `).join("")}  
                    `;
}

export function setCategories(sound, categoryDivID) {
    const categoriesDiv = document.getElementById(categoryDivID)
    categoriesDiv.innerHTML = ''
    if (!sound.categories || sound.categories.length === 0) return;

    sound.categories.forEach(category => {
        const span = document.createElement('span')
        span.className = 'inline-block bg-blue-600 text-white text-sm px-2 py-1 rounded mr-2 mb-2'
        span.textContent = category
        categoriesDiv.appendChild(span)
    })
}

