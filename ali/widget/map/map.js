/**
 * @desc 百度地图接口
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-07-03
 */

var $ = require('jquery');
var Map = require('widget/map/bmap.js');

// 静态图url
var STATIC_IMAGE_URL = 'http://api.map.baidu.com/staticimage?';

// 动态地图url
var DYNAMIC_SERVER_URL = 'http://api.map.baidu.com/api?v=1.4&callback=';


var markerStyles = ['m,A','m,B','m,C','m,D','m,E','m,F','m,G','m,H','m,I','m,J','m,K','m,L','m,M','m,N','m,O','m,P','m,Q','m,R','m,S','m,T','m,U','m,V','m,W','m,X','m,Y','m,Z'];

// 统一接口
exports.create = function (config) {

    var type = config.type || 'dynamic';

    if (type === 'static') {
        createStatic(config);
    } else if (type === 'dynamic') {
        return createDynamic(config);
    }
}

// 创建静态图
var createStatic = exports.createStatic = function (config) {

    var $a = $('<a>');
    var $img = $('<img>');
    var $el = $(config.el);

    if (!$el.size()) return;

    delete config.el;
    delete config.type;

    var markers = config.markers || '';

    if ($.isArray(markers)) {
        config.markers = markers.join('|');
    }

    if (!config.width) {
        config.width = $el.width();
    }

    if (!config.height) {
        config.height = $el.height();
    }

    if (config.tip) {
        $a.attr('title', config.tip);
        delete config.tip;
    }

    if (!config.markerStyles) {
        config.markerStyles = markerStyles.join('|');
    }

    var url = STATIC_IMAGE_URL + $.param(config);

    $img.attr('src', url);

    $a.append($img);

    $el.append($a);
}

// 地图加载状态
var isLoaded = exports.isLoaded = false;

// 加载地图代码
var loadScript = exports.loadScript = function (config) {

    config = $.extend({callback : 'EqsMapLoad'}, config || {});

    G.use([DYNAMIC_SERVER_URL + config.callback]);

};

// 异步回调函数
var EqsMapLoad = window.EqsMapLoad = function () {

    isLoaded = true;
};

// 创建动态地图
var createDynamic = exports.createDynamic = function (config) {

    map = new Map(config);

    loadScript();

    var interval = window.setInterval(function () {

        if (isLoaded) {

            window.clearInterval(interval);
            map.init();
        }

    }, 20);

    return map;
};

// 格式化坐标
exports.formatPoint = Map.formatPoint;


