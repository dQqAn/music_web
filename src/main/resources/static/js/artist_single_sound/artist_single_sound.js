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
    formData.append("category", JSON.stringify([...categorySelectedTags]));
    formData.append("mood", JSON.stringify([...moodsSelectedTags]));
    formData.append("instrument", JSON.stringify([...instrumentsSelectedTags]));

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
const categorySelectedTags = new Set();

//Moods
let moodsMenuData = [];
const moodsSelectedTags = new Set();

//Instruments
let instrumentsMenuData = [];
const instrumentsSelectedTags = new Set();

document.addEventListener('DOMContentLoaded', async () => {
    fetch('/allMetaData')
        .then(response => {
            if (!response.ok) {
                throw new Error('Menu loading error');
            }
            return response.json();
        })
        .then(data => {
            categoryMenuData = data.categories;

            moodsMenuData = data.moods;

            instrumentsMenuData = data.instruments;

            rootItems = data.categories;
            renderMenu(categoryMenuData);
            document.getElementById('searchInput').addEventListener('input', filterMenu);
            document.getElementById('clearSelection').addEventListener('click', clearAllSelections);
            document.getElementById('backButton').addEventListener('click', async () => {
                if (navigationStack.length > 0) {
                    const previous = navigationStack.pop();
                    if (previous && previous.tag && previous.length > 0) {
                        const metaDataName = 'category';
                        const response = await fetch(`/database/getMetaDataSubCategory/${previous.tag}/${metaDataName}`, {
                            headers: {'Accept': 'application/json'}
                        });
                        const data = await response.json();
                        currentItems = data.categories;
                    } else {
                        currentItems = rootItems;
                    }

                    renderMenu(currentItems);

                    if (navigationStack.length === 0) {
                        showBackButton(false);
                    }
                } else {
                    currentItems = rootItems;
                    renderMenu(currentItems);
                    showBackButton(false);
                }
            });
        })
        .catch(error => {
            console.error('Menu Json error:', error);
        });
});

let selectedItems = new Set();
let navigationStack = [];
let currentItems = [];
let rootItems = [];

function renderMenu(items) {
    const menuContainer = document.getElementById('menuContainer');
    menuContainer.innerHTML = '';

    items.forEach(item => {
        const menuItem = createMenuItem(item);
        menuContainer.appendChild(menuItem);
    });
}

function createMenuItem(item) {
    const container = document.createElement('div');
    container.className = `flex items-center space-x-2 py-1 relative group`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'form-checkbox';
    checkbox.dataset.tag = item.tag;

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            selectedItems.add(item.tag);
        } else {
            selectedItems.delete(item.tag);
        }
        updateSelectedItems();
    });

    const label = document.createElement('span');
    label.textContent = item.name;

    container.appendChild(checkbox);
    container.appendChild(label);

    container.addEventListener('click', async (e) => {
        if (e.target !== checkbox) {
            const hasSub = await checkIfHasSubCategory(item.tag);
            if (hasSub) {
                navigationStack.push({
                    tag: item.tag,
                    parentName: item.name
                });
                const subCategories = await fetchSubCategories(item.tag);
                currentItems = subCategories.categories;
                renderMenu(currentItems);
                showBackButton(true);
            }
        }
    });

    return container;
}

async function checkIfHasSubCategory(tag) {
    const response = await fetch('/database/checkMetaDataSubCategory', {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `key=${encodeURIComponent(tag)}`
    });
    const result = await response.json();
    return result === true;
}

async function fetchSubCategories(tag) {
    const metaDataName = 'category';
    const response = await fetch(`/database/getMetaDataSubCategory/${tag}/${metaDataName}`, {
        headers: {'Accept': 'application/json'}
    });
    const data = await response.json();
    return data;
}

function updateSelectedItems() {
    const selectedContainer = document.getElementById('selectedItems');
    selectedContainer.innerHTML = '';

    selectedItems.forEach(tag => {
        const item = document.createElement('div');
        item.className = 'flex items-center bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm space-x-1';

        const tagName = document.createElement('span');
        tagName.textContent = tag;

        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '×';
        removeBtn.className = 'text-red-600 font-bold';
        removeBtn.addEventListener('click', () => {
            selectedItems.delete(tag);
            uncheckCheckbox(tag);
            updateSelectedItems();
        });

        item.appendChild(tagName);
        item.appendChild(removeBtn);
        selectedContainer.appendChild(item);
    });
}

function uncheckCheckbox(tag) {
    const checkbox = document.querySelector(`input[type="checkbox"][data-tag="${tag}"]`);
    if (checkbox) {
        checkbox.checked = false;
    }
}

function clearAllSelections() {
    selectedItems.clear();
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    updateSelectedItems();
}

function filterMenu() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const menuContainer = document.getElementById('menuContainer');
    const items = menuContainer.querySelectorAll('div > span');

    items.forEach(span => {
        const parent = span.parentElement;
        if (span.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
            parent.classList.remove('hidden');
        } else {
            parent.classList.add('hidden');
        }
    });
}

function showBackButton(show) {
    const backButtonContainer = document.getElementById('backButtonContainer');
    backButtonContainer.classList.toggle('hidden', !show);
}

/*function updateIcons(soundID, isPlaying) {
    const icon = document.querySelector('.icon_' + soundID);
    icon.setAttribute('data-lucide', isPlaying ? 'pause' : 'play');
    lucide.createIcons();
}*/
