import { Router } from 'express';
import { productFSService } from '../services/productFSService.js';

const router = Router();
const ProductService = new productFSService('products.json');

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