<!DOCTYPE html>
<html lang="${lang}">
<head>
    <title>Profile</title>
    <link rel="icon" type="image/x-icon" href="../images/favicon.ico">
    <meta charset="UTF-8">
    <meta name="description" content="Profile">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <link href="../js/common.css" rel="stylesheet">
    <script src="../js/theme/theme.js" defer></script>
    <script src="../js/language/language.js" defer></script>
    <script src="../js/index/auth.js" defer></script>
    <script type="module" src="../js/header.js" defer></script>

    <link href="../tailwind/output.css" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest" defer></script>

    <script type="module" src="../js/audio_player/audio_player.js" defer></script>
    <script type="module" src="../js/profile/profile.js" defer></script>

    <style>
    </style>
</head>
<body>

<#include "source/header.ftl">

<main role="main">
    <div class="max-w-sm mx-auto bg-fuchsia-100 dark:bg-neutral-950 rounded-lg overflow-hidden mt-4 mb-12">
        <div class="px-4 pb-6">

            <div class="text-center my-4">
                <img class="h-32 w-32 rounded-full border-4 mx-auto my-4"
                     src="${user.profileImage!""}" alt="">
                <div class="py-2">
                    <h3 class="font-bold text-2xl mb-1">${user.name!""} ${user.surname!""}</h3>
                </div>
                <div>
                    <h6>
                        Status: ${user.status}
                    </h6>
                    <h6>
                        Role: ${user.role}
                    </h6>
                </div>
            </div>
        </div>
    </div>

    <div class="flex justify-evenly">
        <button class="pointer" id="favouritesBtn" data-user-id="${user.id}">Favourites</button>
        <button class="pointer" id="userProfilePlaylistButton">Playlists</button>
    </div>

    <div id="userPlaylistContainer" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4"></div>

    <div id="favSoundList"></div>
    <div id="pagination" class="pointer pagination py-4 text-center z-40 mb-40"></div>

    <#include "source/playlist_box.ftl">
</main>

<#include "source/music_box.ftl">

<script>
</script>

</body>
</html>