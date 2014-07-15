/**
 * @desc 百度地图类封装
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-07-14
 */

var $ = require('jquery');
var Lang = require('util').lang;

var Overlay = require('widget/map/boverlay.js');

var Map = function (config) {

    var $el = $(config.el);

    if (!$el.size()) throw new Error('el参数不正确');

    this.$el = $el;
    this.cbs = [];
    this.controls = {};
    this.overlays = {};
    this.config = config;
    this.isReady = false;
};

var proto = Map.prototype;

proto.constructor = Map;
proto.version = '1.4';

// 格式化坐标
Map.formatPoint= function (point) {

    if (arguments.length > 1) {
        return new BMap.Point(arguments[0], arguments[1]);
    }

    if (point instanceof BMap.Point) {

        return point;
    } else if (point === Object(point) && point.lng && point.lat) {

        return new BMap.Point(point.lng, point.lat);
    } else if (Lang.isString(point) && point && (point.toLowerCase() !== 'null' && point.toLowerCase() !== 'undefined')) {

        var _point = point.trim().split(/[,\s，]+/);

        if (_point.length === 2) {
            return new BMap.Point(_point[0], _point[1]);
        }

        return point;
    }
    return null;
};

proto.init = function () {

    var config = $.extend({
        minZoom : 3,
        maxZoom : 19,
        mapType : BMAP_NORMAL_MAP,
        enableHighResolution : true,
        enableAutoResize : true,
        enableMapClick : true
    }, {
        zoom : 16,
        controls : [],
        width : 0,
        height : 0,
        autoZoom : true,
        enableScrollWheelZoom : false,
        enableDoubleClickZoom : true,
        enableKeyboard : false
    }, this.config);

    var $el = this.$el;

    if (config.width > 0) {
        $el.width(config.width);
    }

    if (config.height > 0) {
        $el.height(config.height);
    }

    var center = Map.formatPoint(config.center) || Map.formatPoint(config.city) || Map.formatPoint(config.province) || '中国';

    var map = new BMap.Map($el[0], config);

    var zoom = config.zoom;

    // 地名字符
    if (Lang.isString(center) && config.autoZoom) {
        zoom  = undefined;
    }

    map.centerAndZoom(center, zoom);

    this.map = map;

    var controls = config.controls;
    for (var i = 0, l = controls.length; i < l; i++) {
        this.addControl({type : controls[i]});
    }

    if (config.enableScrollWheelZoom) {
        this.enableScrollWheelZoom();
    } else {
        this.disableScrollWheelZoom();
    }

    if (config.enableDoubleClickZoom) {
        this.enableDoubleClickZoom();
    } else {
        this.disableDoubleClickZoom();
    }

    if (config.enableKeyboard) {
        this.enableKeyboard();
    } else {
        this.disableKeyboard();
    }

    this.config = config;

    var self = this;

    function onReady () {
        if (!self.isReady) {
            self.isReady = true;
            self.ready();
        }
    }

    this.map.addEventListener('load', onReady);
    this.map.addEventListener('tilesloaded', onReady);

    return this;
};

proto.addControl = function (param) {

    var ctype = (param['ctype'] || '').toLowerCase();

    var control;

    delete param['ctype'];

    switch (ctype) {

        case 'navigation' : control = new BMap.NavigationControl(param); break;

        case 'overviewmap' : control = new BMap.OverviewMapControl(param); break;

        case 'scale' : control = new BMap.ScaleControl(param); break;

        case 'maptype' : control = new BMap.MapTypeControl(param); break;

        case 'copyright' : control = new BMap.CopyrightControl(param); break;

        case 'geolocation' : control = new BMap.GeolocationControl(param); break;

        default : break;
    }

    if (control) {
        this.controls[ctype] = control;
        this.map.addControl(control);
    }
    return this;
};

proto.removeControl = function (type) {

    type = (type || '').toLowerCase();

    var control = this.controls[type];

    if (control) {
        this.map.removeControl(control);
        delete this.controls[type];
    }
    return this;
};

proto.addOverlay = function (param) {

    var overlay, overlays;
    var type = (param['type'] || '').toLowerCase();
    var path = ['widget/map/b' + type + '.js'];
    var self = this;

    G.use(path, function (Lay) {

        if (param instanceof Overlay) {

            overlay = param;
            type = overlay.type;
        } else {

            param['point'] && (param['point'] = Map.formatPoint(param['point']));

            if (!param['point']) {
                return;
            }
            delete param['type'];
            overlay = new Lay(param);
        }

        self.map.addOverlay(overlay[type]);

        overlays = self.overlays[type] || (self.overlays[type] = []);

        overlays.push(overlay);
    });

    return this;
};

proto.removeOverlay = function (overlay) {

    var overlays, type;

    if (overlay instanceof Overlay) {

        type = overlay.type;
        overlays = this.overlays[type] || [];

        this.map.removeOverlay(overlay[type]);

        for (var i = 0, l = overlays.length; i < l; i++) {
            if (overlays[i] === overlay) {
                overlays.splice(i, 1);
                break;
            }
        }
    }

    return this;
};

proto.clearOverlays = function (overlays) {

    // var me = this;

    // if (!overlays) {
    //     overlays = [];
    //     Object.keys(this.overlays).forEach(function (type) {
    //         overlays = overlays.concat((me.overlays[type] || []).slice());
    //     });
    // }

    // if (!Array.isArray(overlays)) {
    //     overlays = [overlays];
    // }

    // for (var i = 0; i < overlays.length; i++) {
    //     this.removeOverlay(overlays[i]);
    // }

    this.map.clearOverlays();

    this.overlays = {};

    return this;
};

// 地图异步载入（ready缓冲）
proto.ready = function (cb) {

    var cbs = this.cbs;
    var isReady = this.isReady;

    if (!cb && isReady) {

        for (var i = 0, l = cbs.length; i < l; i++) {
            cbs[i].apply(this);
        }
        this.cbs = [];
    } else if (cb && Lang.isFunction(cb)) {

        if (isReady) {
            cb.apply(this);
        } else {
            this.cbs.push(cb);
        }
    }

    return this;
};

// 事件
proto.on = function (type, cb) {

    var me = this;

    if (type && Lang.isFunction(cb)) {

        this.ready(function () {
            me.map.addEventListener(type, function (e) {
                cb.apply(me, [e]);
            });
        });

    }

    return this;
};

proto.setCenter = function (point) {

    point = Map.formatPoint(point) || point;

    if (point) {
        this.map.setCenter(point);
    }
    return this;
};

proto.setZoom = function (zoom) {

    if (!isNaN(zoom)) {
        this.map.setZoom(zoom);
    }
    return this;
};

// 设置视野
proto.setViewport = function (points) {

    if (!Array.isArray(points)) {
        points = [points];
    }

    for (var i = 0, l = points.length; i < l; i++) {
        points[i] = Map.formatPoint(points[i])
    }

    this.map.setViewport(points);
};

proto.enableScrollWheelZoom = function () {

    this.map.enableScrollWheelZoom()
    return this;
};

proto.disableScrollWheelZoom = function () {

    this.map.disableScrollWheelZoom()
    return this;
};

proto.enableDoubleClickZoom = function () {

    this.map.enableDoubleClickZoom();
    return this;
};

proto.disableDoubleClickZoom = function () {

    this.map.disableDoubleClickZoom();
    return this;
};

proto.enableKeyboard = function () {

    this.map.enableKeyboard();
    return this;
};

proto.disableKeyboard = function () {

    this.map.disableKeyboard();
    return this;
};

proto.initAutoComplete = function (options) {

    !options && (options = {});

    var location, auto,
        $el = $(options.el);

    if (!$el.length) throw new Error('el参数不正确');

    location = options.location || this.map;

    if (Lang.isString(location)) {
        location = Map.formatPoint(location);
    }

    options.location = location;
    delete options.el;

    options = $.extend({
        input : $el[0]
    }, options);

    auto = new BMap.Autocomplete(options);

    return auto;
};

proto.initRoute = function (options) {

    !options && (options = {});

    var location, route, type,
        $el = $(options.el), renderOptions;

    location = options.location || this.map

    if (Lang.isString(location)) {
        location = Map.formatPoint(location);
    }

    delete options.location;

    renderOptions = options.renderOptions || {};

    if ($el.length) {
        renderOptions.panel = $el[0];
        delete options.el;
    }

    renderOptions.map = this.map;
    options.renderOptions = renderOptions;

    // todo: add other renderOptions

    type = (options.type || 'transit').toLowerCase();
    delete options.type;

    if (type === 'transit') {

        route = new BMap.TransitRoute(location, options);
    } else if (type === 'driving') {
        route = new BMap.DrivingRoute(location, options);
    }

    return route;
};

module.exports = Map;

