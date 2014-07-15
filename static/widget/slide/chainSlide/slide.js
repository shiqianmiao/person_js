/**
 * @fileoverview
 * @author chenhan <chenhan@273.cn>
 */

require('widget/slide/chainSlide/slide.css');

var $ = require('jquery'),
    Widget = require('lib/widget/widget');

/**
 * 总模板
 * @type {string}
 */
var SlideTpl = '' +
    '<a id="js_prev" href="javascript:;" class="prev"><span></span><i></i></a>' +
    '<a id="js_next" href="javascript:;" class="next"><span></span><i></i></a>' +
    '<div id="js_outer" class="content_wrap">' +
        '<div id="js_inner" class="inner">' +
            '<ul></ul>' +
        '</div>' +
    '</div>';

/**
 * 图片列表模板
 * @type {string}
 */
var ImgTpl = '' +
    '<% images.forEach(function(image) { %>' +
            '<li><img src="<%= image %>" /></li>' +
    '<% }); %>';

/**
 * 图片列表模板函数
 */
var ImgTemplate = Widget.template(ImgTpl);

var Slide = function(options) {
    try {
        this.config = $.extend({}, this.defaults, options);
        this._init();
    } catch(e) {
        console.log(e.stack);
    }
};

var prop = Slide.prototype = {};

$.extend(prop, {
    /**
     * 初始化
     * @private
     */
    _init: function() {
        var self = this,
            config = self.config;
        if (!config) {
            throw new Error('缺少配置信息!');
        }
        config.$el = $(config.el);
        if (!config.$el.length) {
            throw new Error('el参数有误!');
        }
        if (!config.images || !config.images.length) {
            throw new Error('images参数有误!');
        }
        self.images = config.images;
        self.$slideTpl = $(SlideTpl);

        self._render();
        self._event();
    },

    /**
     * 模板结构渲染插入页面
     * @private
     */
    _render: function() {
        var self = this,
            $el = self.config.$el,
            images = self.images,
            $images;

        if (images.length === 1) {
            while (images.length < 4) {
                images.push(images[0]);
            }
        } else if (images.length === 2) {
            images.push(images[0]);
            images.push(images[1]);
        }

        images.unshift(images.pop());
        self.$images = $images = $(ImgTemplate({images: images}));
        $.merge($.merge($images, $images.clone()), $images.clone());
        self.length = self.$images.size();

        var $slideHtml = self.$slideTpl.clone().find('#js_inner ul').append($images).end();

        $el.empty().append($slideHtml);
    },

    /**
     * 事件初始化
     * @private
     */
    _event: function() {
        var self = this,
            config = self.config,
            $el = config.$el,
            $images = self.$images,
            totalWdith = self.length * $images.outerWidth(true);

        self.$prev = $el.find('#js_prev');
        self.$next = $el.find('#js_next');
        self.$btn = $.merge($.merge($([]), self.$prev), self.$next);
        self.$outer = $el.find('#js_outer');
        self.$inner = $el.find('#js_inner');
        self.$ul = self.$inner.find('ul');

        self.$outer.css({
            'width': totalWdith,
            'left': -totalWdith / 2
        });

        self.$btn.hover(function() {
            var i = this.getElementsByTagName('i')[0];
            i.className = 'on';
        }, function() {
            var i = this.getElementsByTagName('i')[0];
            i.className = '';
        });

        self.$prev.on('click.slide', function slideLeft() {
            self.$prev.off('click.slide');
            self.slide('left', function() {
                self.$prev.on('click.slide', slideLeft);
            });
        });
        self.$next.on('click.slide', function slideRight() {
            self.$next.off('click.slide');
            self.slide('right', function() {
                self.$next.on('click.slide', slideRight);
            });
        });
    },
    /**
     * 滚动
     * @param {string} diretion 滚动方向
     * @param {function} fn 滚动完成时的回调
     */
    slide: function(diretion, fn) {
        var self = this,
            $inner = self.$inner,
            $ul = self.$ul,
            width = self.$images.outerWidth(true);
        if (diretion === 'left') {
            $inner.animate({left: width}, 250, 'swing', function() {
                var $images = $ul.find('li');
                $ul.prepend($images.last());
                $inner.css('left', 0);
                fn();
            });
        } else {
            $inner.animate({left: -width}, 250, 'swing', function() {
                var $images = $ul.find('li');
                $ul.append($images.first());
                $inner.css('left', 0);
                fn();
            });
        }
    }
});

Slide.defaults = {};

module.exports = function(options) {
    return new Slide(options);
};