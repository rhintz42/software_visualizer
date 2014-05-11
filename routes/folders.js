var express = require('express');
var folders_model = require('../models/folders');
var router = express.Router();
//var router = require('./repositories');

/* POST respositories listing. */
router.post('/repositories/:rep_id/folders/', function(req, res) {
	var folder = new folders_model.Folder(req.body);
	folder.save(function (err, data) {
		if (err)
			res.send("Shit");
		res.send(data);
	});
});

/* Possibly look into using scope/bind: http://stackoverflow.com/questions/7274832/maintaining-variables-through-variable-scope-in-javascript */
/* PUT respositories listing. */
router.put('/repositories/:rep_id/folders/:id', function(req, res) {
	folders_model.Folder.find({_id: req.params.id, repository_id: req.params.rep_id}, function(err, data) {
		if (err) {
			res.send(err);
		}

		data[0].email = res.req.body.email;
		data[0].save(function (err) {
			if (err)
				res.send("Shit3");
			res.json(data[0]);
		});
	});
});

/* GET respositories listing. */
router.get('/repositories/:rep_id/folders/:id', function(req, res) {
	folders_model.Folder.find({_id: req.params.id, repository_id: req.params.rep_id}, function(err, data){
		if (err) {
			res.send(err);
		}
		res.json(data);
	})
});

/* DELETE respositories listing. */
router.delete('/repositories/:rep_id/folders/:id', function(req, res) {
	folders_model.Folder.find({ _id: req.params.id }).remove(function(err, data) {
		if (err) {
			res.send(err);
		}
		res.json("Success");
	})
});

/* GET respositories listing. */
router.get('/repositories/:rep_id/folders', function(req, res) {
	folders_model.Folder.find({ repository_id: req.params.rep_id }, function(err, data){
		res.json(data);
	})
});

module.exports = router;
