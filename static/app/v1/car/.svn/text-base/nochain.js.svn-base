/**
 *连锁首页单独使用的js块级代码
 */
var nochainModule = exports;
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
nochainModule.init = function(ch){
	headerModule.readyAction();
	uuidModule.init();
	uuidModule.setUuid();
	widgetModule.initWidgets();
	commonModule.lazyLoadPic();
	indexCommonModule.problemSubmit();
	indexCommonModule.fastSearchPrice();
	indexCommonModule.fastSearchSubmit();
	indexCommonModule.typeTabHover();
	indexCommonModule.chainReadyAction();
	carModule.readyAction();
	brandFastModule.readyAction();
	bdsugModule.init;
	indexCommonModule.friendLink();
	logCollectModule.init(ch);
};