/**
 * @desc 门店车源页js
 * @copyright (c) 2014 273 Inc
 * @author 陈朝阳<chency@273.cn>
 * @since 2014-02-10
 */

var $ = require('jquery');
var Base = require('app/ms_v2/js/base.js');
var ShopSale = exports;
var LazyLoad = require('lib/jquery/plugin/jquery.lazyload.js');
var KeyContorl = require('app/common/key_contorl.js');
//extend
$.extend(ShopSale, Base);

//展开筛选项
ShopSale.expandSelect = function(config) {
    var $el = config.$el,
        $btns = $el.find('.js_expand');

    $btns.hover(function() {
            $(this).find('.morelayer').show();
        },function(){
            $(this).find('.morelayer').hide();
        }
    );
};

/**
 * 键盘左右翻页
 */
ShopSale.pageTurn = function(config) {
    var $el = config.$el;
    
    var left = KeyContorl({
        key : 'left',
        context : this,
        callback : function() {
            var url = $el.find('#js_prev').attr('href');
            if (url) {
                window.location.href = url;
            }
        }
    });
    var right = KeyContorl({
        key : 'right',
        context : this,
        callback : function() {
            var url = $el.find('#js_next').attr('href');
            if (url) {
                window.location.href = url;
            }
        }
    });
};

//
ShopSale.start = function(param) {
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
