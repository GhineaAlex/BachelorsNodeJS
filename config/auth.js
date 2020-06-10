exports.isUser = function(req, res, next) {
    if(req.isAuthenticated()){
        next();
    } else {
        req.flash('danger', 'Este nevoie sa te loghezi');
        res.redirect('/users/login');
    }
}

