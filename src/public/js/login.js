const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));
    fetch("/api/sessions/login", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((result) => {
        console.log(result);
        if (result.status === 200) {
            Swal.fire({
                position: "Center",
                icon: "success",
                title: "Bienvanido",
                text: "Inicio de sesión correcto",
                showConfirmButton: false,
                timer: 1500,
            });
            console.log("se loguio loquito");
            window.location.replace("/home");
        } else {
            Swal.fire({
                position: "Center",
                icon: "error",
                title: "Error al iniciar sesión",
                text: "Usuario y contraseña incorrectos",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    });
});
