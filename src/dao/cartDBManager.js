import { cartModel } from "./models/cartModel.js";

class cartDBManager {

    constructor(productDBManager) {
        this.productDBManager = productDBManager;
    }

    async getAllCarts() {
        return cartModel.find();
    }

    async getProductsFromCartByID(cid) {
        const cart = await cartModel.findOne({_id: cid}).populate('products.product');

        if (!cart) throw new Error(`El carrito ${cid} no existe!`);
        
        return cart;
    }

    async createCart() {
        return await cartModel.create({products: []});
    }

    async addProductByID(cid, pid) {
        await this.productDBManager.getProductByID(pid);

        const cart = await cartModel.findOne({ _id: cid});

        if (!cart) throw new Error(`El carrito ${cid} no existe!`);
    
        let i = null;
        const result = cart.products.filter(
            (item, index) => {
                if (item.product.toString() === pid) i = index;
                return item.product.toString() === pid;
            }
        );

        if (result.length > 0) {
            cart.products[i].quantity += 1;
        } else {
            cart.products.push({
                product: pid,
                quantity: 1
            });
        }
        await cartModel.updateOne({ _id: cid }, { products: cart.products});

        return await this.getProductsFromCartByID(cid);
    }

    async deleteProductByID(cid, pid) {
        await this.productDBManager.getProductByID(pid);

        const cart = await cartModel.findOne({ _id: cid});

        if (!cart) throw new Error(`El carrito ${cid} no existe!`);
    
        let i = null;
        const newProducts = cart.products.filter(item => item.product.toString() !== pid);

        await cartModel.updateOne({ _id: cid }, { products: newProducts});
        
        return await this.getProductsFromCartByID(cid);
    }

    async updateAllProducts(cid, products) {

        //Validate if exist products
        for (let key in products) {
            await this.productDBManager.getProductByID(products[key].product);
        }

        await cartModel.updateOne({ _id: cid }, { products: products });
        
        return await this.getProductsFromCartByID(cid)
    }

    async updateProductByID(cid, pid, quantity) {

        if (!quantity || isNaN(parseInt(quantity))) throw new Error(`La cantidad ingresada no es válida!`);

        await this.productDBManager.getProductByID(pid);

        const cart = await cartModel.findOne({ _id: cid});

        if (!cart) throw new Error(`El carrito ${cid} no existe!`);
    
        let i = null;
        const result = cart.products.filter(
            (item, index) => {
                if (item.product.toString() === pid) i = index;
                return item.product.toString() === pid;
            }
        );

        if (result.length === 0) throw new Error(`El producto ${pid} no existe en el carrito ${cid}!`);

        cart.products[i].quantity = parseInt(quantity);

        await cartModel.updateOne({ _id: cid }, { products: cart.products});

        return await this.getProductsFromCartByID(cid);
    }

    async deleteAllProducts(cid) {

        await cartModel.updateOne({ _id: cid }, { products: [] });
        
        return await this.getProductsFromCartByID(cid)
    }
}

export { cartDBManager };