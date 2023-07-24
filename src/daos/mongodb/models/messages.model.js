import mongoose from "mongoose";

const collection = "messages";

const MessagesSchema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    }
);

export const messageModel = mongoose.model(collection, MessagesSchema);
