// 暂未实现，仅作简单演示用

var express = require('express');
var router = express.Router();

router.get('/region', function(req, res, next) {
  res.render('customer/region');
});

router.get('/search', function(req, res, next) {
  res.render('customer/search');
});

module.exports = router;
