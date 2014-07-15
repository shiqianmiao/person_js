/**
 * @desc 详情页 免费发送到手机
 * @copyright (c) 2014 273 Inc
 * @author chenhan <chenhan@273.cn>
 * @since 2014-2-20
 */

var $ = require('jquery');
var Cookie  = require('util/cookie.js');
var Widget = require('lib/widget/widget.js');
var Dialog = require('widget/dialog/dialog.js');

var leftTpl = '' +
'<div class="pop_free_sms">' +
    '<div class="pop_box_content clearfix">' +
        '<div class="info">' +
            '<p>' +
                '<%= title %><br>' +
                '<%= price %><br>' +
                '<%= card_time %><br>' +
                '<%= kilometer %><br>' +
                '信息编号：<%= id %><br>' +
                '电话：<br>' +
                '<%= show_phone %>' +
            '</p>' +
            '<span class="arrow"></span>' +
        '</div>' +
    '</div>' +
'</div>';

var mobTpl = '' +
'<form id="js_mobile_form">' +
    '<div class="form">' +
        '<p class="tips1">将左侧信息<strong class="hot">免费</strong>发送到手机(不支持小灵通)</p>' +
        '<div class="input_box clearfix"><input id="js_mobile" class="input1" name="mobile" value="填写手机号码" /><i style="display:none;"></i></div>' +
        '<div class="btn"><button id="js_submit" class="button1" type="button" data-eqselog="/carsend@etype=click@self=submit">免费发送</button><button id="js_close" class="button2" type="button" data-eqselog="/carsend@etype=click@self=cancel">取消</button></div>' +
        '<p class="tips2">273二手车交易网承诺保障您的隐私，不会泄露您的手机号码。</p>' +
    '</div>' +
'</form>';

var valTpl = '' +
'<form id="js_val_form">' +
    '<div class="form">' +
        '<p class="tips4">确认短信已发送到您的手机<strong class="hot"><%=mobile%></strong>请于<strong class="hot">1分钟内</strong>输入短信中的确认码，点击“免费发送”后即可将信息发送到该手机</p>' +
        '<div class="input_box clearfix"><input id="js_code" name="access_code" class="input1" value="请填入验证码"><i style="display:none;"></i></div>' +
        '<div id="js_send_tip" class="send_again"><strong class="hot">60</strong>秒后再次获取验证码</div>' +
        '<div class="btn">' +
            '<button id="js_submit" type="button" class="button1">确认提交</button>' +
            '<button id="js_re_send" type="button" class="button1" style="display:none;">重新发送</button>' +
            '<button id="js_close" type="button" class="button2">取消</button>' +
        '</div>' +
    '</div>' +
'</form>';

var retTpl = '' +
'<div class="form">' +
    '<div class="result"><%=mobile%> 发送成功</div>' +
    '<p class="tips3">本窗口将在 <strong class="hot"><b>5</b>秒</strong> 后自动关闭<br>下载短信会有一定时间延迟，请耐心等待。</p>' +
'</div>';

var UUID = Cookie.get('eqs_uuid');
var OK_TIMER = null;
var SEND_TIMER = null;

var TITLE = '免费发送到手机';
var SendCarMsg = function(options) {
    if (!options) {
        throw new Error('配置信息不存在');
    }
    
    this.config = $.extend({}, SendCarMsg.defaults, options);
    
    
    this._init();
}

var proto = SendCarMsg.prototype = {};

$.extend(proto, {
    _init : function() {
        var config = this.config;
        if (config && !config.$el) {
            throw new Error('$el不存在');
        }
        if (config && !config.id) {
            throw new Error('车辆id不存在');
        }
        
        this.info = config.$el.data('info');
        if (!this.info) {
            throw new Error('info不存在');
        }
        this.leftTpl = Widget.template(leftTpl, this.info);
        this.$leftTpl = $(this.leftTpl);
        
        config.$el.on('click', $.proxy(this._mobileBox, this)).click();
    },
    
    _mobileBox : function() {
        var me = this,
            $tpl = this.$tpl = this.$leftTpl.clone();
        
        this.$mobTpl = $(mobTpl);
        $tpl.find('.pop_box_content').append(this.$mobTpl);
        
        this.$mobile = $tpl.find('#js_mobile');
        this.$mobileErr = this.$mobile.next();
        
        this._dialog(TITLE, $tpl);
        
        inputFocus(this.$mobile);
        
        this.$mobile.on('focus', function() {
            me.$mobileErr.hide();
        }).on('blur', function() {
            if (!isTel($.trim(me.$mobile.val()))) {
                me.$mobileErr.attr('title', '请输入正确的手机号码').show();
            } else {
                me.$mobileErr.hide();
            }
        });
        
        var $submit = $tpl.find('#js_submit');
        var $close = $tpl.find('#js_close');
        
        $submit.on('click', $.proxy(this._checkMobile, this));
        $close.on('click', $.proxy(this._close, this));
    },
    
    _checkMobile : function() {
        var $tpl = this.$tpl,
            $mobile = this.$mobile,
            $mobileErr = this.$mobileErr;
    
        $mobileErr.hide();
        
        //验证标识
        var ret = true;
        
        var mobile = $.trim($mobile.val());
        //验证START
        if (!mobile) {
            $mobileErr.attr('title', '手机号不能为空').show();
            ret = false;
        } else if (!isTel(mobile)) {
            $mobileErr.attr('title', '请输入正确的手机号码').show();
            ret = false;
        }
        
        if (!ret) {
            return false;
        }
        
        this.mobile = mobile;
        
        var defer = this._ajaxSendMobile();
        
        defer.done(function(data) {
            //验证用户名唯一
            if (data) {
                //此车源已经发过短信,不再继续发送,直接返回已经发送成功
                if (data == 1) {
                    this._close();
                    this._retBox();
                //uuid已经绑定此手机号,发送车源短信
                } else if (data == 2) {
                    var sDefer = this._ajaxSendMsg();
                    sDefer.done(function(data) {
                        if(data == 1){
                            this._close();
                            this._retBox();
                        }
                    });
                //此手机号未绑定uuid,先验证手机
                } else {
                    this._close();
                    this._valBox();
                }
            }
        });
    },
    
    _ajaxSendMobile : function() {
        var $tpl = this.$tpl,
            $form = $tpl.find('#js_mobile_form'),
            formList = $form.serializeArray(),
            id = {
                name : 'id',
                value : this.id
            };
        formList.push(id);
        return $.ajax({
            url : 'http://www.273.cn/index.php?m=Message&a=checkContactTelValue',
            data : formList,
            dataType : 'jsonp',
            jsonp : 'jsonp',
            context : this
        });
    },
    
    _ajaxSendMsg : function(bind) {
        var $tpl = this.$tpl,
            $form = $tpl.find('#js_mobile_form'),
            formList = [{
                name : 'mobile',
                value : this.mobile
            }];
            otherList = [{
                name : 'car_sale_id',
                value : this.config.id
            }, {
                name : 'uuid',
                value : UUID
            }, {
                name : 'show_tel',
                value : this.info['show_phone']
            }];
        formList = $.merge(formList, otherList);
        
        return $.ajax({
            url : 'http://www.273.cn/index.php?m=Message&a=sendMessageSave',
            data : formList,
            dataType : 'jsonp',
            context : this
        });
    },
    
    _valBox : function() {
        var me = this,
            $tpl = this.$tpl = this.$leftTpl.clone();
    
        this.valTpl = Widget.template(valTpl, {mobile : this.mobile});
        this.$valTpl = $(this.valTpl);
        
        $tpl.find('.pop_box_content').append(this.$valTpl);
        
        this.$code = $tpl.find('#js_code');
        this.$codeErr = this.$code.next();
        this.$submit = $tpl.find('#js_submit');
        this.$close = $tpl.find('#js_close');
        this.$reSend = $tpl.find('#js_re_send');
        this.$sendTip = $tpl.find('#js_send_tip');
        this.$sec = this.$sendTip.find('.hot');
        
        this._dialog(TITLE, $tpl);
        
        this.$code.on('focus', function() {
            me.$codeErr.hide();
        }).on('blur', function() {
            var val = $.trim($(this).val());
            if (!val) {
                me.$codeErr.attr('title', '验证码不能为空').show();
            }
        });
        this._ajaxGetCode();
        
        inputFocus(this.$code);
        
        
        this.$submit.on('click', $.proxy(this._checkCode, this));
        this.$reSend.on('click', $.proxy(this._reSend, this));
        this.$close.on('click', $.proxy(this._close, this));
    },
    
    /**
     * 发送验证码
     */
    _ajaxGetCode : function() {
        var $tpl = this.$tpl,
            $form = $tpl.find('#js_mobile_form'),
            formList = [{
                name : 'mobile',
                value : this.mobile
            }, {
                name : 'uuid',
                value : UUID
            }];
        this._countDown();
        $.ajax({
            url : 'http://www.273.cn/index.php?m=Message&a=getForAccessCode',
            data : formList,
            dataType : 'jsonp',
            jsonp : 'jsonp',
            context : this
        });
    },
    
    /**
     * 重新发送验证码
     */
    _reSend : function() {
        this._ajaxGetCode();
        this._countDown();
        this.$reSend.hide();
        this.$submit.show();
    },
    
    /**
     * 发送验证码倒计时
     */
    _countDown : function() {
        var me = this;
        var num = 60;
        
        me.$sendTip.text('秒后再次获取验证码');
        me.$sec.text('60');
        me.$sendTip.prepend(me.$sec);
        clearInterval(SEND_TIMER);
        var fn = function() {
            --num;
            num = num >= 0 ? num : 0;
            me.$sec.text(num);
            if(num <= 0) {
                clearInterval(SEND_TIMER);
                me.$sec.text('');
                me.$sendTip.text('点击再次获取验证码');
                me.$submit.hide();
                me.$reSend.show();
            }
        };
        SEND_TIMER = setInterval(fn, 1000);
    },
    
    _checkCode : function() {
        var $tpl = this.$tpl,
            $code = this.$code,
            $codeErr = this.$codeErr;
        
        $codeErr.hide();
        
        //验证标识
        var ret = true;
        
        var code = $.trim($code.val());
        //验证START
        if (!code) {
            $codeErr.attr('title', '验证码不能为空').show();
            ret = false;
        }
        
        if (!ret) {
            return false;
        }
        
        var defer = this._ajaxCheck();
        defer.done(function(data) {
            if (data == 1) {
                var sDefer = this._ajaxSendMsg();
                sDefer.done(function(data) {
                    if(data == 1){
                        this._close();
                        this._retBox();
                    }
                });
            } else {
                this.$codeErr.attr('title', '验证码错误').show();
            }
        });
    },
    
    _ajaxCheck : function() {
        var $tpl = this.$tpl,
            $form = $tpl.find('#js_val_form'),
            formList = $form.serializeArray(),
            mobile = {
                name : 'mobile',
                value : this.mobile
            };
        formList.push(mobile);
        return $.ajax({
            url : 'http://www.273.cn/index.php?m=Message&a=checkForAccessCode',
            data : formList,
            dataType : 'jsonp',
            jsonp : 'jsonp',
            context : this
        });
    },
    
    /**
     * 反馈窗口
     */
    _retBox : function() {
        var me = this,
            $tpl = this.$tpl = this.$leftTpl.clone();
        
        this.retTpl = Widget.template(retTpl, {mobile : this.mobile});
        this.$retTpl = $(this.retTpl);
        
        $tpl.find('.pop_box_content').append(this.$retTpl);
        
        this._dialog(TITLE, $tpl, function() {
            clearInterval(OK_TIMER);
            $(window).off('click');
        });
        
        $.proxy(this._retOk(5), this);
        
        $(window).on('click', function(e) {
            if (!$.contains(me.$retTpl, e.target)) {
                clearInterval(OK_TIMER);
                me._close();
                $(this).off('click');
            }
        })
    },
    
    _retOk : function(n) {
        var me = this;
        clearInterval(OK_TIMER);
        var num = n;
        var fn = function() {
            --num;
            num = num >= 0 ? num : 0;
            me.$tpl.find('.tips3 b').text(num);
            if (num <= 0){
                me._close();
                clearInterval(OK_TIMER);
            }
        };
        OK_TIMER = setInterval(fn, 1000);
    },
    
    _dialog : function(title, $tpl, fn) {
        this.dialog = new Dialog({
            title : title,
            padding : '0px',
            escAble : true,
            skin : 'gray',
            content : $tpl,
            close : fn ? fn : null
        });
    },
    
    _close : function() {
        this.dialog.close();
    }
});

var isTel = function(tel) {
    var rphone = /^1[3458]\d{9}$|^(0\d{2,4}-)?[2-9]\d{6,7}(-\d{2,5})?$|^(?!\d+(-\d+){3,})[48]00(-?\d){7,10}$/;
    if(!rphone.test(tel)) {
        return false;
    }
    return true;
}

var inputFocus = function($dom) {
    var defval = $dom.val();
    $dom.css('color', '#999');
    $dom.focus(function() {
        var val = $(this).val();
        if(val == defval){
            $(this).val('');
            $(this).css('color','#333');
        }
    });
    $dom.blur(function() {
        var val = $(this).val();
        if(val == '') {
            $(this).val(defval);
            $(this).css('color','#999');
        }
    });
}

SendCarMsg.defaults = {
        
};

module.exports = SendCarMsg;