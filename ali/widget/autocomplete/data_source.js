/**
 * @desc 数据源组件
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-11-08
 */

var $ = require('jquery');
var Widget = require('lib/widget/widget.js');

var DataSource = function (config) {

    !config && (config = {});

    this.config = config;

    this._init();
};

DataSource.prototype = {

    constructor : DataSource,

    _init : function () {

        var config = this.config;
        var source = config.source;

        if (typeof source === 'string') {

            this.type = 'Url';
        } else if ($.isArray(source)) {

            this.type = 'Array';
        } else if ($.isFunction(source)) {

            this.type = 'Function';
        } else {
            throw new Error('argument[source] is not supported');
        }

        this.source = source;
        this.params = config.params || {};

        this.qid = 0;
        this.queue = {}; // ajax queue for abort
    },

    getData : function (query) {

        var defer = $.Deferred();

        this['_get' + this.type + 'Data'](query, defer);

        return defer;
    },

    _getUrlData : function (query, defer) {

        var data = {
            query : encodeURIComponent(query),
            timestamp : new Date().getTime()
        };

        var url = Widget.template(this.source, data);
        var me = this;
        var options = {};
        var qid = this.qid++;
        var params= $.param($.isPlainObject(this.params) ? this.params : this.params() || {});

        if (params) {
            if (url.indexOf('?') > -1) {
                url += '&';
            } else {
                url += '?';
            }
            url += params;
        }

        if (/^(https?:\/\/)/.test(url)) {
            options.dataType = 'jsonp';
        } else {
            options.dataType = 'json';
        }

        this.queue[qid] = true;

        $.ajax(url, options).done(function (data) {

            if (me.queue[qid]) {
                defer.resolve(data);
                delete me.queue[qid];
            }
        }).fail(function () {

            if (me.queue[qid]) {
                defer.reject(data);
                delete me.queue[qid];
            }
        });
    },

    _getArrayData : function (query, defer) {

        defer.resolve(this.source);
    },

    _getFunctionData : function (query, defer) {

        this.source.call(this, query, defer)
    },

    abort : function () {
        this.queue = {};
        return this;
    }
};

module.exports = DataSource;