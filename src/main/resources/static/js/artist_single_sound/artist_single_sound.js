import {clearAllSelections, filterMenu, renderMenu} from "../menu/menu.js";

document.getElementById("uploadForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const imageInput = document.getElementById("imageInput");
    const soundInput = document.getElementById("soundInput");
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
    // formData.append("mood", JSON.stringify([...moodsSelectedTags]));
    // formData.append("instrument", JSON.stringify([...instrumentsSelectedTags]));

    fileInfo.style.display = "none";
    errorInfo.style.display = "none";

    try {
        const response = await fetch("/artist/upload_sound", {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        if (response.status === 200) {
            document.getElementById("fileName").textContent = data.fileName;
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

//Instruments
let instrumentsMenuData = [];
let instrumentsRootItems = [];

document.addEventListener('DOMContentLoaded', async () => {
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

            // instrumentsMenuData = data.instruments;
            // instrumentsRootItems = data.instruments;
        })
})

/*function updateIcons(soundID, isPlaying) {
    const icon = document.querySelector('.icon_' + soundID);
    icon.setAttribute('data-lucide', isPlaying ? 'pause' : 'play');
    lucide.createIcons();
}*/
