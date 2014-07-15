/**
 *@desc 列表页js实现
 */
var listModule = exports;
var logCollectModule = require('app/v3/js/common/log_collect');
var uuidModule = require('app/v3/js/common/uuid');
var headerModule = require('app/v3/js/common/header');
var searchLinkModule = require('app/v3/js/sale/search_link');
//var GuessLikeTpl = require('app/ms/tpl/guess_like.tpl');
require ('app/v3/js/common/jquery.scrollLoading');
var $ = require('jquery');

listModule.init = function(ch) {
    //车源内容js提取target='_blank'
    $('#car_list ul li .car_list_box .com_pic a').attr('target','_blank');
    $('#car_list ul li .car_list_box .font h2 a').attr('target','_blank');
    
    headerModule.init();
    searchLinkModule.init();
    $(".scroll").scrollLoading();
    uuidModule.init();
    uuidModule.setUuid();
    logCollectModule.init(ch);
    //导航提取target='_blank'
    $('#daohang li a').attr('target','_blank');
};


listModule.jsLinks = function (config) {
    var $elem = config.$el;
    $elem.find('a[data-jslink]').click(function(){
        var url = $(this).data('jslink');
        if (url) {
            window.location.href = url;
        }
    });
};