/**
 * @desc 详情页 免费发送到手机
 * @copyright (c) 2013 273 Inc
 * @author chenhan <chenhan@273.cn>
 * @since 2013-12-03
 */

var $ = require('jquery');
var Cookie  = require('util/cookie.js');

var UUID = Cookie.get('eqs_uuid');
var SCM_TIMER = null;
var CDM_TIMER = null;

var SendMsg = function($el, option) {
    var me      = this,
        id      = option.id || '';
    require.async(['app/ms/tpl/send_car_msg.tpl'], function(tpl) {
        me.$smDiv   = $(id);
        me.info     = me.$smDiv.data('info');
        me.$smDiv.html(tpl(me.info));
        me.init($el);
    });
}

var proto = SendMsg.prototype = {};

/**
 * 初始化事件
 */
proto.init = function($el) {
    var me = this;
    //初始化发送窗口的事件
    me.initSendBoxEvent($el);
    me.submitMessage(me.$smDiv.find('#right1'));
    me.sendMessageSave(me.$smDiv.find('#js_scm_submit'));
    //手动触发一次
    $el.click();
}

proto.initSendBoxEvent = function($el) {
    var me      = this,
        $elLi   = $el.parent();
    $el.click(function() {
        $elLi.addClass('on');
    });
    $elLi.find(".message .close").click(function() {
        me.closeSms();
    });
    me.inputFocus("#send_mobile");
    me.inputFocus("#send_code");
    me.inputFocus("#sms_code");
    $elLi.find(".btnCancel").click(function() {
        me.closeSms();
    });
};

/**
 * 关闭短信窗口并重置窗口各项值
 */
proto.closeSms = function() {
    var me = this;
    $('#sendMsgLi').removeClass('on');
    me.resetSms();
}

//发送短信窗重置
proto.resetSms = function() {
    //手机号码输入窗重置
    var mobileDef = $("#send_mobile")[0].defaultValue;
    $("#send_mobile").val(mobileDef);
    $("#send_message_msg").removeAttr('class');
    $("#send_message_msg").removeAttr('title');
    
    //验证码输入窗重置
    var codeDef = $("#send_code")[0].defaultValue;
    $("#send_code").val(codeDef);
    $("#send_code_msg").removeAttr('class');
    $("#send_code_msg").removeAttr('title');
    $('#js_scm_submit').show();
    $('#reSendCode').hide();
    $('#code_msg').html('<b id="code_timer">60</b>秒后再次获取验证码</p>');
    
    $("#subMessage").removeAttr("disabled");
    $('#js_scm_submit').removeAttr('disabled');
    $('#right1').show();
    $('#right2').hide();
    $('#right3').hide();
}

//发送车源短信
proto.submitMessage = function($el) {
    var me = this,
        btnSub = $el.find("#subMessage");
    btnSub.click(subSms);
    
    function subSms() {
        var elMsgSpan = $('#send_message_msg');
        var carid = $('#car_sale_id_send').val();
        var tel = $('#send_mobile').val();
        tel=$.trim(tel);
        if (tel == '') {
            elMsgSpan.attr('class', 'form-msg-no');
            elMsgSpan.attr('title', '手机号不能为空');
            return false;
        } else if (!me.isTel(tel)) {
            elMsgSpan.attr('class', 'form-msg-no');
            elMsgSpan.attr('title', '请输入正确的手机号码');
            return false;
        } else {
            btnSub.attr("disabled", "disabled");
            $.getJSON(
                'http://www.273.cn/index.php?m=Message&a=checkContactTelValue&id='+carid+'&mobile='+tel+'&jsonp=?',
                null,
                function(msg) {
                    //验证用户名唯一
                    if (msg) {
                        if (msg == 1) {
                            $('#right1').hide();
                            $('#right3').html('<p style="padding:40px 0px 10px; border-bottom: 1px #ccc dashed;color: #67940F;font-size: 20px;font-weight: 700;font-family: "Microsoft Yahei";">此车源信息已成功发送</p><p class="note">本窗口将在<b>5秒</b>后自动关闭</p>');
                            $('#right3').show();
                            $.proxy(me.sendjs(5), me);
                        } else if (msg == 2) {
                            me.sendMessageJsonSave('');
                        } else {
                            $('#mobile_binded').val(msg);
                            me.getAccessCode(tel);
                        }
                    }
                }
            );
        }
    }
};

proto.sendMessageSave = function($el) {
    var me = this,
        elMsgSpan = $("#send_code_msg");
    $el.click(function() {
        var mobile_binded = $('#mobile_binded').val();
        var access_code = $('#send_code').val();
        if (access_code == '') {
            elMsgSpan.attr('class', 'form-msg-no');
            elMsgSpan.attr('title', '验证码不能为空');
            return;
        } else if (!(/^\d{6}$/.test(access_code))) {
            elMsgSpan.attr('class', 'form-msg-no');
            elMsgSpan.attr('title', '请输入正确的验证码');
            return;
        }
        if (mobile_binded != 2) {
            $(this).attr("disabled", "disabled");
            $.getJSON(
                'http://www.273.cn/Message/checkForAccessCode/?mobile='+$('#send_mobile').val()+'&access_code='+access_code+'&jsonp=?',
                null,
                function(msg) {
                    if (msg == 1) {
                        me.sendMessageJsonSave(mobile_binded);
                    } else {
                        elMsgSpan.attr('class', 'form-msg-no');
                        elMsgSpan.attr('title', '验证码错误，请输入正确的验证码');
                        $("#js_scm_submit").removeAttr("disabled");
                    }
                }
            );
        }
    });
};

proto.sendMessageJsonSave = function(bind) {
    var me = this,
        carid = $('#car_sale_id_send').val(),
        mobile = $('#send_mobile').val(),
        bind_type = '';
    if (bind) {
        bind_type = "&bind="+bind;
    }
    $.ajax({
        url:"http://www.273.cn/index.php?m=Message&a=sendMessageSave",
        type:"GET",
        data:"uuid=" + UUID+bind_type + "&mobile=" + mobile + "&car_sale_id=" + carid,
        dataType:'jsonp',
        context: me,
        success:function(j){
            if(j == 1){
                $('#right1').hide();
                $('#right2').hide();
                $('#mobile_success_send').html(mobile);
                $('#right3').show();
                me.sendjs(5);
            }
        }
    });
}

proto.sendjs = function(n) {
    var me = this;
    clearInterval(SCM_TIMER);
    var num = n;
    var fn = function(){
        --num;
        num = num>=0 ? num : 0;
        $('#right3 .note b').html(num+'秒');
        if (num <= 0){
            clearInterval(SCM_TIMER);
            me.closeSms();
        }
    };
    SCM_TIMER = setInterval(fn,1000);
}

//发送验证码，显示验证码输入框或相应提示
proto.getAccessCode = function(tel) {
    var me = this,
        elMsgSpan = $("#send_message_msg");
    elMsgSpan.attr('class', '');
    elMsgSpan.attr('title', '');
    if (tel) {
        me.countdownMin(tel);
        $.getJSON(
            'http://www.273.cn/Message/getForAccessCode/?uuid='+UUID+'&mobile='+tel+'&jsonp=?',
            null,
            function(msg) {
                if(msg == 1){
                    $('#right1').hide();
                    $('#right2').show();
                    $('#send_code_moblie').html(tel); 
                } else if(msg == 2) {
                    $('#right1').hide();
                    $('#right2 .title').html('一直收不到短信吗？<b>请致电400-6000-273预约</b>');
                    $('#right2').show();
                }
            }
        );
    } 
}

//发送车源短信验证码输入计时
proto.countdownMin = function(telephone) {
    var me = this;
    var num = 60;
    clearInterval(CDM_TIMER);
    var fn = function() {
        --num;
        num = num>=0 ? num : 0;
        $('#code_timer').html(num);
        if(num<=0) {
            clearInterval(CDM_TIMER);
            $('#code_msg').html('<span class="form-msg-no"></span>点击再次获取验证码');
            $('#js_scm_submit').hide();
            $('#reSendCode').show();
            me.sendCodeAgain(telephone);
        }
    };
    CDM_TIMER = setInterval(fn,1000);
}

proto.sendCodeAgain = function(telephone) {
    var me = this;
    $("#reSendCode").click(function() {
        $(this).hide();
        $("#js_scm_submit").show();
        $('#code_msg').html('<b id="code_timer">60</b>秒后再次获取验证码');
        me.getAccessCode(telephone);
    });
}

/**
 * 是否是电话
 */
proto.isTel = function(tel) {
    var rphone = /^1[3458]\d{9}$|^(0\d{2,4}-)?[2-9]\d{6,7}(-\d{2,5})?$|^(?!\d+(-\d+){3,})[48]00(-?\d){7,10}$/;
    if(!rphone.test(tel)) {
        return false;
    }
    return true;
}

proto.inputFocus = function(focusid) {
    var focusblurid = $(focusid);
    var defval = focusblurid.val();
    focusblurid.css('color','#aaa');
    focusblurid.focus(function(){
        var thisval = $(this).val();
        if(thisval == defval){
            $(this).val('');
            $(this).css('color','#333');
        }
    });
    focusblurid.blur(function(){
        var thisval = $(this).val();
        if(thisval == ''){
            $(this).val(defval);
            $(this).css('color','#aaa');
        }
    });
}

module.exports = SendMsg;