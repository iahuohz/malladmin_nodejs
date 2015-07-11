/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/express/express.d.ts" />

var express = require('express');
var router = express.Router();

var Publisher = require('../models/publisher');
var OperationResult = require('../utils/operationresult');

router.get('/', function(req, res, next){
	Publisher.find({}, function(err, publisher){
		res.render('publisher/list', {model:publisher});
	});
});

router.get('/search?', function(req, res, next){
	var filter = "^" + (req.query.filter ? req.query.filter.toLowerCase() : "");
	Publisher.find({name:{$regex : filter}}, function(err, results){
		res.json(results);
	});
});

router.get('/create', function(req, res, next){
	res.render('publisher/create');
});

router.post('/create', function(req, res, next){
	var name = req.body.name;
	var lowerName = name.toLowerCase();
	Publisher.findOne({'name':lowerName}, function(err, existed){
		if(existed){
			res.locals.operationResult =  new OperationResult(false, '出版社【' + lowerName + '】已存在！');
			return res.render('publisher/create', {model : existed});
		}
		var newPublisher = new Publisher({name: lowerName});
		newPublisher.save(function(err, publisher){
			res.locals.operationResult = new OperationResult(true, '关键字【' + lowerName + '】添加成功！');
			return res.render('publisher/create', {model:publisher});
		});
	});
});

router.post('/delete/:name', function(req, res, next){
	var name = req.params.name;
	var lowerName = name.toLowerCase();
	Publisher.remove({'name':lowerName}, function(err){
		res.status(200).end();
	});
});

module.exports = router;