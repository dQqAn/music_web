import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.esm.js'
import {clearAllSelections, filterMenu, renderMenu} from "../menu/menu.js";

const imageInput = document.getElementById("imageInput");
const soundInput = document.getElementById("soundInput");
const stemInput = document.getElementById("stemInput");

soundInput.addEventListener("change", function () {
    const fileName = this.files.length > 0 ? this.files[0].name : "No file chosen";
    document.getElementById("selectedSoundName").textContent = fileName;
});

imageInput.addEventListener("change", function () {
    const fileName = this.files.length > 0 ? this.files[0].name : "No file chosen";
    document.getElementById("selectedImageName").textContent = fileName;
});

stemInput.addEventListener("change", function () {
    const fileName = this.files.length > 0 ? this.files[0].name : "No file chosen";
    document.getElementById("selectedStemName").textContent = fileName;
});

document.getElementById("uploadForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const soundName = document.getElementById("soundName");

    const fileInfo = document.getElementById("fileInfo")
    const errorMessage = document.getElementById("errorMessage")
    const errorInfo = document.getElementById("errorInfo")

    if (!imageInput.files.length || !soundInput.files.length) {
        errorMessage.textContent = "Wrong files";
        errorInfo.style.display = "block";
        return;
    }

    const formData = new FormData();
    formData.append("image", imageInput.files[0]);
    formData.append("sound", soundInput.files[0]);
    formData.append("name", soundName.value);
    formData.append("category", JSON.stringify([...categorySelectedItems]));
    formData.append("loops", JSON.stringify(loops))

    stemEntries.forEach(entry => {
        formData.append("stemNames[]", entry.name);
        formData.append("stemFiles[]", entry.files[0]);
    });

    fileInfo.style.display = "none";
    errorInfo.style.display = "none";

    try {
        const response = await fetch("/artist/upload_sound", {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        if (response.status === 200) {
            document.getElementById("fileStatus").textContent = data.fileStatus;
            fileInfo.style.display = "block";
        } else {
            errorMessage.textContent = data.message;
            errorInfo.style.display = "block";
        }
    } catch (error) {
        errorMessage.textContent = `Error: ${error}`;
        errorInfo.style.display = "block";
    }
});

//Category
let categoryMenuData = [];
let categorySelectedItems = new Set();
let categoryNavigationStack = [];
let categoryCurrentItems = [];
let categoryRootItems = [];

let loops = []
let loopsCounter = 0

const waveSurfer = WaveSurfer.create({
    container: '#artistSingleSoundBox',
    waveColor: 'rgb(200, 0, 200)',
    progressColor: 'rgb(100, 0, 100)',
    url: '',
    height: 75,
})

/** @type {{ name: string, files: File[] }[]} */
let stemEntries = [];
const stemNameInput = document.getElementById("stemName");
const stemFileInput = document.getElementById("stemInput");
const selectedStemsDiv = document.getElementById("selectedStems");
const addStemButton = document.getElementById("addStem");

document.addEventListener('DOMContentLoaded', async () => {
    const startingTime = document.getElementById('startingTime')
    const endingTime = document.getElementById('endingTime')
    const artistSelectedLoopsDiv = document.getElementById('artistSelectedLoopsDiv')
    const artistLoopList = document.getElementById('artistLoopList')
    const soundBox = document.getElementById('artistSingleSoundBox')
    const addLoop = document.getElementById('addLoop')

    addStemButton.addEventListener("click", () => {
        const name = stemNameInput.value.trim();
        const files = [...stemFileInput.files];

        if (!name || files.length === 0) {
            alert("Stem or file is missing");
            return;
        }

        stemEntries.push({name, files});
        stemNameInput.value = "";
        stemFileInput.value = "";
        renderStems();
    });

    const soundInput = document.getElementById("soundInput");
    soundInput.addEventListener('change', (event) => {
        const file = event.target.files[0]
        if (file) {
            const fileName = file.name.toLowerCase()
            const isValid = fileName.endsWith('.mp3') || fileName.endsWith('.wav')
            if (isValid) {
                soundBox.style.display = "block"
                waveSurfer.loadBlob(file)
            }
        } else {
            soundBox.style.display = "none"
            waveSurfer.stop()
            waveSurfer.empty()
        }
    })

    addLoop.addEventListener('click', () => {
        loopsCounter++
        const startTime = parseFloat(startingTime.value)
        const endTime = parseFloat(endingTime.value)
        if (isNaN(startTime) || isNaN(endTime) || startTime < 0 || endTime < 1 || (endTime - startTime) < 1) return

        const loopId = 'loop_' + loopsCounter
        const loopItem = document.createElement('div')
        loopItem.className = 'flex justify-center items-center gap-2 border p-2 rounded';
        loopItem.id = loopId

        const loopText = document.createElement('p')
        loopText.textContent = `${startTime} - ${endTime}`

        const loopRemoveButton = document.createElement('button')
        loopRemoveButton.textContent = 'X'
        loopRemoveButton.className = 'px-2 py-0.5 rounded text-xs border'

        loopRemoveButton.addEventListener('click', () => {
            loops = loops.filter(item => item.id !== loopId)
            loopItem.remove()

            if (loops.length < 1) {
                artistSelectedLoopsDiv.style.display = "none";
            }
        })

        loopItem.appendChild(loopText)
        loopItem.appendChild(loopRemoveButton)
        artistLoopList.appendChild(loopItem)

        loops.push({
            id: loopId,
            start: startTime,
            end: endTime
        })

        if (loops.length > 0) {
            artistSelectedLoopsDiv.style.display = "block"
        }

        startingTime.value = 0
        endingTime.value = 0
    })

    fetch('/allMetaData')
        .then(response => {
            if (!response.ok) {
                throw new Error('Menu loading error');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('categorySearchInput').addEventListener('input', (event) => {
                filterMenu('categorySearchInput', 'categoryMenuContainer')
            });
            document.getElementById('categoryClearSelection').addEventListener('click', (event) => {
                clearAllSelections('selectedItemsContainer', categorySelectedItems, true)
            });
            const categoryDataName = 'categories'
            categoryMenuData = data[categoryDataName];
            categoryRootItems = data[categoryDataName];
            renderMenu('categoryBackButton', categoryRootItems, categoryMenuData, 'categoryMenuContainer', categorySelectedItems, categoryNavigationStack,
                categoryCurrentItems, 'category', categoryDataName, 'selectedItemsContainer', 'categoryBackButtonContainer');
        })
})

function renderStems() {
    selectedStemsDiv.innerHTML = "";

    stemEntries.forEach((entry, index) => {
        const div = document.createElement("div");
        div.className = "border p-2 flex justify-between items-center";

        const info = document.createElement("span");
        info.textContent = `${entry.name}: ${entry.files[0].name}`;

        const remove = document.createElement("button");
        remove.textContent = "❌";
        remove.className = "text-red-500";
        remove.onclick = () => {
            stemEntries.splice(index, 1);
            renderStems();
        };

        div.appendChild(info);
        div.appendChild(remove);
        selectedStemsDiv.appendChild(div);
    });
}

/*function updateIcons(soundID, isPlaying) {
    const icon = document.querySelector('.icon_' + soundID);
    icon.setAttribute('data-lucide', isPlaying ? 'pause' : 'play');
    lucide.createIcons();
}*/
