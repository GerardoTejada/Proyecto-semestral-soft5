document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias del DOM ---
    const gameArea = document.getElementById('game-area');
    const startButton = document.getElementById('start-button');
    const resetButton = document.getElementById('reset-button');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const gameMessage = document.getElementById('game-message');
    const resultModal = document.getElementById('result-modal');
    const finalScoreDisplay = document.getElementById('final-score');

    // --- Variables del Juego ---
    let score = 0;
    let timer = 30; // Tiempo en segundos
    let gameInterval;
    let isGameRunning = false;

    // --- Funciones del Juego ---

    /**
     * @function iniciarJuego
     * Inicializa las variables y comienza el temporizador.
     */
    function iniciarJuego() {
        if (isGameRunning) return;

        // Resetear
        score = 0;
        timer = 30;
        isGameRunning = true;
        scoreDisplay.textContent = score;
        timerDisplay.textContent = `${timer}s`;

        // Ocultar botones/mensajes
        startButton.style.display = 'none';
        gameMessage.style.display = 'none';
        resetButton.disabled = true;

        // Iniciar temporizador
        gameInterval = setInterval(updateTimer, 1000);

        // Crear el primer target
        createTarget();
    }

    /**
     * @function updateTimer
     * Actualiza el contador de tiempo y finaliza el juego si llega a cero.
     */
    function updateTimer() {
        timer--;
        timerDisplay.textContent = `${timer}s`;

        if (timer <= 0) {
            clearInterval(gameInterval);
            finalizarJuego();
        }
    }

    /**
     * @function finalizarJuego
     * Detiene el juego, muestra el resultado y limpia el área de juego.
     */
    function finalizarJuego() {
        isGameRunning = false;
        
        // Mostrar modal de resultado
        finalScoreDisplay.textContent = score;
        resultModal.style.display = 'flex';
        
        // Limpiar área de juego
        gameArea.innerHTML = '';
        gameArea.appendChild(gameMessage);
        gameArea.appendChild(startButton);
        startButton.textContent = 'Jugar de Nuevo';
        startButton.style.display = 'block';
        gameMessage.textContent = `Tu puntaje final fue de ${score} clics. Presiona Jugar de Nuevo.`;
        gameMessage.style.display = 'block';

        resetButton.disabled = false;
    }

    /**
     * @function createTarget
     * Crea un nuevo círculo (target) en una posición aleatoria.
     */
    function createTarget() {
        if (!isGameRunning) return;

        // Limpiar targets anteriores
        const existingTarget = gameArea.querySelector('.target');
        if (existingTarget) {
            gameArea.removeChild(existingTarget);
        }

        // Dimensiones del área de juego
        const areaWidth = gameArea.clientWidth;
        const areaHeight = gameArea.clientHeight;
        const targetSize = 60; // Definido en CSS

        // Calcular posiciones aleatorias (asegurando que no se salgan del área)
        const randomX = Math.floor(Math.random() * (areaWidth - targetSize));
        const randomY = Math.floor(Math.random() * (areaHeight - targetSize));

        // Crear el elemento target
        const target = document.createElement('div');
        target.classList.add('target');
        target.style.left = `${randomX}px`;
        target.style.top = `${randomY}px`;

        // Añadir evento al target
        target.addEventListener('click', targetClicked);

        // Añadir al área de juego
        gameArea.appendChild(target);
    }

    /**
     * @function targetClicked
     * Maneja el evento de clic en el círculo.
     */
    function targetClicked() {
        if (!isGameRunning) return;
        
        // 1. Aumentar puntaje
        score++;
        scoreDisplay.textContent = score;

        // 2. Efecto visual rápido (escalar)
        this.style.transform = 'scale(0.8)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
            // 3. Crear el siguiente target
            createTarget(); 
        }, 100); 
    }
    
    // --- Listeners de Eventos ---

    startButton.addEventListener('click', iniciarJuego);

    resetButton.addEventListener('click', () => {
        // Detener temporizador si está corriendo
        clearInterval(gameInterval);
        
        // Limpiar targets
        const existingTarget = gameArea.querySelector('.target');
        if (existingTarget) {
            gameArea.removeChild(existingTarget);
        }
        
        // Restablecer interfaz
        scoreDisplay.textContent = '0';
        timerDisplay.textContent = '30s';
        gameMessage.textContent = 'Presiona Iniciar Juego para comenzar el reto.';
        gameMessage.style.display = 'block';
        startButton.textContent = 'Iniciar Juego';
        startButton.style.display = 'block';
        resetButton.disabled = true;
        isGameRunning = false;
    });
});