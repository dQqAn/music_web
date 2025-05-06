<!DOCTYPE html>
<html lang="${lang}">
<head>
    <title>Dashboard</title>
    <link rel="icon" type="image/x-icon" href="../images/favicon.ico">
    <meta charset="UTF-8">
    <meta name="description" content="Dashboard">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <link href="../js/common.css" rel="stylesheet">
    <script src="../js/theme/theme.js" defer></script>
    <script src="../js/language/language.js" defer></script>
    <script src="../js/index/auth.js" defer></script>

    <link href="../tailwind/output.css" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest" defer></script>
    <style>
    </style>
</head>
<body>

<#include "source/header.ftl">

<main role="main">
    <button class="pointer" onclick="window.location.href='/profile'">Profile</button>
    <button class="pointer" onclick="window.location.href='/moderator/pending_approval'">Pending Approval</button>
    <button class="pointer" onclick="window.location.href='/logout'">Logout</button>
</main>

<script>
</script>

</body>
</html>