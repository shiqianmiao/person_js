/**
 * @desc 图片轮播组件
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-07－07
 */

require('widget/slide/slide.css');

var $ = require('jquery');
var Widget = require('lib/widget/widget.js');

var Config = {
    el : null,
    width : 230,
    height : 200,
    images : [],
    interval: 5000,
    duration: 500
};

var PicTemplate = '<span><a href="<%= href %>" target="_blank" title="<%= title %>"><img src="<%= src %>" alt="<%= title %>" ></a></span>';
var NumTemplate = '<a href="javascript:void(0);" <% if (index === 0) { %>class="on" <% } %>></a>';

var Slide  = function (config) {

    if (!(this instanceof Slide)) return new Slide(config);

    this.init(config)
        .createDom()
        .bindEvent()
        .setInterval();
};


var proto = Slide.prototype = {};

proto.constructor = Slide;

proto.init = function (config) {

    this.config = config = $.extend(Config, config);

    this.$el = $(config.el);

    if (this.$el.size() === 0) {
        throw new Error('el参数不可以为空');
    }

    if (config.images.length === 0) {
        throw new Error('images参数不可以为空');
    }

    // 索引
    this.index = 1;
    return this;
};

proto.createDom = function () {

    var config = this.config;

    var $el = this.$el;
    var $slide = $('<div>');
    var $pic = $('<p>');
    var $num = $('<p>');
    var $bg = $('<span>');

    $slide.attr('class', 'js-slide')
        .css({
            width : config.width,
            height : config.height
        });


    $pic.attr('class', 'js-slide-pic')
        .css({
            width : config.width * config.images.length,
            height : config.height
        });

    $num.attr('class', 'js-slide-num')
        .css('width', config.width);

    $bg.attr('class', 'js-slide-bg')
        .css('width', config.width);

    $.each(config.images, function (index, value) {

        var image = $.extend({
            src : '',
            href : 'javascript:void(0);',
            title : ''
        }, value);

        $pic.append(Widget.template(PicTemplate, image));
        $num.append(Widget.template(NumTemplate, {index:index}));
    });

    this.$a = $num.find('a');
    this.$span = $pic.find('span');
    this.$p = $pic;
    $num.find('a').css('left', config.width - 19 * config.images.length);
    $num.append($bg);
    $slide.append($pic, $num);
    $el.append($slide);

    return this;
};

proto.bindEvent = function () {

    var me = this;
    var length = me.config.images.length;

    this.$a.each(function (i) {
        var $this = $(this);

        $this.click(function (e, auto) {

            var $other = $(me.$span[i]).prevAll('span');
            var olength = $other.length;

            me.$p.animate({left : - (olength * me.config.width)}, me.config.duration, "swing", function () {
                $this.addClass('on');
                me.$a.not($this).removeClass('on');
                $other.appendTo(me.$p);
                me.$p.css('left' , 0);
                me.index = (i + 1) % length;
            });

            if (!auto) {
                me.clearInterval();
                me.setInterval();
            }

            return false;
        });
    });

    return this;
};

proto.setInterval = function (index) {

    var me = this;

    if (this.config.interval) {

        this.interval = window.setInterval(function () {

            $(me.$a[me.index]).trigger('click', [true]);
        }, this.config.interval);
    }
};

proto.clearInterval = function () {

    if (this.interval) {
        window.clearInterval(this.interval);
    }
};


module.exports = Slide;

