var express = require('express');
var router = express.Router();
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
require('dotenv').config();
var ipfsClient = require('ipfs-http-client');
var Diploma = require('../models/diploma');
var auth = require('../config/auth');
var isUser = auth.isUser;
var Category = require('../models/category');

const nodemailer = require('nodemailer');
console.log("adresa email " + process.env.EMAIL);
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,      
        pass: process.env.PASSWORD
    }
})


//ipfs connection
const ipfs = new ipfsClient({ host: process.env.host, port: process.env.portIpfs, protocol: process.env.protocol });

router.get('/', isUser, function (req, res) {
    var count;
    Diploma.count(function (err, c) {
        count = c;
    });

    Diploma.find(function (err, diplomas) {
        res.render('admin/diplomas', {
            diplomas: diplomas,
            count: count
        });
    });
});

router.get('/add-diploma', isUser, function (req, res) {
    var degree = "";
    var city = "";
    var desc = "";
    var document = "";

    Category.find(function (err, categories) {
        res.render('admin/add_diploma', {
            degree: degree,
            city: city,
            desc: desc,
            categories: categories,
            document: document
            
        });
    });
});

router.post('/add-diploma', isUser, function (req, res) {
    var imageDocument = req.files !== null ? req.files.document.name : "";
    req.checkBody('degree', "You need to insert the type of degree").not().isEmpty();
    req.checkBody('city', "You must insert the city").not().isEmpty();
    req.checkBody('document', "You must insert a document").isImage(imageDocument)
    req.checkBody('desc', "You must provide a description").not().isEmpty();
    req.checkBody('student', "Trebuie sa adaugi numele studentului").not().isEmpty();
    req.checkBody('emailStudent', "Trebuie sa adaugi un email").not().isEmpty();


    var degree = req.body.degree;
    slug = degree.replace(/\s+/g, '-').toLowerCase();
    var desc = req.body.desc;
    var city = req.body.city;
    var category = req.body.category;
    var student = req.body.student;
    var emailStudent = req.body.emailStudent;
    var file = req.files.file;
    var fileName = req.body.fileName;
    var filePath = 'files/' + fileName;

    var errors = req.validationErrors();

    if (errors) {
        Category.find(function (err, categories) {
            res.render('admin/add_diploma', {
                errors: errors,
                degree: degree,
                city: city,
                desc: desc,
                user: req.user
            });
        });
    } else {
        Diploma.findOne({ slug: slug }, function (err, diploma) {
            console.log('path-ul este = ' + fileName);

            file.mv(filePath, async (err) => {
                if (err) {
                    console.log('err download');
                }
                const fileHash = await addFile(fileName, filePath);
                console.log('fileHash ' + fileHash);
                fs.unlink(filePath, (err) => {
                    if (err) console.log(err);
                });
                var diploma = new Diploma({
                    degree: degree,
                    city: city,
                    document: imageDocument,
                    desc: desc,
                    category: category,
                    student: student,
                    slug: slug,
                    emailStudent: emailStudent,
                    hashId: fileHash
                })
                let mailOptions = {
                    from: 'alexg343434@gmail.com',
                    to: emailStudent,
                    subject: 'Diploma ta este acum pe Blockchain',
                    html: "<h2> Salut, </h2> <br> <p> Ne bucuram sa te anuntam ca diploma ta a fost incarcata pe Blockchain. Hash-ul generat de aplicatie este: </p>" + fileHash + "<br>Cu acest hash vei avea posibilitatea de a accesa de oriunde diploma ta. De asemenea, poti trimite oricarei persoane acest hash pentru a confirma ca ai o diploma legitima. Daca ai alte intrebari nu ezita ne contactezi la adresa contact@blockchain.ro. <br><br> Cu respect, <br>echipa UniBuc"
                }
                transporter.sendMail(mailOptions, function(err, data){
                    if(err){
                        console.log('error');
                    } else {
                        console.log('email sent');
                    }
                })
                diploma.save(function (err) {
                    if (err)
                        return console.log(err);
                    mkdirp.sync('public/diploma_images/' + diploma._id);
    
                    if (imageDocument != "") {
                        var diplomaImage = req.files.document;
                        var path = 'public/diploma_images/' + diploma._id + '/' + imageDocument;
    
                        diplomaImage.mv(path, function (err) {
                            return console.log(err)
                        });
                    }
                    req.flash('success', 'Diploma a fost adaugata cu succes!');
                    res.redirect('/admin/diplomas');
                })
            })
        })
    }
})

const addFile = async (fileName, filePath) => {
    const file = fs.readFileSync(filePath);
    let results = [];
    for await (const result of ipfs.add({ path: fileName, content: file })) {
        results.push(result);
    }
    console.log('hash-ul este = ' + results[0].cid);
    return results[0].cid;
}

module.exports = router;