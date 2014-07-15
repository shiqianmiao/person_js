/**
 * @desc 外网首页js
 * @copyright (c) 2014 273 Inc
 * @author 陈朝阳<chency@273.cn>
 * @since 2014-02-10
 */

var $ = require('jquery');
var Base = require('app/ms_v2/js/base.js');
var Slide = require('app/ms_v2/js/common/slide.js');
var Map = require('widget/map/map.js');
var LazyLoad = require('lib/jquery/plugin/jquery.lazyload.js');

require('lib/jquery/plugin/scrollPane/jquery.scrollpane.js');
// 模板
var CarListTpl = require('app/ms_v2/tpl/car_list.tpl');
var CarNewsTpl = require('app/ms_v2/tpl/car_news.tpl');

var Index = exports;

//extend
$.extend(Index, Base);

// 轮播
Index.slide = function (config) {

    var $el = config.$el;
    var images = config.images || [];

    Slide({
        el : $el,
        images : images,
        width : getSc(),
        height : 490,
        interval: 15000
    });

    $el.delegate('.slider li a', 'click', function() {
        var index = $el.find('.slider li a').index($(this));
        index = index + 1;
        var logStr = '/banner@etype=click@banner=' + index;
        Base.log.sendTrack(logStr);
    });
};

/**
 * 首页tab
 */
Index.hoverTab = function(config) {
    var $el = config.$el;
    var timer;
    var eval = null;
    $el.find('h2').hover(function(){
        var $current = $(this).parent();
        timer = setTimeout(function () {
            $current.siblings().removeClass('on');
            $current.addClass('on');
            if (!eval) {
                var $form = $el.find('.pinggu .iform');
                require.async(['app/common/eval_form.js', 'app/common/vehicle2/vehicle.js',
                               'app/common/vehicle2/vehicle.tpl'], function(EvalForm) {
                    eval = new EvalForm($form, '/index');
                });
            }
            clearTimeout(timer);
        }, 200);
    },function(){
        if (timer) {
            clearTimeout(timer);
        }
    });
};
//获取屏幕宽度
function getSc () {

    var sc = window.screen;
    var jv = window.java;

    if (sc) {
        return sc.width + ',' + sc.height;
    }
    // maybe for pad
    else if (jv) {
        try {
            sc = jv.awt.Toolkit.getDefaultToolkit().getScreenSize();
            return sc.width + ',' + sc.height;
        } catch (e) {}

    }

}
// 首页品牌帖子
Index.carList = function (config) {

    var $el = config.$el;
    var $titles = $el.find('.js-title');
    var $contents = $el.find('.js-content');

    var url = '/ajax.php?module=brand_post&num=10';

    $titles.on('click', enter).on('out', function () {
        var $content = $contents.eq($(this).index());
        $(this).find('a').removeClass('current');
        $content.hide();
    });

    //显示隐藏图标
    $contents.delegate("ul li .price .down","hover",function(event){
        if (event.type == 'mouseenter') {
            $(this).find('.down_bg').show();
        } else {
            $(this).find('.down_bg').hide();
        }
    });

    function enter() {
        var $this = $(this);
        var index = $this.index();
        var $content = $($contents[index]);
        var brandId = $this.data('brandid');
        if (!$content.html()) {
            $.ajax(url, {
                data: {
                    brand_id : brandId,
                    domain : $el.data('domain')
                },
                dataType: 'jsonp',
                jsonp: 'jsonCallback'
            }).done(function (data) {
                var html = '';
                if (data && data.car_list && data.car_list.length > 0) {
                    html = CarListTpl(data);
                } else {
                    html = '<div class="index-nocar">&nbsp;</div>';
                }
                tag = false;
                $content.html(html).show();
                $titles.not($this).trigger('out');
                $this.find('a').addClass('current');

                LazyLoad({
                    el : '.js_scroll',
                    effect : 'fadeIn',
                    data_attribute : 'url', // data-url
                    skip_invisible : false,
                    load:function(){
                        $(this).parents('.lazy_load').removeClass('lazy_load');
                    }
                });
                $(window).scroll();
            });
        } else {
            $content.show();
            $titles.not($this).trigger('out');
            $this.find('a').addClass('current');
        }
    }

    var index = 0;
    var interval = null;
    var tag = false;
    var length = $titles.size();

    interval = window.setInterval(function () {

        var $ul = $($contents[index]).find('ul');

        if ($ul.size() > 0) {
            window.clearInterval(interval);
        } else {
            if (!tag) {

                if (index < length) {
                    $($titles[++index]).trigger('mouseenter');
                    tag = true;
                } else {
                    $($titles[0]).trigger('mouseenter');
                    window.clearInterval(interval);
                }
            }
        }
    },1000);
};

//首页门店展示的js
Index.deptDisplay = function(config) {
    var $elem = config.$el;

    //js滚动条替代原生滚动条
    var $scorllDiv = $elem.find('.js_shoplist').jScrollPane();
    var $jspPane = $scorllDiv.find('.jspPane');
    var $jspDrag = $scorllDiv.find('.jspDrag');

    var scorllH = $scorllDiv.height();
    var divH = $jspPane.height();
    var divMinTop = scorllH - divH;
    var dragMaxTop = scorllH - $jspDrag.height();

    function scorllTop(top) {
        var dragTop = (top / divH) * scorllH;
        if (dragTop > dragMaxTop) {
            dragTop = dragMaxTop;
        }
        $jspDrag.css('top', dragTop);

        var top = -1 * top;
        if (top < divMinTop) {
            top = divMinTop;
        }
        $jspPane.css('top', top);
    }

    var $mapDiv = $elem.find('.index_map');
    var $mapLi = $elem.find('.shoplist ul li');
    var param = {
        el : $mapDiv,
        center : $mapDiv.data('center') || '',
        width : $mapDiv.data('width') || 0,
        height : $mapDiv.data('height') || 0,
        type : 'dynamic',
        enableScrollWheelZoom:false,
        maxZoom : 16
    };

    var markers = $mapDiv.data('markers') || [];

    var map = Map.create(param);

    map.ready(function() {
        $mapDiv.removeClass('lazy_load');
        this.addControl({
            ctype:'navigation',
            type : BMAP_NAVIGATION_CONTROL_ZOOM
        });

        var marker;
        var points = [];

        for (var i = 0, l = markers.length; i < l; i++) {
            marker = markers[i];
            this.addOverlay({
                type : 'tip',
                point: marker['point'],
                letter: marker['letter'],
                text : marker['text'],
                url : 'http://chain.273.cn/shop' + marker['id'] + '/',
                width : 20,
                onClick :function (data) {
                    deptClick($('#shop_' + data.letter));
                    var $clickEl = $('#shop_' + data.letter);
                    scorllTop($clickEl.position().top);
                }
            });

            if (marker['point']) {
                points.push(marker['point']);
            }
        }
        $mapLi.each(function(index){
            $(this).click(function(){
                var point = $(this).data('point');
                if (point) {
                    map.setCenter(point);
                    map.setZoom(16);
                }
            });
        });
        this.setViewport(points);
    });

    $mapLi.each(function(index){
        $(this).find('.title').click(function(){
            deptClick($(this).parent());
        });
    });

    function deptClick($clickEl) {
        $clickEl.siblings().removeClass('on');
        $clickEl.addClass('on');
    }
};

//首页交易顾问电话显示
Index.userPhoneHover = function(config) {
    var $el = config.$el;
    $el.find('li .i-tel').hover(function() {
        $(this).parent().parent().find('.tel_num').show();
    }, function() {
        $(this).parent().parent().find('.tel_num').hide();
    });
};



// 首页动态tab
Index.carNews = function (config) {

    var $el = config.$el;
    var $titles = $el.find('.title1 h2');
    var $contents = $el.find('.content');
    var $moreUrl = $el.find('.js_more a');
    var url = '/ajax.php?module=get_news_data';

    $titles.each(function (index) {

        var $this = $(this);
        var $content = $($contents[index]);
        var cid = $this.data('cid');
        $this.click(function(){
            $titles.not($this).removeClass('on');
            $this.addClass('on');
            $moreUrl.html($this.data('name')+'<i></i>');
            $moreUrl[0].href = $this.data('url');
            if (!$content.html()) {
                $.ajax(url, {
                    data: {
                        cid : cid
                    },
                    dataType: 'jsonp',
                    jsonp: 'jsonCallback'
                }).done(function (data) {
                    var html = '';
                    if (data) {
                        html = CarNewsTpl(data);
                    }
                    $content.html(html).show();
                    $contents.not($content).hide();
                }).fail(function(){
                    $content.html('').show();
                    $contents.not($content).hide();
                });
            } else {
                $contents.not($content).hide();
                $content.show();
            }
        });
    });
};

Index.start = function (param) {
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
    Base.init(param);
};