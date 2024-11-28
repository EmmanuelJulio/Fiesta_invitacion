const hoja = "Fiesta RSVP";
let invitado;




async function getTurnos() {
    let response;
    try { 
        response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1ZzchaMcbmaHDNkjwT5JmJLuQUX7eUTmb4FiA6bewZjg',
            range: 'asistencias!A:H',
        });
    } catch (err) {
        console.log(err);
        return;
    }

    const range = response.result;
    if (!range || !range.values || range.values.length == 0) {
        console.warn("No se encontraron registros");
        return;
    }

    const confirmadosContainer = document.getElementById("confirmados");
    const comentariosContainer = document.getElementById("comentarios");

    confirmadosContainer.innerHTML = ""; 
    comentariosContainer.innerHTML = ""; 

    range.values.forEach((fila) => {
        console.log(fila);
        if (isNaN(parseInt(fila[0])) || fila[4] !== "Sí") return;

        const confirmacionInvitado = {
            id: fila[0],
            Nombre: fila[1],
            Telefono: fila[2],
            Horario: fila[3],
            Asiste: fila[4],
            preferencia: fila[5],
            fecha: fila[6],
            comments: fila[7] ? fila[7].trim() : "Sin comentarios"
        };

        // Añadir asistentes confirmados
        const nombreElemento = document.createElement("div");
        nombreElemento.textContent = `✅ ${confirmacionInvitado.Nombre}`;
        nombreElemento.classList.add("nombre-confirmado");
        confirmadosContainer.appendChild(nombreElemento);
        

        const comentarioElemento = document.createElement("div");
        comentarioElemento.textContent = `💬 ${confirmacionInvitado.Nombre}: ${confirmacionInvitado.comments}`;
        comentarioElemento.classList.add("comentario-confirmado");
        document.getElementById("comentarios2").appendChild(comentarioElemento);
        
    });
}

document.getElementById("rsvpForm").addEventListener("submit", async (event) => {
    event.preventDefault(); 
    const data = {
        nombre: document.getElementById("nombre").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        horario: document.getElementById("horario").value,
        asistencia: document.getElementById("asistencia").value,
        preferencia: document.getElementById("preferencia").value.trim(),
        comentarios: document.getElementById("comentarios").value.trim(),
    };


    await enviarDatosAGoogleSheets(data);
});

async function insertarDesdeFormulario() {

    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    const horario = document.getElementById("horario").value;
    const asistencia = document.getElementById("asistencia").value;
    const preferencia = document.getElementById("preferencia").value || "Sin preferencia"; 
    const comentarios = document.getElementById("comentarios").value || "Sin comentarios"; 

    const filaNueva = [
        new Date().getTime(), 
        nombre,
        telefono,
        horario,
        asistencia,
        preferencia,
        new Date().toISOString(), 
        comentarios,
    ];

    try {
        // Insertamos los datos en Google Sheets
        const response = await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: '1ZzchaMcbmaHDNkjwT5JmJLuQUX7eUTmb4FiA6bewZjg', 
            range: 'asistencias!A:H', 
            valueInputOption: "USER_ENTERED",
            insertDataOption: "INSERT_ROWS",
            resource: {
                values: [filaNueva],
            },
        });

        console.log("Datos insertados correctamente:", response);
        document.getElementById("status").textContent = "¡Tu asistencia ha sido registrada!";
        document.getElementById("rsvpForm").reset();
    } catch (error) {
        console.error("Error al insertar los datos:", error);
        document.getElementById("status").textContent = "Hubo un error al registrar tu asistencia. Intenta nuevamente.";
    }
}

