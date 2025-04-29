import {soundList} from "../soundList.js";
import {updatePagination} from "../pagination.js";

document.addEventListener('DOMContentLoaded', async () => {
    //region Duration
    minSlider.value = minSliderValue
    maxSlider.value = maxSliderValue
    minSlider.addEventListener('input', () => updateDisplay(true));
    maxSlider.addEventListener('input', () => updateDisplay(true));
    updateDisplay(false);
    //endregion

    //region Tag Menu
    openCloseButtons('menuWrapper')

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
    //endregion

    menuSubmit('menuSubmitDiv')
});

//region Duration

function parseTimeRange(rangeStr) {
    const [minStr, maxStr] = rangeStr.split("-");

    function toSeconds(timeStr) {
        const [min, sec] = timeStr.split(":").map(Number);
        return (min * 60) + sec;
    }

    const minSeconds = toSeconds(minStr);
    const maxSeconds = toSeconds(maxStr);

    return {minSeconds, maxSeconds};
}

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return minutes + ':' + secs.toString().padStart(2, '0');
}

let isDurationChanged = false;
const minSlider = document.getElementById('minDuration');
const maxSlider = document.getElementById('maxDuration');
const output = document.getElementById('durationOutput');
const minSliderValue = 0
const maxSliderValue = 600

function updateDisplay(durationChanges) {
    let min = parseInt(minSlider.value);
    let max = parseInt(maxSlider.value);

    if (min > max) {
        [minSlider.value, maxSlider.value] = [max, min];
        [min, max] = [max, min];
    }

    output.textContent = formatDuration(min) + '-' + formatDuration(max);

    isDurationChanged = durationChanges === true

    if (isDurationChanged) {
        updateSelected()
    }
}

function resetDuration() {
    minSlider.value = minSliderValue
    maxSlider.value = maxSliderValue
    updateDisplay(false)
}

function updateSelected() {
    if (isDurationChanged) {
        categorySelectedItems.add('duration');
    } else {
        categorySelectedItems.delete('duration');
    }
    updateSelectedItems('selectedItemsContainer', categorySelectedItems)
}

//endregion

//region Tag Menu
let categoryMenuData = [];
let categorySelectedItems = new Set();
let categoryNavigationStack = [];
let categoryCurrentItems = [];
let categoryRootItems = [];

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
    resetDuration()
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

//endregion

function openCloseButtons(menuWrapperID) {
    const menuWrapper = document.getElementById(menuWrapperID)
    const openMenuButton = document.createElement('button');
    openMenuButton.textContent = 'Menu';
    openMenuButton.className = 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded my-4 mx-auto md:hidden max-w-24 max-h-18';
    menuWrapper.parentNode.insertBefore(openMenuButton, menuWrapper);
    const closeMenuButton = document.createElement('button');
    closeMenuButton.textContent = 'Menu';
    closeMenuButton.className = 'bg-red-500 hover:bg-red-600 text-white p-2 rounded mb-4 w-full';
    menuWrapper.insertBefore(closeMenuButton, menuWrapper.firstChild);
    closeMenuButton.classList.add('hidden');
    openMenuButton.addEventListener('click', function () {
        menuWrapper.classList.remove('hidden');
        openMenuButton.classList.add('hidden');
        closeMenuButton.classList.remove('hidden');
    });
    closeMenuButton.addEventListener('click', function () {
        menuWrapper.classList.add('hidden');
        openMenuButton.classList.remove('hidden');
        closeMenuButton.classList.add('hidden');
    });
}

function menuSubmit(menuSubmitBtnID) {
    const submitButton = document.getElementById(menuSubmitBtnID);
    submitButton.addEventListener('click', async function () {
        filterSounds(1)
    });
}

function filterSounds(page) {
    let minDuration = null
    let maxDuration = null
    if (isDurationChanged) {
        const output = document.getElementById('durationOutput');
        const outputResult = parseTimeRange(output.textContent)
        minDuration = outputResult.minSeconds
        maxDuration = outputResult.maxSeconds
    }

    fetch(`/database/filterSounds?page=${page}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            selectedTags: Array.from(categorySelectedItems),
            minDuration: minDuration,
            maxDuration: maxDuration
        })
    }).then(response => {
        if (!response.ok) {
            console.log(`HTTP error! Status: ${response.status}`);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        const sounds = Array.isArray(data) ? data : (data.sounds || []);
        soundList('soundList', sounds)

        lucide.createIcons();
        window.history.pushState({page: page}, `Page ${page}`, `?page=${page}`);

        const totalPages = Math.floor((sounds.length + 20 - 1) / 20);
        updatePagination("pagination", page, totalPages, (p) => {
            filterSounds(p);
        });
    }).catch(error => {
        console.error("Error:", error);
    });
}
