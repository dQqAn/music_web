async function checkLoginStatus() {
    const user_section = document.getElementById("user_section");
    const route = document.createElement('a');

    const response = await fetch('/check_auth');
    const result = await response.text();
    if (result === "ACTIVE") {
        route.href = "/dashboard"
        route.innerHTML = `
                <p>Dashboard</p>
            `;
    } else {
        route.href = "/login"
        route.innerHTML = `
                <p>Login</p>
            `;
    }
    user_section.appendChild(route)
}