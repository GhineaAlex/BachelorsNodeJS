var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcryptjs');

var User = require('../models/user');

router.get('/register', function (req, res){
    res.render('register', {
        title: 'Register'
    });
});


router.post('/register', function (req, res){
    
    var nameUniv = req.body.nameUniv;
    var nameFac = req.body.nameFac;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var city = req.body.city;
    var phoneNumber = req.body.phoneNumber;

    req.checkBody('nameUniv', 'Este nevoie de numele universitatii').not().isEmpty();
    req.checkBody('nameFac', 'Este nevoie de numele facultatii').not().isEmpty();
    req.checkBody('email', 'Email-ul este necesar').isEmail();
    req.checkBody('username', 'Username-ul este necesar').not().isEmpty();
    req.checkBody('password', 'Parola este necesara').not().isEmpty();
    req.checkBody('city', 'Este nevoie de un oras').not().isEmpty();
    req.checkBody('phoneNumber', 'Numarul de telefon este necesar').not().isEmpty();

    var errors = req.validationErrors();

    if (errors){
        res.render('register', {
            errors: errors,
            title: 'Register',
            user: req.user
        })
    } else {
        User.findOne({username: username}, function (err, user){
            if(err) console.log(err);

            if (user){
                req.flash('danger', 'Username exists');
                res.redirect('/users/register');
            } else {
                
                var user = new User({
                    nameUniv: nameUniv,
                    nameFac: nameFac,
                    email: email,
                    username: username,
                    password: password,
                    admin: 1,
                    city: city,
                    phoneNumber: phoneNumber
                });

                bcrypt.genSalt(10, function(err, salt){
                    bcrypt.hash(user.password, salt, function(err, hash){
                        if (err)
                            console.log(err);
                        user.password = hash;
                        user.save(function(err){
                            if (err){
                                console.log(err)
                            } else{
                                req.flash('success', 'Contul a fost creat cu succes');
                                res.redirect('/users/login');
                                res.render('register', {
                                    user: req.user
                                })
                            }
                        })
                    })
                })
            }
        })
    }
});

//GET LOGIN

router.get('/login', function(req, res){
    if (res.locals.user) res.redirect('/');

    res.render('login', {
        title: 'Login'
    })
})


//POST LOGIN
router.post('/login', function(req, res, next){
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

//GET LOGOUT
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');

    res.render('logout', {
        title: "Logout"
    })
})

module.exports = router;
