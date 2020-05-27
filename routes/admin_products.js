var express = require('express');
var router = express.Router();
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img');
var auth = require('../config/auth');
var isUser = auth.isUser;
//get product model
var Product = require('../models/product');

//get category model
var Category = require('../models/category');

// GET products index
router.get('/', isUser, function(req, res){
    var count;
    Product.count(function(err, c){
        count = c;
    });

    Product.find(function(err, products){
        res.render('admin/products', {
            products: products,
            count: count
        });
    });
});

//GET add page
router.get('/add-product', isUser, function(req, res){

    var title = "";
    var desc = "";
    var price = "";

    Category.find(function(err, categories){
        res.render('admin/add_product', {
            title: title,
            desc: desc,
            categories: categories,
            price: price
        });
    })

});

//POST add product
router.post('/add-product', isUser, function(req, res){
    //console.log(typeof req.files.image);
    //.log(req.files);
    var imageFile = req.files !== null ? req.files.image.name : "";

    req.checkBody('title', 'title must have a value').not().isEmpty();
    req.checkBody('desc', 'Description must have a value').not().isEmpty();
    req.checkBody('price', 'Price must have a value').isDecimal();
    req.checkBody('image', 'You must upload an image').isImage(imageFile);

    var title = req.body.title;
    slug = title.replace(/\s+/g,'-').toLowerCase()
    var desc = req.body.desc;
    var price = req.body.price;
    var category = req.body.category;

    var errors = req.validationErrors();

    if(errors) {
        Category.find(function(err, categories){
            res.render('admin/add_product', {
                errors: errors,
                title: title,
                desc: desc,
                categories: categories,
                price: price
            });
        });
    } else {
        Product.findOne({slug: slug}, function(err, product){
            if (product) {
                req.flash('danger', 'Product title exists, choose another page');
                Category.find(function(err, categories){
                    res.render('admin/add_product', {
                        title: title,
                        desc: desc,
                        categories: categories,
                        price: price
                    });
                });
            } else{
                var price2 = parseFloat(price).toFixed(2);
                var product = new Product({
                    title: title,
                    slug: slug,
                    desc: desc,
                    price: price2,
                    category: category,
                    image: imageFile
                });

                product.save(function(err){
                    if(err)
                        return console.log(err);
                    console.log(product);
                    mkdirp.sync('public/product_images/' + product._id);

                    mkdirp.sync('public/product_images/' + product._id + '/gallery');

                    mkdirp.sync('public/product_images/' + product._id + '/gallery/thumbs');

                    if (imageFile != ""){
                        var productImage = req.files.image;
                        var path = 'public/product_images/' + product._id + '/' + imageFile;

                        productImage.mv(path, function(err){
                            return console.log(err);
                        });
                    }

                    req.flash('success', 'Product has been added');
                    res.redirect('/admin/products');
                });
            }
        });
    }


});

router.get('/edit-product/:id', isUser, function (req, res){
    var errors;

    if (req.session.errors) errors = req.session.errors;
    req.session.errors =null;

    Category.find(function(err, categories){

        Product.findById(req.params.id, function(err, p){
           if(err){
               console.log(err);
               res.redirect('/admin/products');
           } else {
               var galleryDir = 'public/product_images/' + p._id + '/gallery';
               var galleryImages = null;

               fs.readdir(galleryDir, function(err, files){
                    if (err) {
                        console.log(err);
                    } else {
                        galleryImages = files;
                        res.render('admin/edit_product', {
                            title: p.title,
                            errors: errors,
                            desc: p.desc,
                            categories: categories,
                            category: p.category.replace(/\s+/g, '-').toLowerCase(),
                            price: p.price,
                            image: p.image,
                            galleryImages: galleryImages
                        });
                    }
               });
           }
        });
    })
})


router.post('/edit-product/:id', isUser, function(req, res){
    var imageFile = req.files !== null ? req.files.image.name : "";

    req.checkBody('title', 'title must have a value').not().isEmpty();
    req.checkBody('desc', 'Description must have a value').not().isEmpty();
    req.checkBody('price', 'Price must have a value').isDecimal();
    req.checkBody('image', 'You must upload an image').isImage(imageFile);

    var title = req.body.title;
    slug = title.replace(/\s+/g,'-').toLowerCase()
    var desc = req.body.desc;
    var price = req.body.price;
    var category = req.body.category;

    var errors = req.validationErrors();

    if (errors){
        req.session.errors = errors;
        res.redirect('/admin/products/edit-product/' + id);
    } else {
        Product.findOne({slug: slug, _id: {'$ne': id}}, function(err, p){
            if (err)
                console.log(err);
            if (p) {
                req.flash('danger', 'Product title exists, choose another one');
                res.redirect('/admin/products/edit-product/' + id);
            } else {
                Product.findById(id, function(err, p){
                    if(err) console.log(err);
                    p.title = title;
                    p.slug = slug;
                    p.desc = desc;
                    p.price = parseFloat(price).toFixed(2);
                    p.category = category;
                    if (imageFile != ""){
                        p.image = imageFile;
                    }
                    p.save(function(err){
                        if (err)
                        {console.log(err);}
                        if (imageFile != ""){
                            if (pimage != ""){
                                fs.remove('public/product_images/' + id + '/'+ pimage, function(err){
                                    if (err)
                                        console.log(err);
                                });
                            }
                            var productImage = req.files.image;
                            var path = 'public/product_images/' + id + '/' + imageFile;

                            productImage.mv(path, function(err){
                                return console.log(err);
                            });
                        }
                        req.flash('success', 'Product edited');
                        res.redirect('/admin/products/edit-product/' + id);
                    })
                })
            }
        });
    }
});

//Exports
module.exports = router;


