var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bcrypt = require('bcryptjs');

module.exports = function (passport) {
    passport.use(new LocalStrategy(function (username, password, done){
        console.log(username);
        User.findOne({username: username}, function(err, user){
            if (err)
                console.log(err);
            if (!user){
                return done(null, false, {message: 'Nu a fost gasit niciun utilizator'});
            }

            bcrypt.compare(password, user.password, function(err, isMatch){
                if (err)
                    console.log(err);
                if (isMatch){
                    return done(null, user);
                } else{
                    return done(null, false, {message: 'User gresit'});
                }
            });
        });
    }));
    passport.serializeUser(function(user, done){
        done(null, user.id);
    })
    passport.deserializeUser(function (id, done){
        User.findById(id, function (err, user){
            done(err, user);
        })
    })

}
