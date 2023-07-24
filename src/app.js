// PAQUETES Y MODULOS

import express, { urlencoded } from 'express';
import __dirname from './utils.js'
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import { Server, Socket } from 'socket.io';

// RUTAS

import routerProducts from "./routes/products.router.js"
import routerCarts from "./routes/cart.router.js"
import routerViews from "./routes/views.router.js"
import routerSession from "./routes/session.router.js"
import routerMessage from "./routes/message.router.js"

// MANAGERS

import ProductManager from './daos/mongodb/ProductManager.class.js'
import CartManager from './daos/mongodb/CartManager.class.js'
import MessageManager from './daos/mongodb/MessageManager.class.js'

// PASSPORT
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { initializePassportLocal } from './config/local.passport.js';
import { initializePassportGitHub } from './config/gitHub.passport.js';
import { initializePassportJWT } from './config/jwt.passport.js';

// SERVER EXPRESS

const app = express();

// MONGOOSE

const connection = mongoose.connect(
  "mongodb+srv://ezequielleiblich:1Q2w3e4r@leibliche.nmve4kb.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// MIDDLEWARES

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");


// PASSPORT

app.use(cookieParser());
initializePassportLocal();
initializePassportJWT();
initializePassportGitHub();
app.use(passport.initialize());

// SERVER HTTP EXPRESS

const expressServer = app.listen(8080, () => {
  console.log("Servidor levantado");
})

// SERVER SOCKET.IO

const socketServer = new Server(expressServer)

// MANAGERS

export const PdtManager = new ProductManager();
export const CrtManager = new CartManager();
export const SmsManager = new MessageManager();

// SERVER SOCKET.IO EVENTS

socketServer.on("connection", async (socket) => {
  console.log("Estas conectado ", socket.id)
  
  // PRODUCTS

  // Se envian todos los productos al conectarse
  const products = await PdtManager.consultarProductos()
  socket.emit('productos', products);

  // Recibo el producto para agregar al carrtito:
  socket.on("agregarProductoEnCarrito", async ({
    cartID,
    productID
  }) => {
    if (cartID && productID) {
        await CrtManager.agregarProductoEnCarrito(cartID, productID);
        console.log(`server-prodc: ${productID}`)
        console.log(`server-cart: ${cartID}`)
    }
  });

  // Buscamos el title del product para el Alert:
  socket.on("buscarTitle", async (productIDValue) => {
      const product = await PdtManager.consultarProductoPorId(productIDValue);
      socket.emit("titleEncontrado", product);
  });

  // Recibo los filtros de main.js en busquedaProducts:

  socket.on('busquedaFiltrada', async (busquedaProducts) => {
    const {
      limit,
      page,
      sort,
      filtro,
      filtroVal
    } = busquedaProducts;
    const products = await PdtManager.consultarProductos(limit, page, sort, filtro, filtroVal);
    socket.emit('productos', products);
  });

  // Se agrega el producto y se vuelven a renderizar para todos los sockets conectados
  socket.on("addProduct", (data) => {
    products.push(data);
    socketServer.emit("productos", products);
  })

  // Se elimina el producto y se vuelven a renderizar para todos los sockets conectados
  socket.on("deleteProduct", (id) => {
    products.splice(
      products.findIndex((product) => product.id === id), 1
    );
    socketServer.emit("productos", products);
  })

  // CARTS

  // Accedo a los productos de un carrito especifico: 
  socket.on("CartCid", async (cartID) => {
    const cartCID = await CrtManager.consultarCartPorId(cartID);
    socketServer.emit("CARTID", (cartCID));
  })

  // Se envian todos los carritos
  // const carts = await CrtManager.consultarCarts();
  // socket.emit('carritos', {
  //    docs: carts
  // });

  // MENSAJES

  // Escuchamos el evento addMessage y recibimos el mensaje:
  socket.on("addMessage", (sms) => {
    messages.push(sms);
    socketServer.emit("messages", messages);
  })

  // Enviamos los mensajes al usuario:
  const messages = await SmsManager.verMensajes();
  socket.emit("messages", messages);

  // Escuchamos el evento deleteMessage y recibimos el id del mensaje.
  socket.on("deleteMessage", (id) => {
      messages.splice(
          messages.findIndex((message) => message.id === id), 1
      );
      socketServer.emit("messages", messages);
  })
})

// MIDDLEWARE (all requests have access to socket server)

app.use((req, res, next) => {
  req.socketServer = socketServer;
  next();
})

// ROUTES

app.use("/", routerViews);
app.use("/api/chat", routerMessage);
app.use("/api/carts", routerCarts);
app.use("/api/sessions", routerSession);
app.use("/api/realtimeproducts", routerProducts);
