const nav = document.getElementById('mainNav');
// El script para cerrar el menú en móvil se mantiene igual.
document.querySelectorAll('.nav-links a').forEach(item => {
    item.addEventListener('click', () => {
        // Solo cerramos si es un enlace interno, no el dropdown
        if (!item.parentElement.classList.contains('dropdown')) {
            nav.classList.remove('nav-open');
        }
    });
});


/* ------------------------------------- */
/* JS para el SLIDER Automático */
/* ------------------------------------- */

let slideIndex = 0;
const wrapper = document.getElementById('sliderWrapper');
let slides = [];

// Esperar a que el DOM esté completamente cargado para obtener los slides
document.addEventListener('DOMContentLoaded', (event) => {
    slides = document.querySelectorAll('.slide');
    showSlides(); // Iniciar el carrusel
});

// Función para mover al slide siguiente/anterior (opcional si usas botones)
function moveSlide(n) {
    slideIndex += n;
    if (slideIndex >= slides.length) {
        slideIndex = 0;
    }
    if (slideIndex < 0) {
        slideIndex = slides.length - 1;
    }
    wrapper.style.transform = `translateX(${-slideIndex * 100}%)`;
    // Reiniciar el temporizador si se mueve manualmente
    resetTimer();
}

// Función principal del carrusel automático
function showSlides() {
    slideIndex++;
    if (slideIndex >= slides.length) {
        slideIndex = 0;
    }

    // Mueve el wrapper al slide actual
    wrapper.style.transform = `translateX(${-slideIndex * 100}%)`;

    // Mantiene la rotación cada 5 segundos
    slideTimer = setTimeout(showSlides, 5000);
}

// Función para reiniciar el temporizador si se usa navegación manual
let slideTimer;

function resetTimer() {
    clearTimeout(slideTimer);
    slideTimer = setTimeout(showSlides, 5000);
}

/* ------------------------------------- */
/* JS para el MODAL de Bienvenida */
/* ------------------------------------- */

const modal = document.getElementById('welcomeModal');

// Función para abrir la modal
function openModal() {
    modal.classList.add('active');
}

// Función para cerrar la modal
function closeModal() {
    modal.classList.remove('active');
}

// Abrir la modal automáticamente 1 segundo después de la carga
window.addEventListener('load', () => {
    // Se usa un temporizador para evitar que aparezca inmediatamente
    setTimeout(openModal, 1000);
});

// Cerrar si se hace clic fuera del contenido del modal
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}
