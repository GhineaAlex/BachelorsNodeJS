var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
var auth = require('../config/auth');
var isUser = auth.isUser;

var Product = require('../models/product');

var Category = require('../models/category');

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

router.get('/:category', function(req, res){
    
    var categorySlug = req.params.category;
    Category.findOne({slug: categorySlug}, function(err, c){
        Product.find({category: categorySlug}, function(err, products){
            if (err)
                console.log(err);
            res.render('cat_products', {
                title: c.title,
                products: products
            });
        });
    });
});

module.exports = router;