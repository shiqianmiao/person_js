/**
 * @desc 图片放大镜
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-08-08
 */

require('widget/imageMagnifier/image_magnifier.css');

var $ = require('jquery');

// 默认配置
var Defaults = {

    el : '',            // 图片元素
    width : 0,          // view的宽度
    height : 0,         // view的高度
    position : 'right', // view相对与小图的位置，right || left || top || bottom
    offsetX : 0,       // 水平方向，view相对于小图的偏移量
    offsetY : 0,        // 竖直方向，view相对于小图的偏移量
    simWidth : 0,       // 大图模拟宽度，用于预加载图片
    simHeight : 0,      // 大图模拟高度，用于预加载图片
    src : ''            // 大图src，优先取data-src属性
};

// 放大镜状态
var Status = {
    'A' : 0, // 初始状态
    'B' : 1, // 小图加载完成（move可用）
    'C' : 2  // 大图加载完成（大图定位）
};

var Magnifier = function (config) {

    this.$simg = $(config.el);
    this.config = config;
    this.status = Status['A'];
    this.active = true;
    this._init();
};

var proto = Magnifier.prototype;

proto.constructor = Magnifier;


$.extend(proto, {

    _init : function () {

        this._createDom();
        this._bindDom();
        this.disable(false);
    },
    _createDom : function () {

        var config = this.config;

        var $simg  = this.$simg;
        var $wrap = $('<div>');
        var $lens = $('<div>');
        var $bimg = $('<img>');
        var $view = $('<div>');
        var $icon = $('<div>');
        var $container = $('<div>');

        $wrap.addClass('js-ui-magnifier-wrap');
        $lens.addClass('js-ui-magnifier-lens');
        $view.addClass('js-ui-magnifier-view');
        $icon.addClass('js-ui-magnifier-icon');
        $container.addClass('js-ui-magnifier');

        $wrap.append($lens, $icon);
        $container.append($wrap);
        $simg.before($container);
        $simg.prependTo($wrap);

        $view.append($bimg);

        $('body').prepend($view);

        this.$wrap = $wrap;
        this.$lens = $lens;
        this.$bimg = $bimg;
        this.$view = $view;
        this.$icon = $icon;
    },
    _bindDom : function () {

        var self = this;
        var $simg = this.$simg;
        var $bimg = this.$bimg;
        var $lens = this.$lens;
        var $view = this.$view;
        var $wrap = this.$wrap;
        var $icon = this.$icon;

        $wrap.on('mouseenter', function (e, flag) {

            // 大图src
            var src = $simg.data('src');

            if (!src) {
                src = self.config.src || '';
                $simg.data('src', src);
            }

            $bimg.attr('src', src);

            if (!flag) {
                self.show();
            }

        }).on('mousemove', function (e) {

            // 等待小图加载完成
            if (self.status === Status['A']) {
                return false;
            }

            var px = e.pageX;
            var py = e.pageY;

            var ox = px - self.sx;
            var oy = py - self.sy;


            var lw = self.lw;
            var lh = self.lh;
            var sw = self.sw;
            var sh = self.sh;

            // lens定位
            var lx = (ox - lw / 2) > 0 ? ((ox + lw / 2) > sw ? parseInt(sw - lw) : parseInt(ox - lw / 2)) : 0;
            var ly = (oy - lh / 2) > 0 ? ((oy + lh / 2) > sh ? parseInt(sh - lh) : parseInt(oy - lh / 2)) : 0;

            $lens.css({
                left : lx + self.sox,
                top : ly + self.soy
            });

            // 等待大图加载完成
            if (self.status === Status['C']) {

                // 大图定位
                var bx = - parseInt(lx * self.scaleX);
                var by = - parseInt(ly * self.scaleY);

                $bimg.css({
                    left : bx,
                    top : by
                });
            }
        }).on('mouseleave', function (e) {

            self.hide();
        });

        $simg.on('load', function () {

            // 小图宽高
            self.sw = $simg.width();
            self.sh = $simg.height();

            // 小图定位
            self.sx = $simg.offset().left;
            self.sy = $simg.offset().top;

            // 小图的边距（border/padding/margin）
            self.sox = ($simg.outerWidth(true) - self.sw) / 2;
            self.soy = ($simg.outerHeight(true) - self.sh) / 2;

            // view宽高
            self.vw = self.config.width || self.sw;
            self.vh = self.config.height || self.sh;

            // view定位
            var pos = self.config.position;
            var ox = self.config.offsetX;
            var oy = self.config.offsetY;

            if (pos === 'top') {

                self.vx = self.sx + ox;
                self.vy = self.sy - self.vh - oy;
            } else if (pos === 'bottom') {

                self.vx = self.sx + ox;
                self.vy = self.sy + self.sh + oy;
            } else if (pos === 'left') {

                self.vx = self.sx - self.vw - ox;
                self.vy = self.vy + oy;
            } else {
                self.vx = self.sx + self.sw + ox;
                self.vy = self.sy + oy;
            }


            // 大图可能比小图先加载完
            if (self.status === Status['A']) {
                self.status = Status['B'];
            } else {
            // 大图已加载完
                self.disable(false);
            }

            
        });

        $bimg.on('load', function () {

            if (self.status === Status['B']) {
                self.disable(false);
            }
            self.status = Status['C'];
        });

        // 小图已加载完
        if ($simg[0].complete) {
            $simg.trigger('load');
        }

        $wrap.trigger('mouseenter', true);
    },
    change : function (src) {

        // 更改大图src，用于多图模式
        var $simg = this.$simg;
        var $bimg = this.$bimg;
        var $icon = this.$icon;

        var osrc = $simg.data('src');

        if (!src || src === osrc) {
            return;
        }

        this.disable();
        self.status = Status['A'];

        $simg.data('src', src);
    },
    show : function () {

        if (!this.active) {
            return;
        }

        var $lens = this.$lens;
        var $view = this.$view;
        var $bimg = this.$bimg;
        var $icon = this.$icon;

        // 大图宽高
        this.bw = $bimg.width() || this.config.simWidth;
        this.bh = $bimg.height() || this.config.simHeight;

        // 宽高比例
        this.scaleX = this.bw / this.sw;
        this.scaleY = this.bh / this.sh;

        // lens宽高
        this.lw = parseInt(this.vw / this.scaleX);
        this.lh = parseInt(this.vh / this.scaleY);

        $icon.hide();

        $lens.css({
            width : this.lw,
            height : this.lh
        }).show();

        $view.css({
            width : this.vw,
            height : this.vh,
            left : this.vx,
            top : this.vy,
            visibility: 'visible'
        });
    },
    hide : function () {

        if (!this.active) {
            return;
        }

        var $lens = this.$lens;
        var $view = this.$view;
        var $icon = this.$icon;

        $lens.hide();
        $view.css('visibility', 'hidden');
        if ($icon.data('icon')) {
            $icon.show();
        }
        
    },
    disable : function (disabled) {

        var $icon = this.$icon;

        if (disabled === undefined || disabled === '') {
            disabled = true;
        } else {
            disabled = !!disabled;
        }

        this.active = !disabled;


        if (disabled) {
            $icon.data('icon', false).hide();
        } else {
            $icon.data('icon', true).show();
        }
    }
});


// 接口
module.exports = function (config) {

    var $el = $(config.el);

    if (!$el.size() || $el[0]['tagName'].toLowerCase() !== 'img') {
        throw new Error('el is incorrect');
    }

    // if (!config.simWidth || !config.simHeight) {
    //     throw new Error('simWidth/simHeight must be set');
    // }

    var magnifier;
    var instance = $el.data('js-ui-magnified') || {};

    if (!$.isPlainObject(instance)) {
        return instance;
    }

    config = $.extend(Defaults, config || {});

    magnifier = new Magnifier(config);


    $.extend(instance, {

        show : function () {
            magnifier.show();
            return this;
        },
        hide : function () {
            magnifier.hide();
            return this;
        },
        change : function (src) {
            magnifier.change(src);
            return this;
        },
        disable : function (disabled) {
            magnifier.disable(disabled);
            return this;
        }
    });

    $el.data('js-ui-magnified', instance);

    return instance;
};