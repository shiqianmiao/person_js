/**
 * @desc 图片轮播组件
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-02-08
 */

var $ = require('jquery'),
    Widget = require('lib/widget/widget');

var defaults = {
    images: {
        s: [],
        m: [],
        b: []
    },
    onClick: function () {}
},

proto = {},

tpl = '' +
    '<div class="ui-imageslide-view">' +
        '<ul class="ui-imageslide-container ui-clearfix">' +
            '<li class="active">' +
                '<a href="javascript:;">' +
                    '<img src="http://sta.273.com.cn/widget/imageSlide/images/m_default.png">' +
                '</a>' +
            '</li>' +
        '</ul>' +

        '<div class="ui-imageslide-prev">' +
            '<span><i></i><a href="javascript:;"></a></span>' +
        '</div>' +

        '<div class="ui-imageslide-next">' +
            '<span><i></i><a href="javascript:;"></a></span>' +
        '</div>' +
    '</div>' +

    '<div class="ui-imageslide-nav ui-clearfix">' +
        '<div class="ui-imageslide-prevpage">' +
            '<span><a href="javascript:;"></a></span>' +
        '</div>' +

        '<div class="ui-imageslide-thumbs">' +
            '<div class="ui-imageslide-wrap ui-clearfix">' +
                '<ul class="ui-imageslide-page">' +
                    '<li class="active">' +
                        '<a href="javascript:;">' +
                            '<img src="http://sta.273.com.cn/widget/imageSlide/images/m_default.png">' +
                        '</a>' +
                        '<span></span>' +
                    '</li>'+
                '</ul>' +
            '</div>' +
        '</div>' +

        '<div class="ui-imageslide-nextpage">' +
            '<span><a href="javascript:;"></a></span>' +
        '</div>' +
    '</div>',

viewTpl = '' +
    '<% for (var i = 0, l = length; i < l; i++) {%>' +
    '<li class="<%if (i === 0) {%>active<%}%> ui-imageslide-loading">' +
        '<a href="javascript:;">' +
            '<img data-src="<%=views[i]%>">' +
        '</a>' +
    '</li>' +
    '<%}%>',


pageTpl = '' +
    '<%for (var i = 0; i < page; i++) {%>' +
    '<ul class="ui-imageslide-page">' +
        '<%for (var j = i * 10, l = j + 10; j < l && j < length; j++) {%>' +
        '<li class="<%if (j === 0) {%>active<%}%> ui-imageslide-loading">' +
            '<a href="javascript:;">' +
                '<img data-src="<%=thumbs[j]%>">' +
            '</a>' +
            '<span></span>' +
        '</li>' +
        '<%}%>' +
    '</ul>' +
    '<%}%>',

template = Widget.template(tpl)
viewTemplate = Widget.template(viewTpl),
pageTemplate = Widget.template(pageTpl);

function ImageSlide(options) {

    if (!(this instanceof ImageSlide)) return ImageSlide.apply({}, arguments);

    options = $.extend({}, defaults, options);

    var $el = $(options.el);
    var images = options.images;

    if (!$el.length) throw new Error('argument[el] is wrong');

    this.$el = $el;
    this._index = -1;
    this._pageIndex = -1;
    this.options = options;
    this.length = Math.min(images.s.length, images.m.length); //张
    this.page = Math.ceil(this.length / 10) || 1; // 页
    this.images = images;
    this._init();
}

ImageSlide.prototype = proto;

proto.constructor = ImageSlide;

$.extend(proto, {

    _init: function() {
        this._createDom();
        this._bindDom();
    },

    _createDom: function() {

        var $dom = $(template({}))
            $view = $dom.find('.ui-imageslide-container'),
            $prev = $dom.find('.ui-imageslide-prev'),
            $next = $dom.find('.ui-imageslide-next'),
            $wrap = $dom.find('.ui-imageslide-wrap'),
            $prevPage = $dom.find('.ui-imageslide-prevpage'),
            $nextPage = $dom.find('.ui-imageslide-nextpage'),
            $preview = $($dom[0]),

            $viewDom = $(viewTemplate({
                length: this.length,
                views: this.images.m
            })),

            $pageDom = $(pageTemplate({
                page: this.page,
                length: this.length,
                thumbs: this.images.s
            }));


        if ($viewDom.length > 0 && $pageDom.length > 0) {
            $view.html($viewDom);
            $wrap.html($pageDom);
        }

        $wrap.width(410 * this.page);

        this.$prev = $prev;
        this.$next = $next;
        this.$wrap = $wrap;
        this.$pages = $pageDom;
        this.$views = $viewDom;
        this.$preview = $preview;
        this.$prevPage = $prevPage;
        this.$nextPage = $nextPage;
        this.$thumbs = $pageDom.find('li');


        this.$el
            .html($dom)
            .addClass('ui-imageslide-loaded');

        if (this.length === 0) this.length = 1;

        this.goToPage(0);
    },

    _bindDom: function() {

        var me = this;

        this.$prev.on('click', function () {
            if ($(this).data('active')) {

                // setTimeout的用途是为了防止a标签href为javascript:void(0);或者javascript:;
                // 在阻止默认操作的同时，还阻止了ajax请求或者图片请求
                setTimeout(function () {
                    me.prev();
                }, 50);
            }
        });

        this.$next.on('click', function () {
            if ($(this).data('active')) {
                setTimeout(function () {
                    me.next();
                }, 50);
            }
        });

        this.$prevPage.on('click', function () {
            if ($(this).data('active')) {
                setTimeout(function () {
                    me.prevPage();
                }, 50);
            }
        });

        this.$nextPage.on('click', function () {
            if ($(this).data('active')) {
                setTimeout(function () {
                    me.nextPage();
                }, 50);
            }
        });

        this.$thumbs.hover(function () {
            var $this = $(this), timer;
            timer = setTimeout(function () {
                me.goTo(me.$thumbs.index($this));
                $this.data('timer', undefined);
                clearTimeout(timer);
            }, 200);
            $this.data('timer', timer);
        }, function () {
            var $this = $(this),
                timer = $this.data('timer');
            if (timer) {
                clearTimeout(timer);
            }
        });

        // todo: delegate
        this.$views.on('click', function () {
            var index = $(this).index();
            var handler = me.options.onClick;

            if ($.isFunction(handler)) {
                handler.call(me, index, me.images);
            }
        });

        this.$preview.hover(function () {
            me.$prev.addClass('ui-imageslide-hover');
            me.$next.addClass('ui-imageslide-hover');
        }, function () {
            me.$prev.removeClass('ui-imageslide-hover');
            me.$next.removeClass('ui-imageslide-hover');
        });
    },

    // 预加载
    _prefetch : function (index) {

        var $view;

        index || (index = this._index + 1);
        index = (~~index % this.length);
        $view = $(this.$views[index]);

        if ($view.length && !$view.data('loaded')) {
            var $img = $view.find('img'),
                img = new Image();

            img.onload = function () {
                $view.removeClass('ui-imageslide-loading');
                $img.attr('src', $img.data('src'));
                img.onload = null;
            };

            img.src =  $img.data('src');

            $view.data('loaded', true);
        }
        return this;
    },

    // 上一张
    prev: function() {
        return this.goTo(this._index - 1);
    },

    // 下一张
    next: function() {
        return this.goTo(this._index + 1);
    },

    // 上一页
    prevPage: function() {
        return this.goToPage(this._pageIndex - 1);
    },

    // 下一页
    nextPage: function() {
        return this.goToPage(this._pageIndex + 1);
    },

    // 第几张
    goTo: function(index) {

        var $prev = this.$prev,
            $next = this.$next,
            $views = this.$views,
            $thumbs = this.$thumbs,
            $lastView = this.$lastView,
            $lastThumb = this.$lastThumb,
            $view, $thumb, page;

        index = (~~index % this.length);
        page = Math.floor(index / 10);

        if (index === this._index || this._timer) return;

        if (page !== this._pageIndex) {
            this._timer = true;
            this.goToPage(page, index);
            return this;
        }

        $thumb = $($thumbs[index]);
        $view = $($views[index]);

        if ($lastThumb) $lastThumb.removeClass('active');
        if ($lastView) $lastView.removeClass('active');

        $thumb.addClass('active');
        $view.addClass('active');

        this._prefetch(index);

        if (index == 0) {
            $prev.data('active', false)
                .find('span')
                .removeClass('active');
        } else {
            $prev.data('active', true)
                .find('span')
                .addClass('active');
        }

        if (index == this.length - 1) {
            $next
                .data('active', false)
                .find('span')
                .removeClass('active');
        } else {
            $next
                .data('active', true)
                .find('span')
                .addClass('active');
        }

        this.$lastView = $view;
        this.$lastThumb = $thumb;

        this._index = index;

        this._prefetch();

        return this;
    },

    // 第几页
    goToPage: function(pageIndex, index) {

        var me = this,
            $wrap = this.$wrap,
            $prev = this.$prev,
            $next = this.$next,
            $pages = this.$pages,
            $page;

        pageIndex = (~~pageIndex % this.page);

        if (pageIndex === this._pageIndex) return;

        $page = $($pages[pageIndex]);

        $wrap.animate({marginLeft: -410 * pageIndex}, 500, 'swing', function () {

            if (pageIndex == 0) {
                $prevPage
                    .data('active', false)
                    .find('span')
                    .removeClass('active');
            } else {
                $prevPage
                    .data('active', true)
                    .find('span')
                    .addClass('active');
            }

            if (pageIndex == me.page - 1) {
                $nextPage
                    .data('active', false)
                    .find('span')
                    .removeClass('active');
            } else {
                $nextPage
                    .data('active', true)
                    .find('span')
                    .addClass('active');
            }

            if (!$page.data('loaded')) {
                $page.find('img')
                    .each(function () {
                        var $img = $(this),
                            $li = $img.parents('li'),
                            img = new Image();

                        img.onload = function () {
                            $li.removeClass('ui-imageslide-loading');
                            $img.attr('src', $img.data('src'));
                            img.onload = null;
                        };

                        img.src =  $img.data('src');
                    });
                $page.data('loaded', true);
            }

            me._pageIndex = pageIndex;

            if (index) {
                me._timer = false;
            }
            me.goTo(index || pageIndex * 10);
        });

        return this;
    }
});

function create(options) {
    return new ImageSlide(options);
};

ImageSlide.create = create;

module.exports = ImageSlide;
