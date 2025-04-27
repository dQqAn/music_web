import {soundList} from "../soundList.js";
import {updatePagination} from "../pagination.js";

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

    loadSounds(1)
});

function loadSounds(page) {
    if (!Number.isInteger(page)) {
        throw new Error('page is not a number');
    }
    const url = `/database/sounds?page=${page}`
    fetch(`${url}`, {
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

            const sounds = Array.isArray(data) ? data : (data.sounds || []);
            soundList('soundList', sounds)

            lucide.createIcons();
            window.history.pushState({page: page}, `Page ${page}`, `?page=${page}`);

            const totalPages = Math.floor((sounds.length + 20 - 1) / 20);
            updatePagination("pagination", page, totalPages, (p) => {
                loadSounds(p);
            });
        })
        .catch(error => {
            console.error("Error:", error);
        });
}