import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'
import HoverPlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/hover.esm.js'
import RegionsPlugin from 'https://unpkg.com/wavesurfer.js@7/dist/plugins/regions.esm.js'
import {formatTime, mainWaveSurfer} from '../js/audio_player/audio_player.js';
import {toSlug} from '../js/header.js'
import {createFavDiv} from '../js/favourite.js'
import {createStemsContent} from '../js/stems.js'

export const soundListWaveSurfers = {}

//region Playlist IDs
//region Original IDs
const SOUND_IDS_KEY = 'soundIDs';

export function getStoredSoundIDs() {
    const data = localStorage.getItem(SOUND_IDS_KEY);
    return data ? JSON.parse(data) : [];
}

function addSoundID(id) {
    const ids = getStoredSoundIDs();
    if (!ids.includes(id)) {
        ids.push(id);
        localStorage.setItem(SOUND_IDS_KEY, JSON.stringify(ids));
    }
}

export function removeSoundID(id) {
    let ids = getStoredSoundIDs();
    ids = ids.filter(storedId => storedId !== id);
    localStorage.setItem(SOUND_IDS_KEY, JSON.stringify(ids));
}

function clearAllSoundIDs() {
    localStorage.removeItem(SOUND_IDS_KEY);
}

export function isSoundIDStored(id) {
    const ids = getStoredSoundIDs();
    return ids.includes(id);
}

//endregion
//region Temp IDs
const TEMP_SOUND_IDS_KEY = 'tempSoundIDs';

export function getTempStoredSoundIDs() {
    const data = localStorage.getItem(TEMP_SOUND_IDS_KEY);
    return data ? JSON.parse(data) : [];
}

function addTempSoundID(id) {
    const ids = getTempStoredSoundIDs();
    if (!ids.includes(id)) {
        ids.push(id);
        localStorage.setItem(TEMP_SOUND_IDS_KEY, JSON.stringify(ids));
    }
}

function removeTempSoundID(id) {
    let ids = getTempStoredSoundIDs();
    ids = ids.filter(storedId => storedId !== id);
    localStorage.setItem(TEMP_SOUND_IDS_KEY, JSON.stringify(ids));
}

function clearTempAllSoundIDs() {
    localStorage.removeItem(TEMP_SOUND_IDS_KEY);
}

export function isTempSoundIDStored(id) {
    const ids = getTempStoredSoundIDs();
    return ids.includes(id);
}

//endregion
export function replaceSoundIDsWith(soundID) {
    const tempIDs = getTempStoredSoundIDs();
    const index = tempIDs.indexOf(soundID);

    if (index === -1) {
        console.warn(`Sound ID "${soundID}" not found in temp list.`);
        return;
    }

    const sliced = tempIDs.slice(index);
    localStorage.setItem(SOUND_IDS_KEY, JSON.stringify(sliced));
}

//endregion

export async function soundList(containerID, sounds) {
    const container = document.getElementById(containerID)
    if (!container) return;

    container.innerHTML = '';
    clearTempAllSoundIDs()

    for (const item of sounds) {
        addTempSoundID(item.soundID)

        const regions = RegionsPlugin.create()

        const listItem = document.createElement('div');
        listItem.className = "w-full flex justify-between mt-4 mb-4 p-2 h-15"

        const infos = document.createElement('div')
        infos.className = "items-center justify-start m-2 w-30"
        infos.innerHTML = `
                <a href="/sound/?${toSlug(item.name)}&soundID=${item.soundID}">
                    <h5>${item.name}</h5>      
                </a>
                ${item.artistInfos.map(artist => `
                    <h1>
                      <a class="text-neutral-600 dark:text-fuchsia-300" href="/artistProfile/${artist.id}">${artist.name}</a>
                    </h1>
                `).join("")}
            `;

        const durationInfos = document.createElement('div');
        durationInfos.className = "items-center w-20"
        durationInfos.innerHTML = `
                    <p id="time_${item.soundID}">0:00</p>
                    <p id="duration_${item.soundID}">0:00</p>
                `;

        const playButton = document.createElement('button')
        playButton.className = "pointer items-center w-8 h-8"
        playButton.innerHTML = `<i data-lucide='play' class="${'icon_' + item.soundID} w-6 h-6"></i>`;

        const leftDiv = document.createElement('div');
        leftDiv.className = "flex w-50 items-center m-4 justify-between"

        const img = document.createElement('img')
        img.className = "w-12 h-12"
        img.src = item.image1Path

        const centerDiv = document.createElement('div');
        centerDiv.className = "flex max-w-150 justify-center items-center space-x-6"

        leftDiv.appendChild(img);
        leftDiv.appendChild(playButton);
        leftDiv.appendChild(infos);
        centerDiv.appendChild(createCategoryElement(item));
        listItem.appendChild(leftDiv)
        listItem.appendChild(centerDiv)
        container.appendChild(listItem)

        const waveSurferDiv = document.createElement('div');
        waveSurferDiv.id = 'div_' + item.soundID
        waveSurferDiv.className = "w-full items-center relative max-w-150"

        /*const soundListHoverDiv = document.createElement('div');
        soundListHoverDiv.innerHTML = `
                <div id="listSoundHover_${item.soundID}" style="position: absolute; left: 0; top: 0; z-index: 1010;
                    pointer-events: none; height: 100%; width: 0; mix-blend-mode: overlay; opacity: 0;
                    background: rgba(255, 255, 255, 0.5); transition: opacity 0.2s ease;">
                </div>
                `;
        listItem.appendChild(soundListHoverDiv);
        container.appendChild(listItem)
        const hoverID = "listSoundHover_" + item.soundID
        const soundListHover = document.getElementById(hoverID);
        waveSurferDiv.addEventListener('mouseenter', () => {
            soundListHover.style.opacity = '1';
        });
        waveSurferDiv.addEventListener('mouseleave', () => {
            soundListHover.style.opacity = '0';
        });
        waveSurferDiv.addEventListener('pointermove', (e) => (soundListHover.style.width = `${e.offsetX}px`))*/

        const listWaveSurfer = WaveSurfer.create({
            container: waveSurferDiv,
            waveColor: 'rgb(200, 0, 200)',
            progressColor: 'rgb(100, 0, 100)',
            url: '',
            height: 75,
            // dragToSeek: true, // minPxPerSec: 100,
            plugins: [
                HoverPlugin.create({
                    lineColor: '#ff0000',
                    lineWidth: 2,
                    labelBackground: '#555',
                    labelColor: '#fff',
                    labelSize: '11px',
                }),
                regions
            ],
        })

        soundListWaveSurfers[item.soundID] = listWaveSurfer

        const downloadButton = document.createElement('button')
        downloadButton.innerHTML = `<i data-lucide='arrow-down-to-line' class="${'icon_' + item.soundID} w-6 h-6"></i>`;
        downloadButton.onclick = () => {
            downloadSound(item.soundID)
        }

        const favDiv = document.createElement('div')
        favDiv.id = 'fav-btn-' + item.soundID

        const rightDiv = document.createElement('div');
        rightDiv.className = "flex w-150 items-center justify-end m-2 space-x-2"

        const stemsButton = document.createElement('button')
        stemsButton.className = "pointer items-center w-8 h-8"
        stemsButton.innerHTML = `<i data-lucide='audio-lines' class="${'icon_' + item.soundID} w-6 h-6"></i>`;

        const bpmText = document.createElement('p')
        bpmText.textContent = 'BPM: ' + item.bpm

        rightDiv.appendChild(bpmText);
        rightDiv.appendChild(stemsButton);
        rightDiv.appendChild(durationInfos);
        rightDiv.appendChild(waveSurferDiv);
        rightDiv.appendChild(downloadButton);
        rightDiv.appendChild(favDiv);
        rightDiv.appendChild(createListMenu(item));
        listItem.appendChild(rightDiv);
        container.appendChild(listItem);

        const timeID = 'time_' + item.soundID
        const durationID = 'duration_' + item.soundID
        const timeEl = document.getElementById(timeID)
        const durationEl = document.getElementById(durationID)
        listWaveSurfer.on('decode', (duration) => (durationEl.textContent = formatTime(duration)))
        listWaveSurfer.on('timeupdate', (currentTime) => (timeEl.textContent = formatTime(currentTime)))

        const src = `/stream/sound/${encodeURIComponent(item.soundID)}`;
        listWaveSurfer.load(src)
        listWaveSurfer.className = "waveSurfer_" + item.soundID

        listWaveSurfer.once('ready', () => {
            playButton.onclick = () => {
                const icon = document.querySelector('.icon_' + item.soundID);
                if (icon.getAttribute('data-lucide') === 'play') {

                    replaceSoundIDsWith(item.soundID)

                    const icons = document.querySelectorAll('[data-lucide]');
                    icons.forEach(otherIcon => {
                        if (otherIcon.getAttribute('data-lucide') === 'pause') {
                            otherIcon.setAttribute('data-lucide', 'play');
                        }
                    });

                    mainWaveSurfer.load(src)
                    mainWaveSurfer.className = "main_waveSurfer_" + item.soundID

                    // const currentTime = listWaveSurfer.getCurrentTime();
                    // mainWaveSurfer.seekTo(currentTime / listWaveSurfer.getDuration());

                    const listIcon = document.querySelector('.icon_' + item.soundID);
                    listIcon.setAttribute('data-lucide', 'pause');

                    mainWaveSurfer.once('ready', () => {
                        const rateInput = document.getElementById('mainRateInput');
                        if (rateInput) {
                            mainWaveSurfer.setPlaybackRate(rateInput.valueAsNumber);
                        }
                        mainWaveSurfer.play()
                    })
                } else {
                    mainWaveSurfer.pause()
                    const listIcon = document.querySelector('.icon_' + item.soundID);
                    listIcon.setAttribute('data-lucide', 'play');
                }
                lucide.createIcons();
            }
        })

        waveSurferDiv.addEventListener('click', (e) => {
            const soundID = mainWaveSurfer.className.split("_").pop();
            const className = 'waveSurfer_' + soundID
            if (listWaveSurfer.className === className) {
                const bbox = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - bbox.left;
                const percent = x / bbox.width;

                const duration = mainWaveSurfer.getDuration();
                if (duration && !isNaN(percent)) {
                    mainWaveSurfer.seekTo(percent);
                }
            }
        });

        createStemsContent(stemsButton, item.soundID)

        await createFavDiv(favDiv.id, item.soundID, false)

        /*listWaveSurfer.on('ready', () => {
            let isDragging = false;
            waveSurferDiv.addEventListener('mousedown', (e) => {
                if (listWaveSurfer.className === mainWaveSurfer.className) {
                    isDragging = true;
                    seek(e, mainWaveSurfer, listWaveSurfer, waveSurferDiv);
                }

            });
            window.addEventListener('mouseup', () => {
                if (listWaveSurfer.className === mainWaveSurfer.className) {
                    isDragging = false;
                }

            });
            waveSurferDiv.addEventListener('mousemove', (e) => {
                if (isDragging && listWaveSurfer.className === mainWaveSurfer.className) {
                    seek(e, mainWaveSurfer, listWaveSurfer, waveSurferDiv);
                }
            });
        })*/
    }

    /*const paginationDiv = document.createElement('div')
    paginationDiv.id = "pagination"
    paginationDiv.className = "pointer pagination"
    container.appendChild(paginationDiv)*/
}

/*function seek(e, mainWave, listItemWave, listItemContainer) {
    const rect = listItemContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));

    listItemWave.seekTo(percent);
    mainWave.seekTo(percent);
}*/

export async function downloadSound(soundID, stems = false, stemPath = "", stretchedSound = false, duration = 0) {
    const url = `/download/sound/${encodeURIComponent(soundID)}?stems=${stems}&stemPath=${stemPath}&stretchedSound=${stretchedSound}&duration=${duration}`;

    const response = await fetch(url);
    if (!response.ok) {
        console.error("Download failed");
        return;
    }

    let filename = `${soundID}.wav`;
    const disposition = response.headers.get("Content-Disposition");
    if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) {
            filename = match[1];
        }
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
}

export async function getSound(soundID) {
    const response = await fetch(`/database/sound/${soundID}`, {
        headers: {
            'Accept': 'application/json'
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.sound;
}

function createCategoryElement(item) {
    const categories = document.createElement('div');
    categories.className = "relative flex items-center space-x-2 w-max";

    const visibleCategories = item.categories.slice(0, 3);
    const hiddenCategories = item.categories.slice(3);

    const categoryGroup = document.createElement('div');
    categoryGroup.className = "flex space-x-2";

    visibleCategories.forEach(cat => {
        const p = document.createElement('p');
        p.className = "hover:underline dark:hover:text-white hover:text-fuchsia-500";
        p.innerHTML = `<a href="/category/${encodeURIComponent(cat)}">${cat}</a>`;
        categoryGroup.appendChild(p);
    });

    categories.appendChild(categoryGroup);

    if (hiddenCategories.length > 0) {
        const moreBtn = document.createElement('button');
        moreBtn.id = "moreBtn";
        moreBtn.innerText = "▼";
        moreBtn.className = "text-neutral-950 text-sm cursor-pointer";

        const popup = document.createElement('div');
        popup.id = "popup";
        popup.className = "absolute left-0 top-full mt-1 bg-fuchsia-100 dark:bg-neutral-950 border rounded p-2 hidden z-10";

        hiddenCategories.forEach(cat => {
            const p = document.createElement('p');
            p.className = "hover:underline dark:hover:text-white hover:text-fuchsia-500";
            p.innerHTML = `<a href="/category/${encodeURIComponent(cat)}">${cat}</a>`;
            popup.appendChild(p);
        });

        moreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            popup.classList.toggle('hidden');
        });

        document.addEventListener('click', () => {
            popup.classList.add('hidden');
        });

        const wrapper = document.createElement('div');
        wrapper.className = "relative";
        wrapper.appendChild(moreBtn);
        wrapper.appendChild(popup);

        categories.appendChild(wrapper);
    }

    return categories;
}

export function createListMenu(sound) {
    const wrapper = document.createElement("div");
    wrapper.className = "relative inline-block";

    const button = document.createElement("button");
    button.innerHTML = `<i data-lucide='ellipsis-vertical' class="w-6 h-6"></i>`
    wrapper.appendChild(button);

    const popup = document.createElement("div");
    popup.id = `popup_${sound.soundID}`;
    popup.className = `
        fixed z-50 hidden
        w-64 max-w-full box-border
        bg-fuchsia-100 dark:bg-neutral-950
        text-neutral-950 dark:text-fuchsia-500
        border rounded p-3
        max-h-[90vh] overflow-auto
    `;

    const input = document.createElement("input");
    input.type = "number";
    input.placeholder = "(max: 600, min: 10)";
    input.className = "border rounded px-3 py-1 w-full";

    const text = document.createElement('h1')
    text.textContent = "Duration"
    text.className = "text-center";

    const stretchOutput = document.createElement('div')
    stretchOutput.textContent = "Processing... (Don't close)"
    stretchOutput.id = "stretchOutput_" + sound.soundID
    stretchOutput.className = "hidden"

    const submitButton = document.createElement('button')
    submitButton.textContent = 'Submit'
    submitButton.className = `
            rounded-lg border-b mt-2
            border-b-neutral-950 dark:border-b-fuchsia-500
            hover:border-transparent dark:hover:text-fuchsia-50
            mx-auto block          
        `;

    const content = document.createElement('div');
    content.className = "flex flex-col items-center gap-3";

    content.appendChild(text);
    content.appendChild(input);
    content.appendChild(stretchOutput);
    content.appendChild(submitButton);

    popup.appendChild(content);

    document.body.appendChild(popup);

    input.addEventListener('input', (event) => {
        stretchOutput.classList.add("hidden")
    })

    submitButton.addEventListener('click', async (e) => {
        e.stopPropagation();

        stretchOutput.classList.remove("hidden")

        const duration = parseInt(input.value, 10)
        if (isNaN(duration)) return;
        await downloadSound(sound.soundID, false, "", true, duration)
    })

    popup.addEventListener("click", (e) => e.stopPropagation());

    button.addEventListener("click", (e) => {
        e.stopPropagation();
        if (popup.classList.contains("hidden")) {
            positionPopup();
            popup.classList.remove("hidden");
        } else {
            popup.classList.add("hidden");
        }
    });

    document.addEventListener("click", (e) => {
        if (popup.contains(e.target) || button.contains(e.target)) return;
        popup.classList.add("hidden");
    });

    function positionPopup() {
        const btnRect = button.getBoundingClientRect();
        const popWidth = popup.offsetWidth || 256;
        const popHeight = popup.offsetHeight || 150;

        const margin = 8;
        const maxLeft = window.innerWidth - popWidth - margin;
        let desiredLeft = btnRect.left + btnRect.width / 2 - popWidth / 2;
        desiredLeft = Math.max(margin, Math.min(desiredLeft, maxLeft));

        let desiredTop;
        const spaceBelow = window.innerHeight - btnRect.bottom;
        const spaceAbove = btnRect.top;

        if (spaceBelow >= popHeight + margin) {
            desiredTop = btnRect.bottom + margin;
        } else if (spaceAbove >= popHeight + margin) {
            desiredTop = btnRect.top - popHeight - margin;
        } else {
            desiredTop = window.innerHeight / 2 - popHeight / 2;
        }

        popup.style.left = `${desiredLeft}px`;
        popup.style.top = `${desiredTop}px`;
    }

    return wrapper;
}



