document.addEventListener("DOMContentLoaded", () => {
    const themeLink = document.getElementById("theme-link");

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        themeLink.href = savedTheme;
    }
});

function toggleTheme() {
    const themeLink = document.getElementById("theme-link");

    if (themeLink.getAttribute("href") === "/js/theme/dark.css") {
        themeLink.href = "/js/theme/light.css";
        localStorage.setItem("theme", "/js/theme/light.css");
    } else {
        themeLink.href = "/js/theme/dark.css";
        localStorage.setItem("theme", "/js/theme/dark.css");
    }
}

function changeLanguage(lang) {
    document.cookie = "lang=" + lang + "; path=/";
    localStorage.setItem("lang", lang);
    location.reload();
}
