import fs from 'fs';

class productFSManager {
    
    constructor(file) {
        this.file = file;
    }

    async getAllProducts() {
        try {
            const products = await fs.promises.readFile(this.file, 'utf-8');
            return JSON.parse(products);
        } catch (error) {
            console.error(error.message);
            return []; 
        }
    }

    async getProductByID(pid) {
        const products = await this.getAllProducts();

        const productFilter = products.filter(product => product.id == pid);

        if (productFilter.length > 0) {
            return productFilter[0];
        }

        throw new Error(`El producto ${pid} no existe!`);
    }

    async createProduct(product) {
        const {title, description, code, price, stock, category, thumbnails} = product;

        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error('Error al crear el producto');
        }

        const products = await this.getAllProducts();

        const newProduct = {
            id: this.getProductID(products),
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails: thumbnails ?? []
        }

        products.push(newProduct);

        try {
            await fs.promises.writeFile(this.file, JSON.stringify(products, null, '\t'));

            return newProduct;
        } catch (error) {
            throw new Error('Error al crear el producto');
        }
    }

    getProductID(products) {
        
        const productsLength = products.length;
        if (productsLength > 0) {
            return parseInt(products[productsLength -1].id) + 1;
        }

        return 1;
    }

    async updateProduct(pid, productUpdate) {
        const {title, description, code, price, status, stock, category, thumbnails} = productUpdate;
        const products = await this.getAllProducts();

        let i = 0;
        const productFilter = products.filter(
            (product, index) => {
                i = index;
                return product.id == pid
            }
        );

        if (productFilter.length > 0) {

            products[i].title = title ? title : products[i].title;
            products[i].description = description ? description : products[i].description;
            products[i].code = code ? code : products[i].code;
            products[i].price = price ? price : products[i].price;
            products[i].status = status ? status : products[i].status;
            products[i].stock = stock ? stock : products[i].stock;
            products[i].category = category ? category : products[i].category;
            products[i].thumbnails = thumbnails ? thumbnails : products[i].thumbnails;
        } else {
            throw new Error(`El producto ${pid} no existe!`);
        }

        try {
            await fs.promises.writeFile(this.file, JSON.stringify(products, null, "\t"));

            return products[i];
        } catch(e) {
            throw new Error('Error al actualizar el producto');
        }
    }

    async deleteProduct(pid) {
        
        const products = await this.getAllProducts();

        const productsFilter = products.filter(product => product.id != pid);

        if (products.length === productsFilter.length) {
            throw new Error(`El producto ${pid} no existe!`);
        }

        try {
            await fs.promises.writeFile(this.file, JSON.stringify(productsFilter, null, "\t"));

            return productsFilter;
        } catch(e) {
            throw new Error(`Error al eliminar el producto ${pid}`);
        }
    }
}

export { productFSManager };