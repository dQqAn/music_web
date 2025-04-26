import {updatePagination} from '../pagination.js';

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

document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
});
