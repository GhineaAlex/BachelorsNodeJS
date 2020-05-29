var express = require('express');
var router = express.Router();

var Student = require('../models/student');


router.get('/', function(req, res){
    Student.find(function(err, students){
        if(err) return console.log(err);
        res.render('admin/students', {
            students: students
        });
    });
});

//GET add page
router.get('/add-student', function(req, res){

    var lastName = "";
    var firstName = "";
    var birthDate = "";
    var birthCountry = "";
    var birthCounty = "";
    var gender = "";
    var cnp = "";
    var idCi = "";
    var dateCi = "";
    var collegeName = "";
    var typeOfStudy = "";

    res.render('admin/add_student', {
        lastName: lastName,
        firstName: firstName,
        birthDate: birthDate,
        birthCountry: birthCountry,
        birthCounty: birthCounty,
        gender: gender,
        cnp: cnp,
        idCi: idCi,
        dateCi: dateCi,
        collegeName: collegeName,
        typeOfStudy: typeOfStudy
    });
});

//POST add page
router.post('/add-student', function(req, res){
    req.checkBody('lastName', 'You need to introduce a name').not().isEmpty();
    req.checkBody('firstName', 'You need to introduce a first name').not().isEmpty();
    //req.checkBody('birthDate', 'You need to introduce a birthdate').not().isEmpty();
    req.checkBody('birthCountry', 'You need to introduce the birth country').not().isEmpty();
    req.checkBody('birthCounty', 'You need to introduce the birth county').not().isEmpty();
    req.checkBody('gender', 'You need to introduce the gender').not().isEmpty();
    req.checkBody('cnp', 'You need to introduce the cnp').not().isEmpty();
    req.checkBody('idCi', 'You need to introduce the id of the CI').not().isEmpty();
    //req.checkBody('dateCi', 'You need to introduce the expiration date for the CI').not().isEmpty();
    req.checkBody('collegeName', 'You need to introduce the name of the college').not().isEmpty();
    req.checkBody('typeOfStudy', 'You need to introduce the type of Study').not().isEmpty();
    
    var lastName = req.body.lastName;
    var firstName = req.body.firstName;
    var birthDate = req.body.birthDate;
    var birthCountry = req.body.birthCountry;
    var birthCounty = req.body.birthCounty;
    var gender = req.body.gender;
    var cnp = req.body.cnp;
    var idCi = req.body.idCi;
    var dateCi = req.body.dateCi;
    var collegeName = req.body.collegeName;
    var typeOfStudy = req.body.typeOfStudy;

    var errors = req.validationErrors();

    if(errors) {
        res.render('admin/add_student', {
            errors: errors,
            cnp: cnp,
            user: req.user
        });
    } else {
        Student.findOne({cnp: cnp}, function(err, page){
            if (page) {
                req.flash('danger', 'Acest student exista deja');
                res.render('admin/add_student', {
                    lastName: lastName
                });
            } else{
                var student = new Student({
                    lastName: lastName,
                    firstName: firstName,
                    birthDate: birthDate,
                    birthCountry: birthCountry,
                    birthCounty: birthCounty,
                    gender: gender,
                    cnp: cnp,
                    idCi: idCi,
                    dateCi: dateCi,
                    collegeName: collegeName,
                    typeOfStudy: typeOfStudy
                });

                student.save(function(err){
                    if(err)
                        return console.log(err);
                    req.flash('success', 'Noul student a fost incarcat');
                    res.redirect('/admin/students');
                });
            }
        });
    }


});

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

