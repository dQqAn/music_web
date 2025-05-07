import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'
import {setSoundInfos} from '../js/sound/sound.js'
import {downloadSound, getSound} from '../js/soundList.js'

export function createStemsContent(openStems, soundID) {
    const stemsListWaveSurfers = {}
    const singleStemsListWaveSurfers = {}
    const muteStemsListWaveSurfers = {}

    const stemsOverlay = document.createElement("div");
    stemsOverlay.id = "stemsOverlay";
    stemsOverlay.className = "fixed inset-0 bg-opacity-30 backdrop-blur-sm hidden z-50";

    const modal = document.createElement("div");
    modal.className = "fixed top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 z-50";

    const closeStems = document.createElement("button");
    closeStems.id = "closeStemsOverlay";
    closeStems.className = "absolute top-3 right-3";
    closeStems.textContent = "✕";

    const stemsOverlayContent = document.createElement("div");
    stemsOverlayContent.id = "stemsOverlayContent";

    modal.appendChild(closeStems);
    modal.appendChild(stemsOverlayContent);
    stemsOverlay.appendChild(modal);
    document.body.appendChild(stemsOverlay);

    if (openStems) {
        openStems.addEventListener('click', () => {

            stemsOverlay.classList.remove("hidden");

            fetch(`/database/soundStems/${soundID}`, {
                headers: {
                    'Accept': 'application/json'
                }
            }).then(res => {
                if (!res.ok) {
                    console.log(`HTTP error! Status: ${res.status}`);
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            }).then(stems => {
                if (stems.length > 0) {
                    stemsContent(stemsOverlayContent, stems, soundID, stemsListWaveSurfers, singleStemsListWaveSurfers, muteStemsListWaveSurfers)
                }
            })
        })
    }

    stemsOverlay.addEventListener("click", (e) => {
        if (e.target === stemsOverlay) {
            stemsOverlayContent.innerHTML = ""
            for (const key in stemsListWaveSurfers) {
                delete stemsListWaveSurfers[key];
            }
            for (const key in muteStemsListWaveSurfers) {
                delete muteStemsListWaveSurfers[key];
            }
            for (const key in singleStemsListWaveSurfers) {
                delete singleStemsListWaveSurfers[key];
            }
            stemsOverlay.classList.add("hidden");
        }
    });

    closeStems.addEventListener('click', () => {
        stemsOverlayContent.innerHTML = ""
        for (const key in stemsListWaveSurfers) {
            delete stemsListWaveSurfers[key];
        }
        for (const key in muteStemsListWaveSurfers) {
            delete muteStemsListWaveSurfers[key];
        }
        for (const key in singleStemsListWaveSurfers) {
            delete singleStemsListWaveSurfers[key];
        }
        stemsOverlay.classList.add("hidden");
    })
}

async function stemsContent(stemsOverlayContent, stems, soundID, stemsListWaveSurfers, singleStemsListWaveSurfers, muteStemsListWaveSurfers) {
    const sound = await getSound(soundID);

    let mainStemWaveReady = false;

    const mainStemItem = document.createElement('div');
    mainStemItem.className = "w-full flex justify-between mt-4 mb-4 p-2"

    const mainInfos = document.createElement('div')
    mainInfos.className = "content-center items-center justify-start m-2"
    mainInfos.innerHTML = `
                <div class="flex items-center justify-center">
                    <div class="w-12 h-12 bg-gray-700 rounded overflow-hidden">
                        <img id="stemSoundImage_${soundID}" src=""
                             class="w-full h-full object-cover" alt="">
                    </div>
                </div>

                <div class="flex items-center justify-center w-full">
                    <h5>Name: </h5>
                    <div id="stemSoundName_${soundID}"></div>
                </div>

                <div class="flex items-center justify-center w-full">
                    <h5>Artists: </h5>
                    <div id="stemSoundArtistNames_${soundID}"></div>
                </div>
                `;

    mainStemItem.appendChild(mainInfos)
    stemsOverlayContent.appendChild(mainStemItem)

    if (sound) {
        setSoundInfos(sound, `stemSoundImage_${soundID}`, `stemSoundName_${soundID}`, `stemSoundArtistNames_${soundID}`)
    }

    const mainStemWaveSurferDiv = document.createElement('div');
    mainStemWaveSurferDiv.className = "w-full content-center items-center justify-center relative"
    mainStemWaveSurferDiv.style.border = "1px solid #ddd";

    mainStemItem.appendChild(mainStemWaveSurferDiv)
    stemsOverlayContent.appendChild(mainStemItem)

    const mainStemWaveSurfer = WaveSurfer.create({
        container: mainStemWaveSurferDiv,
        waveColor: 'rgb(200, 0, 200)',
        progressColor: 'rgb(100, 0, 100)',
        url: '',
        height: 50,
    })
    mainStemWaveSurfer.setMuted(true);
    stemsListWaveSurfers[soundID] = mainStemWaveSurfer

    const src = `/stream/sound/${encodeURIComponent(soundID)}`;
    mainStemWaveSurfer.load(src)
    // mainStemWaveSurfer.className = "main_waveSurfer_" + soundID

    const mainStemPlayButton = document.createElement('button')
    mainStemPlayButton.textContent = "Play"
    mainStemPlayButton.className = "pointer border"

    const mainControllerDiv = document.createElement('div')
    mainControllerDiv.className = "flex flex-col items-center justify-center m-2"

    mainControllerDiv.appendChild(mainStemPlayButton)

    mainStemItem.appendChild(mainControllerDiv)
    stemsOverlayContent.appendChild(mainStemItem)

    mainStemWaveSurfer.on('decode', (duration) => {
        mainStemWaveReady = false
    })

    mainStemWaveSurfer.once('ready', () => {
        mainStemWaveReady = true
        mainStemPlayButton.onclick = () => {
            const mainStemItem = stemsListWaveSurfers[soundID];
            mainStemItem.playPause()

            const hasSingleSelected = Object.keys(singleStemsListWaveSurfers).length > 0;

            for (const key in stemsListWaveSurfers) {
                const stemItem = stemsListWaveSurfers[key];

                if (stemItem === mainStemItem) continue;

                stemItem.setMuted(true)

                if (hasSingleSelected) {
                    if (singleStemsListWaveSurfers[key]) {
                        stemItem.setMuted(false);
                    }
                } else {
                    if (!muteStemsListWaveSurfers[key]) {
                        stemItem.setMuted(false);
                    }
                }

                stemItem.playPause();
            }
        }
    })

    mainStemWaveSurferDiv.addEventListener('click', (e) => {
        const bbox = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - bbox.left;
        const percent = x / bbox.width;

        const duration = mainStemWaveSurfer.getDuration();
        if (duration && !isNaN(percent)) {
            for (const key in stemsListWaveSurfers) {
                if (stemsListWaveSurfers[soundID] !== stemsListWaveSurfers[key]) {
                    stemsListWaveSurfers[key].seekTo(percent);
                }
            }
        }
    });

    stems.forEach(stem => {
        let listStemWaveReady = false;

        const listItem = document.createElement('div');
        listItem.className = "w-full flex justify-between mt-4 mb-4 p-2"

        const infos = document.createElement('div')
        infos.className = "content-center items-center justify-start m-2"
        infos.innerHTML = `
                <p>${stem.name}</p>
            `;
        listItem.appendChild(infos)
        stemsOverlayContent.appendChild(listItem)

        const waveSurferDiv = document.createElement('div');
        waveSurferDiv.id = 'div_' + stem.stemID
        waveSurferDiv.className = "w-full content-center items-center justify-center relative"
        waveSurferDiv.style.border = "1px solid #ddd";

        listItem.appendChild(waveSurferDiv)
        stemsOverlayContent.appendChild(listItem)

        const stemWaveSurfer = WaveSurfer.create({
            container: waveSurferDiv,
            waveColor: 'rgb(200, 0, 200)',
            progressColor: 'rgb(100, 0, 100)',
            url: '',
            height: 50,
        })
        stemsListWaveSurfers[stem.stemID] = stemWaveSurfer

        stemWaveSurfer.on('decode', (duration) => {
            listStemWaveReady = false
        })
        stemWaveSurfer.once('ready', () => {
            listStemWaveReady = true
        })

        waveSurferDiv.addEventListener('click', (e) => {
            const bbox = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - bbox.left;
            const percent = x / bbox.width;

            const duration = mainStemWaveSurfer.getDuration();
            if (duration && !isNaN(percent)) {
                for (const key in stemsListWaveSurfers) {
                    if (stemsListWaveSurfers[stem.stemID] !== stemsListWaveSurfers[key]) {
                        stemsListWaveSurfers[key].seekTo(percent);
                    }
                }
            }
        });

        const src = `/stream/sound/${encodeURIComponent(soundID)}?stems=true&stemPath=${stem.stemPath}`;
        stemWaveSurfer.load(src)
        stemWaveSurfer.className = "stem_waveSurfer_" + soundID

        const downloadButton = document.createElement('button')
        downloadButton.textContent = "D"
        downloadButton.className = "pointer border"
        downloadButton.onclick = function () {
            downloadSound(soundID, true, stem.stemPath);
        };

        const singleCheckbox = document.createElement('input');
        singleCheckbox.type = 'checkbox';
        singleCheckbox.className = 'pointer';
        const singleLabel = document.createElement('label');
        singleLabel.textContent = 'S';
        singleLabel.appendChild(singleCheckbox);
        singleCheckbox.addEventListener('change', function () {
            if (singleCheckbox.checked) {
                muteCheckbox.checked = false

                singleStemsListWaveSurfers[stem.stemID] = stemWaveSurfer
                singleStemsListWaveSurfers[stem.stemID].setMuted(false);
            } else {
                delete singleStemsListWaveSurfers[stem.stemID]

                if (muteStemsListWaveSurfers[stem.stemID]) {
                    muteStemsListWaveSurfers[stem.stemID].setMuted(true);
                }
            }
        });

        const muteCheckbox = document.createElement('input');
        muteCheckbox.type = 'checkbox';
        muteCheckbox.className = 'pointer';
        const muteLabel = document.createElement('label');
        muteLabel.textContent = 'M';
        muteLabel.appendChild(muteCheckbox);
        muteCheckbox.addEventListener('change', function () {
            if (muteCheckbox.checked) {
                singleCheckbox.checked = false

                muteStemsListWaveSurfers[stem.stemID] = stemWaveSurfer
                muteStemsListWaveSurfers[stem.stemID].setMuted(true);
            } else {
                delete muteStemsListWaveSurfers[stem.stemID]

                if (singleStemsListWaveSurfers[stem.stemID]) {
                    singleStemsListWaveSurfers[stem.stemID].setMuted(false);
                }
            }
        });

        const controllerDiv = document.createElement('div')
        controllerDiv.className = "flex flex-col items-center justify-center m-2"
        controllerDiv.appendChild(downloadButton)
        controllerDiv.appendChild(muteLabel)
        controllerDiv.appendChild(singleLabel)

        listItem.appendChild(controllerDiv)
        stemsOverlayContent.appendChild(listItem)
    })
}
