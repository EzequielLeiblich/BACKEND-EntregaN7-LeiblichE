import { Router } from "express";
import MessageManager from "../daos/mongodb/MessageManager.class.js";

let messageManager = new MessageManager()

let router = Router()

router.get("/", async (req, res) => {
  let messages = await messageManager.getMessages()

  res.send(messages)
})

router.post("/", async (req, res) => {
  let newMessage = req.body

  await messageManager.addMessage(newMessage)
  req.socketServer.emit("update-messages", await messageManager.getMessages())

  res.send({status: "success"})
})

export default router