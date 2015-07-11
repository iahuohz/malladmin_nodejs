/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/express/express.d.ts" />

var express = require('express');
var router = express.Router();

var Category = require('../models/category');
var Book = require('../models/book');
var OperationResult = require('../utils/operationresult');

router.get('/', function (req, res, next) {
	Category.find({}, function (err, categories) {
		res.render('category/list', { model: categories });
	});
});

router.get('/json', function(req, res, next){
	Category.find({}, function(err, categories){
		return res.status(200).json(categories);
	});
});

router.get('/create', function (req, res, next) {
	res.render('category/create');
});

router.post('/create', function (req, res, next) {
	var name = req.body.name;

	Category.findOne({ "name": name }, function (err, existed) {
		if (existed) {
			res.locals.operationResult = new OperationResult(false, '目录【' + name + '】名称已存在！');
			return res.render('category/create', { model: existed });
		}
		Category.maxId(function (maxId) {
			var newid = maxId + 1;
			var newCategory = new Category({ _id: newid, name: name });
			newCategory.save(function (err, category) {
				res.locals.operationResult = new OperationResult(true, '目录【' + category.name + '】创建成功！');
				res.render('category/create', { model: category });
			});
		});
	});
});

router.get('/:categoryId', function (req, res, next) {
	var categoryId = parseInt(req.params.categoryId);
	Category.findOne({ _id: categoryId }, function (err, category) {
		res.render('category/edit', { model: category });
	});
});

router.post('/:categoryId', function (req, res, next) {
	var categoryId = parseInt(req.params.categoryId);
	var name = req.body.name;
	Category.findOne({ name: name, _id: { $ne: categoryId } }, function (err, existed) {
		if (existed) {
			res.locals.operationResult = new OperationResult(false, '目录【' + name + '】名称已存在！');
			return res.render('category/edit', { model: existed });
		}
		/*Category.findOne({_id:categoryId}, function(err, category){
			category.name = name;
			category.save(function(err, result){
				res.locals.operationResult =  new OperationResult(true, '目录【' + name + '】修改成功！');
				return res.render('category/edit', {model : result});
			});
		});*/
		Category.findOneAndUpdate({ _id: categoryId }, { $set: { name: name } }, function (err, result) {
			res.locals.operationResult = new OperationResult(true, '目录【' + name + '】修改成功！');
			result.name = name;
			return res.render('category/edit', { model: result });
		});
	});
});

router.get('/delete/:categoryId', function (req, res, next) {
	var categoryId = parseInt(req.params.categoryId);
	Category.findOne({ _id: categoryId }, function (err, category) {
		res.render('category/delete', { model: category });
	});
});

router.post('/delete/:categoryId', function (req, res, next) {
	var categoryId = parseInt(req.params.categoryId);
	Category.findOne({ _id: categoryId }, function (err, category) {
		Book.findOne({ category: categoryId }, { _id: 1 }, function (err, bookid) {
			if (bookid) {
				res.locals.operationResult = new OperationResult(false, '目录【' + category.name + '】包含图书信息，无法删除！');
				return res.render('category/delete', { model: category });
			}
			category.remove(function (err) {
				if (err) {
					res.locals.operationResult = new OperationResult(true, '目录【' + category.name + '】删除失败！');
				} else {
					res.locals.operationResult = new OperationResult(true, '目录【' + category.name + '】删除成功！');
				}
				return res.render('category/delete', { model: category });
			});
		});
	});
});

module.exports = router;