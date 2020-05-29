var mongoose = require('mongoose');

var DiplomaSchema = mongoose.Schema({
    degree:{
      type: String,
      required: true
    },
    slug: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    student: {
      type: String,
      required: true
    },
    document: {
        type: String
    },
    hashId: {
      type: String,
      required: true
    }
});

var Diploma = module.exports = mongoose.model('Diploma', DiplomaSchema);