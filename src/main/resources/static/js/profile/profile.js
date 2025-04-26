import {updatePagination} from '../pagination.js';
import {soundList} from '../soundList.js'

document.addEventListener("DOMContentLoaded", () => {
    const favouritesBtn = document.getElementById('favouritesBtn');
    favouritesBtn.addEventListener('click', () => {
        const userId = favouritesBtn.dataset.userId;
        loadFavourites(userId, 'soundList', 1);
    });
});

function loadFavourites(userID, containerID, page = 1) {
    if (isNaN(page)) {
        console.error(`${page} is not a number`);
        return null;
    }
    fetch(`/loadFavourites/${userID}?page=${page}`, {
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (!response.ok) {
            console.log(`HTTP error! Status: ${response.status}`);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    }).then(data => {

        const sounds = Array.isArray(data) ? data : (data.sounds || []);
        soundList(containerID, sounds)

        lucide.createIcons();
        window.history.pushState({page: page}, `Page ${page}`, `?page=${page}`);

        const totalPages = Math.floor((sounds.length + 20 - 1) / 20);
        updatePagination("pagination", page, totalPages, (p) => {
            loadFavourites(userID, containerID, p);
        });
    }).catch(error => {
        console.error("Error:", error);
    });
}