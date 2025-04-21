const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginMessageArea = document.getElementById('loginMessageArea');
const regMessageArea = document.getElementById('regMessageArea');
const loader = document.getElementById('loader');

function showRegisterForm() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
}

function showLoginForm() {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
}

registerForm.addEventListener('submit', async function (event) {
    event.preventDefault();  // Stop the page refreshing

    const firstPassword = document.getElementById('firstPassword').value;
    const secondPassword = document.getElementById('secondPassword').value;

    if (firstPassword.length < 6) {
        regMessageArea.textContent = 'Password must be at least 6 characters long';
        regMessageArea.style.color = 'red';
        return;
    }

    if (firstPassword !== secondPassword) {
        regMessageArea.textContent = 'Passwords do not match';
        regMessageArea.style.color = 'red';
        return;
    }

    const mail = document.getElementById('regEmail').value;
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;

    const userJson = {
        mail: mail,
        password: firstPassword,
        name: name,
        surname: surname
    };

    try {
        loader.style.display = 'flex';
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userJson)
        });

        if (response.ok) {
            const result = await response.text();
            regMessageArea.textContent = 'Registration successful: ' + result;
            setTimeout(function () {
                loader.style.display = 'none';
                window.location.href = "/dashboard";
            }, 2000);
        } else {
            loader.style.display = 'none';
            regMessageArea.textContent = 'Registration failed: ' + response.statusText;
            regMessageArea.style.color = 'red';
        }
    } catch (error) {
        console.error('Error:', error);
        regMessageArea.textContent = 'Error';
        regMessageArea.style.color = 'red';
    }
});

loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();  // Stop the page refreshing

    const mail = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (password.length < 6) {
        loginMessageArea.textContent = 'Password must be at least 6 characters long';
        loginMessageArea.style.color = 'red';
        return;
    }

    const userJson = {
        mail: mail,
        password: password
    }

    try {
        loader.style.display = 'flex';
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userJson)
        });

        if (response.ok) {
            const result = await response.text();
            loginMessageArea.textContent = 'Signing successful';
            setTimeout(function () {
                loader.style.display = 'none';
                window.location.href = "/dashboard";
            }, 2000);
        } else {
            loader.style.display = 'none';
            loginMessageArea.textContent = 'Signing failed: ' + response.statusText;
            loginMessageArea.style.color = 'red';
        }
    } catch (error) {
        console.error('Error:', error);
        loginMessageArea.textContent = 'Error';
        loginMessageArea.style.color = 'red';
    }
});