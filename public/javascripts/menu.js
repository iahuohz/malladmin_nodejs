(function(){
	var url = window.location.pathname;
	var data_role = "";
	var hrefs = $("#menu a");
	for(var i=0;i<hrefs.length;i++){
		var item = $(hrefs[i]);
		if(item.attr("href") == url){
			data_role = item.attr("data-role");
			break;
		}
	}
	$("#menu > li").each(function(index, item){
		if($(item).attr("data-role") == data_role){
			$(item).addClass("active");
		} else{
			$(item).removeClass("active");
		}
	});
})();