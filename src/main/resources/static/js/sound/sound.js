function downloadSound(soundID) {
    const url = `/download/sound/${encodeURIComponent(soundID)}`;

    const link = document.createElement("a");
    link.href = url;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function playSound(soundID) {
    const audio = document.getElementById("audioPlayer");
    audio.src = `/stream/sound/${encodeURIComponent(soundID)}`;
    audio.play().catch(err => {
        console.error("Audio error:", err);
    });
}

async function changeSoundFavouriteStatus(soundID) {
    try {
        const response = await fetch('/database/favouriteSound', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({soundIDs: [soundID]})
        });

        if (!response.ok) {
            console.log("Error backend.")
            return;
        }

        const result = await response.json();
        const newStatus = result.favouriteStatus;

        const btn = document.getElementById(`fav-btn-${soundID}`);
        if (btn) {
            btn.textContent = newStatus ? "Unfav" : "Fav";
        }
    } catch (error) {
        console.error('Error');
    }
}

function setupPlaylistInputListener() {
    const input = document.getElementById("playlistInput");
    if (!input) return;

    input.addEventListener("input", handlePlaylistInput);
}

async function handlePlaylistInput(event) {
    const query = event.target.value;
    if (query.length < 1) {
        showPlaylists()
        return;
    }
    basicSelected = [];
    basicUnSelected = [];
    const params = new URLSearchParams(window.location.search);
    const soundID = params.get('soundID');
    const playlistDiv = document.getElementById("playlistResult");
    try {
        const response = await fetch(`/database/search_user_playlist?query=${encodeURIComponent(query)}&soundID=${soundID}`);
        if (!response.ok) {
            playlistDiv.innerHTML = "<p style='color: red;'>Error while searching.</p>";
            return;
        }

        playlistDiv.innerHTML = "";
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

async function showPlaylists() {
    basicSelected = [];
    basicUnSelected = [];
    selected = [];
    unSelected = [];
    const params = new URLSearchParams(window.location.search);
    const soundID = params.get('soundID');
    const playlistDiv = document.getElementById("playlistResult");
    try {
        const response = await fetch(`/database/user_playlist?soundID=${soundID}`);
        if (!response.ok) {
            return;
        }

        playlistDiv.innerHTML = "";
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
        setupCheckboxListener();
    } catch (error) {
        console.log(error)
    }
}

function togglePlaylist() {
    const container = document.getElementById('playlistContainer');
    container.style.display = container.style.display === 'block' ? 'none' : 'block';
    if (container.style.display === 'block') {
        showPlaylists();
        setupPlaylistInputListener();
    }
}

async function addSound(soundIDs) {
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

        showPlaylists();

        // const result = await response.json();
        // console.log(result)
    }
}

let basicSelected = [];
let basicUnSelected = [];
let selected = [];
let unSelected = [];

function setupCheckboxListener() {
    const checkboxes = document.querySelectorAll('#playlistResult input[type="checkbox"]')
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

    // console.log("selected:", selected);
    // console.log("unSelected:", unSelected);
}

async function createPlaylist() {
    const value = document.getElementById("playlistInput").value;

    const response = await fetch('/database/createPlaylist', {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `name=${encodeURIComponent(value)}`
    });

    const statusCode = response.status;
    if (statusCode === 200) {
        showPlaylists()
    }
    // const result = await response.text();
}