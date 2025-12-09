// JS/chatbot.js

document.addEventListener('DOMContentLoaded', () => {
    // Referencias del DOM
    const chatContainer = document.getElementById('chat-container');
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send-btn');
    const toggleBtn = document.getElementById('chat-toggle-btn');
    const closeBtn = document.getElementById('chat-close-btn');

    // --- BASE DE CONOCIMIENTO (Palabras Clave) ---
    const RESPONSES = [
        // 1. Horarios y contacto
        { 
            keywords: ['horario', 'abierto', 'cerrado', 'horas'], 
            response: "Nuestro horario de atención es de **Lunes a Viernes, de 8:00 a.m. a 5:00 p.m.** para consultas y reservas." 
        },
        { 
            keywords: ['contacto', 'llamar', 'telefono', 'email'], 
            response: "Puedes contactarnos al **+507 9999-9999** o enviarnos un email a **info@cocletour.com**." 
        },
        // 2. Destinos
        { 
            keywords: ['valle', 'anton', 'el valle', 'montaña'], 
            response: "¡El Valle de Antón es increíble! Ofrecemos tours de senderismo, visita a la Piedra Pintada y hospedaje. ¿Quieres ver nuestros **paquetes** de Valle?" 
        },
        { 
            keywords: ['playa', 'santa clara', 'mar', 'arena'], 
            response: "¡Claro! Tenemos excursiones de un día completo a Playa Santa Clara, incluyendo transporte y almuerzo con mariscos. Busca el **Paquete Santa Clara**." 
        },
        { 
            keywords: ['nata', 'caballeros', 'iglesia', 'historia'], 
            response: "Natá de los Caballeros es pura historia. Nuestros tours incluyen la visita guiada a la iglesia y monumentos históricos. Pregunta por el **Tour Natá**." 
        },
        // 3. Paquetes y precios
        { 
            keywords: ['paquetes', 'precio', 'costo', 'ofertas'], 
            response: "Tenemos paquetes que inician desde B/. 75.00 (Tour Natá) hasta B/. 150.00 (Paquete El Valle Completo). ¿Sobre qué destino te gustaría saber el **precio**?" 
        },
        // 4. Saludos y despedidas
        { 
            keywords: ['hola', 'buenas', 'saludos'], 
            response: "¡Hola! Soy tu Asistente Virtual de Coclé Tour. ¿En qué puedo ayudarte hoy?" 
        },
        { 
            keywords: ['gracias', 'adios', 'chau'], 
            response: "¡Ha sido un placer asistirte! No dudes en contactarnos si tienes más preguntas. ¡Feliz día!" 
        }
    ];

    // --- FUNCIONES PRINCIPALES ---

    /** Muestra un mensaje en el chat, con el formato tipo burbuja. */
    function displayMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(`${sender}-message`);
        
        // Usar innerHTML para interpretar negritas (del bot)
        messageDiv.innerHTML = text; 
        
        chatBody.appendChild(messageDiv);
        
        // Desplazar al último mensaje
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    /** Procesa la entrada del usuario y genera una respuesta del bot. */
    function getBotResponse(userText) {
        const normalizedText = userText.toLowerCase().trim();

        // 1. Buscar coincidencia con palabras clave
        for (const item of RESPONSES) {
            for (const keyword of item.keywords) {
                if (normalizedText.includes(keyword)) {
                    return item.response;
                }
            }
        }
        
        // 2. Respuesta por defecto
        return "Disculpa, no entendí tu pregunta. Intenta usar palabras clave como: **horario**, **paquetes**, **Valle**, **Santa Clara** o **contacto**.";
    }

    /** Maneja el envío de mensajes por el usuario. */
    function sendMessage() {
        const userText = chatInput.value;
        if (userText === '') return;

        // 1. Mostrar mensaje del usuario
        displayMessage(userText, 'user');
        chatInput.value = '';

        // 2. Generar y mostrar respuesta del bot
        const botResponse = getBotResponse(userText);

        // Retraso para simular que el bot está "escribiendo"
        setTimeout(() => {
            displayMessage(botResponse, 'bot');
        }, 500);
    }
    
    // --- LISTENERS DE EVENTOS ---
    
    // Abrir/Cerrar la ventana de chat
    toggleBtn.addEventListener('click', () => {
        chatContainer.style.display = (chatContainer.style.display === 'flex') ? 'none' : 'flex';
        // Mostrar mensaje de bienvenida la primera vez
        if (chatContainer.style.display === 'flex' && chatBody.children.length === 0) {
            displayMessage('¡Hola! Soy el Asistente de Coclé Tour. Pregúntame sobre **paquetes**, **horario** o un **destino** específico.', 'bot');
        }
        chatInput.focus(); // Enfocar el input
    });

    closeBtn.addEventListener('click', () => {
        chatContainer.style.display = 'none';
    });

    // Enviar mensaje al hacer clic en el botón
    sendBtn.addEventListener('click', sendMessage);

    // Enviar mensaje al presionar Enter en el input
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});