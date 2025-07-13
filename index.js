// script.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const usernameInput = form.querySelector("input[name='username']");
    const passwordInput = form.querySelector("input[name='password']");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        try {
            const response = await fetch("https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/token/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("access", data.access);
                localStorage.setItem("refresh", data.refresh);
                window.location.href ="matricula.html"; // Redirigir a matrícula
            } else {
                alert("Credenciales incorrectas o usuario no encontrado.");
            }
        } catch (error) {
            alert("Error al conectar con el servidor.");
            console.error(error);
        }
    });
});
