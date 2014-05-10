var express = require('express');
var repositories_model = require('../models/repositories');
var router = express.Router();

/* POST respositories listing. */
router.post('/', function(req, res) {
	var repository = new repositories_model.Repository(req.body);
	repository.save(function (err) {
		if (err)
			res.send("Shit");
		res.send(repository);
	});
});

/* PUT respositories listing. */
router.put('/:id', function(req, res) {
	repositories_model.Repository.find({_id: req.params.id}, function(err, data) {
		if (err) {
			res.send(err);
		}
		data[0].email = req.body.email;
		data[0].save(function (err) {
			if (err)
				res.send("Shit3");
			res.json(data[0]);
		})
	});
});

/* GET respositories listing. */
router.get('/:id', function(req, res) {
	repositories_model.Repository.find({_id: req.params.id}, function(err, data){
		if (err) {
			res.send(err);
		}
		res.json(data);
	})
});

/* DELETE respositories listing. */
router.delete('/:id', function(req, res) {
	repositories_model.Repository.find({_id: req.params.id}).remove(function(err, data) {
		if (err) {
			res.send(err);
		}
		res.json("Success");
	})
});

/* GET respositories listing. */
router.get('/', function(req, res) {
	repositories_model.Repository.find({}, function(err, data){
		res.json(data);
	})
});

module.exports = router;
