import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "products";

const ProductsSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        descripcion: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        code: {
            type: Number,
            required: true,
            unique: true,
        },
        stock: {
            type: Number,
            required: true,
        },
    },
    { versionKey: false }
);
ProductsSchema.plugin(mongoosePaginate);
export const productsModel = mongoose.model(collection, ProductsSchema);
