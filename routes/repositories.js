var express = require('express');
var repositories_model = require('../models/repositories');
var router = express.Router();

/* GET respositories listing. */
router.get('/add', function(req, res) {
	var repository = new repositories_model.Repository({email: "roberth@surveymonkey.com"});
	repository.save(function (err) {
		if (err)
			res.send("Shit");
		res.send(repository);
	});
});

/* GET respositories listing. */
router.get('/:id/edit', function(req, res) {
	repositories_model.Repository.find({_id: req.params.id}, function(err, data) {
		if (err) {
			res.send(err);
		}

		data[0].name = "Robdawg";
		data[0].save(function (err) {
			if (err)
				res.send("Shit3");
			res.redirect("/repositories/"+ data[0]._id);
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

/* GET respositories listing. */
router.get('/', function(req, res) {
	repositories_model.Repository.find({}, function(err, data){
		res.json(data);
	})
});

module.exports = router;
