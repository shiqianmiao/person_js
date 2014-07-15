/**
 * @desc 图片轮播组件
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-07－07
 */

require('widget/slide/slide.css');

var $ = require('jquery');
var Widget = require('lib/widget/widget.js');
var KeyContorl = require('app/common/key_contorl.js');

var Config = {
    el : null,
    width : 230,
    height : 200,
    images : [],
    interval: 5000,
    duration: 500
};

var PicTemplate = '<li style="background:url(<%= src %>) no-repeat center 0;"><a href="<%= href %>" target="_blank" title="<%= title %>"></a></li>';
var NumTemplate = '<li <% if (index === 0) { %>class="on" <% } %>></li>';

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
    var $picDiv = $('<div>');
    var $numDiv = $('<div>');
    var $pic = $('<ul>');
    var $num = $('<ol>');

    $picDiv.attr('class', 'slider')
        .css({
            width : config.width,
            height : config.height
        });
        
    $numDiv.attr('class', 'num');

    $pic.css({
            width : config.width * config.images.length,
            height : config.height
        });

    $.each(config.images, function (index, value) {

        var image = $.extend({
            src : '',
            href : 'javascript:void(0);',
            title : ''
        }, value);

        $pic.append(Widget.template(PicTemplate, image));
        $num.append(Widget.template(NumTemplate, {index:index}));
    });

    this.$numLi = $num.find('li');
    this.$picLi = $pic.find('li');
    this.$p = $pic;
    
    $(this.$picLi[0]).siblings('li').hide();
    $picDiv.append($pic);
    $numDiv.append($num);
    $el.append($picDiv);
    $el.append($numDiv);

    return this;
};

proto.bindEvent = function () {

    var me = this;
    var length = me.config.images.length;
    var $numLi = this.$numLi;
    this.curIndex = 0;

    function clickTurn() {
        $numLi.off('click.slide');
        var i = $(this).index();
        me.turnPic(i, function() {
            $numLi.on('click.slide', clickTurn);
        });
    }

    $numLi.on('click.slide', clickTurn);
    
    //键盘事件
    var left = KeyContorl({
        key : 'left',
        callback : function() {
            left.cancel();
            right.cancel();
            me.curIndex = me.curIndex <= 0 ? length - 1 : --me.curIndex;
            me.turnPic(me.curIndex, function() {
                left.start();
                right.start();
            });
        }
    });
    var right = KeyContorl({
        key : 'right',
        callback : function() {
            left.cancel();
            right.cancel();
            me.curIndex = me.curIndex >= length - 1 ? 0 : ++me.curIndex;
            me.turnPic(me.curIndex, function() {
                left.start();
                right.start();
            });
            
        }
    });
    
    return this;
};

proto.turnPic = function(i, callback) {
    var me = this;
    if (!callback) {
        callback = $.noop;
    }
    $.proxy(me.clearInterval, me)();
    me.curIndex = i;
    var $this = me.$numLi.eq(i);
    $picLi = me.$picLi.eq(i);
    $oPicLi = $picLi.prevAll('li');
    $this.addClass('on').siblings().removeClass('on');

    var $nowPic = null;
    me.$picLi.each(function() {
        if ($(this).is(':visible')) {
            $nowPic = $(this);
            return false;
        }
    });

    $nowPic.fadeOut('normal', $.proxy(function() {
        me.$picLi.eq(i).fadeIn('normal', callback);
    }, this));
    $.proxy(me.setInterval, me)();
};

proto.setInterval = function () {

    var me = this;
    var length = me.config.images.length;
    if (this.config.interval) {

        this.interval = window.setInterval(function () {
            me.curIndex++;
            me.turnPic(me.curIndex % length);
//            $(me.$numLi[me.curIndex%length]).trigger('click');
        }, this.config.interval);
    }
};

proto.clearInterval = function () {

    if (this.interval) {
        window.clearInterval(this.interval);
    }
};


module.exports = Slide;

