var mongoose = require('mongoose');

var DiplomaSchema = mongoose.Schema({
    lastName: {
      type: String,
      required: true
    },
    firstName:{
      type: String,
      required: true
    },
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
    document: {
        type: String
    }
});

var Diploma = module.exports = mongoose.model('Diploma', DiplomaSchema);