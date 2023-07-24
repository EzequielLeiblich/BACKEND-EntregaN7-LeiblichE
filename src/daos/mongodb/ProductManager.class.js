import mongoose from "mongoose";
import { productsModel } from "./models/products.model.js";

export default class ProductManager {
    
    // MONGOOSE
    connection = mongoose.connect('mongodb+srv://ezequielleiblich:1Q2w3e4r@leibliche.nmve4kb.mongodb.net/?retryWrites=true&w=majority')
    
    async crearProducto(info) {
        let result = await productsModel.create(info);
        return result;
    };

    async consultarProductos(limit = 10, page = 1, sort = 1, filtro = null, filtroVal = null) {
        let whereOptions = {};
        if (filtro != '' && filtroVal != '') {
            whereOptions = { [filtro]: filtroVal };
        };
        let result = {};
        if (sort !== 1) {
            result = await productsModel.paginate(whereOptions, {
                limit: limit,
                page: page,
                sort: { price: sort },
            });
        } else {
            result = await productsModel.paginate(whereOptions, {
                limit: limit,
                page: page,
            });
        }
        const hasNextPage = result.page < result.totalPages;
        return { products: result, hasNextPage: hasNextPage };
    };

    async consultarProductoPorId(id) {
        let result = await productsModel.findOne({
            _id: id
        });
        return result;
    };

    async actualizarProducto(pid, updateProduct) {
        let result = await productsModel.updateOne({ _id: pid}, {$set: updateProduct});
        return result;
    };
    
    async deleteProduct(id) {
        let result = await productsModel.deleteOne({ _id: id })
        return result
    }

    async eliminarProducto(pid) {
        let result = await productsModel.deleteOne({
            _id: pid
        })
        return result;
    }
}