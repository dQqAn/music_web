// import { playSoundToMusicBox } from '/js/audio_player/audio_player.js';

function changeGrid(columns) {
    const grid = document.getElementById('grid');
    grid.style.gridTemplateColumns = `repeat(${columns}, minmax(200px, 1fr))`;
}

export function loadSounds(page) {
    if (!Number.isInteger(page)) {
        throw new Error('page is not a number');
    }

    fetchSoundsWithPagination(
        {
            url: `/database/sounds?page=${page}`,
            page: page, gridId: 'grid', paginationId: 'pagination'
        });
}

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

function toSlug(str) {
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

/*async function soundCount() {
    try {
        const response = await fetch("/database/sound_count");
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

/*async function categorySize(category, counter) {
    try {
        const response = await fetch(`/database/category_size/${category}/${counter}`);
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

function getPageFromUrl(totalPages) {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get('page')) || 1;
    return Math.max(1, Math.min(page, totalPages)); // 1 ile totalPages arasında sınırla
}

function fetchSoundsWithPagination({url, page, gridId, paginationId}) {
    fetch(`${url}?page=${page}`, {
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log(`HTTP error! Status: ${response.status}`);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const grid = document.getElementById(gridId);
            if (!grid) return;
            grid.innerHTML = '';

            const sounds = Array.isArray(data) ? data : (data.sounds || []);
            sounds.forEach(item => {
                const soundDiv = document.createElement('div');
                soundDiv.className = 'sound';
                soundDiv.innerHTML = `
                    <a href="/sound/?${toSlug(item.name)}&soundID=${item.soundID}">
                        <img class="pointer" src="${item.image1Path}" alt=""
                             style="max-width: 200px; max-height: 300px;">
                    </a>
                    <h1>${item.name}</h1>
                    <button class="pointer" onclick="playSoundToMusicBox('${item.soundID}')">Listen</button>
                `;
                grid.appendChild(soundDiv);
            });

            window.history.pushState({page: page}, `Page ${page}`, `/?page=${page}`);

            const totalPages = Math.floor((sounds.length + 20 - 1) / 20);
            updatePagination(paginationId, page, totalPages, (p) => {
                fetchSoundsWithPagination({
                    url,
                    page: p,
                    gridId,
                    paginationId
                });
            });
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

const resultsDiv = document.getElementById("searchResults");

document.getElementById("searchInput").addEventListener("input", async (event) => {
    const query = event.target.value.trim();
    if (query.length < 3) {
        resultsDiv.style.display = "none";
        resultsDiv.innerHTML = "";
        return;
    }

    try {
        const response = await fetch(`/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
            resultsDiv.innerHTML = "<p style='color: red;'>Error while searching.</p>";
            return;
        }

        const results = await response.json();
        resultsDiv.innerHTML = "";

        if (results.length === 0) {
            resultsDiv.style.display = "none";
            resultsDiv.innerHTML = "<p>No results found.</p>";
            return;
        }

        results.forEach(item => {
            const div = document.createElement("div");
            div.className = "result-item pointer";
            div.textContent = item.name + " - " + item.artist;
            div.onclick = () => {
                window.location.href = `/sound/?${toSlug(item.name)}&soundID=${item.soundID}`;
            };
            resultsDiv.appendChild(div);
        });
        resultsDiv.style.display = "block";
    } catch (error) {
        resultsDiv.innerHTML = `<p style="color: red;">Error: ${error}</p>`;
        resultsDiv.style.display = "none";
    }
});

document.addEventListener("click", (e) => {
    if (!document.querySelector(".search_box").contains(e.target)) {
        resultsDiv.style.display = "none";
    }
});
