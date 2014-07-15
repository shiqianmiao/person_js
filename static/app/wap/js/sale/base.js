/**
 * @desc 页面基类
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-06-24
 */

// dependences
var $ = require('zepto');
var Log    = require('app/wap/js/util/log.js');
var Uuid   = require('util/uuid.js');
// public
var Base = exports;

var Cookie = require('util/cookie');

// 返回顶部
Base.scrollTop = function (config) {

    var $el = config.$el;
    var $top = $el.find('.js-uptop');
    var $win = $(window);

    function show() {
        $top.css('visibility', 'visible');
    }

    function hide() {
        $top.css('visibility', 'hidden');
    }

    $win.scroll(function () {

        if ($win.scrollTop() > $win.height() / 2) {
            show();
        } else {
            hide();
        }

    }).resize(function () {
		var rspace = ($win.width() - 990) / 2;
        var right  = rspace - (5 + 58);
        var qright = rspace - (10 + 110);

        if (right > 0) {
            $el.css('right', right);
            $el.show();
        } else {
            $el.hide();
        }
        if (qright > 0) { // qrcode
            $('#m-uptop').css('right', qright);
            $('#m-uptop').show();
        } else {
            $('#m-uptop').hide();
        }
    });

    $top.click(function () {
        window.scroll(0, 0);
        $win.scroll();
        return false;
    });

    $win.resize().scroll();
};
// 顶部banner广告
Base.adBanner = function (config) {

    var $el = config.$el;
    var $close = $el.find('.js-close');
    var useCookie = config.cookie;
    if (useCookie && Cookie.get('ad_close')) {
        $el.hide();
    }
    $close.click(function () {
        $el.hide();
        if (useCookie) {
            var options = {};
            options.domain = '.m.273.cn';
            options.path = '/';
            options.expires = 365;//天
            Cookie.set('ad_close',1 ,options);
        }
    });
};
Base.init = function (param) {

    param || (param = {});
    Uuid();
    Log.init(param['eqsch'], false);
};


