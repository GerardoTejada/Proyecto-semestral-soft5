document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificar Autenticación. Si falla, redirige a login.html
    if (localStorage.getItem('userRole') !== 'admin' || localStorage.getItem('isAuthenticated') !== 'true') {
        window.location.href = 'login.html'; 
        return; // Detiene la ejecución del resto del script
    }

    // --- Referencias del DOM ---
    const logoutBtn = document.getElementById('logoutBtn');
    const addPackageBtn = document.getElementById('addPackageBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const formSection = document.getElementById('packageFormSection');
    const packageForm = document.getElementById('packageForm');
    const formTitle = document.getElementById('formTitle');
    const tableBody = document.getElementById('packageTableBody');

    // --- Configuración Inicial de Paquetes ---
    const INITIAL_PACKAGES = [
        { id: 1, nombre: "Valle de Antón Aventura", precio: 120.00, descripcion: "Hospedaje 2 días/1 noche, ruta senderismo, visita a la Piedra Pintada.", imagen: "Recurso/valle.jpg" },
        { id: 2, nombre: "Escapada a Santa Clara", precio: 95.50, descripcion: "Día de playa con sombrilla y sillas, almuerzo con mariscos, transporte.", imagen: "Recurso/playa-santa-clara.jpg" },
        { id: 3, nombre: "Historia y Cultura Natá", precio: 75.00, descripcion: "Tour guiado por la iglesia, visita a monumentos históricos, refrigerio.", imagen: "Recurso/nata inglesia.jpg" }
    ];

    // Cargar paquetes desde localStorage
    let packages = JSON.parse(localStorage.getItem('coclePackages')) || INITIAL_PACKAGES;

    function savePackages() {
        localStorage.setItem('coclePackages', JSON.stringify(packages));
    }

    // --- Funciones de Renderizado ---
    function renderPackages() {
        tableBody.innerHTML = '';
        packages.forEach(pkg => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td>${pkg.id}</td>
                <td>${pkg.nombre}</td>
                <td>B/. ${pkg.precio.toFixed(2)}</td>
                <td>${pkg.imagen}</td>
                <td>
                    <button class="btn-edit" data-id="${pkg.id}"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn-delete" data-id="${pkg.id}"><i class="fas fa-trash"></i> Eliminar</button>
                </td>
            `;
        });
        
        // Asignar listeners a botones dinámicos
        document.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', (e) => editPackage(Number(e.currentTarget.dataset.id)));
        });
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', (e) => deletePackage(Number(e.currentTarget.dataset.id)));
        });
    }

    // --- Operaciones CRUD ---

    function addOrUpdatePackage(e) {
        e.preventDefault();
        
        const id = document.getElementById('packageId').value;
        const nombre = document.getElementById('nombre').value;
        const precio = Number(document.getElementById('precio').value);
        const descripcion = document.getElementById('descripcion').value;
        const imagen = document.getElementById('imagen').value;

        if (id) {
            // EDITAR
            const index = packages.findIndex(p => p.id === Number(id));
            if (index !== -1) {
                packages[index] = { id: Number(id), nombre, precio, descripcion, imagen };
            }
        } else {
            // AGREGAR
            // Generar nuevo ID, asegurando que sea el máximo + 1 o 1 si la lista está vacía
            const newId = packages.length > 0 ? Math.max(...packages.map(p => p.id)) + 1 : 1;
            packages.push({ id: newId, nombre, precio, descripcion, imagen });
        }

        savePackages();
        renderPackages();
        packageForm.reset();
        formSection.style.display = 'none';
        addPackageBtn.style.display = 'block';
    }

    function editPackage(id) {
        const pkg = packages.find(p => p.id === id);
        if (pkg) {
            document.getElementById('packageId').value = pkg.id;
            document.getElementById('nombre').value = pkg.nombre;
            document.getElementById('precio').value = pkg.precio;
            document.getElementById('descripcion').value = pkg.descripcion;
            document.getElementById('imagen').value = pkg.imagen;
            
            formTitle.textContent = 'Editar';
            formSection.style.display = 'block';
            addPackageBtn.style.display = 'none';
        }
    }

    function deletePackage(id) {
        if (confirm(`¿Estás seguro de que deseas eliminar el paquete ID ${id}?`)) {
            packages = packages.filter(p => p.id !== id);
            savePackages();
            renderPackages();
        }
    }
    
    // --- Listeners de Eventos ---

    // Cierre de sesión (llama a la función en auth.js)
    logoutBtn.addEventListener('click', () => {
        // Mejorar: Intentar llamar window.logout (definido en auth.js)
        if (typeof window.logout === 'function') {
            window.logout();
        } else {
            // En caso de que auth.js no se cargue correctamente
            console.error('La función window.logout no está definida. Limpiando sesión localmente.');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userRole');
            window.location.href = 'inicio.html';
        }
    });

    // Mostrar formulario para agregar
    addPackageBtn.addEventListener('click', () => {
        packageForm.reset();
        document.getElementById('packageId').value = '';
        formTitle.textContent = 'Agregar';
        formSection.style.display = 'block';
        addPackageBtn.style.display = 'none';
    });
    
    // Ocultar formulario
    cancelBtn.addEventListener('click', () => {
        formSection.style.display = 'none';
        addPackageBtn.style.display = 'block';
    });

    // Manejar envío/guardado del formulario
    packageForm.addEventListener('submit', addOrUpdatePackage);

    // --- Inicialización ---
    renderPackages();
});