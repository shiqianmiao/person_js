/*列表页js*/

var listModule = exports;
var $ = require('jquery');
var logCollectModule = require('app/v1/common/log_collect');
var uuidModule = require('app/v1/common/uuid');
var commonModule = require('app/v1/common/common');
var headerModule = require('app/v1/common/header');
var carModule = require('app/v1/car/car');
var bdsugModule = require('app/v1/common/bdsug');
var cheYouModule = require('app/v1/common/cheyou');
var widgetModule = require('lib/widget/widget');

//执行函数
//ch为日志统计所需要的eqsch
listModule.init = function(ch){
	headerModule.readyAction();
	uuidModule.init();
	uuidModule.setUuid();
	logCollectModule.init(ch);
	widgetModule.initWidgets();
	commonModule.lazyLoadPic();
	carModule.readyAction();
	bdsugModule.init;
	listModule.readyAction();
};

listModule.readyAction = function(){
	if(G.config('empty_sea')){
		// 更多操作
		$('#car-select-keywords a.a1').toggle(function(){
			$(this).html('收起').parent().find('[ishide]').show();
		},function(){
			$(this).html('更多').parent().find('[ishide]').hide();
		});

		// 字母选择
		$('#brand-more .en a').click(function(){
			$('#brand-more .en a').removeClass('on');
			var chr = $(this).addClass('on').html();
			$('#brand-more .eli').find('[chr]').hide();
			$('#brand-more .eli').find('[chr="'+chr+'"]').show();
		}).eq(0).click();

		// 已选择条件
		var addfn = function(href,text){
			if(href && text){
				var html = $('<span>'+text+'<a href="'+href+'">x</a></span>');
				$('#car-select-tags').show().find('del').before(html);
			}
		};
		if(G.config('not_empty_province')) {
			addfn(G.config('addfn_href'),$('#car-select a[search="city"]').html());
		}
		$('#car-select a[surl]').each(function(){
			var search = $(this).attr('surl');
			var href = $('#car-select').find('a[search="'+search+'"]').attr('href');
			addfn(href,$(this).html());
		});
		$('#car-select-more select[url]').each(function(){
			var sel = $(this).find(':selected');
			var ops = $(this).find('option');
			if(ops.index(sel)>0)
				addfn(ops.eq(0).val(),sel.text());
		});
	} else {
		$('#car-select').remove();
	}

	// 条件、排序跳转
	$('#car-select select[url],#car-list select[url]').change(function(){
		location.href = $(this).val();
	});
	$('#car-list input[url]').click(function(){
		location.href = $(this).attr('url');
	});

	// 对比栏
	$(window).scroll(function(){
		var top = $(window).scrollTop();
		$('#con_col').stop().animate({top:top+'px'},'normal');
	}).scroll();

	var rContrast = function(){
		// 移除对比
		$("#con_col").find('a[saleid]').unbind('click').click(function(){
			var saleid = $(this).attr('saleid');
			$.ajax({
				dataType : "json",
				url: "/Contrast/remove",
				data: "saleid="+saleid,
				success: function(json){
					json.success ? updatefn() : alert('操作失败。');
				}
			});
		});

		// 加入对比
		$('#car-list-contents').find('a[saleid]').css('color','#FF6600').html('加入对比 +').unbind('click').click(function(){
			var saleid = $(this).attr('saleid');
			$.ajax({
				dataType : "json",
				url: "/Contrast/add",
				data: "saleid="+saleid,
				success: function(json){
					json.success ? updatefn() : alert('操作失败。');
				}
			}); 
		});

		// 已加入对比
		var saleids = [];
		$("#con_col").find('a[saleid]').each(function(){
			var saleid = $(this).attr('saleid');
			saleids.push(saleid);
			$('#car-list-contents').find('a[saleid="'+saleid+'"]').unbind('click').css('color','#999').html('已加入对比');
		});

		// 清空
		$('#con_col a.removecol').unbind('click').click(function(){
			$.ajax({
				dataType : "json",
				url: "/Contrast/removeAll",
				success: function(json){
					json.success ? updatefn() : alert('操作失败。');
				}
			});
		});

		// 隐藏
		$('#con_col a.closecol').unbind('click').click(function(){
			$('#con_col').slideUp();
		});
		$('#con_col a.tocontrast').attr('href','/sale/contrast'+(saleids.length>0 ? '?id='+saleids.join(',') : ''));
		$("#con_col").find('a[saleid]').length>0 ? $('#con_col').slideDown() : $('#con_col').slideUp();
	};

	// 更新对比栏
	var updatefn = function(){
		$("#con_col").load("/Search/contrast",function(){
			rContrast();
		}); 
	};
	rContrast();
	cheYouModule.sinput("#kw");
};
