<!DOCTYPE html>
<html lang="${lang}">
<head>
    <title>Login</title>
    <link rel="icon" type="image/x-icon" href="/images/favicon.ico">
    <meta charset="UTF-8">
    <meta name="description" content="Staff Login">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <link href="/js/common.css" rel="stylesheet">
    <link href="/js/theme/dark.css" rel="stylesheet" id="theme-link">
    <script src="/js/theme/theme.js" defer></script>
    <link href="/js/login/login.css" rel="stylesheet">
    <script src="/js/login/login.js" defer></script>
</head>
<body>

<#include "source/header.ftl">

<main role="main">
    <div class="">
        <form id="loginForm">
            <h2>Sign In</h2>
            <div class="form-group">
                <label for="email">Email:</label>
                <input id="email" name="email" required type="email">
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input id="password" name="password" required type="password">
            </div>
            <div class="form-group">
                <button type="submit">Confirm</button>
            </div>
            <div class="toggle-link">
                <a href="#" onclick="showRegisterForm()">Sign Up</a>
            </div>
            <div class="message" id="loginMessageArea"></div>
        </form>

        <form id="registerForm" style="display:none;">
            <h2>Sign Up</h2>
            <div class="form-group">
                <label for="regEmail">Email:</label>
                <input id="regEmail" name="regEmail" required type="email">
            </div>
            <div class="form-group">
                <label for="name">Name:</label>
                <input id="name" name="name" required type="text">
            </div>
            <div class="form-group">
                <label for="surname">Surname:</label>
                <input id="surname" name="surname" required type="text">
            </div>
            <div class="form-group">
                <label for="firstPassword">Password:</label>
                <input id="firstPassword" name="firstPassword" required type="password">
            </div>
            <div class="form-group">
                <label for="secondPassword">Confirm Password:</label>
                <input id="secondPassword" name="secondPassword" required type="password">
            </div>
            <div class="form-group">
                <button type="submit">Confirm</button>
            </div>
            <div class="toggle-link">
                <a href="#" onclick="showLoginForm()">Sign In</a>
            </div>
            <div class="message" id="regMessageArea"></div>
        </form>
    </div>

    <div class="loader-container" id="loader" style="display: none;">
        <div class="spinner"></div>
    </div>
</main>

<script>
</script>

</body>
</html>