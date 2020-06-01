var mongoose = require('mongoose');

//User Schema
var UserSchema = mongoose.Schema({
    nameUniv: {
        type: String,
        required: true
    },
    nameFac: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    admin: {
        type: Number,
        required: true
    },
    wallet: {
        type: String
    }
});

var User = module.exports = mongoose.model('User', UserSchema);