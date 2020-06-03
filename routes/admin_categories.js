var express = require('express');
var router = express.Router();

var Category = require('../models/category');


router.get('/', function(req, res){
    Category.find(function(err, categories){
        if(err) return console.log(err);
        res.render('admin/categories', {
            categories: categories
        });
    });
});

//GET add page
router.get('/add-category', function(req, res){

    var title = "";

    res.render('admin/add_category', {
        title: title
    });
});

//POST add page
router.post('/add-category', function(req, res){
    console.log('aici');
    req.checkBody('title', 'Este nevoie de un nume pentru document').not().isEmpty();

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var errors = req.validationErrors();

    if(errors) {
        res.render('admin/add_category', {
            errors: errors,
            title: title,
            user: req.user
        });
    } else {
        Category.findOne({slug: slug}, function(err, page){
            if (page) {
                req.flash('danger', 'Acest tip de document exista deja');
                res.render('admin/add_category', {
                    title: title
                });
            } else{
                var category = new Category({
                    title: title,
                    slug: slug
                });

                category.save(function(err){
                    if(err)
                        return console.log(err);
                    req.flash('success', 'Tipul de document a fost incarcat');
                    res.redirect('/admin/categories');
                });
            }
        });
    }


});


//get delete

router.get('/delete-category/:id', function(req, res){
	Category.findByIdAndRemove(req.params.id, function(err){
		if(err) return console.log(err);
		req.flash('success', 'Category deleted');
		res.redirect('/admin/categories/');
	})
})

// router.post('/reorder-pages', function(req, res){
//     var ids = req.body['id[]'];

//     var count = 0;

//     for (var i = 0; i < ids.length; i++){
//         var id = ids[i];
//         count++;

//         (function(count){

//             Page.findById(id, function(err, page){
//                 page.sorting = count;
//                 page.save(function(err){
//                     if(err){
//                         return console.log(err);
//                     }
//                 });
//             });
//         })(count);
//     }
// });

//Exports
module.exports = router;


