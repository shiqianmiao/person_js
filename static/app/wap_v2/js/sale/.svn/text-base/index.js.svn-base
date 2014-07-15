/**
 * @desc 首页
 * @copyright (c) 2013 273 Inc
 * @author 陈朝阳 <chency@273.cn>
 * @since 2013-06-24
 */

var $ = require('zepto');
var Widget = require('app/wap_v2/js/common/widget.js');
var Common = require('app/wap_v2/js/common/common.js');
var Base = require('app/wap_v2/js/sale/base.js');
var MatchBox = require('app/wap_v2/js/sale/matchBox.js');
var BrandTpl = require('app/wap_v2/js/tpl/brand.tpl');
var Swipe = require('app/wap_v2/js/util/swipe.js');

var _ = require('lib/underscore/underscore.js');
var Index = exports;

var domain = '';
//extend
_.extend(Index, Base);

//进入全国站时的地理定位
Index.location = function() {
    Common.location( function(city) {
        if (city) {
            $.ajax({
                type: 'POST',
                url: '/ajax.php?module=getCityByName',
                data: { name: city },
                dataType: 'json',
                timeout: 800,
                success: function(data){
                    if (data && data.url) {
                        window.location.href = data.url;
                    }
                },
                error: function(xhr, type){
                    alert('无法定位您的位置，可手动选择城市');
                }
            });
        }
    });
};

//新版首页头部广告轮播
Index.slide = function(config) {
    var $el = config.$el;
    var $numSpan = $el.find('.num span');
    window.slide = Swipe(document.getElementById('slider'), {
        auto: 5000, //0为不自动播放,大于0表示毫秒
        continuous: true,
        callback: function(pos) {
            $numSpan.removeClass('on');
            $($numSpan[pos]).addClass('on');
        }
    });
};

//更多品牌选择
Index.moreBrand = function(config) {
    var $el = config.$el;
    //所有品牌数据，以json格式存于js中
    var brandData = null;
    //当前屏幕宽度
    var pageWidth = $(window).width();
    $el.on('click', function() {
        pageWidth = $(window).width();
        if (!brandData) {
            brandData = require('app/wap_v2/js/data/brand.js');
        }
        var $moreBrand = $('#more_brand');
        //隐藏其他div
        $('.js_div').hide();
        $moreBrand.css({width:pageWidth, height:'100%', right:-pageWidth});
        if ($moreBrand.children().length > 0) {
            $moreBrand.show();
        } else {
            $moreBrand.html(BrandTpl(brandData));
            $('body').append($moreBrand);
            bindBrandEvent();
        }
        setTimeout(function () {
            $moreBrand.css({right:'0'});
        }, 10);
        //滚动到顶部
        window.scroll(0, 0);
        //绑定屏幕旋转事件
        $(window).off('orientationchange.brand').on('orientationchange.brand', function() {
            setTimeout(function () {
                 $moreBrand.css({width:$(window).width()});
            }, 400);
        });
    });
    
    function bindBrandEvent() {
        //绑定锚点
        Common.anchor($('#more_brand .area-list .letter'));
        
        $('#more_brand .brand-item').on('click', function(){
            var uri = $(this).attr('data-brand-url');
            window.location.href = '/' + uri + '/';
        });
        
        $('#more_brand .reback .first').on('click', function(){
            $('#more_brand').css({right:-pageWidth});
            //解除屏幕旋转事件
            $(window).off('orientationchange.brand');
            setTimeout(function () {
                 $('.js_div').show();
                 $('#more_brand').hide();
                 slide.setup();
            }, 400);
        });
    }
};

//首页入口函数
Index.start = function (param) {
    param || (param = {});
    Base.init(param);
    Widget.initWidgets();
    Common.lazyLoadPic();
    if (param) {
        domain = param['domain'];
        if (param['domain'] == 'www' && param['auto_jump']) {
            Index.location();
        }
    }
};