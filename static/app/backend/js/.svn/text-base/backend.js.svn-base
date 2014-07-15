/**
 * @desc 后台管理系统（种子文件）
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-09-05
 */

var $ = require('jquery');
var Util = require('util');
var Events = require('events');

// 事件句柄
var handler = {};

// 组件集合
var widgets = {};

// defers集合
var defers = {};

// 延时对象
function _deferred (el) {

    var $el = $(el);
    var guid = $el.data('guid');

    if (!guid) {
        guid = Util.guid('bcw');
        $el.data('guid', guid);
    }

    var defer = defers[guid];

    if (!defer) {
        defer = $.Deferred();
        defer.guid = guid;
        defer.ready = defer.done;
        defers[guid] = defer;
    }

    return defer;
}

// 事件代理
function _delegateEvents () {

    $('body').on('click', '[data-action-type]', function (e) {

        var $el = $(e.currentTarget);
        var actionType = $el.data('actionType') || '';

        Backend.trigger(actionType, $el, e);
    });
}

// 初始化指定组件
function _initWidget (el) {

    var $el = $(el);
    var widgetType = $el.data('widget') || '';

    if (!widgetType) {
        return null;
    }

    var defer = _deferred($el);

    if (!defer.requested) {
        require.async(['app/backend/js/widget/' + widgetType + '.js'], function (Widget) {

            var widget = new Widget($el);

            if (widget) {
                widgets[defer.guid] = widget;
                defer.resolveWith(widget);
            }
        });

        defer.requested = true;
    }

    return defer;
}

// 初始化页面所有组件
function _initWidgets () {

    var defers = $('[data-widget]').map(function () {

        return _initWidget(this);
    }).get();

    return $.when.apply($, defers);
}


var Backend = {};

Backend.defer = $.Deferred();

$.extend(Backend, {

    // 初始化页面
    run : function () {

        _delegateEvents();
        _initWidgets().done(function () {
            Backend.defer.resolveWith(Backend);
        });

        return this;
    },

    on : function (events, callback) {

        handler.on(events, function ($el, e) {

            // for alert
            if (!e) {
                e = $el;
                $el = $(window);
            }
            callback.call($el[0], e);
        });

        return this;
    },

    off : function (events, callback) {

        handler.off(events, callback);

        return this;
    },

    trigger : function (events) {

        handler.trigger.apply(handler, arguments);

        return this;
    },

    ready : function (cb) {

        Backend.defer.done(cb);

        return this;
    },

    widget : function (el, name) {

        name = name ? '=' + name : '';
        el = $(el).closest('[data-widget'+ name + ']');

        var defer = _initWidget(el);

        if (!defer) {
            defer = {};
            defer.done = defer.ready = function () {/* nothing */};
        }

        return defer;
    },

    // Simple JavaScript Templating
    // John Resig - http://ejohn.org/ - MIT Licensed

    template : function (str, data) {

        var fn = new Function("obj",
                "var p=[],print=function(){p.push.apply(p,arguments);};" +

                "with(obj){p.push('" +

                str
                    .replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%>").join("p.push('")
                    .split("\r").join("\\'") +
                "');}return p.join('');");

        return data ? fn( data ) : fn;
    }

});

// 事件处理器
Events.mixTo(handler);

// 提示框
require.async(['app/backend/js/widget/alert.js']);

module.exports = Backend;
