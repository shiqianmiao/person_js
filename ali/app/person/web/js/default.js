/**
 *@desc主业js实现 
 */
var MainModule = exports;
var $ = require('jquery');

MainModule.init = function() {
	this.photo();
}

//主要轮播图片
MainModule.photo = function () {
	var $jFocus = $('#j_Focus');
    o = $.extend({
		nID:"#j_FocusNav",    //左侧标题区ID
		cID:"#j_FocusCon",    //右侧图片区ID
		bID:"#j_FocusBack",	  //左侧带箭头的背景ID
		fH:293    //内容切换的高度
    });
	$jFocus.each(function(){
		var _scrollHeight = o.fH;
		var _navDom = $(o.nID);
		var _conDom = $(o.cID);
		var _navs = $("li", _navDom);
		var _max = _navs.size()-1;
		var _back = $(o.bID);
		var _timeInterval = false;
		var _curIndex = 0;
		var _cType = "add";
		var _changeType = function(type){
			type == "add" ? _curIndex++ : _curIndex--;
		}
		var _cutover = function(){
			if (_curIndex>=_max){
				_cType = "jian";
			}
			if (_curIndex<=0){
				_cType = "add";
			}
			_changeType(_cType);
			_go(_navs.eq(_curIndex));
		}
		var _timer = function(){
			(_timeInterval)&&(clearInterval(_timeInterval));
			_timeInterval = setInterval(_cutover,6000);
		}
		var _go = function(dom){
			var _position = dom.position();
			_back.stop().animate({
				top: _position.top
			}, 10);
			_conDom.stop().animate({
				"marginTop": -_scrollHeight * _curIndex + "px"
			}, 10);
		}
		$(this)
		.bind("mouseenter", function(){
			clearInterval(_timeInterval);
		})
		.bind("mouseleave",function(){
			_timer();
		});
		_navs
		.bind("mouseenter", function(){
			clearInterval(_timeInterval);
			var _self = $(this);
			var _index = _self.attr("rel");
			_curIndex = _index;
			_go(_self);
		})
		.bind("mouseleave",function(){
			_timer();
		});
		_timer();
	});
};

