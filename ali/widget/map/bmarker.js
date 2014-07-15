/**
 * @desc 百度标注类封装
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-07-14
 */

var $ = require('jquery');
var Overlay = require('widget/map/boverlay.js');

var Marker = function (config) {

    var point = config.point;

    if (!(point instanceof BMap.Point)) return;

    delete config.point;

    config = $.extend({
        offsetX : 0,
        offsetY : 0,
        title : '',
        enableMassClear : true,
        enableDragging : false,
        enableClicking : true,
        raiseOnDrag : false
    }, config);

    // 二维坐标系
    if (config.offsetX > 0 || config.offsetY > 0) {
        config.offset = new BMap.Size(config.offsetX, config.offsetY);
        delete config.offsetX;
        delete config.offsetY;
    }

    this.marker = new BMap.Marker(point, config);
    this.config = config;
};

var proto = Marker.prototype = new Overlay();

proto.constructor = Marker;

proto.type = 'marker';

// 信息窗口
proto.openInfoWindow = function (param) {

    var self = this;

    G.use(['widget/map/binfowindow.js'], function (InfoWindow) {
        if (self.infowindow) {
            self.closeInfoWindow();
        }

        self.infowindow = new InfoWindow(param);

        self.marker.openInfoWindow(self.infowindow.infowindow);
    });


    return this;
};

proto.closeInfoWindow = function () {

    this.marker.closeInfoWindow();
}

module.exports = Marker;