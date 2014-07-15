/**
 *首页单独使用的js块级代码
 */
var indexModule = exports;
var $ = require('jquery');
var cheYouModule = require('app/v1/common/cheyou');
var logCollectModule = require('app/v1/common/log_collect');
var uuidModule = require('app/v1/common/uuid');
var carModule = require('app/v1/car/car');
var brandFastModule = require('app/v1/car/brand_fast');
var commonModule = require('app/v1/common/common');
var headerModule = require('app/v1/common/header');
var bdsugModule = require('app/v1/common/bdsug');
var indexCommonModule = require('app/v1/common/index_common');
var widgetModule = require('lib/widget/widget');

//执行函数
//ch为日志统计所需要的eqsch
indexModule.init = function(ch){
	headerModule.readyAction();
	uuidModule.init();
	uuidModule.setUuid();
	widgetModule.initWidgets();
	indexCommonModule.scrollText();
	commonModule.lazyLoadPic();
	indexCommonModule.problemSubmit();
	indexCommonModule.priceTab();
	indexCommonModule.fastSearchPrice();
	indexCommonModule.fastSearchSubmit();
	indexCommonModule.typeTabHover();
	indexModule.readyAction();
	carModule.readyAction();
	brandFastModule.readyAction();
	bdsugModule.init;
	indexCommonModule.friendLink();
	logCollectModule.init(ch);
};

//首页准备好时需要执行的一些事情
indexModule.readyAction = function(){
	cheYouModule.TMX("#cha_type","#cha_brands","#cha_chexi","#cha_chexing");
    cheYouModule.ALD("#province","#city");
    cheYouModule.ALD("#top_province","#top_city");
    cheYouModule.sinput("#telphone");
    cheYouModule.sinput("#kw");
    $("#pcbTab ul.tabs li").hover(function(){
		if($(this).attr("class")=="more") return;
		var bgntime=$(this).attr('bgntime');
		$(this).addClass("on");
		$(this).siblings().removeClass("on");
		var conobj=$("#pcbTab .contents ul[bgntime='"+bgntime+"']");
		$("#pcbTab .contents ul").addClass("hidden");
		conobj.removeClass("hidden");
	});
	//评估提交
	$("#pingguBtn").bind("click", function(){
		var type=$("#cha_type").val();
		var make=$("#cha_brands").find("option:selected").attr("_path").toUpperCase();make=make==undefined?"":make;
		var family=$("#cha_chexi").val();family=family==undefined?"":family;
		var chexing=$("#cha_chexing").val();chexing=chexing==undefined?"":chexing;
		var years=$("#years").val();
		var months=$("#months").val();
		var province=$("#province").val();
		var city=$("#city").val();
		var telphone=$("#telphone").val();
		if(type=="" || make==""){
			alert("请选择类型和品牌！");
			return false;
		}
		if(family==""){
			alert("请选择车系！");
			return false;
		}
		if(chexing==""){
			alert("请选择车型！");
			return false;
		}
		if(years=="" || months==""){
			alert("请选择上牌时间！");
			return false;
		}
		if(province=="" || city==""){
			alert("请选择交易地区！");
			return false;
		}
		if(telphone=="" || telphone=='用于回复结果'){
			alert("请填写联系电话！");
			return false;
		}else{
			reg=/^0{0,1}(13|14|15|18)[0-9]{9}$/i;
			if (!reg.test(telphone)){
					alert("请正确填写手机号码！");
					return false;
				}
			}
		var km=commonModule.trim($("#pgkilometer").val());
		if(!commonModule.isNumber(km) || km<=0 || km>100){
			alert("行驶里程请输入0.01-100范围内的数字！");
			return false;
		}
		return true;
	});
	/*var tprovince= G.config('fast_province');
	var tcity= G.config('fast_city');
	$("#top_province").val(tprovince);
	$("#top_city").val(tcity);*/
	$("#brandfast").click(function(){
		$("#showBrands").show();		
	});
};