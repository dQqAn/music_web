<!DOCTYPE html>
<html lang="${lang}">
<head>
    <title>Admin Register</title>
    <link rel="icon" type="image/x-icon" href="../images/favicon.ico">
    <meta charset="UTF-8">
    <meta name="description" content="Admin Register">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <link href="../js/common.css" rel="stylesheet">
    <script src="../js/theme/theme.js" defer></script>
    <script src="../js/language/language.js" defer></script>
    <link href="../js/admin_register/admin_register.css" rel="stylesheet">
    <script src="../js/admin_register/admin_register.js" defer></script>
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
    <div class="container">
        <form id="staffForm">
            <label for="mail">Staff Email:</label>
            <input id="mail" name="mail" required type="email">

            <p>Select Role:</p>
            <label>
                <input type="radio" name="role" value="ADMIN">
                Admin
            </label>

            <label>
                <input type="radio" name="role" value="MODERATOR">
                Moderator
            </label>

            <label>
                <input type="radio" name="role" value="ARTIST" required>
                Artist
            </label>

            <div id="databaseMessage" style="display: none;">User added.</div>

            <div id="roleError" style="display: none;">Please select a role.</div>

            <div id="errorRegister" style="display: none;">
                <p id="errorMessage"></p>
            </div>

            <button type="submit">Submit</button>
        </form>
    </div>
</main>

<script>
</script>

</body>
</html>