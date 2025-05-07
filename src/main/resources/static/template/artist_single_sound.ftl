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
    <script src="../js/theme/theme.js" defer></script>
    <script src="../js/language/language.js" defer></script>
    <link href="../js/artist_single_sound/artist_single_sound.css" rel="stylesheet">
    <script type="module" src="../js/artist_single_sound/artist_single_sound.js" defer></script>
    <script src="../js/index/auth.js" defer></script>
    <script type="module" src="../js/header.js" defer></script>

    <link href="../tailwind/output.css" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest" defer></script>
</head>
<body>

<#include "source/header.ftl">

<main role="main">
    <#setting url_escaping_charset="UTF-8">

    <div class="main_box gap-y-10 mt-12">
        <form class="flex gap-8 content-center items-center w-fit mx-auto" id="uploadForm"
              enctype="multipart/form-data">
            <div class="flex content-center items-center gap-4">
                <label for="imageInput" class="inline-block px-4 py-2 border rounded cursor-pointer">
                    Select an image
                </label>
                <span id="selectedImageName" class="text-sm "></span>
                <input required class="hidden" type="file" id="imageInput" name="imageFile" accept=".png, .jpg"/>
            </div>

            <div class="flex content-center items-center gap-4">
                <label for="soundInput" class="inline-block px-4 py-2 border rounded cursor-pointer">
                    Select a sound
                </label>
                <span id="selectedSoundName" class="text-sm "></span>
                <input
                        required
                        class="hidden"
                        type="file"
                        id="soundInput"
                        name="soundFile"
                        accept=".mp3, .wav"
                />
            </div>

            <div class="flex content-center items-center gap-4">
                <label for="soundName">Sound Name:</label>
                <input class="border rounded" id="soundName" name="soundName" required type="text">
            </div>

            <button class="border rounded" type="submit">Upload Sound</button>
        </form>

        <div id="artistSingleSoundBox" class="container rounded h-30 w-100"
             style="display: none; position: relative;"></div>

        <div class="border rounded" id="fileInfo" style="display: none;">
            <p>File name: <span id="fileStatus"></span></p>
        </div>

        <div class="border rounded" id="errorInfo" style="display: none;">
            <p id="errorMessage"></p>
        </div>
    </div>

    <div class="flex content-center items-center gap-4 w-fit mx-auto mt-12">
        <div class="flex content-center items-center gap-4">
            <label for="stemInput" class="inline-block px-4 py-2 border rounded cursor-pointer">
                Select a stem
            </label>
            <span id="selectedStemName" class="text-sm"></span>
            <input class="hidden" type="file" id="stemInput" name="stemFile" accept=".mp3, .wav"/>
        </div>

        <div class="flex content-center items-center gap-4">
            <label for="stemName">Stem Name:</label>
            <input class="border rounded" id="stemName" name="stemName" type="text">
        </div>

        <button id="addStem" class="border rounded">Add Stem</button>

        <div id="selectedStems"></div>
    </div>

    <div class="content-center items-center w-fit mx-auto gap-y-10 gap-8 mt-12">
        <div class="flex gap-10 gap-y-10">
            <div class="flex content-center items-center w-fit mx-auto gap-8">
                <label for="startingTime">Starting Time:</label>
                <input class="border rounded" id="startingTime" name="startingTime" type="number">
            </div>
            <div class="flex content-center items-center w-fit mx-auto gap-8">
                <label for="endingTime">Ending Time:</label>
                <input class="border rounded" id="endingTime" name="endingTime" type="number">
            </div>

            <button class="border rounded" id="addLoop">Add</button>
        </div>
        <div class="hidden border rounded max-h-50 overflow-y-auto w-100 mx-auto mt-12" id="artistSelectedLoopsDiv">
            <h3 class="font-semibold mb-2">Selected Loops</h3>
            <div id="artistLoopList" class="flex flex-col gap-2"></div>
        </div>
    </div>

    <div class="border border-neutral-950 w-100 content-center items-center mx-auto gap-y-10 p-10 mt-12 mb-50">
        <div class="mb-10">
            <input id="categorySearchInput" type="text" placeholder="Search..." class="w-full border rounded">
        </div>

        <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold">Selected Items</h2>
            <button id="categoryClearSelection" class="text-sm">Clear</button>
        </div>

        <div id="selectedItemsContainer" class="flex flex-wrap gap-2 mb-10"></div>

        <div id="categoryBackButtonContainer" class="hidden">
            <button id="categoryBackButton" class="text-sm">← Back</button>
        </div>

        <div id="categoryMenuContainer" class="rounded overflow-y-auto h-auto max-h-128"></div>
    </div>

    <#include "source/playlist_box.ftl">
</main>

<#include "source/music_box.ftl">

<script>
</script>

</body>
</html>
