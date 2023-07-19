import mongoose from "mongoose";

const collection = "cart";

const CartsSchema = new mongoose.Schema(
    {
        products: {
            type: [
                {
                    product: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "products",
                    },
                    quantity: {
                        type: Number,
                        ref: "products",
                    },
                },
            ],
        },
    },
    { versionKey: false }
);

export const cartsModel = mongoose.model(collection, CartsSchema);
