/**
 * @desc        车源订阅
 * @author      daiyuancheng<daiyc@273.cn>
 * @date        14-4-23
 */

var $ = require('jquery');
var Dialog = require('widget/dialog/dialog.js');
var Widget = require('lib/widget/widget.js');

var CODE_TIP = '请输入验证码';
var MOBILE_TIP = '请输入手机号';

// 输入手机号模版
var MOBILE_TPL = '<input type="text" id="subscribe_mobile" value="' + MOBILE_TIP + '">' +
    '<input type="text" style="display: none;">' +
    '<span class="loading hidden">&nbsp;</span>' +
    '<button class="btn btn-default js_mobile_submit" type="submit">确认</button>';

var SEC_BTN_TPL = '<button disabled class="btn btn-sends js_code_btn"><i class="yes">&nbsp;</i>发送成功（<em class="js_second"><%=sec%></em>）</button>';

var RESEND_BTN_TPL = '<button class="btn js_resend_code js_code_btn" style="background-color: #f2f2f2;border: #DEDEDE;">重新发送</button>';

var CODE_TPL = '<input type="text" id="subscribe_code" value="' + CODE_TIP + '">' +
    '<input type="text" style="display: none;">' +
    '<%if (sec > 0) { %>' +
    SEC_BTN_TPL +
    '<%} else {%>' +
    RESEND_BTN_TPL +
    '<%}%>' +
    '<span class="loading hidden">&nbsp;</span>' +
    '<button class="btn btn-default js_code_submit" type="submit">确认</button>';

var SUCCESS_TPL = '<div class="fl">' +
    '<span class="fl"><i class="yes">&nbsp;</i>该条件新车源，已成功订阅！</span>' +
    '<span class="fl color-hui">' +
    '<%if (count >= 3) {%>（您的<b class="color-cheng"><%=count%></b>条订阅信息已更新）<%} else {%>' +
    '（每日十点，短信推送）&nbsp;<%}%>' +
    '</span>' +
    '</div>';

var FAIL_TPL = '<div class="fl"><span class="fl"><i class="no">&nbsp;</i><%if (error==6) {%>验证码发送失败！<%} else {%>订阅失败！<%}%></span>' +
    '<span class="loading">&nbsp;</span>' +
    '<button class="btn js_resubscribe" type="submit" style="background-color: #F2F2F2;border: #DEDEDE;">重新订阅</button></div>' +
    '';

// 几种面板状态
var STATUS_HIDDEN = 1; // 隐藏
var STATUS_SHOW = 2; // 显示
var STATUS_DISAPPEAR = 3; // 消失（过程）
var STATUS_APPEAR = 4; // 显现（过程）

var Subscribe = function(options) {
    if (!options) {
        throw new Error('配置信息为空');
    }
    if (!options.$el) {
        throw new Error('$el为空');
    }

    this.$el = options.$el;
    this.config = $.extend({}, Subscribe.defaults, options);

    this._init();
};

var isTel = function (tel) {
    var rphone = /^1[3458]\d{9}$|^(0\d{2,4}-)?[2-9]\d{6,7}(-\d{2,5})?$|^(?!\d+(-\d+){3,})[48]00(-?\d){7,10}$/;
    if (!rphone.test(tel)) {
        return false;
    }
    return true;
}

Subscribe.defaults = {};

var proto = Subscribe.prototype = {};

$.extend(proto, {
    $subscribeBtn : null
    , $subContent : null
    , $subForm : null
    , $mobile : null
    , $code : null
    , leftSec : 0
    , isTimer : false
    , $timerEm : null
    , mobile : ''
    , sended : false
    , visibility : STATUS_HIDDEN
    , _init : function() {
        var config = this.config;
        var $el = this.config.$el;

        this.$subscribeBtn = $el.find('.js_subscribe_btn');
        this.$subContent = $el.find('.js_subscribe_content');
        this.$subForm = this.$subContent.find('.js_subscribe_form');

        this.config.subBtnWidth = this.$subscribeBtn.width();

        var me = this;
        this.$subscribeBtn.on('click', function(e) {
            if (me.$el.hasClass('on')) {
                me._hideContent();
            } else {
                me.$el.addClass('on');
                me._initContent();
            }
            return false;
        }).click();

        // delegate
        this.$el.delegate('.js_mobile_submit', 'click', function(e) {
            e.preventDefault();
            me._submitMobile();
            return false;
        });

        this.$el.delegate('.js_code_submit', 'click', function(e) {
            e.preventDefault();
            me._submitCode();
            return false;
        });

        // resend code
        this.$el.delegate('.js_resend_code', 'click', function(e) {
            e.preventDefault();
            me._resendCode();
            return false;
        });

        this.$el.delegate('.js_resubscribe', 'click', function(e) {
            e.preventDefault();
            if (me.mobile && isTel(me.mobile)) {
                me._sendSubscribe(me.mobile);
            }
            return false;
        })
    }
    , _initContent : function() {
        if (this.visibility != STATUS_HIDDEN) {
            return;
        } else {
            this.visibility = STATUS_APPEAR;
        }
        this._showMobile();
        var width = this.$subContent.width(),
            btnWidth = this.config.subBtnWidth ,
            me = this;

        this.$subscribeBtn.css({
            'z-index': 2,
            position: 'relative'
        });
        this.$subContent.css({
            right : '-' + btnWidth + 'px',
            width: btnWidth + 'px',
            height: this.$subContent.height() + 'px',
            overflow: 'hidden',
            position: 'relative',
            'z-index': 1
        }).animate({
            width: '+=' + width + 'px'
        }, 500, function() {
            me.visibility = STATUS_SHOW;
            me.$subContent.css({
                width : '',
                height : '',
                overflow : '',
                right : '',
                position : '',
                'z-index' : ''
            });
            me.$subscribeBtn.css({
                'z-index': 2,
                position: ''
            });
        });

        this.sended = false;
    }
    , _hideContent : function() {
        if (this.visibility != STATUS_SHOW) {
            return;
        } else {
            this.visibility = STATUS_DISAPPEAR;
        }
        var width = this.$subContent.width(),
            btnWidth = this.config.subBtnWidth,
            me = this;
        this.$subscribeBtn.css({
            'z-index': 2,
            position: 'relative'
        });
        this.$subContent.css({
            width : '+=' + btnWidth + 'px',
            right : '-' + btnWidth + 'px',
            height : this.$subContent.height() + 'px',
            overflow : 'hidden',
            position: 'relative',
            'z-index': 1
        }).animate({
            width : btnWidth + 'px'
        }, 500, function() {
            me.visibility = STATUS_HIDDEN;
            me.$el.removeClass('on');
            me.$subForm.html('');
            me.$subContent.css({
                width : '',
                height: '',
                overflow: '',
                right: '',
                position : '',
                'z-index' : ''
            });
            me.$subscribeBtn.css({
                'z-index': 2,
                position: ''
            });
        });
        this.isTimer = false;
    }
    , _showMobile : function() {
        var $content = $(Widget.template(MOBILE_TPL, {})),
            me = this;
        this.$subForm.html($content);
        this.$mobile = this.$subForm.find('#subscribe_mobile');
        this.$mobile.on('blur', function() {
            me._checkMobile();
            if (me.$mobile.val() == '') {
                me.$mobile.val(MOBILE_TIP);
            }
            return false;
        }).on('focus', function() {
            me.$mobile.removeClass('err');
            if (me.$mobile.val() == MOBILE_TIP) {
                me.$mobile.val('');
            }
            return false;
        });
    }
    , _resendCode : function() {
        if (this.leftSec <= 0) {
            var me = this;
            me.$subForm.find('.js_resend_code').prop('disabled', true);
            if (this.mobile && !this.sended) {
                this.sended = true;
                $.ajax({
                    url : 'http://www.273.cn/ajax_v3.php?module=subscribe&act=resendCode'
                    , data : {
                        mobile : this.mobile
                    }
                    , dataType : 'jsonp'
                    , jsonp : 'jsonp'
                }).done(function (result) {
                    if (result.error == 2 || result.error == 3 || result.error == 6) {
                        var sec = result.sec || 60;
                        me.$subForm.find('.js_code_btn').replaceWith(Widget.template(SEC_BTN_TPL, {sec :sec}));
                        me.$timerEm = me.$subForm.find('.js_second');
                        me._startTimer(sec);
                    }
                }).always(function () {
                    me.$subForm.find('.js_resend_code').prop('disabled', true);
                    me.sended = false;
                });
            }
        }
    }
    , _showCode : function(sec) {
        sec = sec || 60;
        var content = Widget.template(CODE_TPL, {sec : sec}),
            me = this;
        this.$subForm.html(content);
        this.isTimer = true;
        this.$timerEm = this.$subForm.find('.js_second');
        this.$code = this.$subForm.find('#subscribe_code');
        this.$code.on('focus', function() {
            me.$code.removeClass('err');
            if (me.$code.val() == CODE_TIP) {
                me.$code.val('');
            }
            return false;
        }).on('blur', function() {
            me._checkCode();
            if (me.$code.val() == '') {
                me.$code.val(CODE_TIP);
            }
            return false;
        });
        this._startTimer(sec);
    }
    , _startTimer : function(sec) {
        this.leftSec = sec = sec || 60;
        var me = this;
        var fun = function() {
            if (me.isTimer == false) {
                return;
            }
            if (--me.leftSec > 0) {
                me.$timerEm.text(me.leftSec);
                setTimeout(arguments.callee, 1000);
            } else {
                me.$subForm.find('.js_code_btn').replaceWith(RESEND_BTN_TPL);
            }
        }
        setTimeout(fun, 1000);
    }
    , _showResult : function(count) {
        var content = Widget.template(SUCCESS_TPL, {count : count});
        this.$subForm.html(content);
        setTimeout($.proxy(this._hideContent, this), 4000);
    }
    , _checkCode : function() {
        var code = this.$code.val();
        if (code && /\d{1,}/.test(code)) {
            return true;
        } else {
            this.$code.addClass('err');
        }
    }
    , _checkMobile : function() {
        var mobile = this.$mobile.val();
        if (mobile && isTel(mobile)) {
            return true;
        } else {
            this.$mobile.addClass('err');
            return false;
        }
    }
    , _submitMobile: function() {
        var mobile = this.$mobile.val();
        this.mobile = mobile;
        if (this._checkMobile()) {
            this._sendSubscribe(mobile);
        }
    }
    , _sendSubscribe : function(mobile) {
        if (!this.sended) {
            this.sended = true;
            this.$subForm.find('button[type=submit]').addClass('hidden');
            this.$subForm.find('.loading').removeClass('hidden');
            var me = this;
            $.ajax({
                url : 'http://www.273.cn/ajax_v3.php?module=subscribe&act=subscribe', data : {
                    mobile : mobile
                }, dataType : 'jsonp', jsonp : 'jsonp'
            }).done(function (result) {
                if (result.error == 0) { // 订阅成功
                    me._showResult(result.count || 1);
                } else if (result.error == 2 || result.error == 3) {
                    me._showCode(result.sec);
                } else {
                    me._showFail(result.error || 1);
                }
            }).fail(function () {
                me._showFail();
            }).always(function () {
                me.sended = false;
                me.$subForm.find('button[type=submit]').removeClass('hidden');
                me.$subForm.find('.loading').addClass('hidden');
            });
        }
    }
    , _submitCode: function() {
        if (this._checkCode() && !this.sended) {
            this.sended = true;
            var me = this;
            this.$subForm.find('button[type=submit]').addClass('hidden');
            this.$subForm.find('.loading').removeClass('hidden');
            $.ajax({
                url : 'http://www.273.cn/ajax_v3.php?module=subscribe&act=checkCode'
                , data : {
                    mobile : me.mobile,
                    code   : me.$code.val()
                }
                , dataType : 'jsonp'
                , jsonp : 'jsonp'
            }).done(function(result) {
                if (result.error == 0) { // 订阅成功
                    me._showResult(result.count || 1);
                } else if (result.error == 4) {
                    me.$code.addClass('err');
                } else {
                    // todo 显示订阅失败
                    me._showFail();
                }

            }).fail(function() {
                this._showFail();
            }).always(function() {
                me.sended = false;
                me.$subForm.find('button[type=submit]').removeClass('hidden');
                me.$subForm.find('.loading').addClass('hidden');
            });
        }
    }
    , _showFail : function(error) {
        this.$subForm.html(Widget.template(FAIL_TPL, {error : error || 1}));
    }
});

module.exports = Subscribe;