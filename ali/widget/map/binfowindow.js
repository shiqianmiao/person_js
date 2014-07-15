/**
 * @desc 百度信息窗口类封装
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-07-14
 */

var $ = require('jquery');
var Overlay = require('widget/map/boverlay.js');

var InfoWindow = function (config) {

    config = $.extend({
        width : 0,
        height : 0,
        offsetX : 0,
        offsetY : 0,
        maxWidth : 730,
        title : '',
        content : '',
        enableAutoPan : true,
        enableCloseOnClick : false,
        enableMessage : false
    }, config);

    if (config.offsetX > 0 || config.offsetY > 0) {
        config.offset = new BMap.Size(config.offsetX, config.offsetY);
        delete config.offsetX;
        delete config.offsetY;
    }

    var content = config.content || '';
    delete config.content;

    this.infowindow = new BMap.InfoWindow(content, config);
    this.config = config;
};

var proto = InfoWindow.prototype = new Overlay();

proto.constructor = InfoWindow;

proto.type = 'infowindow';

module.exports = InfoWindow;