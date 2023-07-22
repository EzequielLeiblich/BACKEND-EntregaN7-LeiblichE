import CartManager from "./classes/CartManager.class.js";
import ProductManager from "./classes/ProductManager.class.js";
import __dirname from "./utils.js"



async function agregar_3_carritos_al_json() {
  let cartManager = new CartManager(__dirname + "/files/carts.json")

  await cartManager.createCart()

  await cartManager.createCart()

  await cartManager.createCart()
}

async function imprimir_productos(limit = null) {
  let productManager = new ProductManager(__dirname + "/files/products.json")

  console.log(await productManager.getProducts(limit))
}
