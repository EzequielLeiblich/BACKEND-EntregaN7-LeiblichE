import express from 'express'
import __dirname from './utils.js'
import handlebars from 'express-handlebars';

import routerProducts from './routes/products.router.js' 
import routerCarts from './routes/cart.router.js'
import routerViews from './routes/views.router.js'

import session from 'express-session'
import sessionRouter from "./routes/session.router.js";

import { Server } from "socket.io";
import { engine } from "express-handlebars";
import { messagesModel } from "./daos/mongodb/models/messages.model.js";

import ProductManager from './daos/mongodb/ProductManager.class.js'
import CartManager from './daos/mongodb/CartManager.class.js'

// import connectDB from './db.js'
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { initializePassport } from './config/passport.config.js';
import UserManager from './daos/mongodb/UserManager.class.js'

export const ProductsManager = new ProductManager();
export const CartsManager = new CartManager();

const products = await ProductsManager.getProductsInStock();
const mensajes = [];
const userManager = new UserManager();

// initial configuration

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static

app.use(express.static(__dirname + "/public"));


// handlebars configuration

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// session
const connection = mongoose.connect(
  "mongodb+srv://ezequielleiblich:1Q2w3e4r@leibliche.nmve4kb.mongodb.net/?retryWrites=true&w=majority" 
);

initializePassport();
app.use(cookieParser())
app.use(
  session({
    store: new MongoStore({ 
      mongoUrl: 
      "mongodb+srv://ezequielleiblich:1Q2w3e4r@leibliche.nmve4kb.mongodb.net/?retryWrites=true&w=majority" 
    }),
    secret: "mongoSecret",
    resave: true,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// server start and socket io

const expressServer = app.listen(8080, () => console.log("Servidor levantado"))
const socketServer = new Server(expressServer)

socketServer.on("connection", async (socket) => {
  console.log("Estas conectado " + socket.id)
  
  // Products
  // Se envian todos los productos al conectarse
  let products = await ProductsManager.getProduct()
  socket.emit("update-products", products.docs)

  // Se agrega el producto y se vuelven a renderizar para todos los sockets conectados
  socket.on("add-product", async (productData) => {
    await ProductsManager.addProduct(productData)
    
    products = await ProductsManager.getProduct()
    socketServer.emit("update-products", products.docs)
  })

  // Se elimina el producto y se vuelven a renderizar para todos los sockets conectados
  socket.on("delete-product", async (productID) => {
    await ProductsManager.deleteProduct(productID)

    products = await ProductsManager.getProduct()
    socketServer.emit("update-products", products.docs)
  })

  // Usuarios

  // let userManager = new UserManager()

socket.on("authenticatedUser", (data) => {
    socket.broadcast.emit("newUserAlert", data);
  })
})

// middleware (all requests have access to socket server)

app.use((req, res, next) => {
  req.socketServer = socketServer;
  next();
})

// routers

app.use("/", routerViews);
app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);
app.use("/api/sessions", sessionRouter)

// export default initializePassport;
export default socketServer;
