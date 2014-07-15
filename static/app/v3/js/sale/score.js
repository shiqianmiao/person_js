/**
 *@desc 积分排名列表页js实现
 */
var scoreModule = exports;
var logCollectModule = require('app/v3/js/common/log_collect');
var uuidModule = require('app/v3/js/common/uuid');
var headerModule = require('app/v3/js/common/header');
require ('app/v3/js/common/jquery.scrollLoading');
var $ = require('jquery');

scoreModule.init = function(ch) {
    headerModule.init();
    $(".scroll").scrollLoading();
    logCollectModule.init(ch);
}