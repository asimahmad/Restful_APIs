const express = require('express');
const app = express();

const productsRoutes = require('./api/routes/products');
app.use('/products', productsRoutes);

const ordersRoutes = require('./api/routes/orders');
app.use('/orders', ordersRoutes);
module.exports = app;