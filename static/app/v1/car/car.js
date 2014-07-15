var carModule = exports;
var commonModule = require('app/v1/common/common.js');
var cheYouModule = require('app/v1/common/cheyou.js');
var cookieModule = require('util/cookie');
var $ = require('jquery');
var email_dy='<h5>车物志</h5><p class="des">每月一刊为您提供最新最全的购车、汽车美容、维修出行等资讯及服务...</p><form action="http://news.273.cn/Subscribe/signup/" method="get" id="dyForm"><p class="mail"><label>免费订阅请输入您的常用邮箱</label><input id="dyEmail" name="dyEmail" value="abc@abc.com" style="width:160px;clear:both;margin:5px 0;" /><br /><button id="dyButton">完成订阅</button></p></form><h5>分享至</h5><div class="share"><div id="bdshare" class="bdshare_t bds_tools get-codes-bdshare" data="{\'text\':\'273汽车电子杂志《车物志》将为您免费提供最新最全的二手车购车推荐，每月一刊。杂志内容重点有汽车配件美容产品分享、维修养护、自驾出行、车险理赔等资讯服务。本杂志是车旅生活的最佳伴侣。\'}"><a class="bds_tsina"></a><a class="bds_qzone"></a><a class="bds_tqq"></a><a class="bds_renren"></a><a class="bds_fx"></a><span class="bds_more">更多</span></div></div>';
carModule.setIpCity = function(){
	//种cookie
	var siteHost = window.location.host;
	var siteDomain = '{$Think.const.DOMAIN}';
	var subDomain = siteHost.substr(0,siteHost.indexOf(siteDomain)-1);
	if(subDomain!='www' && subDomain!='zs' && subDomain!='chain' 
		&& subDomain!='ganji' && subDomain!='member' && subDomain!='news' && subDomain!='ckb'){
		cookieModule.set('273home', subDomain, 1, '/', '.'+siteDomain);
	}
	if(subDomain!='www')return;
	$.ajax({
		url:"/data.php?a=ipGetCity",
		dataType: "jsonp",
		jsonp: 'jsonCallback',
		success:function(data){
			if(data.url=='')return;
			$("#ipCity").html('[<a href="'+data.url+'">进入'+data.name+'站</a>]').parent();
		}	
	});
};

carModule.addToCityInfo = function(name,url){
	$('#CityName').val(name);
	location.href=url;
}

carModule.readyAction = function(){
	carModule.setIpCity();
	//切换城市
	$("#popwin-chewuzhi").html(email_dy);
	
	//订阅
	cheYouModule.sinput("#dyEmail");
	$("#win-chewuzhi").hover(function(){
		$("#popwin-chewuzhi").css("display","block");
		$(this).find("a.ma").attr("class",'hover').css("padding","0 10px 0 0").css("background-position","51px 5px");
	},function(){
		$("#popwin-chewuzhi").css("display","none");
		$(this).find("a.hover").attr("class",'ma').css("padding","0 0 0 0");
	});

	$("#dyButton").bind("click",function(){
		var dyEmail=$("#dyEmail").val();
		if(!commonModule.isEmail(dyEmail)){
			alert("请输入正确的邮箱");
			return false;
		}
		document.getElementById("dyForm").submit();
	});
	
	//导航
	$("#win-nav").hover(function(){
		$("#popwin-nav").css("display","block");
		//$(this).find("a.ma").attr("class",'hover').css("padding","0 10px 0 0").css("background-position","51px 5px");
	},function(){
		$("#popwin-nav").css("display","none");
		//$(this).find("a.hover").attr("class",'ma').css("padding","0 0 0 0");
	});
	
	//分享
	$("#bdshell_js").attr('src',"http://bdimg.share.baidu.com/static/js/shell_v2.js?cdnversion=" + Math.ceil(new Date()/3600000));
	

	// 城市搜索自动完成
	cheYouModule.sinput('#CityName');
	$('#city-change-more input').keyup(function(){
		var t=$(this),h = $('#city-change-more div.showcity');
		h.length<=0 && (h=$('<div class="showcity"></div>'));
		t.val() ? $.ajax({
			url:"/data.php?a=letter&q="+encodeURIComponent(t.val()),
			dataType: "jsonp",
			jsonp: 'jsonCallback',
			success:function(html){
				t.before(h.html(html.data).css({width:'150px',background:'#fff',marginTop:'22px',padding:'5px',border:'1px solid #ccc',position:'absolute'}).show());
			}
		}) : h.hide();
	});
	$('#city-change-more button').click(function(){
		$('#city-change-more input').keyup();
	});

	$('#city-change-more').click(function(){
		$('#city-change-more div.showcity').hide();
	});

	$('#city-change-more button').click(function(){
		var cityname = $('#CityName').val();
		//var h = $('#city-change-more div.showcity');
		if (cityname != false) {
			$.ajax({
				url: "/data.php?a=fieldSearchName&q=" + encodeURIComponent(cityname),
				dataType: "jsonp",
				jsonp: 'jsonCallback',
				success: function(msg){
					if (msg.data==0){
						$('#CityName').val(cityname);
					}else{
						location.href = msg.data;
					}
				}
			});
		}
	});
	$("#hover_title a").hover(function(){
		var cityobj=$(this).attr("id").replace("change","");
		$(".city").hide();
		if (cityobj!='7'){						
			$("#hover_title a").siblings("a").removeClass("current");
			$(this).addClass("current");
			$(".city").eq(cityobj-1).show();
		}else{
			var lastobj=$("#hover_title .current").attr("id").replace("change","");
			$(".city").eq(lastobj-1).show();
		}				
	});
    $('#tab_city a.btn,#citychange').hover(function() {
		$('#citychange').show();
	},function() {
		$('#citychange').hide();
	});
};