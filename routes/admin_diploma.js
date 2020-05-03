var express = require('express');
var router = express.Router();
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img');
var ipfsClient = require('ipfs-http-client');
var Diploma = require('../models/diploma');

var Category = require('../models/category');

//ipfs connection
const ipfs = new ipfsClient({host :'localhost', port: '5001', protocol: 'http'});

router.get('/', function(req, res){
    var count;
    Diploma.count(function(err,c){
        count = c;
    });

    Diploma.find(function(err, diplomas){
        res.render('admin/diplomas', {
            diplomas: diplomas,
            count: count
        });
    });
});

router.get('/add-diploma', function(req, res){
    var lastName = "";
    var firstName = "";
    var degree = "";
    var city = "";
    var desc = "";
    var document = "";
    
    Category.find(function(err, categories){
        res.render('admin/add_diploma', {
            lastName: lastName,
            firstName: firstName,
            degree: degree,
            city: city,
            desc: desc,
            categories: categories,
            document: document
        });
    });
});

router.post('/add-diploma', function(req, res){
    var imageDocument = req.files !== null ? req.files.document.name : "";

    req.checkBody('lastName', "You must insert last name").not().isEmpty();
    req.checkBody('firstName', "You must insert first name").not().isEmpty();
    req.checkBody('degree', "You need to insert the type of degree").not().isEmpty();
    req.checkBody('city', "You must insert the city").not().isEmpty();
    req.checkBody('document', "You must insert a document").isImage(imageDocument)
    req.checkBody('desc', "You must provide a description").not().isEmpty();

    var degree = req.body.degree;
    slug = degree.replace(/\s+/g, '-').toLowerCase();
    var desc = req.body.desc;
    var lastName = req.body.lastName;
    var firstName = req.body.firstName;
    var city = req.body.city;
    var category = req.body.category;
    
    var file = req.files.file;
    var fileName = req.body.fileName;
    var filePath = 'files/' + fileName;

    var errors = req.validationErrors();

    if(errors){
        Category.find(function(err, categories){
            res.render('admin/add_diploma', {
                errors: errors,
                degree: degree,
                lastName: lastName,
                firstName: firstName,
                city: city,
                desc: desc,
                user: req.user
            });
        });
    } else {
        console.log('path-ul este = ' + fileName);
        //console.log('file path este = ' + file);
        //console.log('continutul este = ' + JSON.stringify(file));
        //const file = fs.readFileSync(filePath);
       
        file.mv(filePath, async(err) => {
            if (err){
                console.log('err download');
            }
            const fileHash = await addFile(fileName, filePath);
            fs.unlink(filePath, (err) => {
                if(err) console.log(err);
            });
        })

        Diploma.findOne({slug: slug}, function(err, diploma){
            var diploma = new Diploma({
                lastName: lastName,
                firstName: firstName,
                degree: degree,
                city: city,
                document: imageDocument,
                desc: desc,
                category: category,
                slug: slug
            })

            diploma.save(function(err){
                if(err)
                    return console.log(err);
                    mkdirp.sync('public/diploma_images/' + diploma._id);

                    mkdirp.sync('public/diploma_images/' + diploma._id + '/gallery');

                    mkdirp.sync('public/diploma_images/' + diploma._id + '/gallery/thumbs');

                    if (imageDocument != ""){
                        var diplomaImage = req.files.document;
                        var path = 'public/diploma_images/' + diploma._id + '/' + imageDocument;

                        diplomaImage.mv(path, function(err){
                            return console.log(err)
                        });
                    }
                    req.flash('success', 'Added the diploma');
                    res.redirect('/admin/diplomas');
            })
        })
    }
})

const addFile = async(fileName, filePath) => {
    const file = fs.readFileSync(filePath);
    let results = [];
    for await(const result of ipfs.add({path: fileName, content: file})){
        results.push(result);
    }
    console.log('hash-ul este = ' + results[0].cid);
    return results[0].cid;
}

module.exports = router;