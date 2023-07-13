import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'

import routerProducts from './routes/products.router.js' 
import routerCarts from './routes/carts.router.js'
import routerViews from './routes/views.router.js'
import routerMessages from './routes/messages.router.js'
import session from 'express-session'
import sessionRouter from "./routes/session.router.js";

import { Server } from "socket.io";

import ProductManager from './daos/mongodb/ProductManager.class.js'
import MessageManager from './daos/mongodb/MessageManager.class.js'

import connectDB from './db.js'
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import UserManager from './daos/mongodb/UserManager.class.js'

const productManager = new ProductManager();
const messageManager = new MessageManager();
const userManager = new UserManager();

// initial configuration


const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static

app.use(express.static(__dirname + "/public"));


// handlebars configuration

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// session

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

// app.use(passport.initialize());
// app.use(passport.session());

// server start and socket io

const expressServer = app.listen(8080, () => console.log("Servidor levantado"))
const socketServer = new Server(expressServer)

socketServer.on("connection", async (socket) => {
  console.log("Estas conectado " + socket.id)
  
  // Products
  
  let productManager = new ProductManager()
  // Se envian todos los productos al conectarse
  let products = await productManager.getProducts()
  socket.emit("update-products", products.docs)

  // Se agrega el producto y se vuelven a renderizar para todos los sockets conectados
  socket.on("add-product", async (productData) => {
    await productManager.addProduct(productData)
    
    products = await productManager.getProducts()
    socketServer.emit("update-products", products.docs)
  })

  // Se elimina el producto y se vuelven a renderizar para todos los sockets conectados
  socket.on("delete-product", async (productID) => {
    await productManager.deleteProduct(productID)

    products = await productManager.getProducts()
    socketServer.emit("update-products", products.docs)
  })

  // Messages

  let messageManager = new MessageManager()

  // Se envian todos los mensajes al conectarse
  socket.emit("update-messages", await messageManager.getMessages())

  // Se agrega el mensaje y se vuelven a renderizar
  socket.on("new-message", async (newMessage) => {

    await messageManager.addMessage(newMessage)

    socketServer.emit("update-messages", await messageManager.getMessages())
  })

  // Usuarios

  let userManager = new UserManager()

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
app.use("/api/messages", routerMessages);
app.use("/api/session", sessionRouter)

export default initializePassport;