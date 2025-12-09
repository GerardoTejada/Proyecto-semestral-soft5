document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    // --- Credenciales Estáticas de Administración ---
    const ADMIN_USER = 'admin';
    const ADMIN_PASS = '12345'; // Usar hash en producción

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username === ADMIN_USER && password === ADMIN_PASS) {
                // Autenticación Exitosa
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userRole', 'admin');
                window.location.href = 'PanelAdmin.html'; // Redirigir al panel
                return;
            } else {
                // Fallo de Autenticación
                loginError.textContent = 'Usuario o contraseña incorrectos.';
                loginError.style.display = 'block';
            }
        });
    }

    // Lógica para cerrar sesión (usada en admin.js pero definida aquí para claridad)
    window.logout = function() {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        window.location.href = 'login.html';
    };
});