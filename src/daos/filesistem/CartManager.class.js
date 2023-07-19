import fs from 'fs'
import { v4 as uuidV4 } from 'uuid';

export default class CartManager {
  constructor(path){
    this.path = path;
  }

  async #loadCartsFromPath() {
    let carts = []

    if (fs.existsSync(this.path)) {

      let data = await fs.promises.readFile(this.path, "utf-8");
      carts = JSON.parse(data)
    }

    return carts
  }

  async createCart() {
    let carts = await this.#loadCartsFromPath()

    carts.push({id: uuidV4(), products: []})

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'))
  }

  async getCartById(id) {
    let carts = await this.#loadCartsFromPath()

    return carts.find((cart) => cart.id === id)
  }

  async addProductToCart(cid, pid) {
    // cid es el id del carrito, pid es el id del producto
    let carts = await this.#loadCartsFromPath()

    let cart = carts.find((cart) => cart.id === cid) // Es el carrito al que le voy a agregar el producto

    let product = cart.products.find((prod) => prod.product === pid ) // Es el producto, si existe

    if (!product) {
      product = {product: pid, quantity: 1}

      cart.products.push(product)
    }
    else {
      product.quantity += 1 // Como el producto ya existe, solo incremento su cantidad en 1
    }

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'))
  }

}