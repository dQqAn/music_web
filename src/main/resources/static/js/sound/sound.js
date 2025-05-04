import {downloadSound, getSound} from '../soundList.js'
import {setupPlaylistDiv} from '../playlist.js'
import {createFavDiv} from '../favourite.js'

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
        }
    }
})

export function setSoundInfos(sound, soundImageDivID, soundNameDivID, artistsNameDivID) {
    const image = document.getElementById(soundImageDivID)
    const name = document.getElementById(soundNameDivID)
    const artists = document.getElementById(artistsNameDivID)

    image.src = '/' + sound.image1Path
    name.textContent = sound.name
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

