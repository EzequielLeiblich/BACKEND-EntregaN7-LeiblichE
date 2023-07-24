import { Router } from "express";
import ProductManager from "../daos/mongodb/ProductManager.class.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  let limit = Number(req.query.limit);
  let page = Number(req.query.page);
  let sort = Number(req.query.sort);
  let filtro = req.query.filtro;
  let filtroVal = req.query.filtroVal;
  if (!limit) {
    limit = 9;
  }

  const product = await productManager.getProduct(
    limit,
    page,
    sort,
    filtro,
    filtroVal
  );

  res.send({ product });
});


router.get("/:id", async (req, res) => {
  const product = await productManager.getProductById(req.params.id);
  res.send(product);
});

router.post('/', async (req, res) => {
  const product = await productManager.addProduct(req.body);
    socketServer.emit("newProduct", product);
    res.send(product);
})

router.put("/:id", async (req, res) => {
  const product = await productManager.updateProductById(
      req.params.id,
      req.body
  );
  if (product.matchedCount > 0) {
      const newProduct = await productManager.getProductById(req.params.id);
      socketServer.emit("updateProduct", newProduct);
  }
  res.send(product);
});


router.delete("/:id", async (req, res) => {
  const product = await productManager.deleteProduct(req.params.id);
  socketServer.emit("deleteProduct", req.params.id);
  res.send(product);
});


export default router