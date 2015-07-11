var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var engine = require('express-hbs');
var session = require('express-session');

// 引入自定义Module
var database = require('./utils/database');                   // 数据库操作
var hbsHelpers = require('./utils/hbshelpers');               // Handlerbar Helper注册
var authorization = require('./utils/authorization');         // 访问授权

// 引入路由及控制器定义
var index = require('./routes/index');
var user = require('./routes/user');
var category = require('./routes/category');
var keyword = require('./routes/keyword');
var publisher = require('./routes/publisher');
var book = require('./routes/book');
var order = require('./routes/order');
var customer = require('./routes/customer');

var app = express();

// 设置视图引擎
app.set('views', path.join(__dirname, 'views'));                // 视图所在路径
// 配置Handlebar视图引擎
app.engine('hbs', engine.express4({
  partialsDir: path.join(__dirname, 'views/partials'),          // Partial视图搜索路径
  layoutsDir: path.join(__dirname, 'views/layouts'),            // 模板Layout视图搜索路径
  defaultLayout: path.join(__dirname, 'views/layouts/layout')   // 默认模板视图
}));
app.set('view engine', 'hbs');
// 注册Handlebar中的Helper函数
hbsHelpers.registerHandlebarHelpers(engine);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 设置cookie和session
// 使用：npm install express-session --save   安装session模块
// 参考：https://www.npmjs.com/package/express-session
app.use(session({
    secret: 'mall_admin_session',
    resave: false,
    saveUninitialized: true,
    cookie: { 
      maxAge: 900000,
    }
}));

// 在各router处理请求之前检查权限
authorization.authorize(app);

// 配置router
app.use('/', index);
app.use('/user', user);
app.use('/category', category);
app.use('/keyword', keyword);
app.use('/publisher', publisher);
app.use('/book', book);
app.use('/order',order);
app.use('/customer', customer);

// 404错误处理
app.use(function(req, res, next) {
  var err = new Error('URL连接不存在！');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// 数据库开闭
database.open();
app.on('close', function(){
  database.close();
});

module.exports = app;
