export function togglePlaylist(playlistContainer, playlistResult, id, playlistInput) {
    const container = document.getElementById(playlistContainer);
    container.style.display = container.style.display === 'block' ? 'none' : 'block';
    if (container.style.display === 'block') {
        showPlaylists(playlistResult, id).then(r => {
        });
        setupPlaylistInputListener(id, playlistInput, playlistResult);
    }
}

let basicSelected = [];
let basicUnSelected = [];
let selected = [];
let unSelected = [];

async function showPlaylists(playlistResult, id = "") {
    basicSelected = [];
    basicUnSelected = [];
    selected = [];
    unSelected = [];
    const params = new URLSearchParams(window.location.search);
    const soundID = params.get('soundID') ?? id;
    const playlistDiv = document.getElementById(playlistResult);
    try {
        playlistDiv.innerHTML = "";
        const response = await fetch(`/database/user_playlist?soundID=${soundID}`);
        if (!response.ok) {
            return;
        }

        const results = await response.json();

        if (results.length === 0) {
            playlistDiv.innerHTML = "<p>No results found.</p>";
            return;
        }

        results.forEach(item => {
            const input = document.createElement("input");
            input.type = "checkbox";
            input.id = "playlist-checkbox-" + item.playlist.playlistID

            const label = document.createElement("label");
            label.htmlFor = input.id;
            label.textContent = item.playlist.name;

            if (item.soundStatus) {
                input.checked = item.soundStatus;
                if (item.soundStatus && !selected.includes(item.playlist.playlistID)) {
                    basicSelected.push(item.playlist.playlistID)
                }
            }

            const container = document.createElement("div");
            container.appendChild(input);
            container.appendChild(label);
            playlistDiv.appendChild(container);
        });
        playlistDiv.style.display = "block";
        setupCheckboxListener(playlistResult);
    } catch (error) {
        console.log(error)
    }
}

let playlistSearchTimeout;

function setupPlaylistInputListener(id, playlistInput, playlistResult) {
    const input = document.getElementById(playlistInput);
    if (!input) return;

    input.addEventListener("input", (event) => {
        clearTimeout(playlistSearchTimeout);
        playlistSearchTimeout = setTimeout(() => {
            handlePlaylistInput(event, id, playlistResult).then(r => {
            });
        }, 300);
    });
}

let currentPlaylistFetchController = null;

async function handlePlaylistInput(event, id = "", playlistResult) {
    const query = event.target.value;

    if (currentPlaylistFetchController) {
        currentPlaylistFetchController.abort();
    }

    currentPlaylistFetchController = new AbortController();
    const signal = currentPlaylistFetchController.signal;

    if (query.length < 1) {
        await showPlaylists(playlistResult, id)
        return;
    }
    basicSelected = [];
    basicUnSelected = [];
    const params = new URLSearchParams(window.location.search);
    const soundID = params.get('soundID') ?? id;
    const playlistDiv = document.getElementById(playlistResult);
    try {
        playlistDiv.innerHTML = "";
        const response = await fetch(`/database/search_user_playlist?query=${encodeURIComponent(query)}&soundID=${soundID}`,
            {signal});
        if (!response.ok) {
            playlistDiv.innerHTML = "<p style='color: red;'>Error while searching.</p>";
            return;
        }

        const results = await response.json();
        if (results.length === 0) {
            playlistDiv.innerHTML = "<p>No results found.</p>";
            return;
        }

        results.forEach(item => {
            const input = document.createElement("input");
            input.type = "checkbox";
            input.id = "playlist-checkbox-" + item.playlist.playlistID

            const label = document.createElement("label");
            label.htmlFor = input.id;
            label.textContent = item.playlist.name;

            input.checked = item.soundStatus;
            if (item.soundStatus && !selected.includes(item.playlist.playlistID)) {
                basicSelected.push(item.playlist.playlistID)
            }

            const container = document.createElement("div");
            container.appendChild(input);
            container.appendChild(label);
            playlistDiv.appendChild(container);
        });
        playlistDiv.style.display = "block";
    } catch (error) {
        playlistDiv.innerHTML = `<p style="color: red;">Error: ${error}</p>`;
        playlistDiv.style.display = "none";
    }
}

export async function addSound(soundIDs, playlistResult, id = "") {
    const newSelected = selected.filter(id => !basicSelected.includes(id));
    const newUnselected = unSelected.filter(id => !basicUnSelected.includes(id));

    const cleanedSelected = newSelected.map(id => id.replace("playlist-checkbox-", ""));
    const cleanedUnselected = newUnselected.map(id => id.replace("playlist-checkbox-", ""));

    if (newSelected.length !== 0 || newUnselected.length !== 0) {
        const response = await fetch(`/database/soundsToPlaylist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({soundIDs: soundIDs, selected: cleanedSelected, unselected: cleanedUnselected})
        });
        if (!response.ok) {
            return;
        }

        await showPlaylists(playlistResult, id);
    }
}

function setupCheckboxListener(playlistResult) {
    const checkboxes = document.querySelectorAll(`#${playlistResult} input[type="checkbox"]`);
    if (!checkboxes) return;

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxes);
    });
}

async function handleCheckboxes(event) {
    const id = event.target.id;
    if (event.target.checked) {
        if (!selected.includes(id)) selected.push(id);
        const i = unSelected.indexOf(id);
        if (i !== -1) unSelected.splice(i, 1);
    } else {
        if (!unSelected.includes(id)) unSelected.push(id);
        const i = selected.indexOf(id);
        if (i !== -1) selected.splice(i, 1);
    }
}

export async function createPlaylist(playlistInput, playlistResult, id = "") {
    const value = document.getElementById(playlistInput).value;

    const response = await fetch('/database/createPlaylist', {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `name=${encodeURIComponent(value)}`
    });

    const statusCode = response.status;
    if (statusCode === 200) {
        await showPlaylists(playlistResult, id)
    }
}