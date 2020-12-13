var express = require('express');
var router = express.Router();
var auth = require('../config/auth');
var isUser = auth.isUser;
var Student = require('../models/student');


router.get('/', isUser, function(req, res){
    Student.find(function(err, students){
        if(err) return console.log(err);
        res.render('admin/students', {
            students: students
        });
    });
});

//GET add page
router.get('/add-student', isUser, function(req, res){

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
    var emailStudent = "";

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
        typeOfStudy: typeOfStudy,
        emailStudent: emailStudent
    });
});

//POST add page
router.post('/add-student', isUser, function(req, res){
    
    req.checkBody('lastName', 'Trebuie introdus numele de familie').not().isEmpty();
    req.checkBody('firstName', 'Trebuie introdus prenumele').not().isEmpty();
    req.checkBody('birthCountry', 'Trebuie introdusa tara de nastere').not().isEmpty();
    req.checkBody('birthCounty', 'Trebuie introdus judetul de nastere').not().isEmpty();
    req.checkBody('gender', 'Trebuie introdus sexul').not().isEmpty();
    req.checkBody('cnp', 'Trebuie introdus CNP').not().isEmpty();
    req.checkBody('idCi', 'Trebuia introdusa seria').not().isEmpty();
    req.checkBody('collegeName', 'Trebuie introdus numele Facultatii').not().isEmpty();
    req.checkBody('typeOfStudy', 'Trebuie introdus tipul de studiu (Cu Frecventa, Fara Frecventa, Invatamant la Distanta)').not().isEmpty();
    
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
    var emailStudent = req.body.emailStudent;

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
                    typeOfStudy: typeOfStudy,
                    emailStudent: emailStudent
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

//Exports
module.exports = router;


