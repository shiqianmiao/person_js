/**
 * @desc 首页
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-06-24
 */

var $ = require('jquery');
var Base = require('app/ms/js/base.js');
var Map = require('widget/map/map.js');
var Slide = require('widget/slide/slide.js');
var LazyLoad = require('lib/jquery/plugin/jquery.lazyload.js');

var Header = require('app/v3/js/common/header');
var Log    = require('util/log.js');
// 模板
var CarListTpl = require('app/ms/tpl/car_list.tpl');
var ClassifyTpl = require('app/ms/tpl/classify.tpl');

// 数据
var ClassifyData = require('app/ms/data/classify.js');

var Index = exports;

//extend
$.extend(Index, Base);

/**
 * 初始化评估表单
 */
Index.initEvalForm = function(config) {
    var $el = config.$el;
    $el.one('mouseenter', function() {
        require.async(['app/common/eval_form.js', 'app/common/vehicle2/vehicle.js',
                       'app/common/vehicle2/vehicle.tpl'], function(EvalForm) {
            new EvalForm($el, '/index');
        });
    });
}

// 排行榜
Index.top = function (config) {

    var $el = config.$el;
    var $lis = $el.find('li');

    $lis.each(function () {

        var $this = $(this);
        var $fold = $this.find('.js-fold');
        var $unfold = $this.find('.js-unfold');
        var $phone = $unfold.find('.js-telphone');
        var $phoneTip = $unfold.find('.js-phone-box');

        $this.mouseenter(function () {

            $lis.not(this).trigger('out');
            $fold.hide();
            $unfold.show();
        }).on('out', function () {

            $fold.show();
            $unfold.hide();
        });

        $phone.mouseenter(function() {
            $phone.addClass('on');
            $phoneTip.show();
        }).mouseleave(function () {
            $phone.removeClass('on');
            $phoneTip.hide();
        });

        $fold.show();
        $unfold.hide();
    });

    $($lis[0]).trigger('mouseenter');

};

// 分类（联动）
Index.classify = function (config) {

    var $el = config.$el;
    var $titles = $el.find('.js-title');
    var $contents = $el.find('.js-content');

    var $as = $titles.find('a');

    var data = ClassifyData;

    $as.each(function (index) {

        var $this = $(this);
        var $content = $($contents[index]);
        var type = $this.data('type');

        $this.mouseenter(function () {

            if (!$content.html()) {

                $content.html(ClassifyTpl(data[type])).show();
                $as.not($this).trigger('out');
                $this.attr('class', 'a' + (index + 1 ) + 'on');


            } else {

                $content.show();
                $as.not($this).trigger('out');
                $this.attr('class', 'a' + (index + 1 ) + 'on');
            }

        }).on('out', function () {

            $this.attr('class', 'a' + (index + 1));
            $content.hide();
        });
    });
};

// 车源列表（价格筛选）
Index.carList = function (config) {

    var $el = config.$el;
    var $titles = $el.find('.js-title');
    var $contents = $el.find('.js-content');

    var $as = $titles.find('a');

    var url = '/ajax.php?module=price_post&num=8';

    $as.each(function (index) {

        var $this = $(this);
        var $content = $($contents[index]);
        var price = $this.data('price');

        $this.mouseenter(function () {

            if (!$content.html()) {

                $.ajax(url, {
                    data: {
                        price : price,
                        domain : $el.data('domain'),
                        ids : G.config('latest_post_ids')
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
                    $as.not($this).trigger('out');
                    $this.addClass('current');

                });
            } else {

                $content.show();
                $as.not($this).trigger('out');
                $this.addClass('current');
            }

        }).on('out', function () {

            $this.removeClass('current');
            $content.hide();
        });
    });

    var index = (config.index) ? config.index : 0;
    var interval = null;
    var tag = false;
    var length = $as.size();

    interval = window.setInterval(function () {

        var $ul = $($contents[index]).find('ul');

        if ($ul.size() > 0) {
            window.clearInterval(interval);
        } else {
            if (!tag) {

                if (index < length - 1) {
                    $($as[++index]).trigger('mouseenter');
                    tag = true;
                } else {
                    $($as[0]).trigger('mouseenter');
                    window.clearInterval(interval);
                }
            }
        }
    },1000);
};

// 拍车宝 && 车况宝
Index.carbList = function (config) {

    var $el = config.$el;
    var $titles = $el.find('.js-title');
    var $contents = $el.find('.js-content');

    var $as = $titles.find('.js-a');
    var $more = $titles.find('.js-more');

    var links = ['/sale', 'http://pcb.273.cn/auction/eng', 'http://ckb.273.cn/list'];

    $as.each(function (index) {

        var $this = $(this);
        var $content = $($contents[index]);

        $this.mouseenter(function () {

            $content.show();
            $as.not($this).trigger('out');
            $this.addClass('current');
            $more.attr('href', links[index]);
        }).on('out', function () {

            $this.removeClass('current');
            $content.hide();
        }).click(function () {
            return false;
        });
    });
};

// 合作伙伴
Index.friendLink = function (config) {

    var $el = config.$el;
    var $titles = $el.find('.js-title');
    var $contents = $el.find('.js-content');

    var $as = $titles.find('.js-a');

    $as.each(function (index) {

        var $this = $(this);
        var $content = $($contents[index]);

        $this.mouseenter(function () {

            $content.show();
            $as.not($this).trigger('out');
            $this.addClass('current');


        }).on('out', function () {

            $this.removeClass('current');
            $content.hide();
        }).click(function () {
            return false;
        });
    });

};

// 静态图
Index.map = function (config) {

    var param = {
        el : config.$el,
        center : config.center || '',
        width : config.width || 0,
        height : config.height || 0,
        type : 'dynamic',
        maxZoom : 16
    };

    var markers = config.markers || [];

    var map = Map.create(param);

    map.ready(function () {

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
                point: marker['lnglat'],
                letter: marker['letter'],
                text : marker['text'],
                url : 'http://chain.273.cn/shop' + marker['id'] + '/',
                width : 20
            });

            if (marker['lnglat'] && marker['lnglat'].toLowerCase() != 'null') {
                points.push(marker['lnglat']);
            }
        }

        this.setViewport(points);
    });
};

// 二手车导购
Index.shop = function (config) {

    var $el = config.$el;
    var $input = $el.find('.js-input');

    var defaultVal = '请输入问题关键字';

    $input.focus(function () {

        if ($.trim($input.val()) === defaultVal) {
            $input.val('');
        }
    }).blur(function () {

        if ($.trim($input.val()) === '') {
            $input.val(defaultVal);
        }
    }).val(defaultVal);

    $el.submit(function () {

        var value = $.trim($input.val());

        if (!value || value === defaultVal) {
            return false;
        }
    });
};

// 其他门店
Index.dept = function (config) {

    var $el = config.$el;
    var $titles = $el.find('.js-title');
    var $contents = $el.find('.js-content');
    var $uls = $el.find('ul');
    var $as = $titles.find('a');

    $as.each(function (index) {

        var $this = $(this);
        var $content = $($contents[index]);

        $this.on('in', function () {

            $content.show();
            $as.not($this).trigger('out');
            $this.addClass('current');

        }).on('out', function () {

            $this.removeClass('current');
            $content.hide();
        });
    });

    var index = 0;
    var num = $as.size();
    var timer = null;
    
    $as.on('click', function() {
        index = $(this).index();
        triggerEvent();
    });
    
    timer = window.setInterval(triggerEvent, 3000);
    $uls.hover(function() {
        clearInterval(timer);
    }, function() {
        timer = window.setInterval(triggerEvent, 3000);
    });
    function triggerEvent() {
        $($as[index%num]).trigger('in');
        index++;
    }
};

// 轮播
Index.slide = function (config) {

    var $el = config.$el;
    var images = config.images || [];

    Slide({
        el : $el,
        images : images
    });
    
    $el.delegate('span a', 'click', function(){
        var index = $el.find('.js-slide-num a').index($el.find('.js-slide-num .on'));
        index = index+1;
        var logStr = '/index@etype=click@rbanner=' + index;
        Log.trackEventByGjalog(logStr,$(this),'click');
    });
};

Index.start = function (param) {
    //热门城市提取target='_blank'
    $('#friend_link .content ul.citylink li a').attr('target','_blank');
    //级别
    $('#classify dl.d1 dd a').attr('target','_blank');
    //品牌/价格/车龄/热卖
    $('#classify .js-content dl dd a').attr('target','_blank');
    
    Base.init(param);
    Header.init();
    
    // lazyload
    if ($('.scroll').length != 0) {
        LazyLoad({
            el : '.scroll',
            effect : 'fadeIn',
            data_attribute : 'url' // data-url
        });
    }

    var $topBanner = $('#top_banner');
    var $adImg = $('#top_banner img');
    $adImg.load(function () {
        $(window).resize(); // 触发图片延迟加载
    });

    setTimeout(function() {
        $adImg.attr('src', $topBanner.data('smallImg'));
    }, 5000);
};

