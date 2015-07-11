/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/express/express.d.ts" />

var express = require('express');
var router = express.Router();

var Keyword = require('../models/keyword');
var OperationResult = require('../utils/operationresult');

router.get('/', function(req, res, next){
	Keyword.find({}, function(err, keywords){
		res.render('keyword/list', {model:keywords});
	});
});

router.get('/search?', function(req, res, next){
	// 使用规则表达式构造模糊匹配查询
	var filter = "^" + (req.query.filter ? req.query.filter.toLowerCase() : "");
	Keyword.find({name:{$regex : filter}}, function(err, results){
		res.json(results);
	});
});

router.get('/create', function(req, res, next){
	res.render('keyword/create');
});

router.post('/create', function(req, res, next){
	var name = req.body.name;
	var lowerName = name.toLowerCase();
	Keyword.findOne({'name':lowerName}, function(err, existed){
		if(existed){
			res.locals.operationResult =  new OperationResult(false, '关键字【' + lowerName + '】已存在！');
			return res.render('keyword/create', {model : existed});
		}
		var newKeyword = new Keyword({name: lowerName});
		newKeyword.save(function(err, keyword){
			res.locals.operationResult = new OperationResult(true, '关键字【' + lowerName + '】添加成功！');
			return res.render('keyword/create', {model:keyword});
		});
	});
});

router.post('/delete/:name', function(req, res, next){
	var name = req.params.name;
	var lowerName = name.toLowerCase();
	Keyword.remove({'name':lowerName}, function(err){
		res.status(200).end();
	});
});

module.exports = router;