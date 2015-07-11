// 暂未实现，仅作简单演示用

var express = require('express');
var router = express.Router();

router.get('/todos', function(req, res, next) {
  res.render('order/todos');
});

router.get('/search', function(req, res, next) {
  res.render('order/search');
});

module.exports = router;
