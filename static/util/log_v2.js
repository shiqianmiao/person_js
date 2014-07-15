/**
 * @desc 日志统计
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-12-05
 */

var $ = require('jquery');
var Uuid = require('./uuid_v2');
var Url = require('./url');
var Util = require('util');
var Cookie = require('./cookie');

var SERVER = 'http://analytics.273.cn';
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

function Log (config) {

    // 一个页面只有一个Log实例
    if (Log.instance) {
        return Log.instance;
    }

    !config && (config = {});

    var eqsch = config.eqsch || $(document.body).data('eqsch') || window.__EQSCH__ || '';
    var eqschver = config.eqschver || 'A';

    eqsch = $.trim(eqsch + ''); // to string

    if (!eqsch) {
        throw new Error('eqsch is missing');
    } else {
        eqsch = eqsch.replace(/&/g, '@');
    }

    // 页面属性描述
    // 格式：desc@attr1=xx@attr2=xx
    // 例如：/aodi/list@age=2@price=160000
    //
    if (!$.isPlainObject(eqsch)) {
        eqsch = this._parse(eqsch);
    }

    this.eqsch = eqsch;

    // AB测试
    this.eqschver = eqschver;

    // 页面id，与页面行为关联
    this.eqschid = guid();

    // session id
    this.sid = getCookie('sid') || setCookie('sid',guid());

    Log.instance = this;
}

Log.prototype = {

    constructor : Log,

    trackPageView : function () {

        if (!this._pvTracked) {
            this.sendTrack();
            this._pvTracked = true;
        }
    },

    bindTrackEvent : function () {

        var $body = $(document.body);
        var me = this;

        $body
            .off('click.log mouseenter.log show.log')
            .on('click.log mouseenter.log show.log', '[data-eqselog]', function (e) {

                var $this = $(this);
                var eqselog = $this.data('eqselog');
                var etype, type, temp, tag, $form, href;

                if (typeof eqselog === 'string') {
                    eqselog = me._parse(eqselog);
                    $this.data('eqselog', eqselog);
                }

                etype = eqselog.etype || [];
                type = e.type;

                if (type === 'mouseenter') {
                    type = 'hover';
                }

                if (etype.join().indexOf(type) == -1) {
                    return;
                }

                tag = this.tagName.toLowerCase();
                temp = $.extend({}, eqselog, {etype:type});

                if (tag === 'a') {
                    href = $this.attr('href') || '#';
                    if (href !== '#') {
                        temp.params.href = href;
                    }
                }

                if (type === 'hover') {

                    if (!$this.data('eqsloged')) {
                        me.sendTrack(temp);
                        $this.data('eqsloged', true);
                    }
                } else if (type === 'click') {

                    me.sendTrack(temp);

                    if (tag === 'a') {
                        if (!/^#|(javascript:)\w*/.test(href) && ($this.attr('target') || '_self') === '_self') {
                            window.setTimeout(function () {
                                window.location.href = href;
                            }, 200);
                            return false;
                        }
                    } else if (tag === 'button') {
                        $form = $this.parents('form');
                        if ($this.attr('type') === 'submit' && $form.length
                                        && ($form.attr('target') || '_self') === '_self' ) {
                            window.setTimeout(function () {
                                $form.submit();
                            }, 200);
                            return false;
                        }
                    }

                } else {
                    me.sendTrack(temp);
                }
            });

        // show event
        $(function () {
            $('[data-eqselog]').each(function () {

                var $this = $(this);
                var eqselog = $this.data('eqselog') || '';
                var etype;

                if (typeof eqselog === 'string') {
                    eqselog = me._parse($this.data('eqselog'));
                    $this.data('eqselog', eqselog);
                }

                etype = eqselog.etype || [];

                if (etype.join().indexOf('show') > -1) {
                    $this.trigger('show.log');
                }
            });
        });
    },

    _parse : function (eqselog) {

        var o = {};

        o.params = {};

        // 元素属性描述（格式同eqsch）
        // 注意：多个etype用 | 分隔
        // 例如：/price/index@etype=click|hover@price=100
        // o : {
        //   etype : ['CLICK', 'HOVER'],
        //   params : {
        //       price : 100
        //   }
        // }
        eqselog = $.trim(eqselog + '');

        if (!eqselog) {
            return o;
        }

        eqselog = eqselog.replace(/&/g, '@').split(/[@\s]+/);

        eqselog.forEach(function (v, i) {

            if (i === 0 && v.indexOf('=') === -1) {
                o.code = v;
            } else if (v.indexOf('=') > -1) {

                v = v.split(/[=\s]+/);
                i = v[0].toLowerCase();
                if (i === 'etype') {
                    o.etype = v[1].split(/[|\s]+/);
                } else {
                    o.params[i] = v[1];
                }
            }
        });

        return o;
    },

    _stringify : function (eqselog) {

        var temp = [], code, etype, params;

        if ($.isPlainObject(eqselog)) {

            if (code = eqselog.code) {
                temp.push(code);
            }

            if (etype = eqselog.etype) {
                temp.push('etype=' + etype);
            }

            if (params = eqselog.params) {
                temp.push($.param(params).replace(/&/g, '@'));
            }

            return temp.join('@');
        }

        return '';
    },

    sendTrack : function (eqselog) {

        var params = {};
        var eqsch = this.eqsch;
        var gif, img, url, ca;

        if (!eqselog) {
            gif = 'p.gif';
        } else if ($.isPlainObject(eqselog)) {
            gif = eqselog.gif || 'e.gif';
            delete eqselog.gif;
        } else {
            gif = 'e.gif';
        }

        params.sid = this.sid;
        params.eqsch = this._stringify(eqsch);
        params.eqschid = this.eqschid;
        params.eqschver = this.eqschver;
        params.url = eqsch.params.url || document.location.href;
        params.refer = eqsch.params.refer || document.referrer || '-';
        params.domain = document.location.hostname.split('.')[0];

        // 外部跟踪四元组
        ca = getCa();
        params['ca_source'] = ca[0] || '-';
        params['ca_name']   = ca[1] || '-';
        params['ca_kw']     = ca[2] || '-';
        params['ca_id']     = ca[3] || '-';

        // 内部跟踪
        params['ifid'] = getIfid() || '-';

        // event log
        if (gif === 'e.gif') {
            params.eqselog = $.isPlainObject(eqselog) ? this._stringify(eqselog) : eqselog;
        }

        // pv log
        if (gif === 'p.gif') {
            params.fv = getFv(); // flash player version
            params.sc = getSc(); // screen width height
            params.ua = getUa(); // user agent
        }

        // 随机数
        params.rand = +new Date();

        // uuid异步获取
        Uuid.get().done(function (uuid) {

            params.uuid = uuid || '-';
            url = SERVER + '/' + gif + '?'+ $.param(params);
            setTimeout(function () {
                img = new Image();
                img.src = url;
            }, 50);
        });
    },

    setEqsch : function (eqsch) {

        if (eqsch && typeof eqsch ===  'string') {
            this.eqsch = eqsch;
        }

        return this;
    },

    getEqsch : function () {

        return this.eqsch;
    }
};

// 初始化百度统计
Log.initBdTrack = function () {

    var _hmt = window._hmt || (window._hmt = []);
    var hm, s;

    $(function() {
      hm = document.createElement("script");
      hm.src = "http://hm.baidu.com/hm.js?0a62050fb9336c9e69562609d8ecefd0";
      s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(hm, s);
    });

};
// 初始化谷歌统计
Log.initGgTrack = function () {

    var _gaq = window._gaq || (window._gaq = []);
    var ga, s;

    _gaq.push(['_setAccount', 'UA-43727317-1']);
    _gaq.push(['_setDomainName', '273.cn']);
    _gaq.push(['_setAllowLinker', true]);
    _gaq.push(['_addOrganic', 'sogou', 'query']);
    _gaq.push(['_addOrganic', 'baidu', 'word']);
    _gaq.push(['_addOrganic', 'soso', 'w']);
    _gaq.push(['_addOrganic', 'youdao', 'q']);
    _gaq.push(['_addOrganic', 'so', 'q']);
    _gaq.push(['_addOrganic', '360', 'q']);
    _gaq.push(['_trackPageview']);

    $(function() {
        ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
        s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
    });
};

function guid () {
    var s = new Date();
    var e = new Date(s.getFullYear(), s.getMonth(), s.getDate(), 0, 0, 0);
    return (s.getTime() - e.getTime()) * 1000 + Util.math.random(1000, 9999);
}

function getFv () {

    var nav = window.navigator;
    var p = [0, 0, 0], d, f, a;

    if (nav.plugins && (f = nav.plugins['Shockwave Flash'])) {
        d = f.description;
        if (d && !(nav.mimeTypes && nav.mimeTypes['application/x-shockwave-flash'] &&
                    !nav.mimeTypes['application/x-shockwave-flash'].enabledPlugin)) {

            d = d.replace(/^.*\s+(\S+\s+\S+$)/, '$1');
            p[0] = parseInt(d.replace(/^(.*)\..*$/, '$1'), 10);
            p[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, '$1'), 10);
            p[2] = /[a-zA-Z]/.test(d) ? parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/, '$1'), 10) : 0;
        }
    } else if (window.ActiveXObject) {
        try {
            a = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');

            if (a) {
                d = a.GetVariable('$version');
                if (d) {
                    d = d.split(' ')[1].split(',');
                    p[0] = parseInt(d[0], 10);
                    p[1] = parseInt(d[1], 10);
                    p[2] = parseInt(d[2], 10);
                }
            }
        } catch(e) {}
    }
    return p.join('.');
}

function getUa () {

    var ua = Util.ua;
    var nav = window.navigator;
    var temp = [], lang;

    $.each(ua, function (k ,v) {

        if (v) {
            temp.push(k + ':' + v);
        }
    });

    // language for chrome(..etc) : 'en-US'
    // browerLanguage for ie : 'zh-cn'
    lang = (window.navigator.language || window.navigator.browserLanguage).toLowerCase();

    if (lang){
        temp.push('lang:' + lang);
    }
    return temp.join('|');
}

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

    return '';
}

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

    return [source, name, kw, id]
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

module.exports = Log;
