var mongoose = require('mongoose');

var StudentSchema = mongoose.Schema({
    lastName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    birthCountry: {
        type: String,
        required: true
    },
    birthCounty: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    cnp: {
        type: Number,
        required: true
    },
    idCi: {
        type: String,
        required: true
    },
    dateCi: {
        type: Date,
        required: true
    },
    collegeName: {
        type: String,
        required: true
    },
    typeOfStudy: {
        type: String,
        required: true
    },
    emailStudent:{
        type: String,
        required: true
    }
});

var Student = module.exports = mongoose.model('Student', StudentSchema)