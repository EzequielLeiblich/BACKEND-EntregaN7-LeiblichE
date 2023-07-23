const form = document.getElementById("registerForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));
    fetch("/api/sessions/register", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((result) => result.json())
        .then((json) => {
            console.log(json.status);
            if (json.status === "success") {
                Swal.fire({
                    position: "Center",
                    icon: "success",
                    title: "Bienvanido",
                    text: `${json.message}`,
                    showConfirmButton: false,
                    timer: 2000,
                });
                window.location.replace("/");
            } else {
                Swal.fire({
                    position: "Center",
                    icon: "error",
                    title: "Error al registrar el usuario",
                    text: `${json.message}`,
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        });
});
