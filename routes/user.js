var express = require('express');
var router = express.Router();

var OperationResult = require('../utils/operationresult');
var User = require('../models/user');
var ChangePwd = require('../models/changepwd');

router.get('/login', function(req, res, next) {
    return res.render('user/login');
});

router.post('/login', function(req, res, next) {
    var inputUser = new User(
        {
            username:req.body.username, 
            password:req.body.password
        });
    User.findOne({username:inputUser.username, password:inputUser.password}, function(err, user){
        if(user){
            req.session.user = user;
            return res.redirect("/");
        } else{
            res.locals.operationResult = new OperationResult(false, '用户名或密码不存在！');
    	    return res.render('user/login', { model: inputUser });
        }
    });
});

// 注意，只有sysadmin可以注册其它用户
router.get('/register', function(req, res, next){
   return res.render("user/register"); 
});

router.post('/register', function(req, res, next){
   var newUser = new User({
      username : req.body.username,
      password: req.body.password,
      roles: req.body.roles
   });
   if(newUser.username || newUser.password){
       User.findOne({username:newUser.username}, function(err, existed){
          if(existed){
              res.locals.operationResult = new OperationResult(false, '用户名已存在，请重试');
              return res.render('user/register', { model: newUser });
          } else{
              newUser.save(function(err, user){
                  res.locals.operationResult = new OperationResult(true, '用户注册成功');
                  return res.render('user/register', { model: newUser });
              });
          }
       });
   }
});

router.get('/list', function(req, res, next){
    User.find({}, function(err, users){
       return res.render('user/list', {model: users}); 
    });
});

router.get('/edit/:userId', function(req, res, next){
   var userId = req.params.userId;
   User.findById(userId, function(err, user){
      return res.render('user/edit', {model: user}); 
   });
});

router.post('/edit/:userId', function(req, res, next){
   var userId = req.params.userId;
   User.findByIdAndUpdate(userId, { $set: { roles: req.body.roles } }, function(err, result){
       res.locals.operationResult = new OperationResult(true, '修改成功');
       result.roles = req.body.roles;
       return res.render('user/edit', { model: result });
   });
});

router.post('/delete/:userId', function(req, res, next){
   var userId = req.params.userId;
   User.remove({_id:userId}, function(err){
      if(err){
          return res.status(500).end();
      } else{
          return res.status(200).end();
      }
   });
});

router.get('/changepwd', function(req, res,next){
   if (!req.session.user){
       return res.redirect('/user/login');
   }
   return res.render('user/changepwd'); 
});

router.post('/changepwd', function(req, res,next){
   if (!req.session.user){
        return res.redirect('/user/login');
   }
   var userid = req.session.user._id;
   User.findOneAndUpdate({_id:userid, password:req.body.oldpassword}, 
       {$set:{password:req.body.newpassword}}, function(err, user){
           if(err){
               res.locals.operationResult = new OperationResult(true, '密码修改失败！');    
           } else{
               res.locals.operationResult = new OperationResult(true, '密码修改成功！');
           }
           return res.render('user/changepwd');
       });
});

router.get('/logout', function(req, res, next){
   req.session.user = null;
   return res.redirect('/user/login'); 
});

module.exports = router;
