var headerModule = exports;
var cookieModule = require('util/cookie');
var cheYouModule = require('app/v1/common/cheyou');
var commonModule = require('app/v1/common/common');
var $ = require('jquery');
headerModule.readyAction = function(){
	$("#mNav_"+G.config('menu_id')).attr("class","on");
	var ipCityName = G.config('ip_info_name'),
		ipCityDomain = G.config('ip_info_domain');
	var navi = cookieModule.get('273navit');
	var ipjump = cookieModule.get('273ipjump');
	var IPdiscern = cookieModule.get('273IP_discern');
	var iphiden = cookieModule.get('273iphide');
	var JumpCityId = G.config('fast_city');
	var JumpProvinceId = G.config('fast_province');
	var JumpCityArray= [1,2,5,6,10,11,12,42,56,75,99,128,242,339,43,16];
	var authInfo = cheYouModule.Auth();
	var $ipDiscern = $("#ip_discern");
	if (authInfo) {
	    $('#noLogin').hide();
	    $('#logined').show();
	    $('#logined_name').html(authInfo.username);
	}

	if(ipjump){
		var CityType=false;
		for(var i in JumpCityArray) {
			 if((JumpCityArray[i] == JumpCityId) || JumpCityArray[i]==JumpProvinceId) {
				if(IPdiscern==null && G.config('actions') =='index'  && (G.config('module') =='City' || G.config('module') =='Index')){
					if (iphiden==null){
						commonModule.setCookie('273iphide', '2', 30, '/', '.'+ G.config('domain_main'));
						//$ipDiscern.show();
					}else{
						$ipDiscern.hide();
					}
				}else{
					$ipDiscern.hide();
				}
			 }
	    }
		
	}else{
		$ipDiscern.hide();
	}


	//IP切换效果收集
	$(function(){
		$("#ip_discern a").bind("click",function(){
			var checkId=$(this).attr("id");
			var checkObj=checkId.substring(5);
			var _cityid= G.config('fast_city');
			var Domain = G.config('domain');
			$.ajax({
				url:G.config('domain_main') + "index.php?m=Data&a=Ipdiscern&type="+checkObj+"&cityid="+_cityid,
				dataType: "jsonp",
				jsonp: 'jsonCallback',
				success:function(msg){
					commonModule.setCookie('273IP_discern', '1', 1, '/', '.'+Domain);
					$ipDiscern.hide();
				}
			});
		});
	});
}