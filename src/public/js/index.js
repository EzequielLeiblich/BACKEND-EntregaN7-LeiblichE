const socket = io();

const table = document.getElementById("table");

function createChild(product) {
    const html = `
                <td>${product.title}</td>
                <td>${product.descripcion}</td>
                <td>$${product.price}</td>
                <td><img style="width:50px;height:80px;" src="${product.thumbnail}"></img></td>
                <td>${product.stock} unidades</td>
            `;

    // Actualizar el HTML de la página
    const newElement = document.createElement("tr");
    newElement.id = product._id;

    newElement.innerHTML = html;
    table.appendChild(newElement);
}

function deleteChild(productId) {
    const child = document.getElementById(productId);

    if (!child) {
        return;
    }

    table.removeChild(child);
}

function updateProducts(products) {
    const table = document.getElementById("table");
    table.innerHTML = "";

    Array.from(products).forEach((product) => createChild(product));
}

socket.on("connect", () => {
    console.log("Conectado al servidor de socket.io");
});

socket.on("newProduct", (product) => {
    createChild(product);
});

socket.on("deleteProduct", (productId) => {
    deleteChild(productId);
});

socket.on("initProduct", (products) => {
    updateProducts(products);
});

socket.on("updateProduct", (product) => {
    deleteChild(product._id);
    createChild(product);
});

socket.on("disconnect", () => {
    console.log("Desconectado del servidor de socket.io");
});
