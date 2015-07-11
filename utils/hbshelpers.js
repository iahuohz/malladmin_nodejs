// 用于定义Handlebar视图中使用的UI组件：下拉框(dropdownList)，分页元素(pagedBookAnchor)，日期格式化函数(formatDate)

function dropdownList(engine){
    engine.registerHelper('dropdownList', function (name, hintLabel, items, options) {
        var out = "<select class='form-control' data-bind='value:category' name='>" + name + "' id='" + name + "'><options>";
        out += "<option value=''>" + hintLabel + "</option>";
        for (var i = 0, l = items.length; i < l; i++) {
            out = out + options.fn(items[i]);
        }
        return out + "</options></select>";
    });
}

function pagedBookAnchor(engine){
    engine.registerHelper('pagedBookAnchor', function(searchModel, items, options){
        var queryUrl = "search?title=" + searchModel.title + "&isbn=" + searchModel.isbn + "&name=" + searchModel.name +
    		  "&publisher=" + searchModel.publisher + "&category=" + searchModel.category + "&status=" + searchModel.status;
        var html = "<li><a href='" + queryUrl + "&pageindex=1'>&lt;&lt;</a></li>";  // 第一页
        var prevpageIndex = (searchModel.pageIndex == 1 ? 1: searchModel.pageIndex -1 );
        html += "<li><a href='" + queryUrl + "&pageindex=" + prevpageIndex + "'>&lt;</a></li>";   // 上一页
        html += "<li><a>第<strong>" + searchModel.pageIndex + "</strong>页</a></li>";             //  当前页
        var nextpageIndex = (searchModel.pageIndex == searchModel.totalPages ? searchModel.totalPages : searchModel.pageIndex + 1);
        html += "<li><a href='" + queryUrl + "&pageindex=" + nextpageIndex + "'>&gt;</a></li>";   // 下一页  
        html += "<li><a href='" + queryUrl + "&pageindex=" + searchModel.totalPages + "'>&gt;&gt;</a></li>";  // 最末页
        html += "<li><a>共<strong>" + searchModel.total + "</strong>条记录，共<strong>" 
          + searchModel.totalPages + "</strong>页</a></li>";
        return html;
    });
}

function formatDate(engine){
    engine.registerHelper('formatDate', function(date, options){
      return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }); 
}


exports.registerHandlebarHelpers = function(engine){
    dropdownList(engine);
    pagedBookAnchor(engine);
    formatDate(engine);
};

