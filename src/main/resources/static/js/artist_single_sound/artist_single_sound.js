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
                clearAllSelections('selectedItemsContainer', categorySelectedItems)
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

function handleClearButton(clearButtonName, navigationStack, metaDataName, currentItems, rootItems, dataName, backButtonID, menuContainerID, selectedItems, selectedItemsContainer) {
    const btn = document.getElementById(clearButtonName)
    if (!btn) return

    btn.addEventListener("click", (event) => {
        setupClearButton(clearButtonName, event, navigationStack, metaDataName, currentItems, rootItems, dataName, backButtonID, menuContainerID, selectedItems, selectedItemsContainer);
    });
}

async function setupClearButton(clearButtonName, event, navigationStack, metaDataName, currentItems, rootItems, dataName, backButtonID, menuContainerID, selectedItems, selectedItemsContainer) {
    if (navigationStack.length > 0) {
        const previous = navigationStack.pop();
        if (previous && previous.tag && previous.length > 0) {
            const response = await fetch(`/database/getMetaDataSubCategory/${previous.tag}/${metaDataName}`, {
                headers: {'Accept': 'application/json'}
            });
            const data = await response.json();
            currentItems = data[dataName];
        } else {
            currentItems = rootItems;
        }

        renderMenu(clearButtonName, rootItems, currentItems, menuContainerID, selectedItems, navigationStack, currentItems, metaDataName, dataName, selectedItemsContainer, backButtonID);

        if (navigationStack.length === 0) {
            showBackButton(false, backButtonID);
        }
    } else {
        currentItems = rootItems;
        renderMenu(clearButtonName, rootItems, currentItems, menuContainerID, selectedItems, navigationStack, currentItems, metaDataName, dataName, selectedItemsContainer, backButtonID);
        showBackButton(false, backButtonID);
    }
}

function renderMenu(clearButtonName, rootItems, items, menuContainerID, selectedItems, navigationStack, currentItems, metaDataName, dataName, selectedItemsContainer, backButtonID) {
    const menuContainer = document.getElementById(menuContainerID);
    menuContainer.innerHTML = '';

    items.forEach(item => {
        const menuItem = createMenuItem(clearButtonName, rootItems, item, selectedItems, navigationStack, currentItems, metaDataName, dataName, selectedItemsContainer, backButtonID, menuContainerID);
        menuContainer.appendChild(menuItem);
    });

    handleClearButton(clearButtonName, navigationStack, metaDataName, currentItems, rootItems, dataName, backButtonID, menuContainerID, selectedItems, selectedItemsContainer)
}

function createMenuItem(clearButtonName, rootItems, item, selectedItems, navigationStack, currentItems, metaDataName, dataName, selectedItemsContainer, backButtonID, menuContainerID) {
    const container = document.createElement('div');
    container.className = `flex items-center space-x-2 py-1 relative group`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'form-checkbox';
    checkbox.dataset.tag = item.tag;

    if (selectedItems.has(item.tag)) {
        checkbox.checked = true
    }

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            selectedItems.add(item.tag);
        } else {
            selectedItems.delete(item.tag);
        }
        updateSelectedItems(selectedItemsContainer, selectedItems);
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
                const subCategories = await fetchSubCategories(item.tag, metaDataName);
                currentItems = subCategories[dataName];
                renderMenu(clearButtonName, rootItems, currentItems, menuContainerID, selectedItems, navigationStack, currentItems, metaDataName, dataName, selectedItemsContainer, backButtonID);
                showBackButton(true, backButtonID);
            }
        }
    });

    return container;
}

function showBackButton(show, backButtonID) {
    const backButtonContainer = document.getElementById(backButtonID);
    if (backButtonContainer) {
        backButtonContainer.classList.toggle('hidden', !show);
    }
}

function updateSelectedItems(selectedItemsContainer, selectedItems) {
    const selectedContainer = document.getElementById(selectedItemsContainer);
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
            updateSelectedItems(selectedItemsContainer, selectedItems);
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

async function fetchSubCategories(tag, metaDataName) {
    const response = await fetch(`/database/getMetaDataSubCategory/${tag}/${metaDataName}`, {
        headers: {'Accept': 'application/json'}
    });
    return await response.json();
}

function clearAllSelections(selectedItemsContainer, selectedItems) {
    selectedItems.clear();
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    updateSelectedItems(selectedItemsContainer, selectedItems);
}

function filterMenu(searchInput, menuContainerID) {
    const searchTerm = document.getElementById(searchInput).value.toLowerCase();
    const menuContainer = document.getElementById(menuContainerID);
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

/*function updateIcons(soundID, isPlaying) {
    const icon = document.querySelector('.icon_' + soundID);
    icon.setAttribute('data-lucide', isPlaying ? 'pause' : 'play');
    lucide.createIcons();
}*/
