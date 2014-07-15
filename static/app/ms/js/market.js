/**
 *@desc 积分排名列表页js实现
 */
var marketModule = exports;
var $ = require('jquery');

var showSlider = function () {
        $.fn.powerSlider = function(options) {
            return this.each(function() {
                //handle 为图片滚动方式
                var defualts = {
                        speed: 200,
                        //动画速度
                        delayTime: 6000,
                        //动画间隔
                        clickMode: "mouseenter",
                        //数字导航滑过方式
                        sliderNum: 1
                    };
                var opts = $.extend({}, defualts, options),
                    obj = $(this),
                    index = 0,
                    sliderBox = $(".sliderbox", obj),
                    sliderLi = sliderBox.find("li"),
                    sliderLiWidth = $(".sliderbox li:eq(0)").outerWidth(),
                    liNum = sliderLi.length,
                    len = (sliderLi.length) / (opts.sliderNum),
                    len = Math.ceil(len),
                    sliderNav = $(" .slidernav", obj),
                    sliderText = $(" .slidertext", obj),
                    prev = $(" .left", obj),
                    next = $(" .right", obj),
                    sliderTimer, navHtml = '',
                    textHtml = '';
                    title = '';
                //在动画还没有开始之前预定义的内容    
                for(var i = 0; i < len; i++) {
                    title = $("li:eq("+i+") img",sliderBox).attr("alt");
                    //navHtml += '<li><a href="javascript:void(0);">' + (i + 1) + '</a></li>';
                    //textHtml += '<li><a href="javascript:void(0);">'+title+'</a></li>';
                }
                //sliderText.append(textHtml);
                sliderBox.find('li:eq(0)').show().siblings().hide();
                sliderText.find('li:eq(0)').show().siblings().hide();
                //当动画方式为渐隐渐现时必须定义css的样式，否则动画过程会出现空白的视觉
                if(opts.handle == 'fadeTo') {
                    if(opts.sliderNum<=1){
                        sliderLi.css({
                            "position": "absolute",
                            "left": "0",
                            "top": "0"
                        });
                    }else{
                        sliderLi.each(function(i){
                            $(this).css({
                                "position":"absolute",
                                "left":(i%opts.sliderNum)*(sliderLi.width()),
                                "top":"0"
                            })
                        })
                    }
                    var nextLen = parseInt(opts.sliderNum -1);
                    sliderBox.find("li:gt("+nextLen+")").hide();
                    //必须加这句css，否则渐隐渐显会出现一段空白的
                }
                //sliderNav.append(navHtml);
                //当定义一屏的动画数目大于1时，内容为向左浮动
                if(opts.sliderNum > 1) {
                    sliderLi.css("float", "left");
                }
                // obj.css({"width":(opts.sliderNum)*sliderLiWidth}); 由于内容多种多样性，且css列表也需要个性化，所有不加入这个固定宽度，请使用CSS自定义整体的宽度
                var slidertitle = sliderText.find("li"),
                    sliderA = sliderNav.find("li");
                //当有文字标题时预先显示第一张，其余css已经设置隐藏
                slidertitle.eq(0).show();
                //默认第一张添加了一个类名current
                sliderA.eq(0).addClass("current"), sliderLi.eq(0).addClass("current");
                function showImg(i, index) {
                    var sliderHeight = obj.height(),
                        sliderWidth = obj.width();
                    slidertitle.hide().eq(index).show();
                    sliderA.removeClass("current").eq(index).addClass("current"), sliderLi.removeClass("current").eq(index).addClass("current");
                    if(opts.handle == 'fadeTo') {
                        sliderLi.slice(i*(opts.sliderNum),(i+1)*(opts.sliderNum)).fadeOut(opts.speed);
                        sliderLi.slice(index*(opts.sliderNum),(index+1)*(opts.sliderNum)).filter(":not(':animated')").fadeIn(opts.speed);
                    } else if(opts.handle == 'left') {
                        sliderLi.css("float", "left");
                        sliderBox.css("width", len * sliderWidth).filter(":not(':animated')").animate({
                            "left": -sliderWidth * index
                        }, opts.speed);
                    }
                }
                sliderA.bind(opts.clickMode,function(){
                    index = $(this).index();
                    var i = sliderA.index($(".slidernav .current:eq(0)"));
                    if(index != i) {
                        showImg(i, index);
                    }
                }).eq(0).trigger(opts.clickMode);
                if(len <= 1) {
                    prev.hide(); next.hide();
                } else {
                    prev.click(function() {
                        var i = index;
                        index -= 1;
                        if(index == -1) {
                            index = len - 1
                        };
                        showImg(i, index);
                    });
                    // //next
                    next.click(function() {
                        auto();
                    });
                }
                //auto fn
                function auto() {
                    var i = index; index = (index + 1) % len; showImg(i, index);
                }
                var settime;
                obj.hover(function(){
                    clearInterval(settime);
                },function(){ settime = setInterval(function(){
                        auto();
                    },opts.delayTime);
                }).trigger("mouseleave");
            });    
        };
	
        $("#market_banner").powerSlider({handle:"fadeTo"});
}

var clickShow = function() {
    $('#openAction').click(function () {

		var nowSroll = document.body.scrollTop;
		if (nowSroll < document.documentElement.scrollTop) {
			nowSroll = document.documentElement.scrollTop;
		}
	
		$("#words_pop_box").css({
					  "left":(parseInt(document.body.scrollWidth) - 300) / 2 + "px",
					  "top":(parseInt(nowSroll) + parseInt(parseInt(window.screen.height) / 5) * 1) + "px",
					  "display":"block"
		});
	   
		do_hide_all();
	});
	
	$('#market_faq').click(function () {
	
		var nowSroll = document.body.scrollTop;
		if (nowSroll < document.documentElement.scrollTop) {
			nowSroll = document.documentElement.scrollTop;
		}
	
		$("#faq_pop_box").css({
					  "left":(parseInt(document.body.scrollWidth) - 500) / 2 + "px",
					  "top":(parseInt(nowSroll) + parseInt(parseInt(window.screen.height) / 16) * 1) + "px",
					  "display":"block"
		});
	   
		do_hide_all();
	});
	
	function do_hide_all() {
		$("#hideAll").css({
					  "width":document.body.scrollWidth + "px",
					  "height":document.body.clientHeight + "px",
					  "display":"block"
		});
	}
	
	$('#clos_pop_box,#clos_pop_box_cancel').click(function () {
		$("#words_pop_box").css({
					  "display":"none"
		});
	   
		$("#hideAll").css({
					  "display":"none"
		});
	});
	
	$('#clos_faq_pop_box').click(function () {
		$("#faq_pop_box").css({
					  "display":"none"
		});
	   
		$("#hideAll").css({
					  "display":"none"
		});
	});
	
	$('#clos_info_pop_box, #clos_info_pop_box_2').click(function () {
		$("#info_pop_box").css({
					  "display":"none"
		});
	   
		$("#hideAll").css({
					  "display":"none"
		});
	});
}

var formSub = function() {
	$('#appoint_book').click(function () {

		var now_province = $('#intent_province').val();
		var now_city     = $('#intent_city').val();
	
		var user_name = $('#user_name').val();
	
		var reg = /^1[3-9]\d{9}$/g; 
		var telNum = $('#mobile').val();
					
		var reg_email = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/g;
		var now_email = $('#email').val();
	
		if ($('#intent_province').val() == '') {
			alert('请选择省份！');
			$('#intent_province').focus();
			return false;
		}
					
		if ($('#intent_city').val() == '') {
			alert('请选择城市！');
			$('#intent_city').focus();
			return false;
		}
	
		if (user_name == '') {
			alert('请输入您的姓名！');
			$('#user_name').focus();
			return false;
		}
	
		if (user_name.length < 2 || user_name.length > 20) {
			alert('姓名长度不合法！');
			$('#user_name').focus();
			return false;
		}
	
		if ($('#mobile').val() == '') {
			alert('请输入您的手机号码！');
			$('#mobile').focus();
			return false;
		}
					
		if (!reg.test(telNum)) {
			alert('对不起，您输入的手机号可能有误！');
			$('#mobile').focus();
			return false;
		}
		
		if ($('#email').val() == '') {
			alert('请输入您的邮箱！');
			$('#email').focus();
			return false;
		}
					
		if (!reg_email.test(now_email)) {
			alert('对不起，您输入的邮箱地址可能有误！');
			$('#email').focus();
			return false;
		}
	
		var url = './index.php?_mod=Market&_dir=market&_act=appointBookSub';
		
		var transtr = '';
		transtr += '&now_province=' + now_province;
		transtr += '&now_city=' + now_city;
		transtr += '&user_name=' + encodeURI(user_name);
		transtr += '&telNum=' + telNum;
		transtr += '&now_email=' + now_email;
		
		$.ajax(url + transtr).done(function (data) {
			var dataObj=eval("("+data+")");//转换为json对象 
			//alert(dataObj['status'])
		
			$("#words_pop_box").css({
			  "display":"none"
			});
			
			var nowSroll = document.body.scrollTop;
			if (nowSroll < document.documentElement.scrollTop) {
				nowSroll = document.documentElement.scrollTop;
			}
		    
			//提交成功的话，清空表单中的数据
			if (dataObj['status'] == 1) {
				$('#intent_province').val('')
				$('#intent_city').html('')
				$('#user_name').val('')
				$('#mobile').val('')
				$('#email').val('')
			}
			
			$("#info_tips").html(dataObj['msg']);
		
			$("#info_pop_box").css({
						  "left":(parseInt(document.body.scrollWidth) - 300) / 2 + "px",
						  "top":(parseInt(nowSroll) + parseInt(parseInt(window.screen.height) / 5) * 1) + "px",
						  "display":"block"
			});
		});
	});
	
	$('#intent_province').change(function(){
				var val = $(this).val();
				if (val == '') {
					$('#intent_city').html('<option value="">--城市--</option>');
				}
				else {
					$('#intent_city').load('/data.php?a=city&province='+val,'',function(responseTxt,statusTxt,xhr){
					//$('#intent_city').load('http://zs.273.cn/index.php?_mod=data&_dir=sale','',function(responseTxt,statusTxt,xhr){
						if(statusTxt=="success") {
						
							var dataObj=eval("("+responseTxt+")");//转换为json对象 
							
							var cityStr = '';
							for(var i=0;i<dataObj.length;i++){
			
								cityStr = cityStr + '<option value="' + dataObj[i]['id'] + '">' + dataObj[i]['name'] + '</option>'
							}
							
							$('#intent_city').html(cityStr);
						}
						if(statusTxt=="error"){
							alert("城市数据加载失败！");
						}
					});
				}
			});
}

marketModule.start = function(ch) {
    if (ch.notShowSlider != 1) {
	   //幻灯展示
		showSlider();
	}
	//弹出窗效果
	clickShow();
	//表单提交JS
	formSub();
	
};