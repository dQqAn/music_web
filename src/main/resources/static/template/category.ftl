<!DOCTYPE html>
<html lang="${lang}">
<head>
    <title>Category</title>
    <link rel="icon" type="image/x-icon" href="../images/favicon.ico">
    <meta charset="UTF-8">
    <meta name="description" content="Category">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <link href="../js/common.css" rel="stylesheet">
    <script src="../js/theme/theme.js" defer></script>
    <script src="../js/language/language.js" defer></script>
    <script src="../js/index/auth.js" defer></script>
    <script type="module" src="../js/header.js" defer></script>

    <link href="../js/category/category.css" rel="stylesheet">
    <script type="module" src="../js/category/category.js" defer></script>

    <link href="../tailwind/output.css" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest" defer></script>
    <style>
    </style>
</head>
<body>

<#include "source/header.ftl">

<main role="main" class="flex flex-col">
    <div class="flex flex-1">
        <div class="flex flex-1 flex-col w-full">
            <div class="w-full flex-1" id="soundList"></div>

            <div id="pagination" class="pointer pagination py-4 text-center z-40 mb-40">
            </div>
        </div>
    </div>

    <#include "source/playlist_box.ftl">
</main>

<#include "source/music_box.ftl">

<script>
</script>

</body>
</html>