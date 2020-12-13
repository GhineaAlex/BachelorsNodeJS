var express = require('express');
var router = express.Router();
var auth = require('../config/auth');
var isUser = auth.isUser;
var Category = require('../models/category');


router.get('/', isUser, function(req, res){
    Category.find(function(err, categories){
        if(err) return console.log(err);
        res.render('admin/categories', {
            categories: categories
        });
    });
});

//GET add page
router.get('/add-category', isUser, function(req, res){

    var title = "";

    res.render('admin/add_category', {
        title: title
    });
});

//POST add page
router.post('/add-category', isUser, function(req, res){
   
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

//GET edit page

router.get('/edit-category/:slug', isUser, function(req, res){
	Category.findOne({slug: req.params.slug}, function(err, category){
		if(err)
			return console.log(err);
		res.render('admin/edit_category', {
			title: category.title,
			slug: category.slug,
			id: category._id
		});
	});
});

//POST edit category
router.post('/edit-category/:slug', isUser, function(req, res){
	
	req.checkBody('title', 'title must have a value').not().isEmpty();

	var title = req.body.title;
	var slug = req.body.slug.replace(/\s+/g,'-').toLowerCase();
	if (slug == "") { slug = title.replace(/\s+/g,'-').toLowerCase()}

	var id = req.body.id;

	var errors = req.validationErrors();

	if(errors) {
		res.render('admin/edit_category', {
			errors: errors,
			title: title,
			slug: slug,
			id: id
		});
	} else {
		Category.findOne({slug: slug, _id:{'$ne':id}}, function(err, page){
			if (page) {
				req.flash('danger', 'Categoria exista deja');
				res.render('admin/edit_category', {
					title: title,
					slug: slug,
					id: id
				});
			} else{
				Category.findById(id, function(err, category){
					if(err)
						return console.log(err);
					category.title = title;
					category.slug = slug;

					category.save(function (err){
						if(err)
							return console.log(err);
						req.flash('success', 'Categoria a fost modificata');
						res.redirect('/admin/categories/edit-category/' + category.slug);
					})
				});
			}
		});
	}

	
});

//get delete

router.get('/delete-category/:id', isUser, function(req, res){
	Category.findByIdAndRemove(req.params.id, function(err){
		if(err) return console.log(err);
		req.flash('success', 'Category deleted');
		res.redirect('/admin/categories/');
	})
})

//Exports
module.exports = router;


