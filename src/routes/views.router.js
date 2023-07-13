import { Router } from 'express';
import __dirname from "../utils.js"
import express from 'express';

import ProductManager from '../daos/mongodb/ProductManager.class.js';
import CartManager from '../daos/mongodb/CartManager.class.js';

const router = express.Router();
let productManager = new ProductManager();
let cartManager = new CartManager();

router.get('/', async(req, res) => {
  let limit = req.query.limit || 10;
  const page = req.query.page || 1;
  let result = await productManager.getProducts(limit, page);
  let prod = result.docs;
  console.log(result.docs);
  res.render('home', {
    products: prod,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    nextPage: result.nextPage,
    prevPage: result.prevPage,
    page: result.page
  });
});

router.get('/api/products', async(req, res) => {
  let limit = req.query.limit || 10;
  const page = req.query.page || 1;

  let products = await productManager.getProducts(limit, page); 
  
  products.prevLink = products.hasPrevPage ? `http://localhost:8080/api/products?page=${products.prevPage}&limit=${limit}` : '';
  products.nextLink = products.hasNextPage ? `http://localhost:8080/api/products?page=${products.nextPage}&limit=${limit}` : '';

  res.render('products', {
    title: "Products",
    products: products,
    user: req.session.user
  });
});

router.get('/api/carts', async (req,res)=>{
  let carts = await cartManager.getCarts()
  res.render('carts', {
    title: "Carritos",
    carts: carts
  });
});

router.get('/api/carts/:cid', async (req, res) => {
  let cartId = req.params.cid

  let cartProducts = await cartManager.getAllProductsFromCart(cartId)

  res.render('cart', {
    title: "Cart",
    cartProducts: cartProducts,
    cartId: cartId
  })
});

router.get('/realtimeproducts', async(req, res) => {
  let products = await productManager.getProducts();
  res.render('realTimeProducts', {products});
});

router.get('/api/chat',(req,res)=>{
  res.render('chat');
});

router.get('/login', async (req, res) => {
  res.render('login')
});

router.get('/register', async (req, res) => {
  res.render('register')
});

router.get('/profile', (req, res) => {
  res.render('profile', {
      user: req.session.user
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.json({ status: 'Logout ERROR', body: err })
    }
    return res.redirect('/login')
  });
});

router.get('/resetpassword',(req,res)=>{
  res.render('resetpassword');
})

export default router;