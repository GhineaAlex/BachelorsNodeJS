var express = require('express');
var router = express.Router();
var passport = require('passport');
var Page = require('../models/page');

router.get('/', function(req, res){
	console.log(req.user);
	Page.findOne({slug: 'acasa'}, function(err, page){
		if (err)
			console.log(err);

		res.render('index', {
			title: page.title,
			content: page.content
		});
	});
});

router.get('/:slug', function (req, res){
	var slug = req.params.slug;

	Page.findOne({slug: slug}, function(err, page){
		if (err)
			console.log(err);

		if (!page){
			res.redirect('/');
		} else{
			res.render('index', {
				title: page.title,
				content: page.content
			})
		}
	})
})

//Exports
module.exports = router;


