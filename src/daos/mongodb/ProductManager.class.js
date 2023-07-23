import mongoose from "mongoose";
import { productsModel } from "./models/products.model.js";

export default class ProductManager {
    connection = mongoose.connect('mongodb+srv://ezequielleiblich:1Q2w3e4r@leibliche.nmve4kb.mongodb.net/?retryWrites=true&w=majority')
    
    async addProduct(product) {
        try {
            let result = await productsModel.create(product);
            return result;
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    async getProduct(
        limit = 10,
        page = 1,
        sort = 0,
        filtro = null,
        filtroVal = null
        ) {
            let whereOptions = {};
            if (filtro != null && filtroVal != null) {
                whereOptions = {
                    [filtro]: new RegExp(filtroVal, "i"),
                };
            }
            let result = await productsModel.paginate(whereOptions, {
                limit: limit,
                page: page,
                sort: { price: sort },
                lean: true,
            });
            return result;
    }

    async getProductById(id) {
        let result = await productsModel.findOne({ _id: id })
        return result
    }
    
    async updateProductById(id, updatedProduct) {
        let result = await productsModel.updateOne(
            { _id: id },
            { $set: updatedProduct }
        );
        return result;
    }
    
    async deleteProduct(id) {
        let result = await productsModel.deleteOne({ _id: id })
        return result
    }

    async getProductsInStock() {
        const products = await productsModel.find();
        const inStock = [];

        inStock.push(...products.filter((product) => product.stock > 0));
        return inStock;
    }
}