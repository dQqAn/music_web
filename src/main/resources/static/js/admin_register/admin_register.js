document.getElementById("staffForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const roleSelected = document.querySelector('input[name="role"]:checked');
    const errorRoleDiv = document.getElementById("roleError");
    const databaseMessage = document.getElementById("databaseMessage");
    const errorRegister = document.getElementById("errorRegister");
    const errorMessage = document.getElementById("errorMessage");

    if (!roleSelected) {
        errorRoleDiv.style.display = "block";
        errorRoleDiv.scrollIntoView({behavior: "smooth", block: "center"});
    } else {
        errorRoleDiv.style.display = "none";

        const mail = document.getElementById("mail");

        const data = {
            mail: mail.value,
            role: roleSelected.value
        };

        try {
            const response = await fetch("/admin/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            const resData = await response.text();
            if (response.status === 200) {
                databaseMessage.style.display = "block";
            } else {
                errorMessage.textContent = resData;
                errorRegister.style.display = "block";
            }
        } catch (error) {
            errorMessage.textContent = `Error: ${error}`;
            errorRegister.style.display = "block";
        }
    }
});