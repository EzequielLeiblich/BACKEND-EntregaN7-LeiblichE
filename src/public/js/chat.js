
// Iniciar Socket:
const socket = io();

// Capturas del DOM:
const chatTable = document.getElementById('chat-table');
const btnEnviar = document.getElementById('btnEnv');

// Escucha el evento "messages" enviado por el servidor
socket.on("messages", (data) => {
    let htmlMessages = "";

    // Recorremos los mensajes y los mostramos en el HTML
    htmlMessages += `
        <thead>
        <tr>
            <th>Usuario</th>
            <th>Mensaje</th>
            <th>Eliminar</th>
        </tr>
        </thead>`;

    data.forEach((message) => {
        htmlMessages += `
        <tbody>
        <tr>
            <td>${message.user}</td>
            <td>${message.message}</td>
            <td><button type="submit" id=${message.id} class="btnDeleteSMS boton">Eliminar</button></td>
        </tr>
        </tbody>`;
    });

    // Insertamos los mensajes en el HTML
    chatTable.innerHTML = htmlMessages;

    // Agregar evento click al botón de eliminar
    const deleteButtonsSMS = document.getElementsByClassName('btnDeleteSMS');

    for (let button of deleteButtonsSMS) {
        button.addEventListener("click", () => {
        socket.emit("deleteMessage", button.getAttribute("id"));
        });
    }
    });

    // Enviar Mensaje:

    btnEnviar.addEventListener("click", (e) => {
    e.preventDefault();

    // Obtenemos los valores de los inputs:
    const user = document.getElementById("usuario").value;
    const messageText = document.getElementById("message").value;

    // Validamos que los campos estén completados:
    if (user === "" || messageText === "") {
        alert("Todos los campos son obligatorios");
    } else {
        // Creamos el mensaje:
        const message = {
        user,
        messageText,
        };

        // Enviar el evento "enviarMensaje" al servidor con los datos del mensaje
        socket.emit("addMessage", message);

        // Reseteamos los inputs:
        document.getElementById("usuario").value = "";
        document.getElementById("message").value = "";
    }
});
