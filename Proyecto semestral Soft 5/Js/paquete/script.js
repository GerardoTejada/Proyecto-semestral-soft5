// JS/cart-logic.js - Lógica compartida para Carrito y Paquetes

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. SIMULACIÓN DE LA BASE DE DATOS DE PAQUETES
    // NOTA: Se usa el atributo data-* en paquete.html, pero se mantiene la lista para referencia.
    // ----------------------------------------------------
    const PAQUETES_DB = [
        { id: 1, nombre: "Valle de Antón Aventura", precio: 120.00 },
        { id: 2, nombre: "Escapada a Santa Clara", precio: 95.50 },
        { id: 3, nombre: "Historia y Cultura Natá", precio: 75.00 }
    ];

    // ----------------------------------------------------
    // 2. VARIABLES Y REFERENCIAS GLOBALES
    // ----------------------------------------------------
    // El carrito se almacena en el navegador para persistencia entre páginas.
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    
    const ITBMS_RATE = 0.07; // 7% de Impuesto

    // Referencias DOM (pueden ser null si estamos en otra página que no tiene el elemento)
    const carritoItemsTBody = document.getElementById('carrito-items');
    const subtotalSpan = document.getElementById('subtotal');
    const impuestosSpan = document.getElementById('impuestos');
    const totalFinalSpan = document.getElementById('total-final');
    const checkoutBtn = document.getElementById('checkout-btn');
    const clearCartBtn = document.getElementById('clear-cart-btn');

    // ----------------------------------------------------
    // 3. FUNCIONES DE LÓGICA DEL CARRITO
    // ----------------------------------------------------

    /** Agrega un paquete al carrito o incrementa la cantidad si ya existe */
    window.addItemToCart = function(id, nombre, precio) {
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            // Asegúrate de que el precio sea numérico
            const parsedPrice = parseFloat(precio); 
            if (isNaN(parsedPrice)) {
                console.error("Precio inválido:", precio);
                return;
            }
            cart.push({
                id: id,
                nombre: nombre,
                precio: parsedPrice,
                quantity: 1
            });
        }
        
        saveCart();
        // Solo renderiza el carrito si el elemento existe en la página actual
        if (carritoItemsTBody) {
            renderCarrito();
        }
        alert(`¡"${nombre}" agregado al carrito! Cantidad actual: ${cart.find(item => item.id === id).quantity}`);
    }
    
    /** Incrementa o decrementa la cantidad de un ítem */
    function changeQuantity(id, action) {
        const item = cart.find(item => item.id === id);
        if (item) {
            if (action === 'increment') {
                item.quantity += 1;
            } else if (action === 'decrement' && item.quantity > 1) {
                item.quantity -= 1;
            } else if (action === 'decrement' && item.quantity === 1) {
                // Eliminar si la cantidad llega a cero
                removeItemFromCart(id);
                return; 
            }
            saveCart();
            renderCarrito();
        }
    }

    /** Elimina completamente un paquete del carrito */
    function removeItemFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        renderCarrito();
    }
    
    /** Vacía completamente el carrito */
    function clearCart() {
        if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
            cart = [];
            saveCart();
            renderCarrito();
        }
    }

    /** Simula la finalización de la compra */
    function finalizePurchase() {
        const finalAmount = totalFinalSpan.textContent;
        alert(`¡Procesando compra!\nTotal: ${finalAmount}\n\nGracias por elegir Coclé Tour. Redirigiendo a pasarela de pago... (simulación)`);
        
        // Simular redirección y vaciado
        cart = [];
        saveCart();
        renderCarrito();
        // Opcional: Redirigir a 'gracias.html'
    }

    /** Guarda el estado del carrito en LocalStorage */
    function saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    // ----------------------------------------------------
    // 4. FUNCIONES DE RENDERIZADO Y CÁLCULO
    // ----------------------------------------------------

    /** Dibuja los ítems del carrito y el resumen de totales (solo si está en carrito.html) */
    function renderCarrito() {
        if (!carritoItemsTBody) return; // Salir si no estamos en la página del carrito

        if (cart.length === 0) {
            carritoItemsTBody.innerHTML = `
                <tr id="carrito-vacio-msg">
                    <td colspan="5" style="text-align: center; color: #6c757d; font-style: italic; padding: 20px;">
                        El carrito está vacío. <a href="paquete.html">¡Agrega un paquete!</a>
                    </td>
                </tr>
            `;
            checkoutBtn.disabled = true;
            clearCartBtn.disabled = true;
        } else {
            carritoItemsTBody.innerHTML = cart.map(item => `
                <tr class="carrito-item" data-id="${item.id}">
                    <td>${item.nombre}</td>
                    <td>B/. ${item.precio.toFixed(2)}</td>
                    <td>
                        <div class="cantidad-control">
                            <button class="btn-quantity btn-xs" data-id="${item.id}" data-action="decrement">-</button>
                            <span class="item-quantity">${item.quantity}</span>
                            <button class="btn-quantity btn-xs" data-id="${item.id}" data-action="increment">+</button>
                        </div>
                    </td>
                    <td class="carrito-item-total">
                        B/. ${(item.precio * item.quantity).toFixed(2)}
                    </td>
                    <td>
                        <button class="btn-delete-item" data-id="${item.id}"><i class="fas fa-times"></i></button>
                    </td>
                </tr>
            `).join('');

            checkoutBtn.disabled = false;
            clearCartBtn.disabled = false;
        }

        updateTotals();
        attachCartListeners();
    }

    /** Calcula el subtotal, impuestos y total final */
    function updateTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
        const impuestos = subtotal * ITBMS_RATE;
        const totalFinal = subtotal + impuestos;

        // Si los spans existen (solo en carrito.html), actualizarlos
        if (subtotalSpan && impuestosSpan && totalFinalSpan) {
            subtotalSpan.textContent = subtotal.toFixed(2);
            impuestosSpan.textContent = impuestos.toFixed(2);
            totalFinalSpan.textContent = totalFinal.toFixed(2);
        }
    }

    // ----------------------------------------------------
    // 5. ATTACH LISTENERS GLOBALES
    // ----------------------------------------------------

    /** Asigna listeners a los botones dentro del carrito (llamada después de cada renderizado) */
    function attachCartListeners() {
        // Listeners para los botones de cantidad (+/-)
        document.querySelectorAll('.btn-quantity').forEach(button => {
            button.onclick = (e) => {
                const id = Number(e.currentTarget.dataset.id);
                const action = e.currentTarget.dataset.action;
                changeQuantity(id, action);
            };
        });

        // Listeners para los botones de eliminar (X)
        document.querySelectorAll('.btn-delete-item').forEach(button => {
            button.onclick = (e) => {
                const id = Number(e.currentTarget.dataset.id);
                removeItemFromCart(id);
            };
        });
        
        // Listeners para los botones de acción principal (solo en carrito.html)
        if (checkoutBtn) checkoutBtn.onclick = finalizePurchase;
        if (clearCartBtn) clearCartBtn.onclick = clearCart;
    }
    
    /** Inicializa los listeners en la página de paquetes (paquete.html) */
    function attachPaquetesListeners() {
        document.querySelectorAll('.paquete-card .btn-comprar').forEach(button => {
            button.onclick = (e) => {
                const card = e.currentTarget.closest('.paquete-card');
                const id = Number(card.dataset.id);
                const nombre = card.dataset.nombre;
                const precio = card.dataset.precio;
                
                addItemToCart(id, nombre, precio);
            };
        });
    }

    // ----------------------------------------------------
    // 6. INICIALIZACIÓN
    // ----------------------------------------------------
    // Comprobar si estamos en la página de paquetes para adjuntar listeners de compra
    if (document.querySelector('.paquetes-grid')) {
        attachPaquetesListeners();
    }

    // Comprobar si estamos en la página del carrito para renderizar la tabla
    if (carritoItemsTBody) {
        renderCarrito();
    }
    
    // Si no estamos en el carrito, al menos asegurar que los totales están actualizados 
    // (aunque no se muestren, la lógica debe correr)
    updateTotals();
});