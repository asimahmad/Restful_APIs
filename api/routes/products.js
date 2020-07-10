const express = require('express');
const { route } = require('../../app');
const { json } = require('body-parser');
const router = express.Router();


router.get('/', (req, res, next) =>{
    res.status(200).json({
        message: 'Handling GET request to /products'
    });
});


router.post('/', (req, res, next) =>{
    const product = {
        name: req.body.name,
        price: req.body.price
    };
    res.status(201).json({
        message: 'Handling POST request to /products',
        createProduct: product
    });
});

router.get('/:productID', (req, res, next) => {
    const id = req.params.productID;
    if(id === 'special'){
        res.status(200).json({
            message: 'You found the special ID',
            id: id
        });
    }
    else{
        res.status(200).json({
            message: 'You passed the ID',
            id: id
        });
    }
});

router.patch('/:productID', (req, res, next) =>{
    res.status(200).json({
        message: 'Updated product'
    });
});

router.delete('/:productID', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted product'
    });
});

module.exports = router;