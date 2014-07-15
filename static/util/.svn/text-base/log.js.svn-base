/**
 *@brief 日志统计js代码
 *@date 2013-2-28
 *@author <miaosq@273.cn>
 */

var $ = require('jquery');
var Util = require('util');
var Url = require('util/url');
var Cookie = require('util/cookie');
var Uuid = require('util/uuid.js');


var logCollect = exports;


var actionHover = 'data-273-hover-log';
var actionClick = 'data-273-click-log';
var actionShow = 'data-273-show-log';

var counter = 0;

logCollect.eqsch = '';
logCollect.eqschver = 'A';

//TODO暂时改为测试域名
logCollect.server = 'analytics.273.cn';
//标示pv是否统计过
logCollect.hasCollected = false;

//执行统计
logCollect.init = function(ch){
    logCollect.eqsch = ch;
    logCollect.collectPageView();
    logCollect.collectAllEvent();
};
var KEY = 'eqs_log';
var DOMAIN = '273.cn';

var ENGINES = [
    ['images.google' , 'q'],
    ['google'        , 'q'],
    ['yahoo'         , 'p'],
    ['msn'           , 'q'],
    ['live'          , 'q'],
    ['soso'          , 'w'],
    ['360'           , 'q'],
    ['so'            , 'q'],
    ['bing'          , 'q'],
    ['baidu'         , 'word'],
    ['baidu'         , 'wd'],
    ['sogou'         , 'query']
];
//pv统计函数
logCollect.collectPageView = function(eqsch) {
    if (logCollect.hasCollected) {
        return false;
    } else {
        logCollect.hasCollected = true;
    }
    if (eqsch) {
        logCollect.eqsch = eqsch;
    }
    var org = getCa(),
        urls = {
            eqschid: createUid(),
            uuid: (Uuid() || '-'),
            sid: getSessionId(),
            ca_source: (org[0] || '-'),
            ca_name: (org[1] || '-'),
            ca_kw: (org[2] || '-'),
            ca_id: (org[3] || '-'),
            ifid: (getIfid() || '-'),
            refer: (document.referrer ? document.referrer : '-'),
            domain: document.location.hostname.split('.')[0],
            url: document.URL,
            ua: uaFormat(),
            fv: flashPlayerVersion(),
            sc: screenFormart()
        };
    urls.eqschver = logCollect.eqschver;

    var url = "http://" + logCollect.server + "/p.gif?eqsch=" + (logCollect.eqsch || '-');
    url += '&' + $.param(urls);
    postByImg(url);
};

//日志事件统计
logCollect.collectAllEvent = function() {
    $('body').on('click', '['+actionClick+']', function(){
        o = parseCode($(this).data('273-click-log'));
        sendTrackEvent($(this), o, 'click');
    });
    $('body').on('hover', '['+actionHover+']', function(){
        o = parseCode($(this).data('273-hover-log'));
        sendTrackEvent($(this), o, 'hover');
    });
    //遍历show日志事件，并绑定
    $("["+actionShow+"]").each(function(){
        var $el = $(this),
            eqselog = $el.data('273-show-log'),
            o = parseCode(eqselog);
        sendTrackEvent($el, o, 'show');
    });
};

//生成uid
function createUid() {
    var date = new Date(),time = date.getTime(),
        dates = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    return (time-dates.getTime()) * 1000 + Util.math.random(1000, 9999);
}

//获取sessionid
function getSessionId() {
    return getCookie('sid') || setCookie('sid',guid());
}


//初始化系类参数的相关方法
function flashPlayerVersion() {
    var playerVersion = [0,0,0],
        d = null;
    if (typeof window.navigator.plugins != 'undefined' && typeof window.navigator.plugins['Shockwave Flash'] == 'object') {
        d = window.navigator.plugins['Shockwave Flash'].description;
        if (d && !(typeof window.navigator.mimeTypes != 'undefined' && window.navigator.mimeTypes["application/x-shockwave-flash"] && !window.navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin)) {
            d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
            playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
            playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
            playerVersion[2] = /[a-zA-Z]/.test(d) ? parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
        }
    }
    else if (typeof window.ActiveXObject != 'undefined') {
        try {
            var a = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
            if (a) {
                d = a.GetVariable("$version");
                if (d) {
                    d = d.split(" ")[1].split(",");
                    playerVersion = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
                }
            }
        }
        catch(e) {}
    }
    return playerVersion.join('.');
}

function uaFormat(){
    var data = [],
        lang,
        getLang = function(n){
            return n ? n.toLowerCase() : null;
        };
    var ua = Util.ua;
    $.each(ua, function(k, v){
        if (v){
            data.push(k+":"+v);
        }
    });
    if ((lang = getLang(window.navigator.language || window.navigator.browserLanguage))){
        data.push('lang:' + lang);
    }
    return data.join('|');
}

function screenFormart(){
    if (window.screen) {
        return screen.width + "," + screen.height;
    } else if (window.java) {
        var j = java.awt.Toolkit.getDefaultToolkit();
        var s = j.getScreenSize();
        return s.width + "," + s.height;
    }
    return '';
}


// 发送图片到服务器
function postByImg(url){
    var img = new Image();
    img.onload = function() {
        img.onload = null;
    };
    img.src = url;
}

//拆分log插码字符串
function parseCode(eqslog){
    var p = eqslog.replace('&', '@').split('@'),
        o = {
            code : p.shift(),
            params : {}
        };
    $.each(p, function(k, v){
        v = v.split('=');
        if (v[0]) {
            o.params[v[0]] = v[1];
        }
    });
    return o;
}

//执行事件发送
function sendTrackEvent($el, o, eventType){
    if($el != null) {
        var tagName = $el[0].tagName.toLowerCase();
        if (tagName == 'a'){
            o.params.href = $el.attr('href') || '';
            if ($el[0].target.toLowerCase() == '_self') {
                o.redirectUrl = o.href;
            }
        }
    }
    if (eventType == 'click'){
        if (tagName == 'form'){
            trackEvent(o);
            return true;
        }
        else {
            trackEvent(o);
            if (o.redirectUrl){
                later(function(){
                    window.location.href = o.redirectUrl;
                }, 300);
                return false;
            }
            return true;
        }
    } else if(eventType == 'show'){
        trackEvent(o);
    }
    else if (eventType == 'hover'){
        if (!$el.data('gl_over_tracked')) {
            trackEvent(o);
            $el.data('gl_over_tracked', 1);
        }
        return true;
    }
}

//发送事件
function trackEvent(o){
    var org = getCa(),
        urls = {
            eqschid: createUid(),
            eqselog: (getActionInfo(o) || '-'),
            uuid: (Cookie.get('eqs_uuid') || '-'),
            sid: getSessionId(),
            ca_source: (org[0] || '-'),
            ca_name: (org[1] || '-'),
            ca_kw: (org[2] || '-'),
            ca_id: (org[3] || '-'),
            ifid: (getIfid() || '-'),
            refer: (document.referrer ? document.referrer : '-'),
            domain: document.location.hostname.split('.')[0],
            url: document.URL,
            r: counter++
        };

    if (logCollect.eqschver){
        urls.eqschver = logCollect.eqschver;
    }
    var url = "http://" + logCollect.server + "/" + "e.gif?eqsch=" + (logCollect.eqsch || '-');
    url += '&' + $.param(urls);
    postByImg(url);
}

//拼凑eqselog
function getActionInfo(o){
    var p=[];
    if (o.code) {
        p.push(o.code);
    }
    $.each(o.params, function(k, v){
        p.push(k+"="+v);
    });
    return p.join('@');
}

//延时
function later(fn, when, loop){
    when = when || 0;
    var r = null,
        run = function(){
            r = r || (loop) ? setInterval(fn, when) : setTimeout(fn, when);
        };
    run();
    return {
        run : run,
        cancel: function(){
            if (r){
                if (loop){
                    clearInterval(r);
                } else {
                    clearTimeout(r);
                }
                r = null;
            }
        }
    };
}

//log_v2兼容
function getCa () {

    var cookie = getCookie();
    var refer = document.referrer;
    var temp = Url.parse(window.location.href);
    var params = temp['params'];

    var source = cookie['ca_source'] || '';
    var name   = cookie['ca_name'] || '';
    var kw     = cookie['ca_kw'] || '';
    var id     = cookie['ca_id'] || '';
    var _kw;

    if (refer && !/273.cn/i.test(refer)) {

        temp = Url.parse(refer);

        source = params['ca_source'] || temp.host;
        // 合作推广
        if (params['ca_name'] || params['ca_kw'] || params['ca_id']) {
            name   = params['ca_name'] || '';
            kw     = params['ca_kw'] || '';
            id     = params['ca_id'] || '';
        }

        // 搜索引擎
        else {

            $.each(ENGINES, function(i, v) {
                if (new RegExp(v[0], 'i').test(temp.host)) {
                    _kw = temp.params[v[1]] || '';
                    if (_kw) {
                        if (/[\?&]\w+=utf/i.test(refer)) {
                            kw = _kw + '|utf8';
                        } else {
                            kw = _kw;
                        }
                        return;
                    }
                    source = temp.host;
                    name = 'se';
                    id = '';
                }
            });
        }

        setCookie('ca_source', source);
        setCookie('ca_name', name);
        setCookie('ca_kw', kw);
        setCookie('ca_id', id);
    }

    return [source, name, kw, id];
}

function getCookie (name) {

    var cookie;

    try {
        cookie = JSON.parse(Cookie.get(KEY) || '{}');
    } catch (e) {
        cookie = {};
    }

    return name ? cookie[name] : cookie;
}
function setCookie (name, value) {

    var cookie;

    try {
        cookie = JSON.parse(Cookie.get(KEY) || '{}');
    } catch (e) {
        cookie = {};
    }

    if (name && value) {
        cookie[name] = value;
        Cookie.set(KEY, JSON.stringify(cookie), {
            path : '/',
            domain : DOMAIN
        });
        return value;
    }
}

function guid () {
    var s = new Date();
    var e = new Date(s.getFullYear(), s.getMonth(), s.getDate(), 0, 0, 0);
    return (s.getTime() - e.getTime()) * 1000 + Util.math.random(1000, 9999);
}

function getIfid () {

    var ifid = getCookie('ifid') || '';
    var params, _ifid;

    if (document.referrer) {
        params = Url.parse(window.location.href)['params'];
        _ifid = params['ifid'] || '';

        if (_ifid && _ifid !== ifid) {
            ifid = _ifid;
            setCookie('ifid', ifid);
        }
    }

    return ifid;
}

//为了满足一些特殊的地方直接传gjalog参数，发送统计参数
//gjalog为插码内容，el为当前元素，etype为事件统计类型（click、hover、show）
logCollect.trackEventByGjalog = function(gjalog, el, etype){
    o = parseCode(gjalog);
    sendTrackEvent(el, o, etype);
};

