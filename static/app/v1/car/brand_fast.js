//快速搜索处的选择品牌车系下拉框层事件
var brandFastModule = exports;
var $ = require('jquery');
var logCollectModule = require('app/v1/common/log_collect');
brandFastModule.readyAction = function(){
	$("#bandlist li span").live("click",function(){
		var aval=$(this).attr("_path");
		$("#selectbrand").val($(this).attr("_path"));
		$("#jqss-btn").html($(this).attr("title"));
		$("#brandtitle").val($(this).attr("title"));
		$("#bandlist li span").removeClass("on");
		$("#bandlist li span").removeAttr("style");
		$(this).removeClass().addClass("on");		
		$.ajax({
				type: "GET",
				url: "/data.php?a=jqssfamily&q=" + aval,
				dataType: "jsonp",
				jsonp: 'jsonCallback',
				success: function(msg){
						var dataRoot = msg.data;
						var html='';	
						var listr;
						var str="<dl><dd><ul><li><span class=\"hot\" _path=\"\" title=\"\"><b>不限车系</b></span></li></ul></dd></dl>";
						$("#jqss_family").html('');
						$("#jqss_family").append(str);	
						$.each(dataRoot,function(idx,item){
							listr='';
							html="<dl><dt >"+item.title+"</dt><dd ><ul >";
							$.each(item.info,function(key,data){
								listr+="<li><span _path='"+data.family_code+"' title='"+data.des+"' >&middot;"+data.des+"</span></li>";	
							});
							html=html+listr+"</ul></dd></dl>";
							$("#jqss_family").append(html);
						});
					//logCollectModule.eqsch="/index";
					//logCollectModule.collectAllEvent();
					$("#jqss").css("width","720px");
					$("#jqss_family").show();
				}
			});
		
	});
	//根据上面的字母点击，ajax获取品牌信息
	$("#checkbrandbanner ul li span").bind("click",function(){
		var checkzimu=$(this).attr("id");
		$("#checkbrandbanner ul li span").removeClass().addClass("default");
		$("#checkbrandbanner ul li span").removeAttr("style");
		$(this).removeClass("default").addClass("on");
		$("#jqss_family").hide();
		$("#jqss").css("width","282px");
		$.ajax({
				type: "GET",
				url: "/data.php?a=jqssbrand&q=" + checkzimu,
				dataType: "jsonp",
				jsonp: 'jsonCallback',
				success: function(msg){
						var dataRoot = msg.data;
						$("#bandlist").html('');
						$.each(dataRoot,function(idx,item){
							$("#bandlist").append("<li><span _path='"+item.code+"' title='"+item.des+"' data-273-click-log=\"/index/checkbox@etype=click@element=boxpinpai\">&middot;"+item.des+"</span></li>");
						});	
						if (checkzimu!=""){
							//logCollectModule.eqsch = "/index";
							//logCollectModule.collectAllEvent();
						}
				}
			});		
	});

	//选择车系
	$("#jqss_family ul li span").live("click",function(){
		var checkchexi=$(this).attr("_path");
		var chexititle=$(this).attr("title");
		$("#selectfamily").val(checkchexi);
		$("#jqss_family li span").removeClass("on");
		$(this).addClass("on");
		var showchexi=$("#brandtitle").val();;
		var title=showchexi+" "+chexititle;
		$("#jqss-btn").html(title);
		$("#jqss").hide();
		//TODO这里的事件统计要测试
		if (checkchexi==""){
			logCollectModule.trackEventByGjalog('/index/checkbox@etype=click@element=boxbuxian', null, 'click');
	    }else{
	    	logCollectModule.trackEventByGjalog('/index/checkbox@etype=click@element=boxchexi', null, 'click');
	    }
	});
	//快速搜索处的 选择品牌车系下拉框的点击事件
	$("#jqss-btn").click(function(){
		var showtype=$("#jqss").css("display");
		if (showtype=="none")
		{
			$("#jqss").show();
		}else{
			$("#jqss").hide();
		}
	});
	//关闭选择品牌窗口
	$("#closewin").click(function(){
		$("#jqss").hide();
	});
	

//针对IE6下css hover失效的处理
if ($.browser.msie) { 
		//字母选项
		$("#checkbrandbanner ul li span").hover(function() {
			$(this).css("color","#fff");
			$(this).css("background","#2A4B9C");
			$(this).css("text-decoration","none");
			$(this).css("cursor","hand");
		},function(){
			var currentClas=$(this).attr("class");
			if(currentClas!="on"){
				$(this).css("color","#2A4B9C");
				$(this).css("background","#EDF6FB");
				$(this).css("display","block");
				$(this).css("padding-top","2px");
				$(this).css("line-height","14px");
			}
		});
		//品牌hover
		$("#bandlist li span").hover(function() {
			$(this).css("color","#fff");
			$(this).css("background","#2A4B9C");
			$(this).css("text-decoration","none");
			$(this).css("cursor","hand");
		},function(){
			var currentclass=$(this).attr("class");
			if(currentclass!="on"){
				$(this).css("color","#2A4B9C");
				$(this).css("background","none");
				$(this).css("display","block");
				$(this).css("overflow","hidden");
				$(this).css("line-height","18px");
			}
		});
		
		//车系hover
		$("#jqss_family li span").hover(function() {
			$(this).css("color","#fff");
			$(this).css("background","#2A4B9C");
			$(this).css("text-decoration","none");
			$(this).css("cursor","hand");
		},function(){
			$(this).css("color","#2A4B9C");
			$(this).css("background","none");
			$(this).css("display","block");
			$(this).css("overflow","hidden");
			$(this).css("line-height","18px");
		});
		
	};
	//closeCalendarPannel2();
};
//增加点击非弹窗区域关闭弹窗
function closeCalendarPannel2(){
	window.addEventListener('click',function(e){
		var target = e.target || e.srcElement; 
		if((target.getAttribute('id') =='jqss-btn')){
			$("#jqss").show();
		}else if(target.getAttribute('id') =='jqss'){
			$("#jqss").show();
		}else{
			$("#jqss").hide();
		}
	});
}