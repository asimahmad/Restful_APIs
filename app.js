const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//const dbName = require('./api/models/product');

mongoose.connect('mongodb+srv://Asim123:Asim123@restapis.bamo9.mongodb.net/RestAPIs?retryWrites=true&w=majority', 
{
    useNewUrlParser: true
    // useMongoClient: true
}
);
mongoose.Promise = global.Promise; // this line will disable the warning message from cmd for mongose
// when we don't want to hard code the password 
//mongoose.connect('mongodb+srv://asim007:' + process.env.MONGO.ATLAS_PW + '@cluster0.oh7p5.mongodb.net/<dbname>?retryWrites=true&w=majority')
app.use(morgan('dev'));  // app.use(morgan())
app.use(bodyParser.urlencoded({extended: false})); // parsing for URLencoded data.
app.use(bodyParser.json()); // parsing for json data.


// for CORS and to prevent the CORS error, we will get such error only by the browsers not by the postman
app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*'); // will allow to all clients but if we put http://my-cool-page.com in place of * then only that client link will have access.
    res.header('Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // which define which types of headers we accept we can put * for all types of headers
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


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