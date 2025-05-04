<!DOCTYPE html>
<html lang="${lang}">
<head>
    <title>Sound</title>
    <link rel="icon" type="image/x-icon" href="../images/favicon.ico">
    <meta charset="UTF-8">
    <meta name="description" content="Sound">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <link href="../js/common.css" rel="stylesheet">
    <link href="../js/theme/dark.css" rel="stylesheet" id="theme-link">
    <script src="../js/theme/theme.js" defer></script>
    <link href="../js/sound/sound.css" rel="stylesheet">
    <script type="module" src="../js/sound/sound.js" defer></script>
    <script src="../js/index/auth.js" defer></script>

    <link href="../tailwind/output.css" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest" defer></script>
    <style>
    </style>
</head>
<body>

<#include "source/header.ftl">

<main role="main">
    <div class="sound-details">

        <div class="flex items-center justify-center w-full">
            <div class="w-100 h-100 bg-gray-700 rounded overflow-hidden">
                <img id="soundImage" src=""
                     class="w-full h-full object-cover" alt="">
            </div>
        </div>

        <div class="flex items-center justify-center w-full">
            <h5>Name: </h5>
            <div id="soundName"></div>
        </div>

        <div class="flex items-center justify-center w-full">
            <h5>Artists: </h5>
            <div id="soundArtistNames"></div>
        </div>

        <div id="soundCategories"></div>

        <div id="soundFavStatus"></div>

        <div id="soundFavDiv"></div>

        <div class="flex flex-col space-y-2">
            <button id="soundDownload">Download</button>

            <button id="soundPlay">Play</button>
        </div>

        <div id="soundPlaylistDiv">
            <button id="soundPlaylistBtn">Add Playlist</button>

            <div class="text-black" id="soundPlaylistContainer" style="
                        display: none;
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background-color: white;
                        border: 1px solid #ccc;
                        z-index: 1000;
                        padding: 20px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                        max-width: 90%;
                        max-height: 80%;
                        overflow-y: auto;
                    ">
                <button id="soundPlaylistCloseBtn" style="
                                position: absolute;
                                top: 10px;
                                right: 10px;
                                background: none;
                                border: none;
                                font-size: 20px;
                                cursor: pointer;
                            ">×
                </button>

                <div>
                    <label for="soundPlaylistInput">Search</label>
                    <input type="text" id="soundPlaylistInput" placeholder="Search">
                    <button id="soundCreatePlaylist">Create Playlist</button>
                </div>

                <div id="soundPlaylistResult" class="h-60" style="display: none;"></div>
                <button id="soundAddToPlaylistBtn">Submit</button>
            </div>
        </div>

        <#--        <div id="soundCategories"></div>-->


    </div>

</main>

<footer>
    <#include "source/music_box.ftl">
</footer>

<script>
</script>

</body>
</html>