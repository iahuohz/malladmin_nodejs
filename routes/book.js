/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/express/express.d.ts" />

var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');

var Category = require('../models/category');
var Book = require('../models/book');
var OperationResult = require('../utils/operationresult');
var BookSearch = require('../models/booksearch');

router.get('/create', function (req, res, next) {
    Category.find({}, function (err, categories) {
        res.render('book/create', { model: categories });
    });
});

router.post('/create', function (req, res, next) {
    var book = new Book({
        title: req.body.title,
        isbn: req.body.isbn,
        authors: req.body.authors,
        category: req.body.category,
        publisher: req.body.publisher,
        publishdate: req.body.publishdate,
        keywords: req.body.keywords,
        edition: req.body.edition,
        listprice: req.body.listprice,
        reducedprice: req.body.reducedprice,
        pages: req.body.pages,
        status: 1,
        description: req.body.description
    });

    // 在服务器端验证数据
    if (!book.title || !book.isbn || !book.authors.length || !book.category || !book.publisher ||
        !book.publishdate || !book.edition || !book.listprice || !book.reducedprice || !book.pages) {
        return res.status(400).json({ error: "提交数据验证错误！" });
    }

    book.save(function (err, book) {
        if (err) {
            return res.status(500).json({ error: "无法添加图书数据！" });
        } else {
            return res.status(200).json({ success: true });
        }
    });
});

// 编辑图书信息。本GET请求仅返回了所有图书类别信息数据；图书本身的数据通过AJAX请求/book/api/:bookId获得。
router.get('/edit/:bookId', function (req, res, next) {
    Category.find({}, function (err, categories) {
        res.render('book/edit', { model: categories });
    });
});

// 本URL请求用于从图书编辑页面上通过AJAX请求获取图书详细数据
router.get('/api/:bookId', function(req, res, next){
    var bookId = req.params.bookId;
    Book.findById(bookId, function(err, book){
       Category.find({}, function(err, categories){
           return res.status(200).json({categories:categories, book:book});
       });
    });
});

router.post('/edit/:bookId', function (req, res, next) {
    var bookId = req.params.bookId;

    var book = new Book({
        _id: bookId,
        title: req.body.title,
        isbn: req.body.isbn,
        authors: req.body.authors,
        category: req.body.category,
        publisher: req.body.publisher,
        publishdate: req.body.publishdate,
        keywords: req.body.keywords,
        edition: req.body.edition,
        listprice: req.body.listprice,
        reducedprice: req.body.reducedprice,
        pages: req.body.pages,
        status: req.body.status,
        description: req.body.description
    });

    if (!book.title || !book.isbn || !book.authors.length || !book.category || !book.publisher ||
        !book.publishdate || !book.edition || !book.listprice || !book.reducedprice || !book.pages) {
        return res.status(400).json({ error: "提交数据验证错误！" });
    }
    Book.findByIdAndUpdate(bookId, book, function (err, book) {
        if (err) {
            return res.status(500).json({ error: "图书数据更新失败！" });
        } else {
            return res.status(200).json({ success: true });
        }
    });
});

router.get('/search', function (req, res, next) {
    var filter = {};
    var search = new BookSearch();
    if(req.query.title){
        filter.title = {$regex : "(?i)" + req.query.title};
        search.title = req.query.title;
    }
    if(req.query.isbn){
        filter.isbn = {$regex : req.query.isbn};
        search.isbn = req.query.isbn;
    }
    if(req.query.name){
        filter["authors.name"] = {"$in" : [req.query.name]};
        search.name = req.query.name;
    }
    if(req.query.publisher){
        filter.publisher = req.query.publisher;
        search.publisher = req.query.publisher;    
    }
    if(req.query.category){
        filter.category = req.query.category;
        search.category = req.query.category;
    }
    if(req.query.status){
        filter.status = req.query.status;
        search.status = req.query.status;
    }
    if(req.query.pageindex){
        search.pageIndex = parseInt(req.query.pageindex);
    }
    
    Book.find(filter, function(err, books){
         search.total = books.length;
         search.totalPages =  Math.ceil(search.total / search.pageSize);
         var results = books.slice(search.pageSize*(search.pageIndex-1), search.pageSize*search.pageIndex);
         return res.render('book/search', {model:results, search:search });
    });
    /*Book.find(filter).skip(pageIndex*pageSize).limit(pageSize).count(.exec(function (err, books) {
        res.render('book/search', { model: books });
    });*/
});

// 图书图片处理URL
router.get('/bookimage/:bookId', function (req, res, next) {
    var bookId = req.params.bookId;
    Book.findById(bookId, function (err, book) {
        res.render('book/bookimage', { model: book });
    });
});

router.post('/bookimage/:bookId', function (req, res, next) {
    var bookId = req.params.bookId;

    Book.findById(bookId, function (err, book) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (error, fields, files) {
            var fileName = bookId + ".png";
            var fileUrl = './public/bookimages/' + fileName;
            fs.rename(files.imageFile.path, fileUrl, function (error) {
                if (error) {
                    res.locals.operationResult = new OperationResult(false, '文件上传失败!');
                } else {
                    if (!book.pictureUrl) {                                         // 该图书尚未上传图片
                        book.pictureUrl = fileName;
                        book.save(function (err, result) {                          // 在数据库中保存字段
                            if (err) {
                                res.locals.operationResult = new OperationResult(false, '文件上传失败!');
                            } else {
                                res.locals.operationResult = new OperationResult(true, '文件上传成功！');
                            }
                            res.render('book/bookimage' + bookId, { model: book });
                        });
                    } else {
                        res.locals.operationResult = new OperationResult(true, '文件上传成功！');
                        res.render('book/bookimage', { model: book });
                    }
                }
            });
        });
    });
});

// 图书下架
router.post('/pulloff/:bookId', function(req, res, next){
   var bookId = req.params.bookId;
   Book.findById(bookId, function(err, book){
       if(book){
           book.status = 0;
           book.save(function(err, result){
              if(err){
                  return res.status(500).end();
              } else{
                  return res.status(200).end();
              }
           });
       };
   });
});

// 图书上架
router.post('/pullon/:bookId', function(req, res, next){
   var bookId = req.params.bookId;
   Book.findById(bookId, function(err, book){
       if(book){
           book.status = 1;
           book.save(function(err, result){
              if(err){
                  return res.status(500).end();
              } else{
                  return res.status(200).end();
              }
           });
       };
   });
});


module.exports = router;