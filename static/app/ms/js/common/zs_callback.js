/**
 * 招商页免费回拨
 * @author      daiyuancheng<daiyc@273.cn>
 * @date        14-5-12
 */
var $ = require('jquery');
var Dialog = require('widget/dialog/dialog.js');
var Widget = require('lib/widget/widget.js');
var Cookie = require('util/cookie.js');

var DEFAULT_TITLE = '免费电话回呼';

var MOBILE_TIP = '不支持小灵通';

var DEFAULT_TPL = '<div id="pop_callback">' +
    '<div class="pop_box_content">' +
        '<form>' +
        '<div class="lay">输入您的手机号码,我们将第一时间回拨给您</div>' +
        '<div class="lay h60"><input class="input1 js_mobile" value="<%if (mobile) {%><%=mobile%><%}else{%>不支持小灵通<%}%>"><p class="tip"><b></b><span class="error js_error" style="display: none;"><i></i></span></p></div>' +
        '<div class="lay mb40"><button type="submit" class="js_submit">确　定</button></div>' +
        '<div class="footer"><span class="s1">企业咨询热线：<strong>400-6000-273</strong></span></div>' +
        '<input type="text" style="display: none;">' +
        '</form>' +
    '</div>' +
'</div>';

var SUCCESS_TPL = '<div id="pop_call_suc">' +
    '<div class="pop_box_content">' +
        '<div class="success_tips">' +
            '<p class="p1"><i></i>请求已成功！</p>' +
            '<p class="p2">请保持电话通畅</p>' +
            '<p class="p2">稍后为您免费回拨</p>' +
        '</div>' +
        '<div class="footer"><span class="s1">企业咨询热线：<strong>400-6000-273</strong></span></div>' +
    '</div>' +
'</div>';

var isTel = function(mobile) {
    var rphone = /^1[3458]\d{9}$/;
    if (!rphone.test(mobile)) {
        return false;
    }
    return true;
}

var ZsCallback = function(options) {
    if (!options) {
        throw new Error('配置信息为空');
    }
    if (!options.$el) {
        throw new Error('$el为空');
    }
    this.$el = options.$el;
    this.config = $.extend({}, ZsCallback.defaults, options);

    this._init();
}

ZsCallback.defaults = {};

var proto = ZsCallback.prototype = {};

$.extend(proto, {
    _dialog : null
    , $mobile : null
    , $error : null
    , $submit : null
    , _sended : false
    , mobile : ''
    , _init : function() {
        this.mobile = Cookie.get('mobile') || '';
        this.$el.on('click', $.proxy(this.initPanel, this)).click();
    }
    , initPanel : function() {
        var $content = $(Widget.template(DEFAULT_TPL, {
                mobile: this.mobile
            })),
            me = this;
        this.$mobile = $content.find('.js_mobile');
        this.$error = $content.find('.js_error');
        this.$submit = $content.find('.js_submit');
        this.$mobile.on('focus', function(e) {
            var $this = me.$mobile;
            if ($this.val() == MOBILE_TIP) {
                $this.val('');
            }
            me.$error.hide();
        }).on('blur', function(e) {
            if (me.$mobile.val() == '') {
                me.$mobile.val(MOBILE_TIP);
            }
            me._checkMobile();
        });
        this.$submit.on('click', function(e) {
            if (!me._sended && me._checkMobile()) {
                me._changeSendStatus(true);
                me.mobile = me.$mobile.val();
                $.ajax({
                    url : 'http://www.273.cn/ajax_v3.php?module=zs_callback',
                    data : {
                        mobile : me.mobile
                    },
                    dataType : 'jsonp',
                    jsonp : 'jsonp'
                }).done(function(result) {
                    if (result.error == 0) {
                        me._close();
                        me._showSucPanel();
                    } else {
                        me.showErr(result.msg);
                    }
                }).fail(function() {
                    me.showErr('网络错误，请重试');
                }).always(function() {
                    me._changeSendStatus(false);
                });
            }
            return false;
        });

        this._createDialog(DEFAULT_TITLE, $content);
    }
    , _showSucPanel : function() {
        var content = Widget.template(SUCCESS_TPL, {}),
            me = this;
        var timeOut = setTimeout(function() {
            me._close();
        }, 3000);
        this._createDialog(DEFAULT_TITLE, content, function() {
            clearTimeout(timeOut);
        });
    }
    , _close : function() {
        this._dialog.close();
    }
    , _changeSendStatus : function(sended) {
        this._sended = sended = sended || false;
        if (sended) { // 提交中
            this.$submit.addClass('button2');
        } else {
            this.$submit.removeClass('button2');
        }
    }
    , _checkMobile : function() {
        var mobile = this.$mobile.val();
        if (mobile && isTel(this.$mobile.val())) {
            this.$error.hide();
            return true;
        } else {
            // 手机号错误样式
            this.showErr('不是有效手机号');
            return false;
        }
    }
    , _createDialog : function(title, $content, cb) {
        this._dialog = new Dialog({
            title : title,
            padding : '0px',
            escAble : true,
            skin : 'gray',
            content : $content,
            close : cb ? cb : null
        })
    }
    , showErr : function(msg) {
        this.$error.css('display', 'inline-block').html('<i></i>' + msg);
    }
});
module.exports = ZsCallback;