/**
 * @desc 外网列表页js
 * @copyright (c) 2014 273 Inc
 * @author chenhan<chenhan@273.cn>
 * @since 2014-02-25
 */

var $ = require('jquery');
var Base = require('app/ms_v2/js/base.js');
var LazyLoad = require('lib/jquery/plugin/jquery.lazyload.js');
var KeyContorl = require('app/common/key_contorl.js');
var MoreList = require('app/ms_v2/js/common/more_list.js');
var Position = require('widget/position/position.js');
var ListFilters = require('app/ms_v2/js/common/list_filters.js');

var List = exports;

//extend
$.extend(List, Base);

/**
 * 键盘左右翻页
 */
List.pageTurn = function(config) {
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

/**
 * 更多品牌
 */
List.moreBrand = function(config) {
    var $el = config.$el;
    var moreList = new MoreList({
        $el : $el,
        type : 'fuzzy',
        request : List.request
    });
};

/**
 * 更多车系
 */
List.moreSeries = function(config) {
    var $el = config.$el;
    var moreList = new MoreList({
        $el : $el,
        type : 'simple'
    });
};

var CUSTOM_TYPE = {
    'price' : 1,
    'age' : 2
};
List.customInput = function(config) {
    var $el = config.$el,
        $inputs = $el.find('input'),
        $btn = $el.find('button'),
        sType = $el.data('type'),
        type = CUSTOM_TYPE[sType];
    
    function bindRemove() {
        $(document).on('click.custom' + type, function(e) {
            if (!$.contains($el[0], e.target)) {
                $el.removeClass('input');
                $(this).off('click.custom' + type);
            }
            return false;
        });
    }
    function unBindRemove() {
        $(document).off('click.custom');
    }
    
    if (!sType in CUSTOM_TYPE) {
        throw new Error('customInput():类型不存在');
    }
    
    $inputs.on('keypress', function(e) {
        if (e.charCode && (e.charCode < 48 || e.charCode > 57)) {
            return false;
        }
    }).on('focus', function() {
        unBindRemove();
        bindRemove();
        $el.addClass('input');
    });
    
    $btn.on('click', function() {
        var min = $inputs.eq(0).val();
        var max = $inputs.eq(1).val();
        if (!$.isNumeric(min) && !$.isNumeric(max)) {
            return false;
        }
        var searchList = {
            cu_type : type,
            min : min,
            max : max
        };
        $.extend(searchList, List.request);
        $.ajax({
            url : '/ajax.php?module=custom_param_url',
            data : searchList,
            dataType : 'text',
            success : function(url) {
                window.location.href = url;
            }
        });
    });
};

List.hover = function(config) {
    var $el = config.$el,
        $list = $el.find('.pop_layer');
    $el.hover(function() {
        $list.show();
    }, function() {
        $list.hide();
    });
};

List.slideBar = function(config) {
    var $el = config.$el;
        $box = $el.next();
    var top = $el.offset().top;
    
    $(window).on('scroll', slide).on('resize', function() {
        nuFix();
        slide();
    });
    
    function slide() {
        if ($(this).scrollTop() >= top) {
            fix($el.offset().left);
        } else {
            nuFix();
        }
    }
    
    function fix(left) {
        Position.pin({
            el : $el,
            fixed : true,
            x : 0,
            y : 'top'
        }, {
            x : left,
            y : 'top'
        });
        $box.show();
    }
    function nuFix() {
        $el.attr('style', '');
        $box.hide();
    }
};

//鼠标移动到帖子上的样式变化
List.postHover = function(config) {
    var $el = config.$el;
    var type = config.type;
    if (type == 1) {
        $el.find('li .car_list_box').mouseenter(function(){
            $(this).addClass('on');
        }).mouseleave(function(){
            $(this).removeClass('on');
        });
    } else {
        $el.find('li').mouseenter(function(){
            $(this).addClass('on');
        }).mouseleave(function(){
            $(this).removeClass('on');
        });
    }
};

List.start = function(params) {
    List.request = JSON.parse(params.request);
    // lazyload
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
    Base.init(params);
};

List.listFilter = function(config) {
    var $el = config.$el;
    var listFilters = new ListFilters({
        $el : $el
        , data : $el.data()
    });
};

List.subscribe = function(config) {
    var $el = config.$el;
    $el.one('click', function () {
        require.async(['app/ms_v2/js/common/subscribe.js'], function (Subscribe) {
            var subscribe = new Subscribe({
                $el : $el
            });
        });
    });
};
