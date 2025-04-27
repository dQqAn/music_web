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
    <script src="../js/artist_single_sound/artist_single_sound.js" defer></script>
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

            <label for="category1">Category 1:</label>
            <input id="category1" name="category1" required type="text">

            <button type="submit">Upload Sound</button>
        </form>

        <div id="fileInfo" style="display: none;">
            <p>File name: <span id="fileName"></span></p>
        </div>

        <div id="errorInfo" style="display: none; color: red;">
            <p id="errorMessage"></p>
        </div>
    </div>

    <div id="categoryMenuWrapper" class="hidden md:flex flex-col border rounded-lg bg-white">
        <div id="categoryMenuContainer" class="gap-4 w-full max-w-md mx-auto p-4"></div>
    </div>

    <div id="moodsMenuWrapper" class="hidden md:flex flex-col border rounded-lg bg-white">
        <div id="moodsMenuContainer" class="gap-4 w-full max-w-md mx-auto p-4"></div>
    </div>

    <div id="instrumentsMenuWrapper" class="hidden md:flex flex-col border rounded-lg bg-white">
        <div id="instrumentsMenuContainer" class="gap-4 w-full max-w-md mx-auto p-4"></div>
    </div>
</main>

<script>
</script>

</body>
</html>
