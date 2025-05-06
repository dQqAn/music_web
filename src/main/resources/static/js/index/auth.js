async function checkLoginStatus() {
    const user_section = document.getElementById("user_section");
    const route = document.createElement('a');

    const response = await fetch('/check_auth');
    const result = await response.text();
    if (result === "ACTIVE") {
        route.href = "/dashboard"
        route.innerHTML = `
                <p class="pointer rounded-lg border-b border-b-neutral-950 dark:border-b-fuchsia-500 hover:border-transparent dark:hover:text-fuchsia-50">Dashboard</p>
            `;
    } else {
        route.href = "/login"
        route.innerHTML = `
                <p class="pointer rounded-lg border-b border-b-neutral-950 dark:border-b-fuchsia-500 hover:border-transparent dark:hover:text-fuchsia-50">Login</p>
            `;
    }
    user_section.appendChild(route)
}

document.addEventListener("DOMContentLoaded", () => {
    checkLoginStatus();
});