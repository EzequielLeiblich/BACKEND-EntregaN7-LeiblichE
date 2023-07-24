// En esta línea, se está seleccionando el elemento del DOM que tiene el ID 'registerForm' y asignándolo a la constante form. Este elemento probablemente es un formulario HTML.

const form = document.getElementById('registerForm');

//Se agrega un evento submit al formulario (form). El evento se activará cuando el formulario se envíe (cuando se presione el botón de enviar). La función que se define a continuación se ejecutará cuando ocurra ese evento. La función se define como una función asíncrona usando la palabra clave async.

form.addEventListener('submit', async (e) => {

    // Dentro de la función del evento, se utiliza e.preventDefault() para prevenir el comportamiento predeterminado del envío del formulario. Esto evita que el formulario se envíe de manera convencional (es decir, evita que la página se recargue al enviar el formulario). 

    e.preventDefault();

    // Se crea una nueva instancia de FormData a partir del formulario (form). FormData es un objeto que contiene pares clave/valor correspondientes a los campos y valores del formulario.

    const data = new FormData(form);

    // Aquí se crea un objeto vacío obj. Luego, se utiliza el método forEach de FormData para recorrer cada elemento en data (que contiene los datos del formulario). Para cada par clave/valor, se asigna el valor al objeto obj usando la clave correspondiente del formulario.

    const obj = {};
    data.forEach((value, key) => (obj[key] = value));
    
    // El código entra en un bloque try, que se utiliza para capturar cualquier excepción (error) que ocurra durante la ejecución del código dentro de este bloque.

    try {

        // En esta línea, se hace una solicitud HTTP utilizando la función fetch(). Se envía una solicitud POST a la ruta '/api/sessions/register' en el servidor. El cuerpo de la solicitud contiene los datos del formulario convertidos a una cadena JSON usando JSON.stringify(obj). Además, se establece el encabezado 'Content-Type' como 'application/json', lo que indica que los datos se envían en formato JSON.

        const response = await fetch('/api/sessions/register', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Aquí se espera a que la solicitud termine y se obtiene la respuesta (response) de la solicitud. Luego, se convierte el contenido de la respuesta en un objeto JavaScript utilizando el método json() de la respuesta. La función se declara con la palabra clave await para esperar a que la operación se complete antes de continuar.

        const json = await response.json();

        // En esta sección, se verifica si la respuesta de la solicitud fue exitosa (código de estado en el rango 200-299). Si es así, se muestra un mensaje en la consola, se restablece el formulario y se redirecciona al usuario a la página '/login'.

        if (response.ok) {
            console.log('Usuario creado con éxito.');
            form.reset();
            window.location.href = '/login';
        } 

        // Si la respuesta no fue exitosa (código de estado fuera del rango 200-299), se muestra un mensaje de error utilizando la biblioteca Swal.fire() (SweetAlert). Si la respuesta contiene un campo error en formato JSON, se muestra ese mensaje; de lo contrario, se muestra un mensaje genérico.
        
        else {
            Swal.fire({
                icon: 'error',
                title: 'Error de registro',
                text: json.message || 'Error en el registro. Inténtalo de nuevo.',
            });
        }
    } 
    
    // Finalmente, en el bloque catch, cualquier error que ocurra durante la ejecución del bloque try se captura y se muestra en la consola.

    catch (error) {
        console.log('Error en la solicitud:', error);
    }
});