// 用于记录某个操作的执行结果信息
// 该信息将从控制器中传递到Handlebar页面上
var OperationResult = function(success, message){
	this.success = success;
	this.message = message;
};

module.exports = OperationResult;