import express from 'express';
import handlebars from 'express-handlebars';
import productRouter from './routes/productRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import __dirname from './utils/constantsUtil.js';

const app = express();

//Handlebars Config
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

//Routers
app.use('/api/products', productRouter);
app.use('/products', viewsRouter);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Start server in PORT ${PORT}`);
});