/**
 * @desc 遮罩层组件
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-09-22
 */

// mask单个实例（document中）

var $ = require('jquery');
var Util = require('util');
var Ua = Util.ua;

var defaults = {

    backgroundColor : '#000',
    opacity : 0.6,
    zIndex : 1990,
    visible : true,
    scrollAble : true
};

var count = 0;

var unique = function (key) {

    key || (key = '');

    return key + '_' + (count++);
};

var Mask = function (options) {

    options = $.extend({}, defaults, options || {}, {
            position : 'fixed',
            top : 0,
            left : 0,
            width : '100%',
            height : '100%'
    });

    this.config = options;

    this._init();
}

$.extend((Mask.prototype = {}), {

    constructor : Mask,

    _init : function () {

        var id = this.id = unique('mask');
        var config = this.config;

        this._createDom()
            ._bindDom()
            .update();

        if (config.visible) {
            this.show();
        }

        Mask.instances[id] = this;
    },

    _createDom : function () {

        if (Mask.$mask) {
            return this;
        }

        var $mask = $('<div>');
        var $body = $(document.body);

        $mask.addClass('ui-mask').hide();

        if (Ua.ie == 6) {

            $body.css({
                height : '100%',
                margin : 0
            });

            $mask.html('<iframe style="position:absolute;left:0;top:0;width:100%;height:100%;z-index:-1;border:0 none;filter:alpha(opacity=0)"></iframe>')
        }

        $body.prepend($mask);

        Mask.$mask = $mask;

        return this;
    },

    _bindDom : function () {

        return this;
    },

    update : function (options) {

        var config = $.extend(this.config, options || {});

        var $mask = Mask.$mask;

        options = $.extend({}, config);

        if (Ua.ie == 6) {

            options.filter = 'alpha(opacity=' + options.opacity * 100 + ')';
            options.position = 'absolute';

            // ie6下解决遮罩无限延伸（宽度和高度地设置防止滚动条无限下拉）
            // 方法一（括号或者等于号）
            $mask[0].style.setExpression('top','(document).documentElement.scrollTop');
            // $mask[0].style.setExpression('top','hack=document.documentElement.scrollTop');
            $mask[0].style.setExpression('left','(document).documentElement.scrollLeft');
            $mask[0].style.setExpression('width','(document).documentElement.clientWidth');
            $mask[0].style.setExpression('height','(document).documentElement.clientHeight');

            // 方法二
            // $mask[0].style.cssText = 'left:expression((document).documentElement.scrollLeft);top:expression((document).documentElement.scrollTop);width:expression((document).documentElement.clientWidth);height:expression((document).documentElement.clientHeight);';
            delete options.opacity;
            delete options.top;
            delete options.left;
            delete options.width;
            delete options.height;
        }
 
        // 去除无关属性
        delete options.visible;
        delete options.scrollAble;

        $mask.css(options);

        return this;
    },

    show : function () {

        this.disableScroll(!this.config.scrollAble);

        Mask.$mask.show();

        return this;
    },

    hide : function () {

        if (Object.keys(Mask.instances).length === 1) {
            Mask.$mask.hide();
            this.disableScroll(false);
        }

        delete Mask.instances[this.id];

        return this;
    },

    // 禁用滚动条
    // todo : select bug
    // flag => true表示禁用
    disableScroll : function (flag) {

        var $body = $(document.body);

        if (flag === undefined) {
            flag = true;
        }

        if (flag) {
            $body.css('overflow', 'hidden');
        } else {
            $body.css('overflow', 'visible');
        }

        return this;
    }
});

Mask.instances = {};

Mask.defaults = defaults;

Mask.$mask = null;

module.exports = Mask;

// todo:
// 禁用滚动条地完美实现，目前存在bug