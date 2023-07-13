const socket = io();

let sendMsgBtn = document.getElementById("send-message-btn")
let messageInput = document.getElementById("message-input")

let user = ""

// Identificacion de usuario

Swal.fire({
    title: "E-mail",
    input: "email",
    inputValidator: (value) => {
        if (!value) {
        return "Escribir un email para identificarte"
        }
        return false
    },
    allowOutsideClick: false,
    }).then((result) => {
    user = result.value;
});

// Socket.on

socket.on("update-messages", (messages) => {
    let chatContainer = document.getElementById("chat-container")
    chatContainer.innerHTML = ""

    for (message of messages) {
        let messageElement = document.createElement("p")
        messageElement.innerHTML = `${message.user}: ${message.message}`

        chatContainer.appendChild(messageElement)
    }
})

// Event listeners

messageInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        sendMsgBtn.click();
    }
})

sendMsgBtn.addEventListener('click', () => {
    socket.emit("new-message", {user: user, message: messageInput.value})
    messageInput.value = ""
})