<!DOCTYPE html>
<html lang="${lang}">
<head>
    <title>Profile</title>
    <link rel="icon" type="image/x-icon" href="/images/favicon.ico">
    <meta charset="UTF-8">
    <meta name="description" content="Profile">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <link href="/js/common.css" rel="stylesheet">
    <link href="/js/theme/dark.css" rel="stylesheet" id="theme-link">
    <script src="/js/theme/theme.js" defer></script>
    <script src="/js/index/auth.js" defer></script>

    <link href="/tailwind/output.css" rel="stylesheet">

    <style>
    </style>
</head>
<body>

<#include "source/header.ftl">

<main role="main">

    <#if true>
    <#else>
    </#if>

    <div class="max-w-sm mx-auto bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        <div class="border-b px-4 pb-6">

            <div class="text-center my-4">
                <img class="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 mx-auto my-4"
                     src="${user.profileImage!""}" alt="">
                <div class="py-2">
                    <h3 class="font-bold text-2xl text-gray-800 dark:text-white mb-1">${user.name!""} ${user.surname!""}</h3>
                </div>
                <div class="dark:text-white">
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
        <a href="">
            <h6>Favourites</h6>
        </a>
        <a href="">
            <h6>Playlists</h6>
        </a>
    </div>

</main>

<script>
</script>

</body>
</html>