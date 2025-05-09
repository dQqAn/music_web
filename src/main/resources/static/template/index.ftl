<!DOCTYPE html>
<html lang="${lang}" data-theme="dark" style="visibility:hidden">
<head>
    <title>Music Web</title>
    <#--    <base href="https://www.site.com/">-->
    <link rel="icon" type="image/x-icon" href="../images/favicon.ico">
    <meta charset="UTF-8">
    <meta name="description" content="Music Web">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <link href="../js/common.css" rel="stylesheet">
    <script src="../js/theme/theme.js" defer></script>
    <script type="module" src="../js/header.js" defer></script>
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

<main role="main" class="flex flex-col">
    <#setting url_escaping_charset="UTF-8">

    <div class="flex flex-1">
        <div id="menuWrapper" class="bg-fuchsia-100 dark:bg-neutral-950 text-neutral-950 dark:text-fuchsia-500
         hidden md:flex flex-col border rounded-lg  w-80 max-h-fit">
            <div class="gap-4 w-full max-w-md mx-auto p-4">
                <div class="mb-4">
                    <input id="categorySearchInput" type="text" placeholder="Search..."
                           class="w-full p-2 border rounded">
                </div>

                <div class="flex justify-between items-center mb-2">
                    <h2 class="text-lg font-semibold">Selected Items</h2>
                    <button id="categoryClearSelection" class="text-sm">Clear</button>
                </div>
            </div>

            <div id="menuContainer" class="gap-4 w-full max-w-md mx-auto p-4 overflow-y-auto max-h-80">
                <div id="selectedItemsContainer" class="flex flex-wrap gap-2 mb-4"></div>

                <div id="categoryBackButtonContainer" class="mb-2 hidden">
                    <button id="categoryBackButton" class="text-sm">← Back</button>
                </div>

                <div id="categoryMenuContainer" class=" rounded p-4"></div>

                <#--                <div id="mainPagination" class="pointer pagination gap-2 mb-4"></div>-->
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

            <div class="gap-4 w-full max-w-md mx-auto p-4">
                <h3>Bpm</h3>
                <div>
                    <input id="bpmSlider" name="bpmSlider" type="range" min="0" max="200" step="20">
                </div>
                <div id="bpmOutput"></div>
            </div>

            <div id="menuSubmitDiv">
                <button id="menuSubmitButton"
                        class="show-selected-btn border-t p-2 w-full mt-4">
                    Show Selected Tags
                </button>
            </div>
        </div>

        <div class="flex flex-1 flex-col w-full">
            <div class="w-full flex-1" id="soundList"></div>

            <div id="pagination" class="pointer pagination py-4 text-center z-40 mb-40"></div>
        </div>
    </div>

    <#include "source/playlist_box.ftl">
</main>

<#include "source/music_box.ftl">

<script>
</script>

</body>
</html>
