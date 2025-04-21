function toggleSubmenu(element) {
    const submenu = element.nextElementSibling;
    if (submenu && submenu.classList.contains('submenu')) {
        const computedStyle = window.getComputedStyle(submenu);
        const isOpen = computedStyle.display === 'block';
        if (isOpen) {
            const nestedSubmenus = submenu.querySelectorAll('.submenu');
            nestedSubmenus.forEach(nested => {
                nested.style.display = 'none';
            });
        }
        submenu.style.display = isOpen ? 'none' : 'block';
    }
}

function getMenuId(checkbox) {
    return checkbox.getAttribute('data-menu') || checkbox.closest('.menu')?.getAttribute('data-menu') || 'menu1';
}

function updateFilters() {
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

function clearAllFilters() {
    const allCheckboxes = document.querySelectorAll('.menu-checkbox');
    allCheckboxes.forEach(cb => {
        cb.checked = false;
    });
    updateFilters();
}

function getFullHierarchy(checkbox, maxLevels = Infinity) {
    const hierarchy = [];
    let currentElement = checkbox.closest('li');
    let level = 0;

    while (currentElement && level < maxLevels) {
        const menuText = currentElement.querySelector('.menu-text');
        if (menuText) {
            hierarchy.unshift(menuText.textContent.trim());
        }
        currentElement = currentElement.parentElement.closest('li');
        level++;
    }

    return hierarchy.join(' > ');
}

function countGreaterThan(text) {
    return (text.match(/>/g) || []).length;
}

function getTextAfterLastGreaterThan(text) {
    const lastIndex = text.lastIndexOf(">");
    if (lastIndex === -1) {
        return text.trim();
    } else if (lastIndex === text.length - 1) {
        return "";
    } else {
        return text.substring(lastIndex + 1).trim();
    }
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

function getFilteredSounds() {
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
}

/*async function filteredSize(category, counter, minDuration, maxDuration) {
    try {
        const response = await fetch(`/database/category_size/${category}/${counter}/${minDuration}/${maxDuration}`);
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
            return null;
        }

        const data = await response.text();
        const integerValue = parseInt(data);

        if (isNaN(integerValue)) {
            console.error(`${integerValue} is not a number`);
            return null;
        }
        return integerValue;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}*/
