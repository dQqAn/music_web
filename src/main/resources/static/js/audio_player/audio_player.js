import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'
// import Region from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/regions.esm.js'
// import EnvelopePlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/envelope.esm.js'

// Create an instance of WaveSurfer
const wavesurfer = WaveSurfer.create({
    container: '#music_box',
    waveColor: 'rgb(200, 0, 200)',
    progressColor: 'rgb(100, 0, 100)',
    url: '',
})

/*const isMobile = top.matchMedia('(max-width: 900px)').matches*/

// Initialize the Envelope plugin"@tailwindcss/postcss": "^4.1.4",
//     "postcss": "^8.5.3",
//     "wavesurfer.js": "^7.9.4"
/*const envelope = wavesurfer.registerPlugin(
    EnvelopePlugin.create({
        volume: 0.8,
        lineColor: 'rgba(255, 0, 0, 0.5)',
        lineWidth: 4,
        dragPointSize: isMobile ? 20 : 12,
        dragLine: !isMobile,
        dragPointFill: 'rgba(0, 255, 255, 0.8)',
        dragPointStroke: 'rgba(0, 0, 0, 0.5)',

        points: [
            {time: 11.2, volume: 0.5},
            {time: 15.5, volume: 0.8},
        ],
    }),
)*/

/*envelope.on('points-change', (points) => {
    console.log('Envelope points changed', points)
})*/

// envelope.addPoint({time: 1, volume: 0.9})

// Randomize points
/*const randomizePoints = () => {
    const points = []
    const len = 5 * Math.random()
    for (let i = 0; i < len; i++) {
        points.push({
            time: Math.random() * wavesurfer.getDuration(),
            volume: Math.random(),
        })
    }
    envelope.setPoints(points)
}

document.querySelector('#randomize').onclick = randomizePoints*/

// Show the current volume
/*const volumeLabel = document.getElementById('tempLabel')
const showVolume = () => {
    const volume = envelope.getCurrentVolume().toFixed(2)
    volumeLabel.textContent = volume
}
envelope.on('volume-change', showVolume)
wavesurfer.on('ready', showVolume)*/

// Play/pause button
// const button = document.querySelector('#play')
const musicBoxPlayPause = document.querySelector('#musicBoxPlayPause')
wavesurfer.once('ready', () => {
    musicBoxPlayPause.onclick = () => {
        wavesurfer.playPause()
    }
})
wavesurfer.on('play', () => {
    const icon = document.getElementById('playPauseIcon');
    icon.setAttribute('data-lucide', 'pause');
    lucide.createIcons();
})
wavesurfer.on('pause', () => {
    const icon = document.getElementById('playPauseIcon');
    icon.setAttribute('data-lucide', 'play');
    lucide.createIcons();
})

let currentTrack = {
    soundID: "",
    playlistID: "",
    currentTime: 0.0,     // second
    volume: 1.0         // 0.0 - 1.0
};

//todo loadSounds()
function playSoundToMusicBox(soundID) {
    currentTrack.soundID = soundID
    localStorage.setItem("currentTrack", JSON.stringify(currentTrack));

    const src = `/stream/sound/${encodeURIComponent(soundID)}`;
    wavesurfer.load(src);
    wavesurfer.once('ready', () => {
        wavesurfer.playPause();
    })

    /*setInterval(() => {
        currentTrack.volume = 1.0;
        localStorage.setItem("currentTrack", JSON.stringify(currentTrack));
    }, 5000);*/
}

window.playSoundToMusicBox = playSoundToMusicBox;

document.addEventListener("DOMContentLoaded", () => {
    let savedTrack = localStorage.getItem("currentTrack");

    if (savedTrack) {
        let restoredTrack = JSON.parse(savedTrack);
        const src = `/stream/sound/${encodeURIComponent(restoredTrack.soundID)}`;
        wavesurfer.load(src)
    }

    lucide.createIcons();
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
        const container = document.getElementById(containerID)
        if (!container) return;
        container.innerHTML = '';

        const sounds = Array.isArray(data) ? data : (data.sounds || []);
        sounds.forEach(item => {
            const listItem = document.createElement('div');
            listItem.className = "w-full flex justify-between mt-4 mb-4 p-2"

            const infos = document.createElement('div')
            infos.className = "content-center items-center justify-start m-2"
            infos.innerHTML = `
                <p>${item.name}</p>
                <p>${item.artistIDs}</p>
            `;
            listItem.appendChild(infos)
            container.appendChild(listItem)

            const waveSurferDiv = document.createElement('div');
            waveSurferDiv.id = 'div_' + item.soundID
            waveSurferDiv.className = "w-full content-center items-center justify-center"
            waveSurferDiv.style.border = "1px solid #ddd";

            listItem.appendChild(waveSurferDiv);
            container.appendChild(listItem);

            const listWaveSurfer = WaveSurfer.create({
                container: waveSurferDiv,
                waveColor: 'rgb(200, 0, 200)',
                progressColor: 'rgb(100, 0, 100)',
                url: '',
            })
            const src = `/stream/sound/${encodeURIComponent(item.soundID)}`;
            listWaveSurfer.load(src)

            const playButton = document.createElement('button')
            playButton.className = "pointer"
            playButton.innerHTML = `<i data-lucide="play" class="${'icon_' + item.soundID} w-6 h-6"></i>`;

            listWaveSurfer.once('ready', () => {
                playButton.onclick = () => {
                    listWaveSurfer.playPause()

                    wavesurfer.load(src)
                    currentTrack.soundID = item.soundID
                    localStorage.setItem("currentTrack", JSON.stringify(currentTrack));
                }
            })
            listWaveSurfer.on('play', () => {
                const icon = document.querySelector('.icon_' + item.soundID);
                icon.setAttribute('data-lucide', 'pause');
                lucide.createIcons();
            })
            listWaveSurfer.on('pause', () => {
                const icon = document.querySelector('.icon_' + item.soundID);
                icon.setAttribute('data-lucide', 'play');
                lucide.createIcons();
            })

            const controllerDiv = document.createElement('div')
            controllerDiv.className = "content-center items-center justify-end m-2"
            controllerDiv.appendChild(playButton)

            listItem.appendChild(controllerDiv)
            container.appendChild(listItem)
        });

        const paginationDiv = document.createElement('div')
        paginationDiv.id = "pagination"
        paginationDiv.className = "pointer pagination"
        container.appendChild(paginationDiv)

        lucide.createIcons();
        window.history.pushState({page: page}, `Page ${page}`, `?page=${page}`);

        const paginationId = paginationDiv.id
        const totalPages = Math.floor((sounds.length + 20 - 1) / 20);
        updatePagination(paginationId, page, totalPages, (p) => {
            loadFavourites(userID, containerID, p);
        });
    }).catch(error => {
        console.error("Error:", error);
    });
}

window.loadFavourites = loadFavourites;

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