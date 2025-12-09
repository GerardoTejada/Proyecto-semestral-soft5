const nav = document.getElementById('mainNav');
const toggle = document.querySelector('.menu-toggle');

// Cierra el menú cuando se hace clic en cualquier enlace (útil en móvil)
document.querySelectorAll('.nav-links a').forEach(item => {
    item.addEventListener('click', () => {
        nav.classList.remove('nav-open');
    });
});
