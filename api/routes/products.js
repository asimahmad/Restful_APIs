const express = require('express');
const { route } = require('../../app');
const { json } = require('body-parser');
const mongoose = require('mongoose');
const router = express.Router();

const Product = require('../models/product');



router.get('/', (req, res, next) =>{
    // res.status(200).json({
    //     message: 'Handling GET request to /products'
    // });
    Product.find()
    .select('name price _id') // if this line is not here then we will get all info.
    .exec()
    .then(docs =>{
        const response = {
            count: docs.length,
            products: docs.map(doc =>{
                return{
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        };
        //console.log(docs);
        // if(docs.length >= 0){
            //res.status(200).json(docs);
            res.status(200).json(response);
        // } else{
        //     res.status(404).json({
        //         message: "No entries found"
        //     }); 
        // }
        
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


router.post('/', (req, res, next) =>{
   
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created product successfully',
            createProduct: //result or 
            {
                name: result.name,
                price: result.price,
                _id: result._id,
                request:{
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
    // res.status(201).json({
    //     message: 'Handling POST request to /products',
    //     createProduct: product
    // });
});

router.get('/:productID', (req, res, next) => {
    const id = req.params.productID;
    Product.findById(id)
    .select('name price _id')
    .exec()
    .then(doc => {
         console.log("From database ", doc);
         if(doc){
            res.status(200).json({
                product: doc,
                request:{
                    type: 'GET',
                    description: 'GET_ALL_PRODUCTS',
                    url: "http://localhost:3000/products"
                }
            });
         }
         else
         {
             res.status(404).json({
                message: "No valid entry found for provided ID"
             });
         }
    
})
.catch(err => {
     console.log(err);
    res.status(500).json({error: err});
});
});
// Update the database
router.patch('/:productID', (req, res, next) =>{
    // res.status(200).json({
    //     message: 'Updated product'
    // });
    const id = req.params.productID;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, {$set: updateOps})
    .exec()
    .then(result =>{
        //console.log(result);
        res.status(200).json({
            message: 'Product updated',
            request:{
                type: 'GET',
                url: "http://localhost:3000/products/"+ id
            }
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:productID', (req, res, next) => {
    // res.status(200).json({
    //     message: 'Deleted product'
    // });
    const id = req.params.productID;
    Product.remove({_id: id})
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'Product deleted',
            request:{
                type: 'POST',
                url: "http://localhost:3000/products",
                body:{name: 'String', price: 'Number'}
            }
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;