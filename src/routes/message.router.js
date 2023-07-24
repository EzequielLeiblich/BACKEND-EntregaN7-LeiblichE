import { Router } from "express";
import MessageManager from "../daos/mongodb/MessageManager.class.js";

const router = Router();
const messageManager = new MessageManager();

router.get("/", async (req, res) => {
    try {
        const messages = await messageManager.verMensajes();
        res.send({
            messages
        });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({
            error: "Error al consultar los mensajes. Por favor, inténtelo de nuevo más tarde."
        });
    }
});

router.post("/", async (req, res) => {
    try {
        console.log(req.body);
        const message = req.body;
        const createdMessage = await messageManager.nuevoMensaje(message);
        const messages = await messageManager.verMensajes();
        req.socketServer.sockets.emit('messages', messages);
        res.send({
            message: createdMessage
        });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({
            error: "Error al crear el mensaje. Por favor, inténtelo de nuevo más tarde."
        });
    }
});

router.delete("/:mid", async (req, res) => {
    try {
        const mid = req.params.mid;
        const result = await messageManager.eliminarMensaje(mid);
        if (!result) {
            console.log(`No se encontró ningún mensaje con el ID ${mid}.`)
            res.status(404).json({
                error: `No se encontró ningún mensaje con el ID ${mid}.`
            });
        } else {
            const messages = await messageManager.verMensajes();
            req.socketServer.sockets.emit('messages', messages);
            res.send(result);
        }
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({
            error: "Error al eliminar el mensaje. Por favor, inténtelo de nuevo más tarde."
        });
    }
});

export default router;