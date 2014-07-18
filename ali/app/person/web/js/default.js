/**
 *@desc主业js实现 
 */
var MainModule = exports;
var $ = require('jquery');
var commonModule = require('app/person/web/js/common.js');

MainModule.init = function() {
	commonModule.menuEvent();
}

