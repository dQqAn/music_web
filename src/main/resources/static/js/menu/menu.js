/*function parseTimeRange(rangeStr) {
    const [minStr, maxStr] = rangeStr.split("-");

    function toSeconds(timeStr) {
        const [min, sec] = timeStr.split(":").map(Number);
        return (min * 60) + sec;
    }

    const minSeconds = toSeconds(minStr);
    const maxSeconds = toSeconds(maxStr);

    return {minSeconds, maxSeconds};
}

let selectedDuration = null

export function getFilteredSounds() {
    const output = document.getElementById('durationOutput');
    selectedDuration = output.textContent || null

    const result = parseTimeRange(output.textContent)
    const minDuration = result.minSeconds
    const maxDuration = result.maxSeconds
}*/

//region Duration
function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return minutes + ':' + secs.toString().padStart(2, '0');
}

const minSlider = document.getElementById('minDuration');
const maxSlider = document.getElementById('maxDuration');
const output = document.getElementById('durationOutput');

function updateDisplay() {
    let min = parseInt(minSlider.value);
    let max = parseInt(maxSlider.value);

    if (min > max) {
        [minSlider.value, maxSlider.value] = [max, min];
        [min, max] = [max, min];
    }

    output.textContent = formatDuration(min) + '-' + formatDuration(max);
}

//endregion

let parentStack = [];
let fullMenuData = [];
const selectedTags = new Set();
const menuWrapper = document.getElementById('menuWrapper');
const menuContainer = document.getElementById('menuContainer');

document.addEventListener('DOMContentLoaded', function () {
    //region Duration
    minSlider.addEventListener('input', updateDisplay);
    maxSlider.addEventListener('input', updateDisplay);
    updateDisplay();
    //endregion

    //region Tag Menu
    openCloseButtons()

    searchBoxDiv()

    fetch('/menuItems')
        .then(response => {
            if (!response.ok) {
                throw new Error('Menu loading error');
            }
            return response.json();
        })
        .then(data => {
            fullMenuData = data;
            renderMenu(data);
        })
        .catch(error => {
            console.error('Menu Json error:', error);
        });
    //endregion

    menuSubmit()
});

//region Tag Menu
function updateSelected() {
    const selectedContainer = document.querySelector('.selected-container');
    const clearButton = document.querySelector('.clear-all-btn');

    if (!selectedContainer || !clearButton) return;

    selectedContainer.innerHTML = '';

    selectedTags.forEach(tag => {
        const name = findNameByTag(fullMenuData, tag);
        if (name) {
            const badge = document.createElement('div');
            badge.className = 'flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm';
            badge.innerHTML = `${name} <span data-tag="${tag}" class="remove-item ml-2 cursor-pointer text-red-500 hover:text-red-700">&times;</span>`;
            selectedContainer.appendChild(badge);
        }
    });

    clearButton.style.display = selectedTags.size > 0 ? 'inline-block' : 'none';
}

function findNameByTag(items, tag) {
    for (const item of items) {
        if (item.tag === tag) return item.name;
        if (item.subcategories) {
            const subName = findNameByTag(item.subcategories, tag);
            if (subName) return subName;
        }
    }
    return null;
}

function filterMenu(items, query) {
    let results = [];

    items.forEach(item => {
        if (item.name.toLowerCase().includes(query)) {
            results.push(item);
        }

        if (item.subcategories) {
            results = results.concat(filterMenu(item.subcategories, query));
        }
    });

    return results;
}

function renderMenu(items, parentName = '') {
    menuContainer.innerHTML = '';

    const selectedContainer = document.createElement('div');
    selectedContainer.className = 'selected-container mb-4 flex flex-wrap gap-2';
    menuContainer.appendChild(selectedContainer);

    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear all';
    clearButton.className = 'clear-all-btn bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition';
    clearButton.style.display = 'none';
    menuContainer.appendChild(clearButton);

    if (parentName) {
        const backButton = document.createElement('div');
        backButton.textContent = '← ' + parentName;
        backButton.className = 'back-button flex items-center text-blue-500 hover:text-blue-700 font-semibold mb-4 cursor-pointer';
        menuContainer.appendChild(backButton);

        backButton.addEventListener('click', function () {
            const prev = parentStack.pop();
            renderMenu(prev.items, prev.parentName);
        });
    }

    const listContainer = document.createElement('div');
    listContainer.className = 'space-y-2';
    menuContainer.appendChild(listContainer);

    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item group flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 transition';

        const menuItem = document.createElement('div');
        menuItem.className = 'flex items-center space-x-2';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'menu-checkbox accent-blue-500';
        checkbox.dataset.name = item.name;
        checkbox.dataset.tag = item.tag;
        checkbox.checked = selectedTags.has(item.tag);
        menuItem.appendChild(checkbox);

        const nameSpan = document.createElement('span');
        nameSpan.textContent = item.name;
        nameSpan.className = 'category-name font-medium text-gray-700 group-hover:text-gray-900';
        menuItem.appendChild(nameSpan);

        itemDiv.appendChild(menuItem);

        if (item.subcategories && item.subcategories.length > 0) {
            const arrow = document.createElement('span');
            arrow.className = 'text-gray-400 group-hover:text-gray-600';
            arrow.innerHTML = '&rsaquo;';
            itemDiv.appendChild(arrow);

            itemDiv.addEventListener('click', function (e) {
                if (e.target !== checkbox) {
                    parentStack.push({items, parentName});
                    renderMenu(item.subcategories, item.name);
                }
            });
        }

        listContainer.appendChild(itemDiv);
    });

    updateSelected();
}

menuContainer.addEventListener('change', function (e) {
    if (e.target.classList.contains('menu-checkbox')) {
        const tag = e.target.dataset.tag;
        if (e.target.checked) {
            selectedTags.add(tag);
        } else {
            selectedTags.delete(tag);
        }
        updateSelected();
    }
});

menuContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('remove-item')) {
        const tag = e.target.dataset.tag;
        selectedTags.delete(tag);
        const checkbox = menuContainer.querySelector(`.menu-checkbox[data-tag="${tag}"]`);
        if (checkbox) {
            checkbox.checked = false;
        }
        updateSelected();
    }

    if (e.target.classList.contains('clear-all-btn')) {
        selectedTags.clear();
        const selected = menuContainer.querySelectorAll('.menu-checkbox:checked');
        selected.forEach(checkbox => checkbox.checked = false);
        updateSelected();
    }
});

function searchBoxDiv() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'flex items-center mb-4 w-full';
    const clearButton = document.createElement('button');
    clearButton.innerHTML = '&times;';
    clearButton.className = 'p-2 bg-gray-200 hover:bg-gray-300 border border-l-0 border-gray-300 rounded-r';
    const searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.placeholder = 'Search...';
    searchBox.className = 'flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:border-blue-400';
    searchContainer.appendChild(searchBox);
    searchContainer.appendChild(clearButton);
    menuWrapper.insertBefore(searchContainer, menuContainer);
    clearButton.addEventListener('click', function () {
        searchBox.value = '';
        searchBox.dispatchEvent(new Event('input'));
    });
    searchBox.addEventListener('input', function () {
        const query = searchBox.value.toLowerCase();
        if (query === '') {
            renderMenu(fullMenuData);
        } else {
            const filtered = filterMenu(fullMenuData, query);
            renderMenu(filtered);
        }
    });
}

function openCloseButtons() {
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

//endregion

function menuSubmit() {
    const menuSubmitDiv = document.getElementById('menuSubmitDiv');
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Show Selected Tags';
    submitButton.className = 'show-selected-btn bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition w-full mt-4';
    menuSubmitDiv.appendChild(submitButton);

    submitButton.addEventListener('click', function () {
        if (selectedTags.size > 0) {
            console.log(Array.from(selectedTags).join(', '));
        } else {
            console.log("no selected");
        }
    });
}
