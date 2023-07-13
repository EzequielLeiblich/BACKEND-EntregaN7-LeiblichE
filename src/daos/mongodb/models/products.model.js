import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection = 'products'

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    thumbnails: { 
        type: [],
    },
    status: {
        type: Boolean,
        required: true
    },
    code: {
        type: String,
        unique: true,
        required: true
    },
    stock: { 
        type: Number,
        required: true
    }

})

productSchema.plugin(mongoosePaginate)
export const productsModel = mongoose.model(productCollection, productSchema)