/**
 * @desc 弹出框组件
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-09-15
 */

var $ = require('jquery');
var Widget = require('lib/widget/widget.js');
var Mask = require('widget/mask/mask.js');
var Util = require('util');
var Ua = Util.ua;

var unique = function (key) {

    var count = 0;

    key || (key = '');

    return function (name) {
        return (name || key) + '_' + (count++);
    };
};

var ucid  = unique('cid');
var udialog = unique('dialog');

var Dialog = function (options) {

    if (!this instanceof Dialog) {
        return new Dialog(options);
    }

    var self = this;

    this.config = $.extend({}, Dialog.defaults, options);

    this.skin()
        .done(function () {
            self._init()
                .$dialog.data('ui-dialog', self);

            if (self.defer) {
                self.defer.resolveWith(self);
            }
        });
}

var proto = Dialog.prototype = {};

proto.constructor = Dialog;

$.extend(proto, {

    _init : function () {

        var config = this.config;
        var id = this.id = config.id || udialog();
        var params = this._format();

        this._createDom(params)
            .content(config.content)
            ._bindDom()
            ._reset();

        if (params.visible) {
            this.show();
        }

        Dialog.instances[id] = this;

        return this;
    },

    _createDom : function (params) {

        var config = this.config;

        var $win = $(window);
        var $doc = $(document);
        var $body = $(document.body);

        var $dialog = $(Dialog.template(params)).hide();
        var mask;

        if (config.maskAble) {

            mask = new Mask({
                zIndex : params.zIndex - 1,
                visible : config.visible,
                opacity : config.opacity,
                scrollAble : config.scrollAble
            });

            this.mask = mask;
        }


        $body.prepend($dialog);

        // 无遮罩层强制隐藏select（ie6 bug）
        if (!config.maskAble && Ua.ie == 6){
            $iframe = $dialog.find('.ui-dialog-iframe');
            $iframe.css({
                width : $dialog.width(),
                height : $dialog.height()
            });

            this.$iframe = $iframe;
        }

        this.$win = $win;
        this.$doc = $doc;
        this.$body = $body;
        this.$dialog = $dialog;

        return this;
    },

    _bindDom : function () {

        var $doc = this.$doc;
        var $dialog = this.$dialog;

        var self = this;
        var config = this.config;
        var callbacks = self.callbacks;

        $dialog
            // 关闭按钮
            .on('click', '.ui-dialog-close', function (e) {

                var callback = config.close || config.cancel;

                if (!callback || callback.call(self, e) !== false) {
                    self.hide();
                }
                return false; // 阻止冒泡
            })
            // 确定 | 取消 | 自定义按钮
            .on('click', '.ui-dialog-button', function (e) {

                var $button = $(this);
                var cid = $button.data('cid');
                var callback;

                if (!cid || !(callback = callbacks[cid]) || callback.call(self, e) !== false) {
                    self.hide();
                }
            });


        if (config.drapAble) {

        }

        if (config.resizeAble) {

        }

        return this;
    },

    _position : function () {

        var fixed = this.config.fixAble;
        var isIE6 = (Ua.ie == 6);

        var $win = this.$win;
        var $doc = this.$doc;
        var $body = this.$body;
        var $html = $('html');
        var $dialog = this.$dialog;

        var ww = $win.width();
        var wh = $win.height();
        var dw = $dialog.width();
        var dh = $dialog.height();
        var sl = $doc.scrollLeft();
        var st = $doc.scrollTop();

        var left = Math.max(parseInt((ww - dw) / 2), 0);
        var top =  parseInt(Math.max((wh - dh), 0) * 382 / 1000); // 黄金比例

        var position = isIE6 ? 'absolute' : (fixed ? 'fixed' : 'absolute');

        if (fixed) {

            if (isIE6) {

                 $dialog[0].style.setExpression('top','(document).documentElement.scrollTop' + '+' + top);
                 $dialog[0].style.setExpression('left','(document).documentElement.scrollLeft' + '+' + left);

                // ie6下模拟fixed抖动bug
                if ($html.css('backgroundAttachment') !== 'fixed' && $body.css('backgroundAttachment') !== 'fixed') {
                    $html.css({
                        zoom: 1, // 避免偶尔出现body背景图片异常的情况，图片乱成一团
                        backgroundImage: 'url(about:blank)',
                        backgroundAttachment: 'fixed'
                    });
                }

                // ie6下body的宽度范围会限制对话框的定位，压缩对话框
                $body.css('width', $body.width());

            } else {
                $dialog.css({
                    top : top,
                    left : left
                });
            }
        } else {
            $dialog.css({
                top : top + st,
                left : left + sl
            })
        }

        $dialog.css('position', position);

        return this;
    },

    _format : function () {

        var params = $.extend(true, {}, this.config);
        var buttons = params.buttons;

        var template = Widget.template('<a href="javascript:;" class="ui-dialog-button <%=focus%>" data-cid="<%=cid%>"><%=text%></a>');

        // 改为添加dom
        params.content = this.content(Dialog.defaults.content, true);


        if (params.cancel) {
            buttons.unshift({
                text : params.cancelText,
                callback : params.cancel
            });
        }

        if (params.ok) {
            buttons.unshift({
                text : params.okText,
                callback : params.ok,
                focus : true
            });
        }

        if (params.width !== 'auto') {
            params.width = params.width + 'px';
        }

        if (params.height !== 'auto') {
            params.height = params.height + 'px';
        }

        params.zIndex = Dialog.zIndex;

        Dialog.zIndex+=2;

        var callbacks = this.callbacks = {};
        var noop = function () {};

        params.buttons = $.map(buttons, function (button) {

            var cid = ucid();

            if (button.focus) {
                button.focus = 'ui-dialog-focus';
            } else {
                button.focus = '';
            }

            button.cid = cid;
            callbacks[cid] = button.callback || noop;

            return template(button);
        }).join('');

        params.isIE6 = (Ua.ie == 6);

        return params;
    },

    // 复位对话框
    _reset : function () {

        //var $main = this.$main ? this.$main : (this.$main = this.$dialog.find('.ui-dialog-main'));

        //$main.width($main.width()); // 获取main的真实高度，ie6下外层的宽度限制会影响内层的宽度

        this._position();

        return this;
    },

    // 下载皮肤
    skin : function (skin) {

        skin || (skin = this.config.skin);

        return require.async(['./skins/' + skin + '.css']);
    },

    // 返回对话框实例
    get : function (id) {

        var dialog = null;

        if (!id || !(dialog = Dialog.instances[id])) {
            return null;
        }

        return dialog;
    },

    // 设置标题
    title : function (title) {

        var $title = this.$title ? this.$title : (this.$title = this.$dialog.find('.ui-dialog-title'));

        $title.html(title || '');

        this._reset();

        return this;
    },

    // 设置内容
    content : function (content, internal) {

        var $content;

        try {
            $content = $(content);
        } catch (e) {
            $content = $();
        }

        // string | dom | jquery selector | jquery object
        if ($content.size() > 0) {
            content = $content;
        }

        if (internal) {

            return content.length ? $('<div>').append(content.clone().show()).html() : content;
        } else {

            $content = this.$content ? this.$content : (this.$content = this.$dialog.find('.ui-dialog-content'));

            $content.html('').append(content || '');

            this._reset();
        }

        return this;
    },

    // 加载远程页面（iframe）
    open : function (url, callback) {

        var self = this;
        var config = this.config;
        var $dialog = this.$dialog;
        var $content = $dialog.find('.ui-dialog-content');
        var $loading = $dialog.find('.ui-dialog-loading');
        var $iframe = $('<iframe frameborder="0">');
        var $idoc, iwin, width, height;

        require.async(['lib/rpc/rpc.js'], function (RPC) {

            var rpc;

            $iframe.on('load', function () {


                if (config.width === 'auto') {
                    rpc.call('size').done(function (data) {
                        self.size(data.width);
                    });
                }

                if (config.height === 'auto') {
                    rpc.call('size').done(function (data) {
                        self.size(null, data.height);
                    });
                }

                $content.css({
                    padding : '0',
                    height : '100%'
                });

                $loading.hide();
                $iframe.show();

            }).hide();

            // 注意以下两步的顺序，反了，会导致chrome下load执行两次
            $iframe.attr('src', url);

            $content.append($iframe);

            rpc = new RPC({
                remote : $iframe[0].contentWindow
            });

            rpc.register({

                close : function () {
                    self.close();
                },

                refresh : function () {
                    window.location.reload();
                },

                resize : function (width, height) {
                    self.size(width, height);
                },

                setTitle : function (title) {
                    self.title(title);
                },

                setContent : function (content) {
                    self.content(content);
                }
            });

            self.rpc = rpc;

            callback && callback.call(self);
        });

        return this;
    },

    // 加载远程数据
    load : function () {

    },

    // 显示对话框
    show : function () {

        var that;
        var self = this;
        var config = this.config;
        var mask = this.mask;
        var $dialog = this.$dialog;

        if (!$dialog || (config.maskAble && !mask)) {

            // 重塑对话框dom
            new Dialog($.extend({}, this.config, {id:this.id, visible:true}));

        } else {
            $dialog.show();

            if (mask) {
                mask.update({
                    zIndex : $('.ui-dialog').css('zIndex') - 1
                }).show();
            }

           if (this.config.focusAble) {

                var button = $dialog.find('.ui-dialog-focus').last()[0];

                if (button) {
                    button.focus(); // 必须对可见元素设置焦点才有效，IE还会报错
                }
            }

        }

        return this;
    },

    // 隐藏对话框（删除dom）
    hide : function () {

        var self = this;
        var mask = this.mask;
        var rpc = this.rpc;
        var $dialog = this.$dialog;

        window.setTimeout(function () {

            if ($dialog) {
                $dialog.remove();
                self.$dialog = null;
            }

            if (mask) {
                mask.update({
                        zIndex : $('.ui-dialog').css('zIndex') - 1
                }).hide();
                self.mask = null;
            }

            if (rpc) {
                rpc.destory();
            }
        }, 200);

        return this;
    },

    close : function () {
        var $dialog = this.$dialog;
        var $close = $dialog.find('.ui-dialog-close');

        $close.trigger('click');
        return this;
    },

    // 设置宽高
    size : function (width, height) {

        var $dialog = this.$dialog;
        var $iframe = this.$iframe;
        var $main = this.$main ? this.$main : (this.$main = $dialog.find('.ui-dialog-main'));

        var params = {};

        width && (params.width = width);
        height && (params.height = height);

        $main.css(params);

        // select相关iframe
        if ($iframe) {
            $iframe.css({
                width : $dialog.width(),
                height : $dialog.height()
            });
        }

        this._reset();
        return this;
    },

    // 皮肤是异步加载，提供ready函数
    ready : function (callback) {

        var defer = this.defer ? this.defer : (this.defer = $.Deferred());

        defer.done(callback);

        return this;
    },

    register : function (name ,fn) {

        if (this.rpc) {
            this.rpc.register(name, fn);
        }

        return this;
    }
});

// 版本
Dialog.version = '1.0';

// 缓存
Dialog.instances = {};

// 配置
Dialog.defaults = {

    // 标题
    title : '标题',

    // 内容 string | html | dom
    content : '<div class="ui-dialog-loading"></div>',

    // 确定按钮回调函数
    ok : null,

    // 对话框id，用来获取实例
    id : null,

    // 取消按钮回调函数
    cancel : null,

    // 关闭按钮回调函数
    close : null,

    // 确定按钮文本
    okText : '确定',

    // 取消按钮文本
    cancelText : '取消',

    // 自定义按钮
    buttons : [],

    // 内容宽度 auto表示自适应
    width : 'auto',

    // 内容高度 auto表示自适应
    height : 'auto',

    // 内容与边界填充距离
    padding : '20px 25px',

    // 皮肤名
    skin : 'blue',

    // 是否固定
    fixAble : true,

    // 能否拖动
    drapAble : false,

    // 能否调节尺寸
    resizeAble : false,

    // 能否关闭
    closeAble : true,

    // 是否遮罩
    maskAble : true,

    // 遮罩透明度
    opacity : 0.6,

    // 能否滑动（滚动条）
    scrollAble : true,

    // 按钮聚焦
    focusAble : true,

    // esc关闭对话框
    escAble : false,

    // 初始情况是否显示
    visible : true
};

Dialog.zIndex = 1990;

// for iframe
// <iframe frameborder="0" src="http://www.273.cn"></iframe>

// 模板
var templates =
'<div class="ui-dialog" style="z-index:<%=zIndex%>;">'
+ '<%if (!maskAble && isIE6) {%><iframe class="ui-dialog-iframe" style="position:absolute;left:0;top:0;width:100%;height:100%;z-index:-1;border:0 none;filter:alpha(opacity=0)"></iframe><%}%>'
+   '<table cellspacing="0">'
+       '<tbody>'
+           '<tr>'
+               '<td class="ui-dialog-tl"></td>'
+               '<td class="ui-dialog-tc"></td>'
+               '<td class="ui-dialog-tr"></td>'
+           '</tr>'
+           '<tr>'
+               '<td class="ui-dialog-cl"></td>'
+               '<td class="ui-dialog-cc">'
+                   '<table cellspacing="0">'
+                       '<tbody>'
+                           '<tr>'
+                               '<td class="ui-dialog-header">'
+                                   '<div class="ui-dialog-bar <%if (drapAble) {%> ui-dialog-drap <%}%>">'
+                                       '<div class="ui-dialog-title"><%=title%></div>'
+                                       '<a class="ui-dialog-close" href="javascript:;" <%if (!closeAble) {%> style="display:none;" <%}%>>×</a>'
+                                   '</div>'
+                               '</td>'
+                           '</tr>'
+                           '<tr>'
+                               '<td class="ui-dialog-main" style="width:<%=width%>;height:<%=height%>;">'
+                                   '<div class="ui-dialog-content" style="padding:<%=padding%>"><%=content%></div>'
+                               '</td>'
+                           '</tr>'
+                           '<tr>'
+                               '<td class="ui-dialog-footer">'
+                                   '<div class="ui-dialog-buttons"><%=buttons%></div>'
+                               '</td>'
+                           '</tr>'
+                       '</tbody>'
+                   '</table>'
+               '</td>'
+               '<td class="ui-dialog-cr"></td>'
+           '</tr>'
+           '<tr>'
+               '<td class="ui-dialog-bl"></td>'
+               '<td class="ui-dialog-bc"></td>'
+               '<td class="ui-dialog-br <%if (resizeAble) {%> ui-dialog-resize <%}%>"></td>'
+           '</tr>'
+       '</tbody>'
+   '</table>'
+'</div>';

Dialog.template = Widget.template(templates);

// 警告对话框
Dialog.alert = function (options) {

}

// 确认对话框
Dialog.confirm = function (options) {

}

// 提示对话框
Dialog.notice = function (options) {

}


var timer;
// 对话框动态居中
$(window).on('resize', function () {

    // 简单的节流
    timer && window.clearTimeout(timer);

    timer = window.setTimeout(function () {

        $('.ui-dialog').each(function () {

            var $this = $(this);
            var dialog = $this.data('ui-dialog');

            if (dialog) {
                dialog._position();
            }
        });
    }, 50);

});

$(document).on('keyup', function (e) {

    var $dialog = $($('.ui-dialog')[0]);
    var dialog;

    if (e.keyCode == 27 && $dialog.size() > 0 && $dialog.is(':visible') && (dialog = $dialog.data('ui-dialog')) && dialog.config.escAble) {
        $dialog.find('.ui-dialog-close').click();
    }
});

module.exports = Dialog;