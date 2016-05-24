var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var Student = mongoose.model('Student');
var Subject = mongoose.model('Subject');

router.get('/', function(req, res, next) {
	Student.find(function(err, students){
	if(err){ return next(err); }

		res.json(students);
	});
});

router.get('/:student', function(req, res, next) {
	var studentID = req.params.student;
	
	Student.findOne({_id: studentID}).exec(function (err, student){
		if(err){ return next(err); }

		res.json(student);
	});
});

router.post('/', function(req, res, next) {

	if(!req.body.name || !req.body.address || typeof req.body.phones === 'undefined' || req.body.phones.length == 0) {
		return res.status(400).json({message: 'Please fill out all fields'});
	}

	var student = new Student();
	student.name = req.body.name;
	student.address = req.body.address;
	student.phones = req.body.phones;

	student.save(function(err, newStudent){
		if(err){ return next(err); }
		
		// Now we have to assign the user to the classes we chose
		if(typeof req.body.subjects !== 'undefined' && req.body.subjects.length > 0)
		{
			for(var i = 0; i < req.body.subjects.length; i++)
			{
				Subject.findOne({_id: req.body.subjects[i]}).exec(function (err, docs){
					if (err) {
						return next(err);
					}
					
					if (!docs || typeof docs === 'undefined' || docs.length == 0) {
						return next(new Error('No results found.'));
					}
					
					if(typeof req.body.subjects === 'undefined' || req.body.subjects.length == 0)
						docs.students = [];

					// Let's push!
					docs.students.push(newStudent._id);
					docs.save();
				});
			}
		}

		res.json({message: 'Student added successfully!'});
	});
});

router.post('/assign/:studentID/:subjectID', function(req, res, next) {
	
	var studentID = req.params.studentID;
	var subjectID = req.params.subjectID;

	// Find student
	Student.findOne({_id: studentID}).exec(function (err, student){
		if (err) {
			return next(err);
		}
		
		if (!student) {
			return next(new Error('No student found.'));
		}

		// Find subject
		Subject.findOne({_id: subjectID}).exec(function (err, subject){
			if (err) {
				return next(err);
			}
			
			if (!subject) {
				return next(new Error('No subject found.'));
			}

			// Is the student ID in our students list already?
			if(subject.students !== undefined)
			{
				for(var i=0; i<subject.students.length; i++)
				{
					if(subject.students[i] == studentID)
					{
						return res.status(400).json({message: 'Student is already in the subject.'});
					}
				}
			}
			
			// Let's push!
			subject.students.push(student._id);
			subject.save();
			
			res.json({message: 'Student assigned successfully!', student: student});
		});
	});
});

module.exports = router;
