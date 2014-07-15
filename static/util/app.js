/**
 * @desc IOS Android 交互js
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-12-02
 */

var Ua = require('util')['ua'];
var App = exports;

var APP = '__APP__';
var WEB = '__WEB__';
var mobile = Ua.mobile;
var appFns = window[APP] || {};  // from app
var webFns = window[WEB] || (window[WEB] = {});  // to app


// js -> app
App.call = function (name, params) {

    var fn = appFns[name];

    if (params && !Array.isArray(params)) {
        params = Array.prototype.slice.call(arguments,1);
    }

    // android
    if (mobile === 'Android' && fn) {
        try{
            // 这里一定要传入window.__APP__作为this指针
            fn.apply(window.__APP__, params || []);
        } catch (e) {}
    }
    // ios
    else if (mobile === 'Apple') {

        window.location = [APP, name, (params || []).join('|')].join('::');
    }
};

// js <- app
App.addCallback = function (name, fn) {

    var _fn = webFns[name];

    if (name && !_fn) {
        webFns[name] = fn;
    }
};