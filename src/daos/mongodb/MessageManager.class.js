import mongoose from 'mongoose'
import { messageModel } from './models/messages.model.js'

export default class MessageManager {
    // connection = mongoose.connect('mongodb+srv://ezequielleiblich:1Q2w3e4r@leibliche.nmve4kb.mongodb.net/?retryWrites=true&w=majority')
    async addMessage (message) {
        const { user, message: text } = message;
        const msg = { user, message: text };
        let result = await messageModel.create(msg) 
        return result;
    }

    async getMessages () {
        let result = await messageModel.find()
        return result
    }
}