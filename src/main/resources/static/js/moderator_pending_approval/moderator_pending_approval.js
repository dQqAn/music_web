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
                <td>${soundItem.artist}</td>   
                <td>${soundItem.category1}</td>
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
    console.log('IDs:', selectedSoundIds);

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

function updatePagination(divID, currentPage, totalPages, onPageClick) {
    const pagination = document.getElementById(divID);
    pagination.innerHTML = '';

    if (currentPage > 1) {
        const firstLink = document.createElement('a');
        firstLink.textContent = 'First';
        firstLink.onclick = () => onPageClick(1);
        pagination.appendChild(firstLink);

        const prevLink = document.createElement('a');
        prevLink.textContent = 'Before';
        prevLink.onclick = () => onPageClick(currentPage - 1);
        pagination.appendChild(prevLink);
    }

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.textContent = i;
        pageLink.onclick = () => onPageClick(i);
        if (i === currentPage) {
            pageLink.classList.add('active');
        }
        pagination.appendChild(pageLink);
    }

    if (currentPage < totalPages) {
        const nextLink = document.createElement('a');
        nextLink.textContent = 'Next';
        nextLink.onclick = () => onPageClick(currentPage + 1);
        pagination.appendChild(nextLink);

        const lastLink = document.createElement('a');
        lastLink.textContent = 'Last';
        lastLink.onclick = () => onPageClick(totalPages);
        pagination.appendChild(lastLink);
    }
}
