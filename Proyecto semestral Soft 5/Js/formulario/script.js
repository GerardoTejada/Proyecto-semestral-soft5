document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    // Función principal que maneja la validación de un campo
    function validateField(inputElement, regex, errorMessage) {
        const value = inputElement.value.trim();
        const parentGroup = inputElement.closest('.form-group');
        const errorDisplay = document.getElementById(`error-${inputElement.name}`);
        
        // 1. Validar campos requeridos
        if (inputElement.required && value === "") {
            parentGroup.classList.add('error');
            errorDisplay.textContent = 'Este campo es obligatorio.';
            return false;
        }

        // 2. Validar formato (si se proporciona una expresión regular)
        if (regex && value !== "" && !regex.test(value)) {
            parentGroup.classList.add('error');
            errorDisplay.textContent = errorMessage;
            return false;
        }

        // 3. Validación exitosa
        parentGroup.classList.remove('error');
        errorDisplay.textContent = '';
        return true;
    }

    // --- Definición de Reglas de Validación ---
    
    // Regla de Email: Formato básico de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    
    // Regla de Teléfono: 8 dígitos con o sin guión (Ej: 6999-9999 o 69999999)
    const phoneRegex = /^\d{4}[-]?\d{4}$/; 

    // --- Validadores Individuales ---
    
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const telefonoInput = document.getElementById('telefono');
    const mensajeTextarea = document.getElementById('mensaje');

    // Validación en tiempo real (al perder el foco o escribir)
    nombreInput.addEventListener('blur', () => {
        validateField(nombreInput, /^.{3,}$/, 'El nombre debe tener al menos 3 caracteres.');
    });

    emailInput.addEventListener('blur', () => {
        validateField(emailInput, emailRegex, 'Introduce un formato de correo válido (ejemplo@dominio.com).');
    });
    
    telefonoInput.addEventListener('blur', () => {
        // Solo validar si se ha introducido algo, ya que es opcional
        if (telefonoInput.value.trim() !== "") {
            validateField(telefonoInput, phoneRegex, 'El teléfono debe tener 8 dígitos (ej: 6999-9999).');
        } else {
            // Limpiar error si está vacío y no es requerido
            telefonoInput.closest('.form-group').classList.remove('error');
            document.getElementById(`error-telefono`).textContent = '';
        }
    });

    mensajeTextarea.addEventListener('blur', () => {
        validateField(mensajeTextarea, /^.{10,}$/, 'El mensaje debe tener al menos 10 caracteres.');
    });


    // --- Manejo del Envío del Formulario ---
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Detener el envío por defecto del navegador

        // Ejecutar todas las validaciones antes de enviar
        const isNombreValid = validateField(nombreInput, /^.{3,}$/, 'El nombre debe tener al menos 3 caracteres.');
        const isEmailValid = validateField(emailInput, emailRegex, 'Introduce un formato de correo válido.');
        const isTelefonoValid = telefonoInput.value.trim() === "" || validateField(telefonoInput, phoneRegex, 'El teléfono debe tener 8 dígitos.');
        const isMensajeValid = validateField(mensajeTextarea, /^.{10,}$/, 'El mensaje debe tener al menos 10 caracteres.');

        // Si todas las validaciones son verdaderas
        if (isNombreValid && isEmailValid && isTelefonoValid && isMensajeValid) {
            
            // Aquí iría la lógica real de envío al servidor (AJAX/Fetch)
            console.log("Formulario enviado exitosamente (simulación)");
            
            // Simulación de éxito
            form.reset(); // Limpiar campos
            form.style.display = 'none'; // Ocultar formulario
            successMessage.style.display = 'block'; // Mostrar mensaje de éxito

            // Opcional: Ocultar el mensaje de éxito después de unos segundos
            setTimeout(() => {
                successMessage.style.display = 'none';
                form.style.display = 'flex'; // Mostrar formulario de nuevo
            }, 5000); 

        } else {
            alert('Por favor, corrige los campos marcados antes de enviar.');
        }
    });
});