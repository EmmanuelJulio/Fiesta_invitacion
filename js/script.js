const form = document.getElementById('rsvpForm');
const statusText = document.getElementById('status');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    statusText.textContent = "Enviando...";
    const data = {
        nombre: document.getElementById('nombre').value,
        telefono: document.getElementById('telefono').value,
        horario: document.getElementById('horario').value,
        asistencia: document.getElementById('asistencia').value,
        preferencia: document.getElementById('preferencia').value,
        comentarios: document.getElementById('comentarios').value
    };
    try {
        const response = await fetch('https://script.google.com/macros/s/1SYlpD7y7MHtJl7NqUMjprj3qeAs5zv2I7no0T-ZxetynXOSb9DEWaA98/exec', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.status === 'success') {
            statusText.textContent = "¡Gracias por confirmar tu asistencia!";
            form.reset();
        } else {
            statusText.textContent = "Ocurrió un error. Por favor, intenta nuevamente.";
        }
    } catch (error) {
        console.error(error);
        statusText.textContent = "No se pudo enviar la información. Revisa tu conexión.";
    }
});
