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
    <link href="../js/artist_single_sound/artist_single_sound.css" rel="stylesheet">
    <script type="module" src="../js/artist_single_sound/artist_single_sound.js" defer></script>
    <script src="../js/index/auth.js" defer></script>

    <link href="../tailwind/output.css" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest" defer></script>
</head>
<body>

<#include "source/header.ftl">

<main role="main">
    <#setting url_escaping_charset="UTF-8">

    <div class="main_box">
        <form id="uploadForm" enctype="multipart/form-data">
            <input required type="file" id="imageInput" name="imageFile" accept=".png, .jpg"/>
            <input required type="file" id="soundInput" name="soundFile" accept=".mp3, .wav"/>

            <label for="soundName">Sound Name:</label>
            <input id="soundName" name="soundName" required type="text">

            <button type="submit">Upload Sound</button>
        </form>

        <div id="fileInfo" style="display: none;">
            <p>File name: <span id="fileName"></span></p>
        </div>

        <div id="errorInfo" style="display: none; color: red;">
            <p id="errorMessage"></p>
        </div>
    </div>

    <div class="mb-4">
        <input id="categorySearchInput" type="text" placeholder="Search..." class="w-full p-2 border rounded">
    </div>

    <div class="flex justify-between items-center mb-2">
        <h2 class="text-lg font-semibold">Selected Items</h2>
        <button id="categoryClearSelection" class="text-red-600 text-sm">Clear</button>
    </div>

    <div id="selectedItemsContainer" class="flex flex-wrap gap-2 mb-4"></div>

    <div id="categoryBackButtonContainer" class="mb-2 hidden">
        <button id="categoryBackButton" class="text-blue-600 text-sm">← Back</button>
    </div>

    <div id="categoryMenuContainer" class="bg-white rounded shadow p-4 overflow-y-auto max-h-128 pb-20"></div>

    <#--<div id="categoryMenuWrapper" class="hidden md:flex flex-col border rounded-lg bg-white">
        <div id="categoryMenuContainer" class="gap-4 w-full max-w-md mx-auto p-4"></div>
    </div>

    <div id="moodsMenuWrapper" class="hidden md:flex flex-col border rounded-lg bg-white">
        <div id="moodsMenuContainer" class="gap-4 w-full max-w-md mx-auto p-4"></div>
    </div>

    <div id="instrumentsMenuWrapper" class="hidden md:flex flex-col border rounded-lg bg-white">
        <div id="instrumentsMenuContainer" class="gap-4 w-full max-w-md mx-auto p-4"></div>
    </div>-->
</main>

<footer>
    <#include "source/music_box.ftl">
</footer>

<script>
</script>

</body>
</html>
