/**
 * @desc 页面基类
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-06-24
 */

// dependences
var $ = require('zepto');
var Log    = require('app/wap_v2/js/util/log.js');
var Uuid   = require('util/uuid.js');
// public
var Base = exports;

var Cookie = require('util/cookie');

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
            options.expires = 3;//天
            Cookie.set('ad_close',1 ,options);
        }
    });
};
Base.init = function (param) {

    param || (param = {});
    Uuid();
    Log.init(param['eqsch'], false);
};


