const form = document.getElementById("restartPasswordForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));
    fetch("/api/sessions/restartPassword", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((result) => result.json())
        .then((json) => {
            console.log(json);
            if (json.status === "success") {
                Swal.fire({
                    position: "Center",
                    icon: "success",
                    title: "Contraseña",
                    text: `${json.message}`,
                    showConfirmButton: false,
                    timer: 2000,
                });
                window.location.replace("/");
            } else {
                Swal.fire({
                    position: "Center",
                    icon: "error",
                    title: "Error al cambiar la contraseña",
                    text: `${json.message}`,
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        });
});
