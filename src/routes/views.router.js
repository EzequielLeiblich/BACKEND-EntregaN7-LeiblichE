import { Router } from 'express';
import __dirname from "../utils.js"
import express from 'express';

import ProductManager from '../daos/mongodb/ProductManager.class.js';
import CartManager from '../daos/mongodb/CartManager.class.js';

const router = express.Router();
let productManager = new ProductManager();
let cartManager = new CartManager();

router.get("/home", async (req, res) => {
  let limit = Number(req.query.limit);
  let page = Number(req.query.page);
  let sort = Number(req.query.sort);
  let filtro = req.query.filtro;
  let filtroVal = req.query.filtroVal;
  if (!limit) {
    limit = 9;
  }
  if (!page) {
    page = 1;
  }
  await productManager.getProduct(limit, page, sort, filtro, filtroVal).then(
    (product) => {
      let products = JSON.stringify(product.docs);
      products = JSON.parse(products);
      product.prevLink = product.hasPrevPage
        ? `http://localhost:8080/home/?page=${product.prevPage}`
        : "";
      product.nextLink = product.hasNextPage
        ? `http://localhost:8080/home/?page=${product.nextPage}`
        : "";
      product.isValid = !(page <= 0 || page > product.totalPages);
      res.render("home", {
        title: "Productos",
        user: req.session.user,
        product,
      });
    }
  );
});

router.get('/', async(req, res) => {
  res.render("login");
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

router.get("/profile", (req, res) => {
  console.log(req.session);
  res.render("profile", {
    user: req.session.user,
    isAdmin: req.session.user.rol === "admin",
  });
});

router.get("/logout", (req, res) => {
  if (req.session) {
      req.session.destroy((err) => {
          if (err) {
              res.status(400).send("Unable to log out");
          } else {
              res.redirect("/");
          }
      });
  } else {
      res.redirect("/");
  }
});

router.get('/resetpassword',(req,res)=>{
  res.render('resetpassword');
})

export default router;