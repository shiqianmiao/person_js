/**
 * @desc 自定义提示类封装
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-07-30
 */

require('widget/map/css/btip.css');

var $ = require('jquery');
var Widget = require('lib/widget/widget.js');
var Overlay = require('widget/map/boverlay.js');

var TipTpl = '<div class="BMap_Tip"><span class="letter"><%= letter %></span><span class="text"><a href="<%= url %>" target="_blank"><%= text %></a></span></div>';

// 自定义覆盖物
var BTip = window.BMap.Tip = function (point, options) {

    this.point = point;
    this.options = options || {};
};

BTip.prototype = new BMap.Overlay();

BTip.prototype.initialize = function (map) {

    if (!(this.point instanceof BMap.Point)) {
        return null;
    }

    var options = $.extend({
        letter : '',
        text : ''
    }, this.options);

    var $el = this.$el = $(Widget.template(TipTpl, options));

    $el.click(function () {
        var handler = options.onClick;
        if ($.isFunction(handler)) {
            handler(options);
        }
        $(this).addClass('BMap_Tip_On');
    }).mouseenter(function () {
        $(this).css('zIndex', 999);
    }).mouseleave(function () {
        $(this).css('zIndex', 0);
        $(this).removeClass('BMap_Tip_On');
    });

    map.getPanes().markerMouseTarget.appendChild($el[0]);

    this.map = map;

    return $el[0];
};

BTip.prototype.draw = function (map) {

    var $el = this.$el;
    var map = this.map;
    var options = this.options

    var pos = map.pointToOverlayPixel(this.point);
    var width = options.width || $el.width() || 0;
    var height = options.height || $el.height() || 0;

    var offsetX = options.offsetX || 0;
    var offsetY = options.offsetY || 0;

    $el.css({
        left : pos.x - Math.round(width / 2) + offsetX,
        top : pos.y - height + offsetY
    });
};


// 封装

var Tip = function (config) {

    var point = config.point;

    if (!(point instanceof BMap.Point)) return;

    delete config.point;

    this.tip = new BTip(point, config);
    this.config = config;
};


var proto = Tip.prototype = new Overlay();

proto.constructor = Tip;

proto.type = 'tip';

module.exports = Tip;