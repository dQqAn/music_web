import {filterSounds} from "../menu/menu.js";

export function toSlug(str) {
    const turkishToEnglish = {
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
        'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
    };

    return str
        .toLowerCase()
        .split('')
        .map(char => turkishToEnglish[char] || char)
        .join('')
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^a-z0-9-]/g, '')     // Remove all non-alphanumeric chars except -
        .replace(/-+/g, '-');           // Replace multiple - with single -
}


document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();

    const div = document.getElementById('soundList')
    if (div) {
        filterSounds(1)
    }
});