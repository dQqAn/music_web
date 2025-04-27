document.getElementById("uploadForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const imageInput = document.getElementById("imageInput");
    const soundInput = document.getElementById("soundInput");
    const soundName = document.getElementById("soundName");
    const category1 = document.getElementById("category1");

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
    formData.append("category1", category1.value);

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
let categoryParentStack = [];
let categoryMenuData = [];
const categorySelectedTags = new Set();
const categoryMenuWrapper = document.getElementById('categoryMenuWrapper');
const categoryMenuContainer = document.getElementById('categoryMenuContainer');
const categoryClearButton = 'categoryClearButton'
const categorySelectedContainerDiv = 'categorySelectedContainerDiv'

//Moods
let moodsParentStack = [];
let moodsMenuData = [];
const moodsSelectedTags = new Set();
const moodsMenuWrapper = document.getElementById('moodsMenuWrapper');
const moodsMenuContainer = document.getElementById('moodsMenuContainer');
const moodsClearButton = 'moodsClearButton'
const moodsSelectedContainerDiv = 'moodsSelectedContainerDiv'

//Instruments
let instrumentsParentStack = [];
let instrumentsMenuData = [];
const instrumentsSelectedTags = new Set();
const instrumentsMenuWrapper = document.getElementById('instrumentsMenuWrapper');
const instrumentsMenuContainer = document.getElementById('instrumentsMenuContainer');
const instrumentsClearButton = 'instrumentsClearButton'
const instrumentsSelectedContainerDiv = 'instrumentsSelectedContainerDiv'

document.addEventListener('DOMContentLoaded', function () {
    fetch('/menuItems')
        .then(response => {
            if (!response.ok) {
                throw new Error('Menu loading error');
            }
            return response.json();
        })
        .then(data => {
            categoryMenuData = data.categories;
            renderMenu(categoryMenuContainer, categoryMenuData, categoryMenuData, '', categorySelectedTags, categoryParentStack, categoryClearButton, categorySelectedContainerDiv);
            searchBoxDiv(categoryMenuWrapper, categoryMenuContainer, categoryMenuData, categoryMenuData, categorySelectedTags, categoryParentStack, categoryClearButton, categorySelectedContainerDiv)

            moodsMenuData = data.moods;
            renderMenu(moodsMenuContainer, moodsMenuData, moodsMenuData, '', moodsSelectedTags, moodsParentStack, moodsClearButton, moodsSelectedContainerDiv);
            searchBoxDiv(moodsMenuWrapper, moodsMenuContainer, moodsMenuData, moodsMenuData, moodsSelectedTags, moodsParentStack, moodsClearButton, moodsSelectedContainerDiv)

            instrumentsMenuData = data.instruments;
            renderMenu(instrumentsMenuContainer, instrumentsMenuData, instrumentsMenuData, '', instrumentsSelectedTags, instrumentsParentStack, instrumentsClearButton, instrumentsSelectedContainerDiv);
            searchBoxDiv(instrumentsMenuWrapper, instrumentsMenuContainer, instrumentsMenuData, instrumentsMenuData, instrumentsSelectedTags, instrumentsParentStack, instrumentsClearButton, instrumentsSelectedContainerDiv)
        })
        .catch(error => {
            console.error('Menu Json error:', error);
        });
});

function searchBoxDiv(menuWrapper, menuContainer, menuData, fullMenuData, selectedTags, parentStack, clearButtonID, selectedContainerDiv) {
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
            renderMenu(menuContainer, menuData, fullMenuData, '', selectedTags, parentStack, clearButtonID, selectedContainerDiv);
        } else {
            const filtered = filterMenu(menuData, query);
            renderMenu(menuContainer, filtered, fullMenuData, '', selectedTags, parentStack, clearButtonID, selectedContainerDiv);
        }
    });
}

function renderMenu(menuContainer, menuData, fullMenuData, parentName = '', selectedTags, parentStack, clearButtonID, selectedContainerDiv) {
    menuContainer.innerHTML = '';

    const selectedContainer = document.createElement('div');
    selectedContainer.className = 'selected-container mb-4 flex flex-wrap gap-2';
    selectedContainer.classList.add(selectedContainerDiv);
    menuContainer.appendChild(selectedContainer);

    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear all';
    clearButton.id = clearButtonID;
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
            renderMenu(menuContainer, prev.items, fullMenuData, prev.parentName, selectedTags, parentStack, clearButtonID, selectedContainerDiv);
        });
    }

    const listContainer = document.createElement('div');
    listContainer.className = 'space-y-2';
    menuContainer.appendChild(listContainer);

    menuData.forEach(item => {
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
                    parentStack.push({items: menuData, parentName});
                    renderMenu(menuContainer, item.subcategories, fullMenuData, item.name, selectedTags, parentStack, clearButtonID, selectedContainerDiv);
                }
            });
        }

        listContainer.appendChild(itemDiv);
    });

    updateSelected(selectedContainer, clearButton, selectedTags, fullMenuData);
}

function updateSelected(selectedContainer, clearButton, selectedTags, fullMenuData) {
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

categoryMenuContainer.addEventListener('change', function (e) {
    if (e.target.classList.contains('menu-checkbox')) {
        const tag = e.target.dataset.tag;
        if (e.target.checked) {
            categorySelectedTags.add(tag);
        } else {
            categorySelectedTags.delete(tag);
        }

        const selectedDiv = '.' + categorySelectedContainerDiv;
        const categoryClearBtn = document.getElementById(categoryClearButton)
        const categorySelectedContainer = document.querySelector(selectedDiv)
        updateSelected(categorySelectedContainer, categoryClearBtn, categorySelectedTags, categoryMenuData);
    }
});

moodsMenuContainer.addEventListener('change', function (e) {
    if (e.target.classList.contains('menu-checkbox')) {
        const tag = e.target.dataset.tag;
        if (e.target.checked) {
            moodsSelectedTags.add(tag);
        } else {
            moodsSelectedTags.delete(tag);
        }

        const selectedDiv = '.' + moodsSelectedContainerDiv;
        const moodsClearBtn = document.getElementById(moodsClearButton)
        const moodsSelectedContainer = document.querySelector(selectedDiv)
        updateSelected(moodsSelectedContainer, moodsClearBtn, moodsSelectedTags, moodsMenuData);
    }
});

instrumentsMenuContainer.addEventListener('change', function (e) {
    if (e.target.classList.contains('menu-checkbox')) {
        const tag = e.target.dataset.tag;
        if (e.target.checked) {
            instrumentsSelectedTags.add(tag);
        } else {
            instrumentsSelectedTags.delete(tag);
        }

        const selectedDiv = '.' + instrumentsSelectedContainerDiv;
        const instrumentsClearBtn = document.getElementById(instrumentsClearButton)
        const instrumentsSelectedContainer = document.querySelector(selectedDiv)
        updateSelected(instrumentsSelectedContainer, instrumentsClearBtn, instrumentsSelectedTags, instrumentsMenuData);
    }
});

categoryMenuContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('remove-item')) {
        const tag = e.target.dataset.tag;
        categorySelectedTags.delete(tag);
        const checkbox = categoryMenuContainer.querySelector(`.menu-checkbox[data-tag="${tag}"]`);
        if (checkbox) {
            checkbox.checked = false;
        }

        const selectedDiv = '.' + categorySelectedContainerDiv;
        const categoryClearBtn = document.getElementById(categoryClearButton)
        const categorySelectedContainer = document.querySelector(selectedDiv)
        updateSelected(categorySelectedContainer, categoryClearBtn, categorySelectedTags, categoryMenuData);
    }

    if (e.target.classList.contains('clear-all-btn')) {
        categorySelectedTags.clear();
        const selected = categoryMenuContainer.querySelectorAll('.menu-checkbox:checked');
        selected.forEach(checkbox => checkbox.checked = false);

        const selectedDiv = '.' + categorySelectedContainerDiv;
        const categoryClearBtn = document.getElementById(categoryClearButton)
        const categorySelectedContainer = document.querySelector(selectedDiv)
        updateSelected(categorySelectedContainer, categoryClearBtn, categorySelectedTags, categoryMenuData);
    }
});

moodsMenuContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('remove-item')) {
        const tag = e.target.dataset.tag;
        moodsSelectedTags.delete(tag);
        const checkbox = moodsMenuContainer.querySelector(`.menu-checkbox[data-tag="${tag}"]`);
        if (checkbox) {
            checkbox.checked = false;
        }

        const selectedDiv = '.' + moodsSelectedContainerDiv;
        const moodsClearBtn = document.getElementById(moodsClearButton)
        const moodsSelectedContainer = document.querySelector(selectedDiv)
        updateSelected(moodsSelectedContainer, moodsClearBtn, moodsSelectedTags, moodsMenuData);
    }

    if (e.target.classList.contains('clear-all-btn')) {
        moodsSelectedTags.clear();
        const selected = moodsMenuContainer.querySelectorAll('.menu-checkbox:checked');
        selected.forEach(checkbox => checkbox.checked = false);

        const selectedDiv = '.' + moodsSelectedContainerDiv;
        const moodsClearBtn = document.getElementById(moodsClearButton)
        const moodsSelectedContainer = document.querySelector(selectedDiv)
        updateSelected(moodsSelectedContainer, moodsClearBtn, moodsSelectedTags, moodsMenuData);
    }
});

instrumentsMenuContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('remove-item')) {
        const tag = e.target.dataset.tag;
        instrumentsSelectedTags.delete(tag);
        const checkbox = instrumentsMenuContainer.querySelector(`.menu-checkbox[data-tag="${tag}"]`);
        if (checkbox) {
            checkbox.checked = false;
        }

        const selectedDiv = '.' + instrumentsSelectedContainerDiv;
        const instrumentsClearBtn = document.getElementById(instrumentsClearButton)
        const instrumentsSelectedContainer = document.querySelector(selectedDiv)
        updateSelected(instrumentsSelectedContainer, instrumentsClearBtn, instrumentsSelectedTags, instrumentsMenuData);
    }

    if (e.target.classList.contains('clear-all-btn')) {
        instrumentsSelectedTags.clear();
        const selected = instrumentsMenuContainer.querySelectorAll('.menu-checkbox:checked');
        selected.forEach(checkbox => checkbox.checked = false);

        const selectedDiv = '.' + instrumentsSelectedContainerDiv;
        const instrumentsClearBtn = document.getElementById(instrumentsClearButton)
        const instrumentsSelectedContainer = document.querySelector(selectedDiv)
        updateSelected(instrumentsSelectedContainer, instrumentsClearBtn, instrumentsSelectedTags, instrumentsMenuData);
    }
});

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