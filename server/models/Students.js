var mongoose = require('mongoose');

var StudentSchema = new mongoose.Schema({
    name: { type: String, required: true},
    address: { type: String, required: true},
	phones : { type : Array , "default" : [] }
});

module.exports = mongoose.model('Student', StudentSchema);