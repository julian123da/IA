const API_BASE = 'http://127.0.0.1:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    fetchInventory();
    setupLoanForm();
    setupUserForm(); // Nueva función
});

// 1. Obtener Inventario
async function fetchInventory() {
    const indicator = document.getElementById('api-indicator');
    try {
        const response = await fetch(`${API_BASE}/equipos`);
        if (!response.ok) throw new Error();
        const equipos = await response.json();
        renderTable(equipos);
        updateStats(equipos);
        indicator.innerHTML = '<span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span> SERVIDOR CONECTADO';
    } catch (error) {
        indicator.innerHTML = '<span class="w-2 h-2 bg-red-500 rounded-full mr-2"></span> ERROR DE CONEXIÓN';
        showToast("Error al conectar con la API", "error");
    }
}

// 2. Nueva Función: Registro de Usuarios
function setupUserForm() {
    const userForm = document.getElementById('form-usuario');
    if (!userForm) return;

    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            id: document.getElementById('reg-id').value,
            name: document.getElementById('reg-name').value,
            role: document.getElementById('reg-role').value
        };

        try {
            const res = await fetch(`${API_BASE}/usuarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            
            if (data.success) {
                showToast("Usuario registrado con éxito", "success");
                userForm.reset();
            } else {
                showToast(data.message, "error");
            }
        } catch (error) {
            showToast("Error en el registro de usuario", "error");
        }
    });
}

// 3. Registrar Préstamo
function setupLoanForm() {
    document.getElementById('form-prestamo').addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            user_id: document.getElementById('input-camper').value,
            equipo_id: parseInt(document.getElementById('input-equipo').value)
        };

        try {
            const res = await fetch(`${API_BASE}/prestamos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                showToast(data.message, "success");
                fetchInventory();
                e.target.reset();
            } else {
                showToast(data.message, "error");
            }
        } catch (error) {
            showToast("Error al procesar préstamo", "error");
        }
    });
}

// Resto de funciones (renderTable, returnEquipment, etc.) se mantienen igual
// ... [Mantenemos la lógica de UI del archivo original]