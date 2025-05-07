<!DOCTYPE html>
<html lang="${lang}">
<head>
    <title>Moderator Pending Approval</title>
    <link rel="icon" type="image/x-icon" href="../images/favicon.ico">
    <meta charset="UTF-8">
    <meta name="description" content="Moderator Pending Approval">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <link href="../js/common.css" rel="stylesheet">
    <script src="../js/theme/theme.js" defer></script>
    <script src="../js/language/language.js" defer></script>
    <link href="../js/moderator_pending_approval/moderator_pending_approval.css" rel="stylesheet">
    <script type="module" src="../js/moderator_pending_approval/moderator_pending_approval.js" defer></script>
    <script src="../js/index/auth.js" defer></script>
    <script type="module" src="../js/header.js" defer></script>

    <link href="../tailwind/output.css" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest" defer></script>

    <style>
    </style>
</head>
<body>

<#include "source/header.ftl">

<main role="main">
    <div class="container" id="tableOptions">
        <table class="sounds_table">
            <thead>
            <tr>
                <th></th>
                <th>Name</th>
                <th>Artist</th>
                <th>Category1</th>
            </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
    <button id="submitButton">Submit</button>
    <div class="pointer pagination" id="pagination"></div>
</main>

<script>
</script>

</body>
</html>