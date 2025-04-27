<!DOCTYPE html>
<html lang="${lang}">
<head>
    <title>Music Web</title>
    <#--    <base href="https://www.site.com/">-->
    <link rel="icon" type="image/x-icon" href="../images/favicon.ico">
    <meta charset="UTF-8">
    <meta name="description" content="Music Web">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <link href="../js/common.css" rel="stylesheet">
    <link href="../js/theme/dark.css" rel="stylesheet" id="theme-link">
    <script src="../js/theme/theme.js" defer></script>
    <script src="../js/language/language.js" defer></script>

    <link href="../js/audio_player/audio_player.css" rel="stylesheet">
    <script type="module" src="../js/audio_player/audio_player.js" defer></script>

    <link href="../js/menu/menu.css" rel="stylesheet">
    <script type="module" src="../js/menu/menu.js" defer></script>

    <link href="../js/index/index.css" rel="stylesheet">
    <script type="module" src="../js/index/index.js" defer></script>
    <script src="../js/index/auth.js" defer></script>

    <link href="../tailwind/output.css" rel="stylesheet">
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
        <#--<div class="menu" data-menu="menu2">
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
        </div>-->

        <div id="menuWrapper" class="flex flex-col border rounded-lg bg-white">
            <div id="menuContainer" class="gap-4 w-full max-w-md mx-auto p-4"></div>
        </div>

        <div class="main_content">
            <div id="soundList"></div>

            <div class="pointer pagination" id="pagination"></div>
        </div>
    </div>
</main>

<footer>
    <#include "source/music_box.ftl">
</footer>

<script>
    /*function formatDuration(seconds) {
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
    }*/
</script>

</body>
</html>
