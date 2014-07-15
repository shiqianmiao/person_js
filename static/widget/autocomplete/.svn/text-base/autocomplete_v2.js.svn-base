/**
 * @desc autocomplete组件（新版）
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-11-08
 */

var $ = require('jquery');
var Ua = require('util')['ua'];
var DataSource = require('./data_source.js');
var Widget = require('lib/widget/widget.js');

require('widget/autocomplete/autocomplete.css');

var defaults = {

    // 输入框selector
    el : '',

    // 自定义css类
    classPrefix : 'ui-autocomplete',

    // 模版
    template : '' +
        '<div class="<%= classPrefix %>" >' +
            '<ul class="<%= classPrefix %>-items" data-role="items">' +
                '<% items.forEach (function (item) {%>' +
                    '<li class="<%= classPrefix %>-item">' +
                        '<a href="javascript:;" data-role="item" data-value="<%= item.value %>"><%= item.text || item.value %></a>' +
                    '</li>' +
                '<% }); %>' +
            '</ul>' +
        '</div>',

    // input输入过滤
    inFilter : function (value) {
        return $.trim(value);
    },

    // datasource 输出过滤
    outFilter : function (data, query) {
        return data;
    },

    // 数据源
    dataSource : [],

    // 节流延迟
    delay : 200,

    // 相对el定位
    position : {
        x : 0,
        y : 1
    },

    // 宽度
    width : 0,

    // 层级
    zIndex : 99,

    // 最多显示
    max : 0,

    // 最多可见
    overflow : 0,

    // 输入框提示文字
    disabled : false,

    placeholder : '',

    // 默认选中第一个
    selectFirst : false,

    selectOnBlur : false,

    // 回车提交表单
    submitOnEnter : true,

    // 高亮显示query
    hightLight : false,

    // 传到服务器端的querystring，如：a=1&b=2
    // {} | function () {return {}}
    params : {},

    cacheAble : false,

    // 选中后是否focus输入框
    focusAble : true,

    onItemSelect : function (data) {
        this.$el.val(data.value || '');
    }
};



var AutoComplete = function (config) {

    !config && (config = {});

    var $el = $(config.el);
    var options;

    if (!$el.length) {
        throw new Error('argument[el] is incorrect')
    }

    options = $.extend({}, defaults, config);

    if (config.position) {
        options.position = $.extend({}, defaults.position, config.position);
    }

    if (!config.width) {
        options.width = $el.outerWidth();
    }

    this.$el = $el;
    this.config = options;

    this._init();
};


AutoComplete.prototype = {

    constructor : AutoComplete,

    $ : function (selector) {

        var $list = this.$list;

        if ($list) {
            return $list.find(selector);
        }

        return $();
    },

    _init : function () {

        var config = this.config;

        // 数据 | 模版 | 缓存
        this.model = {classPrefix : config.classPrefix, items : []};
        this.template = Widget.template(config.template);
        this.cache = {};

        // 数据源
        this.dataSource = new DataSource({
            source : config.dataSource,
            params : config.params
        });
        this.query = '';

        this._createDom()
            ._bindDom();
    },

    _createDom : function () {

        var config = this.config;

        var $list = $(this._compile());
        var $body = $(document.body);


        $list.css({
            width : config.width,
            zIndex : config.zIndex
        });

        // for select bug ie6
        if (Ua.ie == 6) {
            $list.prepend('<iframe style="position:absolute;left:0;top:0;width:100%;height:100%;z-index:-1;border:0 none;filter:alpha(opacity=0)"></iframe>')
        }

        $body.append($list);

        this.$list = $list; // 容器
        this.$items = $();  // 选项列表
        this.$item = $();   // 当前选项


        return this;
    },

    _bindDom : function () {

        var $input = this.$el;
        var $list = this.$list;

        var me = this;
        var config = this.config;
        var placeholder = config.placeholder;
        var classPrefix = config.classPrefix;
        var focusAble = config.focusAble;

        if (!$.trim($input.val()) && placeholder) {
            $input.val(placeholder);
        }

        $input
            .attr('autocomplete', 'off')
            .on('focus.autocomplete', function () {
                var value = $.trim($input.val());
                if (value === placeholder) {
                    $input.val('');
                }
            })
            .on('blur.autocomplete', function () {

                // 点击外部
                if (!me._secondKeydown ) {

                    var value = $.trim($input.val());

                    if (!value) {
                        $input.val(placeholder);
                    }

                    if (config.selectOnBlur) {
                        me.$item.trigger('mousedown');
                    }
                    me.hide();
                }
                // 点击选项
                else if (me._firstKeydown) {

                    if (focusAble) {
                        $input.trigger('focus.autocomplete');
                    }
                    me.hide();
                }
                // 点击滚动条
                else {
                    if (focusAble) {
                        $input.trigger('focus.autocomplete');
                    }
                }

                me._firstKeydown = undefined;
                me._secondKeydown = undefined;
            })
            .on('keydown.autocomplete', $.proxy(this._keydownEvent, this))
            .on('keyup.autocomplete', $.proxy(this._keyupEvent, this));

        $list
            // mousedown(非click) 先于 blur 触发，选中后再触发 blur 隐藏浮层
            .on('mousedown.autocomplete', '[data-role=item]', function (e) {
                $item = me.$item;

                if ($item.length === 0) {
                    $item = $(e.currentTarget);
                    me.$item = $item;
                }
                me._secondKeydown = undefined;
                me._firstKeydown = true;
                me._selectItem();
            })
            .on('mousedown.autocomplete', function (e) {
                me._secondKeydown = true;
            })
            .on('mouseenter.autocomplete', '[data-role=item]', function (e) {

                $item = me.$item;
                $item.removeClass(classPrefix + '-item-hover');

                $item = $(e.currentTarget);
                $item.addClass(classPrefix + '-item-hover');
                me.$item = $item;
            });

        $(window).on('resize.autocomplete', function () {
            me._position();
        });
    },

    _compile : function () {

        return this.template(this.model);
    },

    _selectItem : function () {

        var $item = this.$item;
        var $items = this.$items;
        var index = $items.index($item);

        var config = this.config;
        var data = this.model.items[index] || $item.data();
        var callback;

        if ($.isFunction(callback = config.onItemSelect)) {
            callback.call(this, data);
        }
    },

    _keydownEvent : function (e) {

        switch (e.which) {

            // enter
            case 13 : this._keyEnter(e); break;

            // esc
            case 27 : this._keyEsc(); break;

            // left
            case 37 : break;

            // up
            case 38 : this._keyUp(); break;

            // right
            case 39 : break

            // down
            case 40 : this._keyDown(); break;

            // others
            default : this.tag = true;

        }
    },

    _keyEsc : function () {

        if (this.config.selectOnBlur) {
            this.$item.trigger('mousedown');
        }
        this.hide();
    },

    _keyupEvent : function () {

        var me = this;
        var config = this.config;

        if (!this.tag) return;

        if (this._timeout) {
            clearTimeout(this._timeout);
        }

        me.tag = undefined;
        this._timeout = setTimeout(function () {

            me._timeout = undefined;

            me._getData();

        }, config.delay);
    },

    _getData : function () {

        var me = this;
        var html = '';
        var config = this.config;
        var query = config.inFilter.call(this, this.$el.val()) || '';

        if (!query) {

            me._updateDom(html);
        } else if (config.cacheAble && (html = this.cache[query])) {

            me._updateDom(html);
        } else if (query === this.query) {
            // 避免短时间重复请求
            // do nothing
        } else {
            // 阻止之前可能阻塞的ajax请求
            this.dataSource.abort()
                .getData(query)
                .done(function (data) {
                    me._processData(data, query);
                    me._updateDom();
                    me.query = '';
                });
        }

        this.query = query;
    },

    _processData : function (data, query) {

        var config = this.config;
        var max    = config.max;
        var hl     = config.hightLight;
        var classPrefix = config.classPrefix;

        if (!$.isArray(data)) {
            throw new Error('dataSource must be an Array');
        }

        data = config.outFilter.call(this, data, query);

        if (max > 0) {
            data = data.slice(0, max);
        }

        // 格式化数据
        data = data.map(function (item) {

            if (!$.isPlainObject(item)) {
                item = {value:item};
            }

            // query高亮
            if (hl && !item.text) {
                item.text = item.value.replace(new RegExp('(' + query + ')', 'g'), '<span class="' + classPrefix + '-item-hl">$1</span>');
            }

            return item;
        });

        this.model.items = data;
    },

    _updateDom : function (html) {

        var config = this.config;
        var overflow = config.overflow;
        var selector = '[data-role=items]';
        var $all, $selected, $items;

        // undefined
        if (html == null) {
            $all = $(this._compile());
            $selected = $all.find(selector);

            if ($selected.length) {
                html = $selected.html();
                if (config.cacheAble) {
                    this.cache[this.query] = html;
                }
            } else {
                throw new Error('attribute[data-role=items] is missing');
            }
        }

        this.$(selector).html(html);
        $items = this.$('[data-role=item]');

        var length = $items.length;
        var height = $items.height();

        if (html) {

            // 数据溢出，滚动条
            if (overflow > 0 && length > overflow) {

                this.$list.css({
                    overflowY : 'scroll',
                    height : height * overflow
                });
            } else {
                this.$list.css({
                    overflowY : 'visible',
                    height : height * length
                });
            }

            if (config.selectFirst) {
                $($items[0]).trigger('mouseenter');
            }
            this.show();
        } else {
            this.hide();
        }

        this.$items = $items;

        return this;
    },

    _keyEnter : function (e) {

        if (this.$items.length > 0 && this.isVisible()) {
            this.$item.trigger('mousedown');
            this.hide();
        }

        if (!$.trim(this.$el.val()) || this.$item.length !== 0 ||
            (!this.config.submitOnEnter && this.$item.length === 0)) {
            e.preventDefault();
        }
    },

    _keyUp : function () {

        if (!this.$items.length) return;

        if (!this.isVisible()) {
            this.show();
        } else {
            this._step(-1);
        }
    },


    _keyDown : function () {

        if (!this.$items.length) return;

        if (!this.isVisible()) {
            this.show();
        } else {
            this._step(1);
        }
    },

    _step : function (direction) {

        var $items = this.$items;
        var $item = this.$item;
        var index = $items.index($item);
        var length = $items.length;

        if (direction === 1) {
            index = ++index % length;
        } else if (direction === -1) {
            index = --index;
            if (index < 0) {
                index += length;
            }
        }

        $($items[index]).trigger('mouseenter');
    },

    _position : function () {

        var config = this.config;
        var position = config.position;

        var $input = this.$el;
        var $list = this.$list;

        var offset = $input.offset();

        if (!$list.width()) {
            $list.css('width', $input.outerWidth());
        }
        $list.css({
            left : offset.left + position.x,
            top : offset.top + $input.outerHeight() + position.y
        });
    },

    hide : function () {

        this.$list.css({
            visibility : 'hidden',
            top: -999,    // win7＋chrome下，特殊的滚动条visibility不能隐藏掉
            left: -999
        });
        return this;
    },

    show : function () {

        this._position();
        this.$list.css('visibility', 'visible');
        return this;
    },

    clear : function () {
        this.$items = $();
        this.$item = $();
    },

    isVisible : function () {

        return this.$list.css('visibility') === 'visible' ? true : false;
    }
};

module.exports = AutoComplete;
