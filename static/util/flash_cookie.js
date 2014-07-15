/**
 * @desc flash cookie
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-11-28
 */

var $ = require('jquery');
var Config = require('config');
var Util = require('util');

var FlashCookie = exports;

var done = module.async();

// ie下flash文件缓存出现__flash_addCallback__错误，可以选择加上版本号或者在flash里面处理
// 这里为了缓存.swf文件，采用后者
var swfUrl = Config.baseUrl + require.resolve('./swf/flash_cookie.swf');

// note: ie下，增加id属性，否则js无法调用flash方法
// note: width和height要至少设置为1，如果为0的话，chrome浏览器无法调用系统flash
var swfHtml = '' +
    '<object id="__FLASH_COOKIE__" style="position:absolute;top:-1990px;left:-1990px;" type="application/x-shockwave-flash" data="' + swfUrl + '" width="1" height="1">' +
        '<param name="wmode" value="opaque" />' +
        '<param name="movie" value="' + swfUrl + '"/>' +
        '<param name="quality" value="high" />' +
        '<param name="allowScriptAccess" value="always"/>' +
        '<param name="flashvars" value=""/>' +
    '</object>';

var flashCookie = $(swfHtml)[0];

var noop = $.noop || function () {};

// todo: for test
FlashCookie.debug = false;

FlashCookie.get = function (name) {

    return flashCookie.get(name);
};

FlashCookie.set = function (name, value) {

    return flashCookie.set(name, value);
};

FlashCookie.remove = function (name) {

    flashCookie.remove(name);
};

FlashCookie.clear = function () {

    flashCookie.clear();
};

// 供flash调用
window.__FLASH_COOKIE__ = {
    ready : function () {
        window.clearTimeout(timer);
        FlashCookie.loaded = true;
        done();
        this.log('flash cookie is ready from js');
    },
    fail : function () {

        FlashCookie.get = noop;
        FlashCookie.set = noop;
        FlashCookie.remove = noop;
        FlashCookie.clear = noop;
        FlashCookie.loaded = false;
        done();
        this.log('flash cookie fail to load');
    },
    log : function () {
        if (FlashCookie.debug && console && console.log) {
            console.log.apply(console, arguments);
        }
    }
};

// flash超时10秒处理
// 用户可能未安装flash，就不会执行ready函数
// flash未成功加载
// flash未成功执行（如上述的1px问题）
var timer = window.setTimeout(function () {

    window.__FLASH_COOKIE__.fail();
}, 1000 * 10);

$(document.body).prepend(flashCookie);
