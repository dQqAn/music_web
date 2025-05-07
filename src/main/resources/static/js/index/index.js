import {filterSounds} from "../menu/menu.js";

document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();

    const div = document.getElementById('soundList')
    if (div) {
        filterSounds(1)
    }
});