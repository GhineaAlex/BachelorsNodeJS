var express = require('express');
var router = express.Router();

var Product = require('../models/product');

router.get('/', function(req, res){
    Product.find(function (err, products){
        if (err)
            console.log(err);
        res.render('all_products', {
            title: 'All products',
            products: products
        });
    });
});

module.exports = router;