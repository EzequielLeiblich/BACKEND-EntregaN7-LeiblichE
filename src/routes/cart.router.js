import { Router } from "express";
import CartManager from "../daos/mongodb/CartManager.class.js";

let cartManager = new CartManager()

const router = Router();

router.get('/', async (req, res) => {
  let carts = await cartManager.getCart()
  res.send(carts)
})

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const cart = await cartManager.getCartById(id);
  res.send(cart);
});

router.get('/:cid', async (req, res) => {
  let id = req.params.cid
  let cart = await cartManager.getCartById(id)
  res.send(cart.products)
})

router.post('/', async (req, res) => {
  await cartManager.createCart()
  res.send({status: "success"})
})

router.post('/:cid/product/:pid/quantity/:q', async (req, res) => {
  console.log(req.params.cid, req.params.pid, req.params.q);
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.params.q;
  await cartManager.addToCart(cartId, productId, quantity)
  res.send({status: "success"})
})

router.delete('/:cid/products/:pid', async (req, res) => {
  let cartId = req.params.cid
  let productId = req.params.pid
  await cartManager.deleteProductFromCart(cartId, productId)
  res.send({status: "success"})
})

router.delete('/:cid', async (req, res) => {
  let cartId = req.params.cid
  await cartManager.deleteAllProductsFromCart(cartId)
  res.send({status: "success"})
})

router.put('/:cid', async (req, res) => {
  let cartId = req.params.cid
  let data = req.body
  await cartManager.updateCartProducts(cartId, data)
  res.send({status: "success"})
})

router.put('/:cid/products/:pid/quantity/:q', async (req, res) => {
  let cartId = req.params.cid
  let productId = req.params.pid
  let quantity = req.body.q
  await cartManager.updateCartQuantity(cartId, productId, quantity)
  res.send({status: "success"})
})

export default router