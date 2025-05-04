import {updatePagination} from '../pagination.js';

function getSounds(page) {
    let tempPage = 1
    if (page != null && Number.isInteger(page)) {
        tempPage = page
    } else {
        throw new Error('page is not an int');
    }

    fetch(`/database/moderatorSounds?page=${tempPage}`, {
        headers: {
            'Accept': 'application/json'
        },
    }).then(response => {
        if (!response.ok) {
            console.log(`HTTP error! Status: ${response.status}`);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        const tbody = document.querySelector('.sounds_table tbody');
        tbody.innerHTML = '';
        const sounds = Array.isArray(data) ? data : (data.sounds || []);
        sounds.forEach(soundItem => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="sound-checkbox" data-sound-id="${soundItem.soundID}"></td>
                <td>${soundItem.name}</td>
                <td>${soundItem.artistInfos.map(artist => `
                        <p>
                          <a href="/artistProfile/${artist.id}">${artist.name}</a>
                        </p>
                        `).join("")}  </td>   
                <td>${soundItem.categories.map(item => `
                        <p>
                          <a href="/category/${encodeURIComponent(item)}">${item}</a>
                        </p>
                        `).join("")}</td>
            `;
            tbody.appendChild(row);
        });

        window.history.pushState({page: tempPage}, `Page ${tempPage}`, `/moderator/pending_approval?page=${tempPage}`);

        const totalPages = (sounds.length + 20 - 1) / 20
        updatePagination('pagination', tempPage, Math.floor(totalPages), getSounds)
    }).catch(error => {
        console.error('Error:', error)
    });
}

document.addEventListener('DOMContentLoaded', () => {
    getSounds(1)
});

/*async function soundsCount() {
    try {
        const response = await fetch("/database/moderator_sounds_count", {});
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
            return null;
        }

        const data = await response.text();
        const integerValue = parseInt(data);

        if (isNaN(integerValue)) {
            console.error(`${integerValue} is not a number`);
            return null;
        }
        return integerValue;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}*/

function getSelectedSoundIds() {
    const checkboxes = document.querySelectorAll('.sound-checkbox:checked');
    return Array.from(checkboxes).map(cb => cb.getAttribute('data-sound-id'));
}

document.getElementById('submitButton').addEventListener('click', async () => {
    const selectedSoundIds = getSelectedSoundIds();

    if (selectedSoundIds.length === 0) {
        alert('Please select min one item!');
        return;
    }

    try {
        const response = await fetch('/database/moderatorSounds', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({soundIDs: selectedSoundIds})
        });

        if (!response.ok) {
            throw new Error('Error backend');
        }

        const result = await response.text();

        const urlParams = new URLSearchParams(window.location.search);
        let page = parseInt(urlParams.get("page")) || null;
        getSounds(page)
    } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    }
});
