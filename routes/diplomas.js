var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
var auth = require('../config/auth');
var isUser = auth.isUser;

var Diploma = require('../models/diploma');

var Category = require('../models/category');

var Student = require('../models/student');

router.get('/', isUser, function(req, res){
    Diploma.find(function (err, diplomas){
        if (err)
            console.log(err);
        res.render('all_diplomas', {
            title: 'All diplomas',
            diplomas: diplomas
        });
    });
});

module.exports = router;