/**
 * @desc web公共js文件
 **/
var CommonModule = exports;
var $ = require('jquery');

CommonModule.init = function() {
	CommonModule.menuEvent();
}

CommonModule.menuEvent = function() {
	$('.js-menu').find('li a').click(function() {
		var $this = $(this);
		$this.addClass('current').parent('li').siblings('li').find('a').removeClass('current');
	});
}