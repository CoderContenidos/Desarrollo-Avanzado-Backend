import { Router } from 'express';
import { productManager } from '../managers/productManager.js';

const router = Router();
const ProductService = new productManager('products.json');

router.get('/', async (req, res) => {
    res.render(
        'index',
        {
            title: 'Productos',
            style: 'index.css',
            products: await ProductService.getAllProducts()
        }
    )
});

export default router;