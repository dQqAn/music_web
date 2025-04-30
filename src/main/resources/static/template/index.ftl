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
        <div id="menuWrapper" class="hidden md:flex flex-col border rounded-lg bg-white w-80 max-h-fit">
            <div class="gap-4 w-full max-w-md mx-auto p-4">
                <div class="mb-4">
                    <input id="categorySearchInput" type="text" placeholder="Search..."
                           class="w-full p-2 border rounded">
                </div>

                <div class="flex justify-between items-center mb-2">
                    <h2 class="text-lg font-semibold">Selected Items</h2>
                    <button id="categoryClearSelection" class="text-red-600 text-sm">Clear</button>
                </div>
            </div>

            <div id="menuContainer" class="gap-4 w-full max-w-md mx-auto p-4 overflow-y-auto">
                <div id="selectedItemsContainer" class="flex flex-wrap gap-2 mb-4"></div>

                <div id="categoryBackButtonContainer" class="mb-2 hidden">
                    <button id="categoryBackButton" class="text-blue-600 text-sm">← Back</button>
                </div>

                <div id="categoryMenuContainer" class="bg-white rounded shadow p-4"></div>

                <div id="mainPagination" class="pointer pagination gap-2 mb-4"></div>
            </div>

            <div class="gap-4 w-full max-w-md mx-auto p-4">
                <h3>Duration</h3>
                <div>
                    <label for="minDuration">Min:</label>
                    <input id="minDuration" name="minDuration" type="range" min="0" max="600" step="15">
                </div>
                <div>
                    <label for="maxDuration">Max:</label>
                    <input id="maxDuration" name="maxDuration" type="range" min="0" max="600" step="15">
                </div>
                <div id="durationOutput"></div>
            </div>
            <div id="menuSubmitDiv">
                <button id="menuSubmitButton"
                        class="show-selected-btn bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition w-full mt-4">
                    Show Selected Tags
                </button>
            </div>
        </div>

        <div class="main_content relative pb-20">
            <div id="soundList"></div>

            <div class="pointer pagination" id="pagination"></div>
        </div>
    </div>
</main>

<footer>
    <#include "source/music_box.ftl">
</footer>

<script>
</script>

</body>
</html>
