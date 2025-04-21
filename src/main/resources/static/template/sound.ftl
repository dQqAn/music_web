<!DOCTYPE html>
<html lang="${lang}">
<head>
    <title>Sound</title>
    <link rel="icon" type="image/x-icon" href="/images/favicon.ico">
    <meta charset="UTF-8">
    <meta name="description" content="Sound">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <link href="/js/common.css" rel="stylesheet">
    <link href="/js/theme/dark.css" rel="stylesheet" id="theme-link">
    <script src="/js/theme/theme.js" defer></script>
    <link href="/js/sound/sound.css" rel="stylesheet">
    <script src="/js/sound/sound.js" defer></script>
    <script src="/js/index/auth.js" defer></script>

    <style>
        .sound-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .sound-image img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
        }

        .sound-details {
            margin-top: 20px;
        }

        .sound-details h1 {
            font-size: 24px;
            margin: 0 0 10px;
        }

        .sound-details p {
            margin: 5px 0;
            line-height: 1.5;
        }
    </style>
</head>
<body>

<#include "source/header.ftl">

<main role="main">
    <#--    <div class="sound-container"></div>-->

    <#macro soundCard sound>
        <div class="sound-image">
            <img src="/${sound.image1Path}" alt="${sound.name}"
                 style="max-width: 200px; max-height: 300px;">
        </div>
        <div class="sound-details">
            <h1>Name: ${sound.name}</h1>
            <p><strong>Artist:</strong> ${sound.artist}</p>
            <p><strong>Category1:</strong> ${sound.category1}</p>
            <p><strong>SoundID:</strong> ${sound.soundID}</p>
            <div>
                <strong>FavouriteStatus</strong>
                <button
                        id="fav-btn-${sound.soundID}"
                        onclick="changeSoundFavouriteStatus('${sound.soundID}')">
                    <#if sound.favouriteStatus>
                        Unfavourite
                    <#else>
                        Favourite
                    </#if>
                </button>
            </div>
            <button class="pointer" onclick="downloadSound('${sound.soundID}')">Download</button>
            <div id="playerWrapper">
                <button class="pointer" onclick="playSound('${sound.soundID}')">Listen</button>
                <audio id="audioPlayer" controls></audio>
            </div>
        </div>
    </#macro>

    <div>
        <@soundCard sound=sound />
    </div>

</main>

<script>
    /*function getIDFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('soundID') || 'none';
    }

    window.onload = function () {
        const soundID = getIDFromUrl();
        getSound(soundID);
    };*/
</script>

</body>
</html>