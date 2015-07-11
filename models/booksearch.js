// 封装用于图书分页显示的数据模型

var bookSearch = function(){
	this.pageIndex = 1;		// 当前页，从1开始
	this.pageSize = 5;		// 每页最大显示元素个数
	this.total = 0;			// 总元素个数
	this.totalPages = 0;	// 总页数
	this.title = "";		// 保存分页请求中的title值，以便能填充到编辑框中。(否则在提交请求后，编辑框中将为空白)
	this.isbn = "";
	this.name = "";
	this.publisher = "";
	this.category = "";
	this.status = 1;
};

module.exports = bookSearch;