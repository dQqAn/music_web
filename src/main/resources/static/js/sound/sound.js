import {downloadSound, getSound} from '../soundList.js'
import {setupPlaylistDiv} from '../playlist.js'
import {createFavDiv} from '../favourite.js'

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const soundID = params.get('soundID')

    const soundPlaylistDiv = document.getElementById('soundPlaylistDiv')
    if (soundPlaylistDiv) {
        const sound = await getSound(soundID);
        setSoundInfos(sound, 'soundImage', 'soundName', 'soundArtistNames')
        await createFavDiv('soundFavDiv', sound.soundID)
        setupPlaylistDiv(sound, 'soundPlaylistDiv', 'soundPlaylistBtn',
            'soundAddToPlaylistBtn', 'soundCreatePlaylist',
            'soundPlaylistContainer', 'soundPlaylistCloseBtn',
            'soundPlaylistResult', 'soundPlaylistInput')

        document.getElementById('soundDownload').onclick = () => {
            downloadSound(sound.soundID)
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
