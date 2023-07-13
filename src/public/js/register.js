const form = document.getElementById('registerForm');

form.addEventListener('submit', e => {
    e.preventDefault();

    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);

    console.log(obj)

    fetch('/api/sessions/register',{
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
      if (result.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'El usuario fue creado',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
      else {
        Swal.fire({
          icon: 'error',
          title: `El usuario no pudo ser creado`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
  })
})