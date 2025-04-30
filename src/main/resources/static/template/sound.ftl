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
    <script src="../js/sound/sound.js" defer></script>
    <script src="../js/index/auth.js" defer></script>

    <style>
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

        .dropdown-wrapper {
            position: relative;
            display: inline-block;
        }

        #playlistContainer {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            width: 320px;
            background: #fff;
            border: 1px solid #ccc;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 15px;
            border-radius: 8px;
            z-index: 100;
        }

        #playlistContainer input[type="text"] {
            width: 100%;
            padding: 6px;
            margin-bottom: 10px;
        }

        #playlistResult {
            list-style: none;
            padding: 0;
            margin-bottom: 10px;
            max-height: 150px;
            overflow-y: auto;
        }

        #playlistResult li {
            padding: 6px;
            display: flex;
            align-items: center;
        }

        #playlistResult li:hover {
            background-color: #f0f0f0;
        }

        #playlistResult input[type="checkbox"] {
            margin-right: 10px;
        }

        #addToPlaylistBtn {
            width: 100%;
            padding: 8px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }

        #addToPlaylistBtn:hover {
            background-color: #218838;
        }
    </style>
</head>
<body>

<#include "source/header.ftl">

<main role="main">
    <#macro soundCard sound>
        <div class="sound-image">
            <img src="/${sound.image1Path}" alt="${sound.name}"
                 style="max-width: 200px; max-height: 300px;">
        </div>
        <div class="sound-details">
            <h1>Name: ${sound.name}</h1>
            <ul>
                <#list sound.artistIDs as artist>
                    <li>${artist}</li>
                </#list>
            </ul>
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

            <div class="dropdown-wrapper">
                <button onclick="togglePlaylist()">Add Playlist</button>

                <div id="playlistContainer" style="display: none">
                    <div>
                        <label for="playlistInput">Search</label>
                        <input type="text" id="playlistInput" placeholder="Search">
                        <button onclick="createPlaylist()">Create Playlist</button>
                    </div>

                    <div id="playlistResult" style="display: none;"></div>
                    <button id="addToPlaylistBtn" onclick="addSound(['${sound.soundID}'])">Submit</button>
                </div>
            </div>
            <div>
                <button class="pointer" onclick="downloadSound('${sound.soundID}')">Download</button>
            </div>
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
</script>

</body>
</html>