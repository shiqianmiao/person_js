/**
 * @desc 门店首页js
 * @copyright (c) 2014 273 Inc
 * @author 陈朝阳<chency@273.cn>
 * @since 2014-02-10
 */

var $ = require('jquery');
var Base = require('app/ms_v2/js/base.js');
var LazyLoad = require('lib/jquery/plugin/jquery.lazyload.js');
var Slide = require('widget/slide/chainSlide/slide.js');
var ShopIndex = exports;
//extend
$.extend(ShopIndex, Base);

//门店页图片滑动
ShopIndex.imageSlide = function(config) {
    images = config.images;
    Slide({
        el : '#chain-slide',
        images: images
    });
};

//
ShopIndex.start = function(param) {
    //图片延迟加载
    if ($('.js_scroll').length != 0) {
        LazyLoad({
            el : '.js_scroll',
            effect : 'fadeIn',
            data_attribute : 'url', // data-url
            skip_invisible : false,
            load:function(){
                $(this).parents('.lazy_load').removeClass('lazy_load');
            }
        });
    }
    Base.init(param);
};
