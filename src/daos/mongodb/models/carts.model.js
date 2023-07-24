import mongoose from "mongoose";

const collection = "carts";

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
                        default: 1,
                    },
                },
            ],
        },
    },
    { versionKey: false }
);

export const cartModel = mongoose.model(collection, CartsSchema);
