<!DOCTYPE html>
<html lang="${lang}">
<head>
    <title>Music Web</title>
    <#--    <base href="https://www.site.com/">-->
    <link rel="icon" type="image/x-icon" href="/images/favicon.ico">
    <meta charset="UTF-8">
    <meta name="description" content="Music Web">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <link href="/js/common.css" rel="stylesheet">
    <link href="/js/theme/dark.css" rel="stylesheet" id="theme-link">
    <script src="/js/theme/theme.js" defer></script>
    <script src="/js/language/language.js" defer></script>

    <link href="/js/audio_player/audio_player.css" rel="stylesheet">
    <script type="module" src="/js/audio_player/audio_player.js" defer></script>

    <link href="/js/menu/menu.css" rel="stylesheet">
    <script type="module" src="/js/menu/menu.js" defer></script>

    <link href="/js/index/index.css" rel="stylesheet">
    <script type="module" src="/js/index/index.js" defer></script>
    <script src="/js/index/auth.js" defer></script>

    <link href="/tailwind/output.css" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest" defer></script>
</head>
<body>

<#include "source/header.ftl">

<main role="main">
    <#setting url_escaping_charset="UTF-8">

    <div class="search_box">
        <label for="searchInput">Search</label>
        <input
                type="text"
                id="searchInput"
                placeholder="Search..."
        />
        <div id="searchResults" class="search-dropdown" style="display: none;"></div>
    </div>

    <div class="main_box">
        <#import "source/menu_data.ftl" as menuData>

        <#macro renderMenu items menuId="menu1">
            <#list items as item>
                <li>
                    <span class="pointer menu-item">
                        <input type="checkbox" class="menu-checkbox"
                               name="menu-selection" data-menu="${menuId}" aria-label="${item.name}">
                        <span class="menu-text">${item.name}</span>
                    </span>
                    <#if item.subItems?? && item.subItems?size gt 0>
                        <ul class="submenu" style="display: none;">
                            <@renderMenu items=item.subItems menuId=menuId />
                        </ul>
                    </#if>
                </li>
            </#list>
        </#macro>

        <div>
            <div>
                <button class="menuButton" onclick="toggleMenu()">☰ Menu</button>
            </div>
            <div class="menu_box">
                <div class="filters" style="display: none;">
                    <h4>Filters</h4>
                    <div id="selected-filters"></div>
                    <button class="pointer" id="clear-all-filters">Clear Filters</button>
                </div>

                <h3>Tags</h3>
                <ul class="menu" data-menu="menu1">
                    <@renderMenu items=menuData.menuItems menuId="menu1" />
                </ul>

                <div class="menu" data-menu="menu2">
                    <h3>Duration</h3>
                    <div>
                        <label for="minDuration">Min:</label>
                        <input id="minDuration" name="minDuration" type="range" min="0" max="600" step="15" value="0">
                    </div>
                    <div>
                        <label for="maxDuration">Max:</label>
                        <input id="maxDuration" name="maxDuration" type="range" min="0" max="600" step="15" value="600">
                    </div>
                    <div id="durationOutput">
                        <div id="durationPlaceHolder" style="display: none"></div>
                    </div>
                    <button onclick="getFilteredSounds()">Submit</button>
                </div>
            </div>
        </div>

        <div class="main_content">
            <div class="grid-container" id="grid"></div>

            <div class="pointer pagination" id="pagination"></div>
        </div>
    </div>

    <#--<div>
        <button style="min-width: 5em" id="play">Play</button>
        <button style="margin: 0 1em 2em" id="randomize">Randomize points</button>

        Volume: <label id="tempLabel">0</label>
        <div id="container" style="border: 1px solid #ddd;"></div>
    </div>-->
</main>

<#include "source/music_box.ftl">

<script>
    document.addEventListener("DOMContentLoaded", () => {
        lucide.createIcons();
    });

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

    minSlider.addEventListener('input', updateDisplay);
    maxSlider.addEventListener('input', updateDisplay);
    updateDisplay();

    const menu = document.querySelector(".menu_box");

    function toggleMenu() {
        if (menu.style.display === "none" || getComputedStyle(menu).display === "none") {
            menu.style.display = "block";
        } else {
            menu.style.display = "none";
        }
    }
</script>

</body>
</html>
