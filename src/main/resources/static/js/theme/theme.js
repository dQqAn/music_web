const root = document.documentElement;

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        root.setAttribute("data-theme", "dark");
    } else if (savedTheme === "light") {
        root.setAttribute("data-theme", "light");
    } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.setAttribute("data-theme", prefersDark ? "dark" : "light");
    }

    const main = document.querySelector("main");
    if (main) {
        main.classList.add(
            "bg-fuchsia-50",
            "dark:bg-neutral-800",
            "text-neutral-950",
            "dark:text-fuchsia-500"
        );
    }

    const buttons = document.querySelectorAll("button");
    buttons.forEach(btn => {
        btn.classList.add(
            "pointer",
            "rounded-lg",
            "border-b",
            "border-b-neutral-950",
            "dark:border-b-fuchsia-500",
            "hover:border-transparent",
            "dark:hover:text-fuchsia-100"
        );
    });

    const themedSections = document.querySelectorAll("header, footer");
    themedSections.forEach(el => {
        el.classList.add(
            "bg-fuchsia-100",
            "dark:bg-neutral-950",
            "text-neutral-950",
            "dark:text-fuchsia-500"
        );
    });

    const html_body = document.querySelector("html, body");
    html_body.classList.add(
        "w-full",
        "h-full",
        "overflow-x-hidden"
    );

    const inputs = document.querySelectorAll('input[type="password"], input[type="email"], input[type="text"]');
    inputs.forEach(el => {
        el.classList.add(
            "border"
        );
    });
    root.style.visibility = "visible";
});

function toggleTheme() {
    const currentTheme = root.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
}