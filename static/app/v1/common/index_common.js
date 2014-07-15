/*全国站首页、连锁首页、非连锁首页、公用的一些js方法*/
var indexCommonModule = exports;
var $ = require('jquery');
var cheYouModule = require('app/v1/common/cheyou');
var commonModule = require('app/v1/common/common');

//常见问题搜索处的事件处理
indexCommonModule.problemSubmit = function(){
	var $askTitle = $("#askTitle");
	cheYouModule.sinput($askTitle);
    var default_aval = $askTitle.val();
    $("#askForm").bind("submit",function(){
	    var input_val = $askTitle.val();
	    input_val = input_val.replace(/(^\s*)|(\s*$)/g, "");
	    if(input_val == "" || input_val == default_aval){
	        alert("请输入关键字！");
	        return false;
	    }
	    return true;
    });
};

//首页底部友情链接的tab切换
indexCommonModule.friendLink = function(){
	$('body').on('click', '#friendlink a', function(){
		var contentId = $(this).attr('href');
		$(contentId).show().siblings().hide();
	});
};

//右侧连锁店铺滚动，目前非连锁没有使用
indexCommonModule.scrollText = function(){
//	var speed = 200;
//    var colee2=document.getElementById("dept_colee2");
//    var colee1=document.getElementById("dept_colee1");
//    var colee=document.getElementById("dept_colee");
//    colee2.innerHTML=colee1.innerHTML;
//    function Marquee1(){
//		document.title = colee2.offsetTop-colee.offsetTop +':'+colee.scrollTop +':'+colee1.offsetHeight;
//        //当滚动至colee1与colee2交界时
//        if(colee2.offsetTop-colee.offsetTop - colee.scrollTop<=0){
//        	//colee跳到最顶端
//            colee.scrollTop-=colee1.offsetHeight;
//        }else{
//            colee.scrollTop++;
//        }
//    }
//    var MyMar1=setInterval(Marquee1,speed);
//    colee.onmouseover = function(){
//    	clearInterval(MyMar1);
//    };
//    colee.onmouseout = function(){
//    	MyMar1=setInterval(Marquee1,speed);
//    };
    var speed = 1;
    var colee2=document.getElementById("dept_colee2");
    var colee1=document.getElementById("dept_colee1");
    var colee=document.getElementById("dept_colee");
    colee2.innerHTML=colee1.innerHTML;
    function Marquee1(){
        //当滚动至colee1与colee2交界时
        if(colee.offsetTop<=-colee.offsetHeight/2){
            //colee跳到最顶端
            colee.style.top = 0;
         }
        colee.style.top = colee.offsetTop-speed+'px';
    }
    var MyMar1=setInterval(Marquee1,200);
    colee.onmouseover = function(){
        clearInterval(MyMar1);
    };
    colee.onmouseout = function(){
        MyMar1=setInterval(Marquee1,200);
    };
};

//车源列表里面的价格tab，ajax加载数据,非连锁车源无使用
indexCommonModule.priceTab = function(){
	$("#priceTab ul.tabs li").bind("hover", function(){
		var $this = $(this);
		var $price = $this.attr("price");
		if($this.attr("class")=="more")
			return;
		var conobj=$("#priceTab .contents ul[price='"+ $price +"']");
		if(conobj.length){
			$("#priceTab ul.tabs li").removeClass("on");
			$this.attr("class","on");
			$("#priceTab .contents ul").addClass("hidden");
			conobj.removeClass("hidden");
			return;
		}

		$.ajax({
		  type: "GET",
		  url: G.config('domain_main')+"index.php?m=Data&a=salePrice&price=" + $price,
		  data: { city_id: G.config('city_id'), province_id: G.config('province_id') },
		  dataType: "jsonp",
		  jsonp: 'jsonCallback',
		  cache: false,
		  success: function(data, textStatus){
			$("#priceTab ul.tabs li").removeClass("on");
			$("#priceTab ul.tabs li[price='"+data.price+"']").attr("class","on");

			$("#priceTab .contents ul").addClass("hidden");
			$("#priceTab .contents").append('<ul class="carlist" price="'+data.price+'">'+ data.content +'</ul>');
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown){
		  }
		});
	});
};

//快速搜索自定义价格
indexCommonModule.fastSearchPrice = function(){
	$('#top_price').change(function(){
		if($(this).val() != '0'){
			$("#top_price_user").css("display","none");
			$("#top_min_price").val('');
			$("#top_max_price").val('');
			return;
		}
		$("#top_price_user").css("display","inline");
		$("#top_min_price").focus();
	});
};

//快速搜索提交
indexCommonModule.fastSearchSubmit = function() {
	$('form#qs').submit(function(){
		//等于0时为自定义价格
		if( $("#top_price").val() !='0') {
			return true;
		}
		var min_price = commonModule.trim($("#top_min_price").val()),
			max_price = commonModule.trim($("#top_max_price").val());
		if(min_price - max_price > 0){
			alert("最高价不能小于最低价！");
			return false;
		}
		if(min_price=="" || max_price=="") {
			return true;
		}
	});
};

//车类型选择,高级搜索下方的车型hover事件
indexCommonModule.typeTabHover = function() {
	$("#car-type .title li").hover(function() {
		var tab_type = $(this).attr('type');
		if(tab_type == 'BS' || tab_type == 'HC') {
			return false;
		}
		$(this).addClass("on");
		$(this).siblings().removeClass("on");
		var tabon = $("#car-type ul.contents").eq($('#car-type .title li').index(this));
		$("#car-type ul.contents").addClass("hidden");
		tabon.removeClass("hidden");
	});
};

//本方法有连锁和非连锁的首页公用，全国首页暂时不用
indexCommonModule.chainReadyAction = function(){
	$("#allNewsBack").html($("#allNews").html());
    cheYouModule.TMX(null,"#top_brands","#top_chexi");    
    cheYouModule.TMX("#cha_type","#cha_brands","#cha_chexi","#cha_chexing");
    cheYouModule.sinput("#telphone");
    cheYouModule.ALD("#top_province","#top_city","",G.config('jqss_provinceid'),G.config('fast_city'));
    cheYouModule.ALD("#province","#city");
    cheYouModule.sinput("#kw");

	//评估提交
	$("#pingguBtn").bind("click", function(){
		var type=$("#cha_type").val();
		var make=$("#cha_brands").find("option:selected").attr("_path").toUpperCase();
			make=make==undefined?"":make;
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
			reg=/^0{0,1}(13[0-9]|145|15[7-9]|153|156|18[0-9])[0-9]{8}$/i;
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
};
