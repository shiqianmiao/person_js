/**
 * @desc 百度覆盖物抽象基类封装
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-07-14
 */

var Lang = require('util').lang;

var Overlay = function () {};


var proto = Overlay.prototype;

proto.constructor = Overlay;

proto.on = function (type, cb) {

    var me = this;

    if (type && Lang.isFunction(cb)) {

        this[this.type].addEventListener(type, function (e) {
            cb.apply(me, [e]);
        });
    }

    return this;
};


proto.isVisible = function () {

    return this[this.type].isVisible();
};

proto.show = function () {

    this[this.type].show();
    return this;
};

proto.hide = function () {

    this[this.type].hide();
    return this;
};

module.exports = Overlay;