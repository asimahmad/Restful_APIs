const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('dev'));  // app.use(morgan())

const productsRoutes = require('./api/routes/products');  // route which should handle reguest
app.use('/products', productsRoutes);

const ordersRoutes = require('./api/routes/orders');
app.use('/orders', ordersRoutes);

app.use((req, res, next) =>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message,
            status: error.status
        }
    });
});


module.exports = app;