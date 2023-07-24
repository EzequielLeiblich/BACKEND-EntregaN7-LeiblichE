// Iniciar Socket:
const socket = io();

// Hacemos una solicitud a la ruta '/api/user' para obtener los datos del usuario
fetch('/api/user')

  .then((response) => response.json())
  .then((data) => {
    // Aquí recibimos los datos del usuario en la variable 'data'
    let user = data.user;
    // Ahora puedes mostrar el Sweet Alert de bienvenida con los datos del usuario

    Swal.fire({
      icon: 'success',
      title: '¡Bienvenido!',
      text: `Hola ${user.first_name}, has iniciado sesión con éxito.`,
    });
  })
  .catch((error) => {
    console.error('Error al obtener los datos del usuario:', error);
  });



// Capturamos la tabla de productos del DOM:
const tableProd = document.getElementById('tableProd');

function allProducts() {

  // Primera carga de todos los productos:

  console.log("Primera carga - General")

  socket.on("productos", (data) => {

    const products = data.products;

    let htmlProductos = "";

    htmlProductos += `
    <thead>
      <tr>
          <th>Modelo</th>
          <th>Descripción</th>
          <th>Categoria</th>
          <th>Img</th>
          <th>Stock</th>
          <th>Precio</th>
          <th>Cart</th>
      </tr>
    </thead>`;

    products.docs.forEach((product) => {
      htmlProductos += `
          <tr>
            <td id="${product.title}">${product.title}</td>
            <td class="description">${product.description}</td>
            <td class="category">${product.category}</td>
            <td><img src="${product.thumbnail}" alt="${product.title}" class="Img"></td>
            <td>${product.stock} Und.</td>
            <td>$${product.price}</td>
            <td><p class="boton" id="agr${product._id}">+ Cart</p></td>
          </tr>`;

    });

    tableProd.innerHTML = htmlProductos;

    // Obtengo el id de cada boton +Cart:

    products.docs.forEach((product) => {
      const botonAgregar = document.getElementById(`agr${product._id}`);
      const titleElement = document.getElementById(`${product.title}`);
      const title = titleElement.textContent;

      botonAgregar.addEventListener('click', () => {
        addToCart(product._id, title);
      });
    });

    function addToCart(productID, title) {

      fetch('/api/user')
        .then((response) => response.json())
        .then((data) => {
          // Aquí recibimos los datos del usuario en la variable 'data'
          let user = data.user;

          if (productID) {

            const cartID = user.cart;
            const productIDValue = productID;

            if (cartID && productIDValue) {

              socket.emit("agregarProductoEnCarrito", {
                cartID,
                productID: productIDValue
              });
              console.log(`clint-prodc: ${productID}`);
              console.log(`clint-cart: ${cartID}`);

              if (title) {
                console.log(title)

                Swal.fire({
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 5000,
                  title: `${title} se ha agregado a tu carrito`,
                  icon: 'success'
                })
              }

            }
          }
        });



    }

  });

}

allProducts()



// Busqueda filtrada: 

// Capturamos tabla de filtros e inputs:
const tableFil = document.getElementById('tableFil');
const limit = document.getElementById('limit');
const page = document.getElementById("page");
const sort = document.getElementById("sort");
const filtro = document.getElementById("filtro");
const filtroVal = document.getElementById("filtroVal");
const limpiarFiltros = document.getElementById("limpiarFiltros");

// Creamos la function filtrarProdcuts:
function filtrarProducts() {
  const busquedaProducts = {
    limit: limit.value || 10,
    page: page.value || 1,
    sort: sort.value || 1,
    filtro: filtro.value || null,
    filtroVal: filtroVal.value || null,
  }
  socket.emit('busquedaFiltrada', busquedaProducts);
  return busquedaProducts;
}

limit.addEventListener('input', () => {
  filtrarProducts();
});

page.addEventListener('input', () => {
  filtrarProducts();
});

sort.addEventListener('change', () => {
  filtrarProducts();
});

filtroVal.addEventListener('change', () => {
  filtrarProducts();
});



// Captura div de Pags:

const Pags = document.getElementById('Pags');

// Paginación:

socket.on('productos', (data) => {

  const currentPage = data.products.page;
  const hasNextPage = data.hasNextPage;

  let htmlPag = "";

  htmlPag +=

    `<h2 class="pag" id="Prev">Prev </h2>

    <h2 class="pag pagNumber" id="numberPag">${currentPage}</h2>

    <h2 class="pag" id="Next">Next</h2>`;

  Pags.innerHTML = htmlPag;

  const prevButton = document.getElementById('Prev');
  const nextButton = document.getElementById('Next');

  function cambiarPagina(currentPage, newPage, hasNextPage) {

    if (newPage === -1) {
      if (currentPage < 1) {
        currentPage = 1;
      } else {
        currentPage = currentPage - 1;
      }
    }

    if (newPage === 1) {
      if (hasNextPage === false) {
        currentPage;
      } else {
        currentPage = currentPage + 1;
      }
    }

    if (currentPage) {

      const busquedaProducts = {
        limit: limit.value || 10,
        page: Number(currentPage),
        sort: sort.value || 1,
        filtro: filtro.value || null,
        filtroVal: filtroVal.value || null,
      }

      socket.emit('busquedaFiltrada', busquedaProducts);

      const pageInput = document.getElementById('page');
      pageInput.value = currentPage.toString();
    }
  }

  prevButton.addEventListener('click', (e) => {
    e.preventDefault();
    cambiarPagina(currentPage, -1, hasNextPage);
  });

  nextButton.addEventListener('click', (e) => {
    e.preventDefault();
    cambiarPagina(currentPage, +1, hasNextPage);
  });

});