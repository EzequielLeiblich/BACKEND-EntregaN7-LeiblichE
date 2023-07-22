import fs from 'fs'
import { v4 as uuidV4 } from 'uuid';

import Product from "./Product.class.js"

export default class ProductManager {
  constructor(path){
    this.path = path;
  }

  async #loadProductsFromPath() {
    let products = []

    if (fs.existsSync(this.path)) {

      let data = await fs.promises.readFile(this.path, "utf-8");
      products = JSON.parse(data)

      products = products.map((product) => this.#rebuildProduct(product)) // Se reconstruyen los productos como instancia de la clase Product
    }

    return products
  }

  #rebuildProduct({title, description, price, thumbnails, code, stock, category, status, id}) {
    let product = new Product(title, description, price, thumbnails, code, stock, category, status)
    product.id = id

    return product
  }

  async addProduct({title, description, price, thumbnails = null, code, stock, category, status}) {
    let products = await this.#loadProductsFromPath();

    // Verificamos si se puede agregar el producto

    let hayCampoVacio = [title, description, price, code, stock, category, status].some(campo => campo === null || campo === "" || campo === undefined)

    if (hayCampoVacio) {
      console.log("Falta agregar un campo")
      return
    }

    if (products.some( product => code === product.code )) {
      console.log("Ya existe un producto con ese código")
      return
    }

    // Se agrega el producto

    let newProduct = new Product(title, description, price, thumbnails, code, stock, category, status);

    newProduct.id = uuidV4()

    products.push(newProduct)

    // Se reescriben los productos en el archivo (con el nuevo producto)

    await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
  }

  async getProducts(limit = null) {
    let products = await this.#loadProductsFromPath()

    if (!limit) {
      return products
    }

    return products.slice(0, limit)
  }

  async getProductById(id) {
    let products = await this.#loadProductsFromPath()
    let productFound = products.find(product => product.id === id)

    if (!productFound) {
      console.log("Not found")
      return
    }

    return productFound
  }

  async updateProduct(id, updatedProduct) {
    let products = await this.#loadProductsFromPath();

    if (products.some( product => product.code === updatedProduct.code )) {
      console.log("No se puede actualizar el producto. Pues ya existe un producto con ese código")
      return
    }

    products = products.map((product) => {
      if (product.id === id) {
        return {...product, ...updatedProduct}
      }
      return product
    })

    // Se reescriben los productos en el archivo (con el producto actualizado)

    await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
  }

  async deleteProduct(id) {
    let productFound = await this.getProductById(id)
    
    if (!productFound) {
      console.log("Product couldn't be erased because it wasn't found")
      return
    }

    let products = await this.#loadProductsFromPath()
    products = products.filter((product) => product.id != id)

    await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
  }
}