import { Router } from 'express';
import __dirname from "../utils.js"
import passport from "passport";

import userModel from '../daos/mongodb/models/users.model.js';

import ProductManager from '../daos/mongodb/ProductManager.class.js';
import CartManager from '../daos/mongodb/CartManager.class.js';
import MessageManager from '../daos/mongodb/MessageManager.class.js';

const productsManager = new ProductManager();
const cartManager = new CartManager();
const messageManager = new MessageManager();

const router = Router();

router.get("/cart", async (req, res) => {
  res.render("cart", { title: "Productos"});
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const limit = Number(req.query.limit);
    const page = Number(req.query.page);
    let sort = Number(req.query.sort);
    let filtro = req.query.filtro;
    let filtroVal = req.query.filtroVal;
    const products = await productsManager.consultarProductos(limit, page, sort, filtro, filtroVal);
    res.render("realTimeProducts", {  title: "Productos Actualizados", products });
  } 
  catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      error: "Error al consultar los productos. Por favor, inténtelo de nuevo más tarde."
    });
  }
});

router.get("/chat", async (req, res) =>{

  // Traigo los mensajes:
  const messages = await messageManager.verMensajes();

  // Renderizo la vista del chat con los Mensajes Actualizados:
  res.render("chat", { title: "Mensajes Actualizados", messages });

})

router.get('/register', (req, res) => {
  res.render('register');
})

router.get('/login', (req, res) => {
  res.render('login');
})

router.get('/api/user', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    if (!user.cart) {
      return res.status(404).json({ error: "Carrito no encontrado para este usuario." });
    }
    const cart = await cartManager.consultarCartPorId(user.cart);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado." });
    }
    const cartID = cart._id;
    res.send({ user, cartID});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cargar el carrito. Por favor, inténtelo de nuevo más tarde." });
  }
});

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const user = await userModel.findOne({ email: req.user.email });
  if (!user) {
    return res.redirect('/login');
  }
  const { first_name, last_name, email, age, role } = user;
  res.render('profile', {
    user: {
      first_name,
      last_name,
      email,
      age,
      role
    }
  });
});

export default router;