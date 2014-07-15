/**
 *连锁首页单独使用的js块级代码
 */

var chainModule = exports;
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
chainModule.init = function(ch){
	headerModule.readyAction();
	uuidModule.init();
	uuidModule.setUuid();
	widgetModule.initWidgets();
	//高度只能显示九个，如果超过九个就滚动
	if(G.config('new_depts_counts') > 9) {
		indexCommonModule.scrollText();
	}
	commonModule.lazyLoadPic();
	indexCommonModule.problemSubmit();
	indexCommonModule.priceTab();
	indexCommonModule.fastSearchPrice();
	indexCommonModule.friendLink();
	indexCommonModule.fastSearchSubmit();
	indexCommonModule.typeTabHover();
	indexCommonModule.chainReadyAction();
	carModule.readyAction();
	brandFastModule.readyAction();
	logCollectModule.init(ch);
};