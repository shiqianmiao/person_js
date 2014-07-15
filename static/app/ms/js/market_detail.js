/**
 *@desc 积分排名列表页js实现
 */
var marketDetailModule = exports;
var $ = require('jquery');

var clickShow = function() {
	
	$('#clos_info_pop_box, #clos_info_pop_box_2').click(function () {
		$("#info_pop_box").css({
					  "display":"none"
		});
	   
		$("#hideAll").css({
					  "display":"none"
		});
	});
	
	
	$('#signAction').click(function () {
	
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
}

var formSub = function() {
	$('#appoint_sign').click(function () {
	
		var user_name = $('#user_name').val();
	
		var reg = /^1[3-9]\d{9}$/g; 
		var telNum = $('#mobile').val();
					
		var reg_email = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/g;
		var now_email = $('#email').val();
	
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
	
		var url = '../index.php?_mod=Market&_dir=market&_act=appointSign&now_province=' + $('#now_province').val() + '&now_city=' + $('#now_city').val() + '&from_market_id=' + $('#from_market_id').val();
		
		var transtr = '';
		
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
}

marketDetailModule.start = function(ch) {
	//弹出窗效果
	clickShow();
	//表单提交JS
	formSub();
};