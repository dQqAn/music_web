/*function getSound(soundID) {
    if (typeof soundID !== 'string') {
        throw new Error('soundID is not a string');
    }
    fetch(`/database/sound/${soundID}`, {
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
        const sound = data.sound;

        const soundContainer = document.querySelector('.sound-container');
        if (!soundContainer) {
            console.error('Sound container is missing!');
            return;
        }

        if (sound) {
            soundContainer.innerHTML = `
                <div class="sound-image">
                    <img src="/${sound.image1Path}" alt="${sound.name}"
                        style="max-width: 200px; max-height: 300px;">
                </div>
                <div class="sound-details">
                    <h1>Name: ${sound.name}</h1>
                    <p><strong>Artist:</strong> ${sound.artist}</p>
                    <p><strong>Status:</strong> ${sound.status}</p>
                    <p><strong>Category1:</strong> ${sound.category1}</p>
                    <p><strong>SoundPath:</strong> ${sound.soundPath}</p>
                    <p><strong>SoundID:</strong> ${sound.soundID}</p>
                    <p><strong>ArtistID:</strong> ${sound.artistID}</p>
                    <button class="pointer" onclick="downloadSound('${sound.soundID}')">Download</button>
                    <div id="playerWrapper">
                        <button class="pointer" onclick="playSound('${sound.soundID}')">Listen</button>
                        <audio id="audioPlayer" controls></audio>
                    </div>
                </div>
            `;
        } else {
            soundContainer.innerHTML = `
                <div class="sound-details">
                    <p>Error</p>
                </div>
            `;
        }
    }).catch(error => {
        console.log("Error:", error);
        const soundContainer = document.querySelector('.sound-container');
        if (soundContainer) {
            soundContainer.innerHTML = `
                <div class="sound-details">
                    <p>Error</p>
                </div>
            `;
        }
    });
}*/

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