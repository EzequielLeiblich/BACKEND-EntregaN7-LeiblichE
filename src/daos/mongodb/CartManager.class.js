import mongoose from "mongoose";
import { cartsModel } from "./models/carts.model.js";
import ProductManager from "./ProductManager.class.js";

export default class CartManager {
  // connection = mongoose.connect('mongodb+srv://ezequielleiblich:1Q2w3e4r@leibliche.nmve4kb.mongodb.net/?retryWrites=true&w=majority')
  productManager = new ProductManager()

  async createCart() {
    const result = await cartsModel.create({ products: [] })
    return result
  }

  async getCartById(id) {
    const result = await cartsModel.findOne({ _id: id }).populate('products.product')
    return result
  }

  async getCarts() {
    const result = await cartsModel.find({}).populate('products.product')
    return result
  }

  async addProductToCart(cid, pid) {
    try {
      const cart = await this.getCartById(cid)

      let product = cart.products.find((prod) => prod.product._id.toString() === pid )

      if (!product) {
        let newProduct = await this.productManager.getProductById(pid)

        cart.products.push({ product: newProduct, quantity: 1 })
      }
      else {
        product.quantity += 1
      }
      
      await cart.save()

      return
    } 
    catch(error) {
      throw new Error("El producto no existe")
    }
  }

  async deleteProductFromCart(cid, pid) {
    try {
      const cart = await this.getCartById(cid)
      cart.products = cart.products.filter((prod) => prod.product._id.toString() !== pid )
      await cart.save()

      return
    } 
    catch(error) {
      throw new Error("El producto no existe")
    }
  }

  async deleteAllProductsFromCart(cid) {
    const cart = await this.getCartById(cid)
    cart.products = []
    await cart.save()

    return
  }

  async replaceProductsFromCart(cid, newProducts) {
    const cart = await this.getCartById(cid)
    cart.products = newProducts
    await cart.save()

    return
  }

  async updateProductQuantityFromCart(cid, pid, newQuantity) {
    const cart = await this.getCartById(cid)
    let product = cart.products.find((prod) => prod.product._id.toString() === pid )
    product.quantity = newQuantity

    await cart.save()

    return
  }

  async getAllProductsFromCart(id) {
    const cart = await cartsModel.findOne({ _id: id }).populate('products.product').lean()

    return cart.products
  }

}