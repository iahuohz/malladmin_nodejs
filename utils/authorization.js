// 用于对所有url请求进行授权
// 允许匿名访问：首页、登录页和注销请求
// 其余url请求必须具有相应权限。系统分为sysadmin, productadmin和salesadmin角色
// 目录、书籍等管理：仅sysadmin, productadmin可访问
// 订单、客户管理：仅sysadmin, salesadmin可访问
// 用户管理：仅sysadmin可访问

exports.authorize = function(app){
	app.use(function (req, res, next) {
		res.locals.user = req.session.user;		// 将session中的user对象赋值给locals，从而在视图中可直接访问user对象
		
	    var url = req.url;
		// 下列url可以匿名访问
	    if (url == '/' || url == '/user/login' || url == '/user/logout'){
	        return next();
	    }
	    
		// 其余url均需先登录
	    var user = req.session.user;
	    if(!user){
	      return res.redirect('/user/login');
	    }
		
		// "修改密码"url登录后即可访问
		if(url == '/user/changepwd'){
			return next();
		}
		
		// 解析出url的第一节文本，后续授权仅根据该节文本进行
		// 例如：/book/search解析后成为：/book  又如：/category解析后仍为：/category
		var section = "";
	    var firstIndex = url.indexOf('/');
	    var secondIndex = url.indexOf('/', firstIndex+1);
	    if (secondIndex < 0){
	        section = url;
	    } else{
	        section = url.substring(firstIndex, secondIndex);
	    }
	   
	    var isSysAdmin = false;
	    var isProductAdmin = false;
	    var isSalesAdmin = false;
	    for(var i=0;i<user.roles.length;i++){
	      if(user.roles[i] == "sysadmin"){
	        isSysAdmin = true;
	      }
	      if(user.roles[i] == "productadmin"){
	        isProductAdmin = true;
	      }
	      if(user.roles[i] == "salesadmin"){
	        isSalesAdmin = true;
	      }
	    }
	    switch(section){
	      case "/category":
	      case "/keyword":
	      case "/publisher":
	      case "/book":
	        if(!isSysAdmin && !isProductAdmin){
	          return res.redirect('/user/login');
	        }
	        break;
	      case "/order":
	      case "/customer":
	        if(!isSysAdmin && !isSalesAdmin){
	          return res.redirect('/user/login');
	        }
	        break;
	      case "/user":
	        if(!isSysAdmin){
	          return res.redirect('/user/login');
	        }
	        break;   
	    }
	    next();
	});
};