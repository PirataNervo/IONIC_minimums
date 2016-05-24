var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var Student = mongoose.model('Student');
var Subject = mongoose.model('Subject');

router.post('/', function(req, res, next) {
	
	if(!req.body.name) {
		return res.status(400).json({message: 'Please enter a name for the subject.'});
	}
	
	var subject = new Subject();
	subject.name = req.body.name;
	subject.students = [];
	
	subject.save(function(err, newSubject){
		if(err){ return next(err); }

		res.json({message: 'Subject added successfully!'});
	});
});

router.get('/', function(req, res, next) {
	Subject.find(function(err, subjects){
	if(err){ return next(err); }

		res.json(subjects);
	});
});

router.get('/:subject', function(req, res, next) {
	var subjectID = req.params.subject;
	
	Subject.findOne({_id: subjectID}).populate('students').exec(function (err, subject){
		if(err){ return next(err); }

		res.json(subject);
	});
});

module.exports = router;
