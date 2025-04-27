/*function updateFilters() {
    const selectedFiltersDiv = document.getElementById('selected-filters');
    selectedFiltersDiv.innerHTML = '';

    const checkedCheckbox = document.querySelector('.menu-checkbox:checked');
    if (checkedCheckbox) {
        const filterText = checkedCheckbox.nextElementSibling.textContent.trim();
        const menuId = getMenuId(checkedCheckbox);

        if (!filterText) {
            console.error('filterText is empty!');
            return;
        }

        const displayText = getFullHierarchy(checkedCheckbox);

        const filterItem = document.createElement('div');
        filterItem.className = 'filter-item';
        filterItem.style.backgroundColor = menuId === 'menu1' ? '#ed6d6d' : '#5696dc';

        const textSpan = document.createElement('span');
        textSpan.className = 'filter_text';
        textSpan.textContent = displayText;

        const removeSpan = document.createElement('span');
        removeSpan.className = 'pointer filter-remove';
        removeSpan.textContent = '✖';

        removeSpan.addEventListener('click', function () {
            checkedCheckbox.checked = false;
            updateFilters();
        });

        filterItem.appendChild(textSpan);
        filterItem.appendChild(removeSpan);
        selectedFiltersDiv.appendChild(filterItem);

        filteredSounds(1)
    } else {
        loadSounds(1);
    }

    const filtersDiv = document.querySelector('.filters');
    filtersDiv.style.display = checkedCheckbox ? 'block' : 'none';
}

function filteredSounds(page) {
    const filterText = document.querySelector('.filter_text').textContent;
    if (typeof filterText !== 'string') {
        throw new Error('filterText is not a string');
    }
    const category = getTextAfterLastGreaterThan(filterText)
    const counter = countGreaterThan(filterText)

    const output = document.getElementById('durationOutput');
    const result = parseTimeRange(output.textContent)
    const minDuration = result.minSeconds
    const maxDuration = result.maxSeconds

    fetchSoundsWithPagination(
        {
            url: `/database/category/${category}/${counter}/${minDuration}/${maxDuration}?page=${page}`,
            page: page, gridId: 'grid', paginationId: 'pagination'
        });
}

document.addEventListener('DOMContentLoaded', function () {
    const checkboxes = document.querySelectorAll('.menu-checkbox');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                checkboxes.forEach(otherCb => {
                    if (otherCb !== this) {
                        otherCb.checked = false;
                    }
                });
            }
            updateFilters();
        });
    });

    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function (e) {
            if (e.target.type !== 'checkbox') {
                toggleSubmenu(this);
            }
        });
    });
    document.getElementById('clear-all-filters').addEventListener('click', clearAllFilters);

    updateFilters();
});

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

let selectedCategory = null
let selectedDuration = null

export function getFilteredSounds() {
    const output = document.getElementById('durationOutput');
    const category = document.querySelector(".filter_text");
    selectedDuration = output.textContent || null
    selectedCategory = category || null

    let categoryName = null
    let counter = null

    if (selectedCategory?.textContent?.trim()) {
        categoryName = getTextAfterLastGreaterThan(selectedCategory.textContent)
        counter = countGreaterThan(selectedDuration)
    } else {
        categoryName = null
    }

    const result = parseTimeRange(output.textContent)
    const minDuration = result.minSeconds
    const maxDuration = result.maxSeconds

    fetchSoundsWithPagination(
        {
            url: `/database/category/${categoryName}/${counter}/${minDuration}/${maxDuration}?page=${1}`,
            page: 1, gridId: 'grid', paginationId: 'pagination'
        });
}*/

/*function loadSounds(page) {
    if (!Number.isInteger(page)) {
        throw new Error('page is not a number');
    }

    fetchSoundsWithPagination(
        {
            url: `/database/sounds?page=${page}`,
            page: page, gridId: 'grid', paginationId: 'pagination'
        });
}

function fetchSoundsWithPagination({url, page, gridId, paginationId}) {
    fetch(`${url}?page=${page}`, {
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log(`HTTP error! Status: ${response.status}`);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const grid = document.getElementById(gridId);
            if (!grid) return;
            grid.innerHTML = '';

            const sounds = Array.isArray(data) ? data : (data.sounds || []);
            sounds.forEach(item => {
                const soundDiv = document.createElement('div');
                soundDiv.className = 'sound';
                soundDiv.innerHTML = `
                    <a href="/sound/?${toSlug(item.name)}&soundID=${item.soundID}">
                        <img class="pointer" src="${item.image1Path}" alt=""
                             style="max-width: 200px; max-height: 300px;">
                    </a>
                    <h1>${item.name}</h1>
                    <button class="pointer" onclick="playSoundToMusicBox('${item.soundID}')">Listen</button>
                `;
                grid.appendChild(soundDiv);
            });

            window.history.pushState({page: page}, `Page ${page}`, `/?page=${page}`);

            const totalPages = Math.floor((sounds.length + 20 - 1) / 20);
            updatePagination(paginationId, page, totalPages, (p) => {
                fetchSoundsWithPagination({
                    url,
                    page: p,
                    gridId,
                    paginationId
                });
            });
        })
        .catch(error => {
            console.error("Error:", error);
        });
}*/

document.addEventListener('DOMContentLoaded', function () {
    const menuWrapper = document.getElementById('menuWrapper');
    const menuContainer = document.getElementById('menuContainer');

    let parentStack = [];
    let fullMenuData = [];
    const selectedTags = new Set();

    const searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.placeholder = 'Ara...';
    searchBox.className = 'mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400';
    menuWrapper.insertBefore(searchBox, menuContainer);

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

            const left = document.createElement('div');
            left.className = 'flex items-center space-x-2';
            itemDiv.appendChild(left);

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'menu-checkbox accent-blue-500';
            checkbox.dataset.name = item.name;
            checkbox.dataset.tag = item.tag;
            checkbox.checked = selectedTags.has(item.tag);
            left.appendChild(checkbox);

            const nameSpan = document.createElement('span');
            nameSpan.textContent = item.name;
            nameSpan.className = 'category-name font-medium text-gray-700 group-hover:text-gray-900';
            left.appendChild(nameSpan);

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

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Show Selected Tags';
        submitButton.className = 'show-selected-btn bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition w-full mt-4';
        menuContainer.appendChild(submitButton);

        submitButton.addEventListener('click', function () {
            if (selectedTags.size > 0) {
                console.log(Array.from(selectedTags).join(', '));
            } else {
                console.log("no selected");
            }
        });

        updateSelected();
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

    searchBox.addEventListener('input', function () {
        const query = searchBox.value.toLowerCase();
        if (query === '') {
            renderMenu(fullMenuData);
        } else {
            const filtered = filterMenu(fullMenuData, query);
            renderMenu(filtered);
        }
    });

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
});
