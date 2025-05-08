import {filterSounds} from '../menu/menu.js'

document.addEventListener('DOMContentLoaded', async () => {
    const pathSegments = window.location.pathname.split('/');
    const name = pathSegments[pathSegments.length - 1];

    const categorySoundList = document.getElementById('soundList')
    if (categorySoundList) {
        filterSounds(1, name)
    }
})