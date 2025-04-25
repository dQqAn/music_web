<!DOCTYPE html>
<html lang="${lang}">
<head>
    <title>Dashboard</title>
    <link rel="icon" type="image/x-icon" href="../images/favicon.ico">
    <meta charset="UTF-8">
    <meta name="description" content="Dashboard">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <link href="../js/common.css" rel="stylesheet">
    <link href="../js/theme/dark.css" rel="stylesheet" id="theme-link">
    <script src="../js/theme/theme.js" defer></script>
    <link href="../js/admin_dashboard/admin_dashboard.css" rel="stylesheet">
    <script src="../js/admin_dashboard/admin_dashboard.js" defer></script>
    <script src="../js/index/auth.js" defer></script>

    <style>
    </style>
</head>
<body>

<#include "source/header.ftl">

<main role="main">
    <button class="pointer" onclick="window.location.href='/profile'">Profile</button>
    <button class="pointer" onclick="window.location.href='/admin/register'">Register</button>
    <button class="pointer" onclick="window.location.href='/logout'">Logout</button>
</main>

<script>
</script>

</body>
</html>