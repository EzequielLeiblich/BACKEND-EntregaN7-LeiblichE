import mongoose from "mongoose";
import { messageModel } from "./models/messages.model.js"

export default class MessageManager {

    // MONGOOSE
    connection = mongoose.connect('mongodb+srv://ezequielleiblich:1Q2w3e4r@leibliche.nmve4kb.mongodb.net/?retryWrites=true&w=majority')

    async nuevoMensaje(sms) {
        let result = await messageModel.create(sms);
        return result;
    };

    async verMensajes() {
        let result = await messageModel.find().lean();
        return result;
    }

    async eliminarMensaje(mid) {
        let result = await messageModel.deleteOne({_id: mid})
        return result;
    };
}