var categoryModule = exports;
var $ = require('jquery');
categoryModule.init = function(){
	$(".alls").mouseenter(function(){
		 t = setTimeout(function(){
		 	$("#alls").show();
		 },200);
	});
	 $(".alls").mouseleave(function(){
		clearTimeout(t);
	});
	 $("#alls").mouseenter(function(){
		$('li.alls').addClass('alls-on');
	});
	$("#alls").mouseleave(function(){
		$("#alls").hide();
		$('li.alls').removeClass('alls-on');
	});
	$("ul#tips li").mouseenter(function(){
		$(this).find('.tips').show()
		$(this).addClass('on');
	});
	$("ul#tips li").mouseleave(function(){
		$(this).find('.tips').fadeOut('100')
		$(this).removeClass('on');
	});
};