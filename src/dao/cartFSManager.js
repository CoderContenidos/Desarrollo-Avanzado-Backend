import fs from 'fs';

class cartFSManager {
    
    constructor(file, productFSManager) {
        this.file = file;
        this.productFSManager = productFSManager;
    }

    async getAllCarts() {
        try {
            const carts = await fs.promises.readFile(this.file, 'utf-8');
            return JSON.parse(carts);
        } catch (error) {
            console.error(error.message);
            return []; 
        }
    }

    async getProductsFromCartByID(cid) {
        const carts = await this.getAllCarts();

        const cartFilter = carts.filter(cart => cart.id == cid);

        if (cartFilter.length > 0) {
            return cartFilter[0].products;
        }

        throw new Error(`El carrito ${cid} no existe!`);
    }

    async createCart() {

        const carts = await this.getAllCarts();

        const newCart = {
            id: this.getCartID(carts),
            products: []
        }

        carts.push(newCart);

        try {
            await fs.promises.writeFile(this.file, JSON.stringify(carts, null, '\t'));

            return newCart;
        } catch (error) {
            throw new Error('Error al crear el carrito');
        }
    }

    getCartID(carts) {
        
        const cartsLength = carts.length;
        if (cartsLength > 0) {
            return parseInt(carts[cartsLength -1].id) + 1;
        }

        return 1;
    }

    async addProductByID(cid, pid) {
        //Check if exist product
        await this.productFSManager.getProductByID(pid);

        const carts = await this.getAllCarts();
        let i = 0;
        const cartFilter = carts.filter(
            (cart, index) => {
                if (cart.id == cid) i = index;
                return cart.id == cid;
            }
        );
        console.log('index: ', i, 'cid: ', cid);

        if (cartFilter.length > 0) {
            let exist = false;
            for (let key in carts[i].products) {
                if (carts[i].products[key].product == pid) {
                    exist = true;
                    carts[i].products[key].quantity++;
                }
            }

            if (!exist) {
                carts[i].products.push({
                    product: pid,
                    quantity: 1
                });
            }
        } else {
            throw new Error(`El carrito ${cid} no existe!`);
        }

        try {
            await fs.promises.writeFile(this.file, JSON.stringify(carts, null, "\t"));

            return carts[i];
        } catch(e) {
            throw new Error('Error al actualizar el carrito');
        }
    }
}

export { cartFSManager };