/**
 * @desc 详情页 评价反馈
 * @copyright (c) 2014 273 Inc
 * @author chenhan <chenhan@273.cn>
 * @since 2014-2-17
 */

var $ = require('jquery');
var Dialog = require('widget/dialog/dialog.js');
var Widget = require('lib/widget/widget.js');

var comTpl = '' +
'<div id="pop_eva_con">' +
    '<div class="pop_box_content">' +
        '<form id="js_form">' +
            '<dl class="clearfix">' +
                '<dt><em>*</em>评价类型</dt>' +
                '<dd>' +
                    '<ul class="clearfix ul1">' +
                        '<li>信息真实</li>' +
                        '<li>车况经典</li>' +
                        '<li>看车方便</li>' +
                    '</ul>' +
                    '<ul class="clearfix ul2">' +
                        '<li>信息虚假</li>' +
                        '<li>该车已售</li>' +
                        '<li>价格虚假</li>' +
                        '<li>图片虚假</li>' +
                        '<li>态度恶劣</li>' +
                    '</ul>' +
                '</dd>' +
                '<dd id="report-type" style="display:none">' +
                    '<div class="ul1">' +
                        '<input type="checkbox" name="report_type[]" value="11" />' +
                        '<input type="checkbox" name="report_type[]" value="12" />' +
                        '<input type="checkbox" name="report_type[]" value="13" />' +
                    '</div>' +
                    '<div class="ul2">' +
                        '<input type="checkbox" name="report_type[]" value="4" />' +
                        '<input type="checkbox" name="report_type[]" value="3" />' +
                        '<input type="checkbox" name="report_type[]" value="5" />' +
                        '<input type="checkbox" name="report_type[]" value="1" />' +
                        '<input type="checkbox" name="report_type[]" value="17" />' +
                    '</div>' +
                '</dd>' +
            '</dl>' +
            '<dl id="js_select_err" class="clearfix" style="display:none;">' +
                '<dt>　</dt>' +
                '<dd><div class="error"><i></i>请至少选择一个评价</div></dd>' +
            '</dl>' +
            '<dl class="clearfix">' +
                '<dt>我的评论</dt>' +
                '<dd><textarea id="js_textarea" name="report_content" maxlength="100" class="textarea1" style="resize: none;">有更多想说的？写点评价吧～请最多不超过100个字</textarea></dd>' +
            '</dl>' +
            '<dl id="js_content_err" class="clearfix" style="display:none;">' +
                '<dt>　</dt>' +
                '<dd><div class="error"><i></i>请填写评价最多不超过100个字</div></dd>' +
            '</dl>' +
            '<dl class="clearfix">' +
                '<dt>　</dt>' +
                '<dd><button id="js_submit" type="button" class="button1" data-eqselog="/car@etype=click@gwpj=submit">提交评价</button><button id="js_close" type="button" class="button2" data-eqselog="/car@etype=click@gwpj=submit">取消</button></dd>' +
            '</dl>' +
        '</form>' +
    '</div>' +
'</div>';

var valTpl = '' +
'<div id="pop_eva_con_code">' +
    '<div class="pop_box_content">' +
        '<form id="js_mobile_box">' +
            '<div class="success_tips clearfix">' +
                '<div class="icon"></div>' +
                '<p><strong>感谢您做出的评价！</strong>为了更好跟进您的意见，请填写手机号码。</p>' +
            '</div>' +
            '<dl class="form_text clearfix">' +
                '<dt><em>*</em>手机号码</dt>' +
                '<dd><div class="input_box clearfix"><input id="js_mobile" class="input1" name="mobile" value="请填写您手机号码" /></div></dd>' +
            '</dl>' +
            '<dl id="js_mobile_err" class="form_text clearfix" style="display:none;">' +
                '<dt>&nbsp;</dt>' +
                '<dd><span class="error"><i></i>请填写正确的手机号码</span></dd>' +
            '</dl>' +
            '<dl class="form_text clearfix">' +
                '<dt>&nbsp;</dt>' +
                '<dd>' + 
                    '<div id="js_sms" class="code"><a href="javascript:;">免费获取短信验证码</a></div>' +
                    '<span class="code3" style="display:none;"><i></i>已发送，1分钟后可重新发送</span>' +
                '</dd>' +
            '</dl>' +
            '<dl class="form_text clearfix">' +
                '<dt><em>*</em>验 证 码</dt>' +
                '<dd><div class="input_box clearfix"><input id="js_code" class="input1" name="code" value="请输入短信验证码" /></div></dd>' +
            '</dl>' +
            '<dl id="js_code_err" class="form_text clearfix" style="display:none;">' +
                '<dt>&nbsp;</dt>' +
                '<dd><span class="error"><i></i>请填写正确的短信验证码</span></dd>' +
            '</dl>' +
            '<dl class="form_text clearfix">' +
                '<dt>&nbsp;</dt>' +
                '<dd><div class="btn"><button id="js_submit" type="button" class="button1">确认提交</button><button id="js_close" type="button" class="button2">取消</button></div></dd>' +
            '</dl>' +
            '<p class="other">如果没有收到验证短信：<br>1.查看是否被手机安全软件屏蔽<br>2.信号不好，请重新发送验证短信</p>' +
        '</form>' +
    '</div>' +
'</div>';

var retTpl = '' +
'<div id="pop_eva_con2">' +
    '<div class="pop_box_content">' +
        '<div class="success_tips clearfix">' +
            '<div class="icon"></div>' +
            '<p><strong>感谢您的评价！我们将根据您的反馈继续改进!</strong>本窗口将在 <em><b>5</b>秒</em> 后自动关闭</p>' +
        '</div>' +
    '</div>' +
'</div>';


/**
 * 短信倒计时的timer
 */
var SMS_TIMER = null; 

/**
 * 反馈完成的timer
 */
var OK_TIMER = null;

var TITLE = '评价顾问';

var FeedBack = function(options) {
    if (!options) {
        throw new Error('配置信息不存在');
    }
    
    this.config = $.extend({}, FeedBack.defaults, options);
    
    this._init();
}

var proto = FeedBack.prototype = {};

$.extend(proto, {
    _init : function() {
        var config = this.config;
        if (config && !config.$el) {
            throw new Error('$el不存在');
        }
        if (config && !config.id) {
            throw new Error('车源信息编号不存在');
        }
        if (config && !config.username) {
            throw new Error('交易顾问username不存在');
        }
        config.$el.on('click', $.proxy(this._comBox, this)).click();
    },
    
    /**
     * 选择评论窗口
     */
    _comBox : function() {
        this.$comTpl = $(comTpl);
        var $comTpl = this.$comTpl;
        this.$content = $comTpl.find('#js_textarea');
        
        this._dialog(TITLE, $comTpl);
        
        this._selectCom();
        
        inputFocus(this.$content);
        var $submit = $comTpl.find('#js_submit');
        var $close = $comTpl.find('#js_close');
        
        $submit.on('click', $.proxy(this._upComment, this));
        $close.on('click', $.proxy(this._close, this));
    },
    
    _selectCom : function() {
        var $comTpl     = this.$comTpl,
            $hpBtn      = $comTpl.find('.ul1 li'),
            $hpInput    = $comTpl.find('#report-type .ul1 input'),
            $cpBtn      = $comTpl.find('.ul2 li'),
            $cpInput    = $comTpl.find('#report-type .ul2 input'),
            $btn        = $.merge($(), $hpBtn),
            $input      = $.merge($(), $hpInput);
        
        $btn = $.merge($btn, $cpBtn);
        $input = this.$input = $.merge($input, $cpInput);
        
        $btn.on('click', function() {
            var i = $btn.index(this);
            if ($(this).hasClass('li2')) {
                $(this).removeClass().addClass('li1')
                    .siblings('li').removeClass();
                $($input.get(i)).attr('checked', 'checked');
            } else if ($(this).hasClass('li1')) {
                $(this).removeClass();
                $($input.get(i)).removeAttr('checked');
            } else {
                $(this).removeClass().addClass('li1');
                $($input.get(i)).attr('checked', 'checked');
            }
            if (i < $hpBtn.length) {
                $cpBtn.removeClass().addClass('li2');
                $cpInput.removeAttr('checked');
            } else {
                $hpBtn.removeClass().addClass('li2');
                $hpInput.removeAttr('checked');
            }
        });
    },
    
    _upComment : function() {
        var $comTpl = this.$comTpl,
            $selctErr = $comTpl.find('#js_select_err'),
            $contentErr = $comTpl.find('#js_content_err'),
            $btn = this.$btn,
            $input = this.$input;
        
        $selctErr.hide();
        $contentErr.hide();
        //验证标识
        var ret = true;
        
        
        //验证START
        if (!$input.serialize()) {
            $selctErr.show();
            ret = false;
        }
        if (this.$content.val().length > 100) {
            $contentErr.show();
            ret = false;
        }
        if (!ret) {
            return;
        }
        
        var defer = this._ajaxSendCom();
        
        defer.done(function(data) {
            if (data.status == 'success') {
                this.commentId = data.id;
                this._close();
                this._validateBox();
            } else if (data.status == 'error') {
                throw new Error('插入车源评论失败');
            }
        });
    },
    
    /**
     * 发送车源评价
     */
    _ajaxSendCom : function() {
        var config      = this.config,
            $comTpl     = this.$comTpl,
            $form       = $comTpl.find('#js_form'),
            formList    = $form.serializeArray(),
            otherInfo   = [{
                    name : 'id',
                    value : config.username
                }, {
                    name : 'carid',
                    value : config.id
                }, {
                    name : 'default_content',
                    value : this.$content[0].defaultValue
                }, {
                    name : 'error_page',
                    value : window.location.origin + window.location.pathname
                }];
        $.merge(formList, otherInfo);
        return $.ajax({
            type : "GET",
            url : "/ajax.php?module=comment&a=upcomment",
            data : formList,
            dataType : "jsonp",
            jsonp : 'jsonp',
            context : this
        });
    },
    
    /**
     * 验证手机窗口
     */
    _validateBox : function() {
        this.$valTpl = $(valTpl);
        var $valTpl = this.$valTpl;
        
        this.$form = $valTpl.find('#js_mobile_box'),
        this.$mobile = $valTpl.find('#js_mobile'),
        this.$code = $valTpl.find('#js_code'),
        this.$smsBtn = $valTpl.find('#js_sms'),
        this.$sendMsg = this.$smsBtn.next(),
        this.$mobileErr = $valTpl.find('#js_mobile_err'),
        this.$codeErr = $valTpl.find('#js_code_err'),
        this._dialog(TITLE, $valTpl);
        
        inputFocus(this.$mobile);
        inputFocus(this.$code);
        
        this.$smsBtn.on('click', $.proxy(this._sendCode, this));
        
        var $submit = $valTpl.find('#js_submit');
        var $close = $valTpl.find('#js_close');
        
        $submit.on('click', $.proxy(this._validate, this));
        $close.on('click', $.proxy(this._close, this));
    },
    
    /**
     * 发送评论验证短信
     */
    _sendCode : function() {
        var $smsBtn = this.$smsBtn,
            $sendMsg = this.$sendMsg,
            $mobileErr = this.$mobileErr,
            mobile = $.trim(this.$mobile.val());
        //验证手机格式
        if (!mobile || !isTel(mobile)) {
            $mobileErr.show();
        } else {
            $mobileErr.hide();
            $smsBtn.off('click');
            $sendMsg.show();
            $smsBtn.removeClass().addClass('code2').html('重新发送(<b>60</b>)');
            this._countDown();
            $.ajax({
                type : 'GET',
                url : '/ajax.php?module=message&a=getcode',
                data : {mobile : mobile},
                dataType : 'jsonp',
                jsonp : 'jsonp'
            });
        }
    },
    
    /**
     * 验证手机
     */
    _validate : function() {
        var $mobile = this.$mobile,
            $code = this.$code,
            $mobileErr = this.$mobileErr,
            $codeErr = this.$codeErr;
        
        //验证标识
        var ret = true;
        
        $mobileErr.hide();
        $codeErr.hide();
        
        //验证START
        var mobile = $mobile.val();
        var code   = $code.val();
        if (mobile == '' || mobile == $mobile[0].defaultValue || !(isTel(mobile))) {
            $mobileErr.show();
            ret = false;
        }
        if (code == '' || code == $code[0].defaultValue) {
            $codeErr.show();
            ret = false;
        }
        if (!ret) {
            return;
        }
        
        var defer = this._ajaxValidate();
        
        defer.done(function(data) {
            if (data.status == 'success') {
                //更新评论手机验证(更新手机号字段和status)
                $codeErr.hide();
                var upDefer = this._upMobile();
                upDefer.done(function(data) {
                    if (data.status == 'success') {
                        this._close();
                        this._retBox();
                    } else if (data.status == 'error') {
                        throw new Error('更新评论手机验证状态失败');
                    }
                });
            } else if (data.status == 'error') {
                $codeErr.show();
            }
        });
    },
    
    /**
     * 验证码验证ajax
     */
    _ajaxValidate : function() {
        //验证短信验证码是否正确
        var checkList = this.$form.serializeArray();
        
        //短信验证码验证
        return $.ajax({
            type : 'GET',
            url : '/ajax.php?module=message&a=checkcode',
            data : checkList,
            dataType : "jsonp",
            jsonp : 'jsonp',
            context : this
        });
    },
    
    /**
     * 更新手机字段ajax
     */
    _upMobile : function() {
        var me = this,
            mobileList  = this.$form.serializeArray();
        mobileList = $.merge(mobileList, [{name : 'car_comment_id', value : this.commentId}]);
        
        return $.ajax({
            type : 'GET',
            url : '/ajax.php?module=comment&a=updatemobile',
            data : mobileList,
            dataType: 'jsonp',
            jsonp: 'jsonp',
            context : this
        });
    },
    
    /**
     * 反馈页面
     */
    _retBox : function() {
        var me = this;
        
        this.$retTpl = $(retTpl);
        
        this._dialog(TITLE, this.$retTpl, function() {
            clearInterval(OK_TIMER);
            $(window).off('click');
        });
        
        this._retOk();
        $(window).on('click', function(e) {
            if (!$.contains(me.$retTpl, e.target)) {
                clearInterval(OK_TIMER);
                me._close();
                $(this).off('click');
            }
        })
    },
    
    /**
     * 再次发送短信倒计时
     */
    _countDown : function() {
        var me = this,
            $smsBtn = this.$smsBtn;
        
        clearInterval(SMS_TIMER);
        var num = 60;
        var fn = function() {
            --num;
            num = num >= 0 ? num : 0;
            $smsBtn.find('b').html(num);
            if (num <= 0) {
                clearInterval(SMS_TIMER);
                $smsBtn.off('click').on('click', $.proxy(me._sendCode, me));
                $smsBtn.removeClass().addClass('code').html('<a href="javascript:;">重新发送验证码</a>');
            }
        };
        SMS_TIMER = setInterval($.proxy(fn, me), 1000);
    },
    
    _retOk : function() {
        var me = this;
        clearInterval(OK_TIMER);
        var $sec = this.$retTpl.find('.success_tips b');
        var num = 5;
        $sec.text(num);
        var fn = function() {
            --num;
            num = num >= 0 ? num : 0;
            $sec.text(num);
            if (num <= 0) {
                clearInterval(OK_TIMER);
                this._close();
                $(window).off('click');
            }
        };
        OK_TIMER = setInterval($.proxy(fn, me), 1000);
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

FeedBack.defaults = {
        
};

module.exports = FeedBack;