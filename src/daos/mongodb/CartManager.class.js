import mongoose from "mongoose";
import { cartsModel } from "./models/carts.model.js";
import ProductManager from "./ProductManager.class.js";

export default class CartManager {
  connection = mongoose.connect('mongodb+srv://ezequielleiblich:1Q2w3e4r@leibliche.nmve4kb.mongodb.net/?retryWrites=true&w=majority')
  productManager = new ProductManager()

  async addCart() {
    let cart = {
      product: [],
    };
    console.log(cart);
    let result = await cartsModel.create(cart);
    console.log(result);
    return result;
  }

  async getCart() {
    let result = await cartsModel.find();
    console.log(result);
    return result;
  }

  async getCarts() {
    const result = await cartsModel.find({}).populate('products.product')
    return result
  }

  async getCartById(id) {
    let result = await cartsModel
      .findOne({ _id: id })
      .populate("products.product");
    console.log(result);
    return result;
  }

  async addToCart(cid, pid, q) {
    let product = await this.productManager.getProductById(pid);
    let cart = await this.getCartById(cid);
    cart.products.push({ product: product, quantity: q });
    await cart.save();
    return;
}

  async deleteProductFromCart(cid, pid) {
    const cart = await this.getCartById(cid);
    cart.products.pull(pid);
    await cart.save();
    return;
}

  async deleteAllProductsFromCart(cid) {
    const cart = await this.getCartById(cid)
    cart.products = []
    await cart.save()
    return
  }

  async updateCartQuantity(cid, pid, q) {
        let cart = await this.getCartById(cid);
        let productos = cart.products;
        let este = productos.find(
            (prod) => prod.product.valueOf() === pid
        );
        este.quantity = q;
        await cart.save();
        return;
    }

    async updateCartProducts(cid, data) {
      await this.deleteAllProductsFromCart(cid);
      let cart = await this.getCartById(cid);
      data.data.forEach((e) => {
          cart.products.push(e);
      });
      await cart.save();
      return;
  }

}