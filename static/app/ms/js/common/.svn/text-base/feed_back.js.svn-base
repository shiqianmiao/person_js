/**
 * @desc 详情页 评价反馈
 * @copyright (c) 2013 273 Inc
 * @author chenhan <chenhan@273.cn>
 * @since 2013-11-29
 */

var $ = require('jquery');
require('lib/jquery/plugin/jquery.overlay.js');

OK_TIMER    = null, //反馈完成的timer
SMS_TIMER   = null; //短信倒计时的timer
$FBDIV      = null;

var FeedBack = function($el, option) {
    var me          = this,
        id          = option.id || '';
    require.async(['app/ms/tpl/feed_back.tpl'], function(FBTpl) {
        $FBDIV = $(id).html(FBTpl);
        me.username = $FBDIV.data('id'),
        me.carId    = $FBDIV.data('carId');
        me.init($el);
    });
}

var proto = FeedBack.prototype = {};

/**
 * 初始化事件
 */
proto.init = function($el) {
    var me = this;
    //选择反馈类型
    me.selectType($FBDIV.find('#js_report_type_box'));
    //初始化反馈表单事件
    me.initBoxEvent($FBDIV.find('#js_comment_box'));
    //初始化填写手机表单事件
    me.initCommentBox($FBDIV.find('#pingfen'));
    //初始化填写手机表单事件
    me.submitMobile($FBDIV.find('#js_check_mobile_box'));
    //初始化发动短信倒计时
    me.sendSMS($FBDIV.find('#sms-send'));
    //初始化打开表单事件
    $el.on('click', $.proxy(me.initOpenEvent, me)).click();
}

/**
 * 打开反馈窗口
 */
proto.initOpenEvent = function() {
    var me = this,
    $comBox = $FBDIV.find('#js_comment_box');
    $comBox.overlay({
        effect: 'fade',
        opacity: 0.8,
        closeOnClick: false,
        onShow: function() {
            clearInterval(OK_TIMER);
            me.resetComment();
            $comBox.addClass('on');
            me.centerDisplay($comBox.selector);
            $('.overlay').css({height: $(document).height()});
        }
    });
}

/**
 * 初始化反馈表单事件
 */
proto.initBoxEvent = function($el) {
    var me = this,
        $reContent = $el.find('#re-content'),
        $submitBtn = $el.find('#re-submit'),
        $cancelBtn = $el.find('#cancel'),
        $closeBtn = $el.find('#close-btn');
    focusInput($reContent);
    $submitBtn.on('click', {$el : $el}, $.proxy(me.submitCarComment, me));
    $cancelBtn.on('click', $.proxy(function() {
        $el.removeClass('on');
        me.resetCarComment();
        me.removeOverlay()
    }, me));
    $closeBtn.on('click', $.proxy(function() {
        $el.removeClass('on');
        me.resetCarComment();
        me.removeOverlay()
    }, me));
};

/**
 * 重置评价页面
 */
proto.resetComment = function() {
    var me              = this,
        $el             = $('#pingfen'),
        $feedBackBox    = $el.find('#feed_back_box'),
        $checkMobileBox = $el.find('#js_check_mobile_box'),
        $result         = $el.find('#result input[name=result]'),
        $content        = $el.find('#content'),
        $resultErr      = $el.find('#result .form-msg-no'),
        $serviceErr     = $el.find('#service .form-msg-no'),
        $realDescErr    = $el.find('#real_desc .form-msg-no'),
        $expertiseErr   = $el.find('#expertise .form-msg-no');
    
    var $mobile         = $el.find('#c_mobile input[name=mobile]'),
        $mobileErr      = $el.find('#c_mobile').next(),
        $smsSend        = $el.find('#sms-send'),
        $code           = $el.find('#c_code input[name=code]'),
        $smsBtn         = $el.find('#sms-send .freesend');
    
    $el.hide();
    $resultErr.hide();
    $serviceErr.hide();
    $realDescErr.hide();
    $expertiseErr.hide();
    var $allErr         = $el.find('.err'),
        $pinfenOk       = $el.find('#pingfen-ok'),
        $pinfenNo       = $el.find('#pingfen-no');
    
    $checkMobileBox.hide();
    $allErr.hide();
    $pinfenOk.hide();
    $pinfenNo.hide();
    $feedBackBox.show();
    
    $result.removeAttr('checked');
    $content.removeAttr('checked');
    
    var defMobile  = $mobile[0].defaultValue;
    $mobile.val(defMobile).removeClass('focus').css('color', '#aaa');
    var defcode  = $code[0].defaultValue;
    $code.val(defcode).removeClass('focus').css('color', '#aaa');
    
    this.endCount($smsBtn, me.sendSMSEvent, $mobile, $mobileErr)
}

/**
 * 居中显示
 */
proto.centerDisplay = function(id) {
    var div = $(id);
    var winHeight = $(window).height();
    var winWidth = $(window).width();
    var divHeight = div.height();
    var divWidth = div.width();
    var top = (winHeight - divHeight) / 2 + $(window).scrollTop();
    var left = (winWidth - divWidth) / 2;
    div.css({ top: top + "px", left: left + "px" });
}

/**
 * 选择评价事件
 */
proto.selectType = function($el) {
    var $hpTypeBtn = $el.find('.hp .type');
    var $hpTypeInput = $el.find('#report-type .hp input');
    var $cpTypeBtn = $el.find('.cp .type');
    var $cpTypeInput = $el.find('#report-type .cp input');
    $hpTypeBtn.each(function(i) {
        $(this).on('click', function() {
            if ($(this).hasClass('hp2')) {
                $(this).removeClass().addClass('hp1 type');
                $($hpTypeInput.get(i)).attr('checked', 'checked');
            } else if ($(this).hasClass('hp3')) {
                $(this).removeClass().addClass('hp1 type')
                    .siblings('span[class~=type]').removeClass().addClass('hp2 type');
                $($hpTypeInput.get(i)).attr('checked', 'checked');
            } else if ($(this).hasClass('hp1')) {
                $(this).removeClass().addClass('hp2 type');
                $($hpTypeInput.get(i)).removeAttr('checked');
            }
            $cpTypeBtn.removeClass().addClass('cp3 type');
            $cpTypeInput.removeAttr('checked');
        });
    });
    $cpTypeBtn.each(function(i) {
        $(this).on('click', function() {
            if ($(this).hasClass('cp2')) {
                $(this).removeClass().addClass('cp1 type');
                $($cpTypeInput.get(i)).attr('checked', 'checked');
            } else if ($(this).hasClass('cp3')) {
                $(this).removeClass().addClass('cp1 type')
                    .siblings('span[class~=type]').removeClass().addClass('cp2 type');
                $($cpTypeInput.get(i)).attr('checked', 'checked');
            } else if ($(this).hasClass('cp1')) {
                $(this).removeClass().addClass('cp2 type');
                $($cpTypeInput.get(i)).removeAttr('checked');
            }
            $hpTypeBtn.removeClass().addClass('hp3 type');
            $hpTypeInput.removeAttr('checked');
        });
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

/**
 * 立即结束计数
 */
proto.endCount = function($btn, func, $mobile, $mobileErr) {
    var me = this;
    clearInterval(SMS_TIMER);
    $btn.off('click').on('click', {$mobile : $mobile, $mobileErr : $mobileErr}, $.proxy(func, me));
    $btn.removeClass('waiter').html('免费获取短信验证码');
    $btn.next().hide();
}

proto.reportOk = function(n, selector) {
    var me = this;
    clearInterval(me.OKTimer);
    var num = n;
    $(selector).html(num);
    var fn = function() {
        --num;
        num = num>=0 ? num : 0;
        $(selector).html(num);
        if (num<=0) {
            clearInterval(OK_TIMER);
            me.closeReport();
            $(window).off('click');
        }
    };
    OK_TIMER = setInterval(fn,1000);
}

proto.closeReport = function() {
    var me = this;
    me.removeOverlay();
    clearInterval(OK_TIMER);
    $('#pingfen').hide();
}

proto.removeOverlay = function() {
    $(".overlay-trigger").removeClass('overlay-trigger');
    $("body").css('overflow', 'auto');
    $(".overlay").remove();
}

/**
 * 发送评论验证短信
 */
proto.sendSMS = function($el) {
    var me          = this,
        $sendBtn    = $el.find('.freesend'),
        $mobile     = $('#c_mobile input'),
        $mobileErr  = $('#c_mobile').next();
    $sendBtn.on('click', {$mobile : $mobile, $mobileErr : $mobileErr}, $.proxy(me.sendSMSEvent, me));
}

/**
 * 重置评价页面
 */
proto.resetCarComment = function() {
    var me                  = this,
        $el                 = $FBDIV.find('#js_comment_box'),
        $reportTypeBox      = $el.find('#js_report_type_box'),
        $hpReportType       = $reportTypeBox.find('.hp .type'),
        $cpReportType       = $reportTypeBox.find('.cp .type'),
        $reportTypeInput    = $el.find('#report-type input'),
        $reContent          = $el.find('#re-content');
    
    var $pingfen            = $FBDIV.find('#pingfen');
        $mobile             = $pingfen.find('#c_mobile input[name=mobile]'),
        $mobileErr          = $pingfen.find('#c_mobile').next(),
        $smsSend            = $pingfen.find('#sms-send'),
        $code               = $pingfen.find('#c_code input[name=code]'),
        $codeErr            = $pingfen.find('#c_code').next(),
        $smsBtn             = $pingfen.find('#sms-send .freesend');
    
    var $pinfenOk           = $pingfen.find('#pingfen-ok');
    var $pinfenNo           = $pingfen.find('#pingfen-no');
    
    $codeErr.hide();
    $pinfenOk.hide();
    $pinfenNo.hide();

    $hpReportType.removeClass().addClass('hp2 type');
    $cpReportType.removeClass().addClass('cp2 type');
    $reportTypeInput.removeAttr('checked');
    var defContent = $reContent[0].defaultValue;
    $reContent.val(defContent).removeClass('focus').css('color', '#aaa');
    
    var defMobile  = $mobile[0].defaultValue;
    $mobile.val(defMobile).removeClass('focus').css('color', '#aaa');
    var defcode  = $code[0].defaultValue;
    $code.val(defcode).removeClass('focus').css('color', '#aaa');
    
    this.endCount($smsBtn, me.sendSMSEvent, $mobile, $mobileErr)
}


/**
 * 发送评论验证短信事件
 */
proto.sendSMSEvent = function(e) {
    var me          = this,
        $el         = $FBDIV.find('#sms-send .freesend');
        $mobile     = e.data.$mobile,
        mobileList  = $mobile.serializeArray(),
        $mobileErr  = e.data.$mobileErr,
        $sendMsg    = $el.next(),
        $sendType   = $('#js_check_mobile_box input[name=send_type]'),
        mobile      = $.trim($mobile.val());
    var sendType    = {
            name : 'send_type',
            value : $sendType.val()
    }
    mobileList.push(sendType);
    //验证手机格式
    if (!mobile || !me.isTel(mobile)) {
        $mobileErr.show();
    } else {
        $mobileErr.hide();
        $el.off('click');
        $sendMsg.show();
        $el.addClass('waiter').html('重新发送(<b>60</b>)');
        me.startCount($el, me.sendSMSEvent, e);
        $.ajax({
            type : 'GET',
            url : '/ajax.php?module=message&a=getcode',
            data : mobileList,
            dataType : 'jsonp',
            jsonp : 'jsonp',
            cache : false,
            success : function (data) {
                //do nothing
            }
        });
    }
}

/**
 * 提交反馈
 */
proto.submitCarComment = function(e) {
    var me = this,
        $el = e.data.$el;
    //验证标识
    var ret = true;
    var $reType         = $el.find('#report-type input');
    var $reTypeErr      = $el.find('#js_report_type_box .err');
    var $reContent      = $el.find('#re-content');
    var $reContentErr   = $el.find('#re-comment .err');
    
    $reContentErr.hide();
    $reTypeErr.hide();
    //验证START
    if (!$reType.serialize()) {
        $reTypeErr.show();
        ret = false;
    }
    if ($reContent.val().length > 100) {
        $reContentErr.show();
        ret = false;
    }
    if (!ret) {
        return;
    }
    
    //废弃uuid限制,直接使用短信验证
    me.ajaxSendCarComment(e);
}

/**
 * 发送车源评价
 */
proto.ajaxSendCarComment = function(e) {
    var me       = this,
        $el      = e.data.$el,
        $form    = $el.find('form'),
        formList = $form.serializeArray(),
        username    = {
            name : 'id',
            value : me.username
        },
        carId       = {
            name : 'carid',
            value : me.carId
        },
        defContent = {
            name : 'default_content',
            value : $el.find('#re-content')[0].defaultValue
        },
        url = {
            name : 'error_page',
            value : window.location.origin + window.location.pathname
        };
    formList.push(username);
    formList.push(carId);
    formList.push(defContent);
    formList.push(url);
    $.ajax({
        type: "GET",
        url: "/ajax.php?module=comment&a=carcomment",
        data:formList,
        dataType: "jsonp",
        jsonp: 'jsonp',
        cache: false,
        context: this,
        success: function(data){
            if (data.status == 'success') {
                var $checkForm = $('#js_check_mobile_box');
                var $carCommentId = $checkForm.find('input[name=car_comment_id]');
                if (!$carCommentId.length) {
                    $carCommentId = $('<input>');
                    $carCommentId.attr({
                        'type' : 'hidden',
                        'name' : 'car_comment_id'
                    });
                }
                $carCommentId.attr({
                    'value' : data.id
                });
                var $sendType = $checkForm.find('input[name=send_type]');
                if (!$sendType.length) {
                    $sendType = $('<input>');
                    $sendType.attr({
                        'type' : 'hidden',
                        'name' : 'send_type'
                    });
                }
                $sendType.attr({
                    'value' : 'car_comment'
                });
                var $checkMobileBox = $('#js_check_mobile_box');
                $('#js_comment_box').removeClass('on');
                $checkForm.append($carCommentId).append($sendType).show();
                this.resetCarComment();
                //打开短信验证窗口
                $checkMobileBox.overlay({
                    effect: 'fade',
                    opacity: 0,
                    closeOnClick: false,
                    onShow: function() {
                        $checkMobileBox.show();
                        $FBDIV.find('#pingfen').show();
                        $FBDIV.find('#pingfen-ok').hide();
                        $FBDIV.find('#pingfen-no').hide();
                        me.centerDisplay($('#pingfen').selector);
                    }
                });
                $(".overlay").css({height: $(document).height()});

            } else if (data.status == 'error') {
                throw new Error('插入车源评论失败');
            }
        }
    });
}

proto.initCommentBox = function($el) {
    var me          = this,
        $content    = $el.find('#content'),
        $closeBtn   = $el.find('.close'),
        $cancelBtn  = $el.find('.cancel');
    
    focusInput($content);
    $closeBtn.on('click', {$el : $el}, $.proxy(me.closeComment, me));
    $cancelBtn.on('click', {$el : $el}, $.proxy(me.closeComment, me));
};

/**
 * 关闭评价窗口
 */
proto.closeComment = function(e) {
    var me = this,
        $el = e.data.$el;
    $el.hide();
    me.removeOverlay();
    clearInterval(OK_TIMER);
    me.resetComment();
}
/**
 * 评价窗口输入窗口焦点变化
 */
function focusInput($obj) {
    var defVal = $obj.val();
    $obj.focus(function(){
        var thisVal = $(this).val();
        if(thisVal == defVal){
            $(this).val("");
            $(this).addClass('focus').css('color','#434343');
            
        }
    });
    $obj.blur(function(){
        var thisVal = $(this).val();
        if(thisVal == ""){
            $(this).val(defVal);
            $(this).removeClass('focus').css('color','#aaa');
        }
    });
}

/**
 * 提交交易顾问评价手机号
 * @param config
 */
proto.submitMobile = function($el) {
    var me          = this,
        submitBtn   = $el.find('#mobile_submit'),
        $mobile     = $el.find('#c_mobile input[name=mobile]'),
        $code       = $el.find('#c_code input[name=code]');
    focusInput($mobile);
    focusInput($code);
    submitBtn.on('click', {$el : $el}, $.proxy(me.validateMobile, me));
}

/**
 * 验证评价内容
 */
proto.validateMobile = function(e) {
    var me  = this;
    var $el = e.data.$el;
    //验证标识
    var ret = true;
    var $mobile          = $el.find('#c_mobile input[name=mobile]');
    var $mobileErr       = $el.find('#c_mobile').next();
    var $c_code         = $el.find('#c_code input[name=code]');
    var $codeErr        = $el.find('#c_code').next();
    
    $mobileErr.hide();
    
    //验证START
    var mobile = $mobile.val();
    var code   = $c_code.val();
    if (mobile == '' || mobile == $mobile[0].defaultValue || !(me.isTel(mobile))) {
        $mobileErr.show();
        ret = false;
    }
    if (code == '' || code == $c_code[0].defaultValue) {
        $codeErr.show();
        ret = false;
    }
    if (!ret) {
        return;
    }
    //验证短信验证码是否正确
    var checkList = $el.serializeArray();
    var codeTypeObj = {
            'name' : 'code_type',
            'value' : 'fb_code'
    };
    checkList.push(codeTypeObj);
    //短信验证码验证
    $.ajax({
        type : 'GET',
        url : '/ajax.php?module=message&a=checkcode',
        data : checkList,
        dataType : "jsonp",
        jsonp : 'jsonp',
        cache : false,
        success : function(data) {
            if (data.status == 'success') {
                //更新评论手机验证(更新手机号字段和status)
                $codeErr.hide();
                me.ajaxSendMobile($el);
            } else if (data.status == 'error') {
                $codeErr.show();
            }
        }
    });
}

/**
 * 提交交易顾问评价手机号
 * @param config
 */
proto.ajaxSendMobile = function($el) {
    var me          = this,
        mobileList  = $el.serializeArray();
    $.ajax({
        type : 'GET',
        url : '/ajax.php?module=comment&a=updatemobile',
        data : mobileList,
        dataType: 'jsonp',
        jsonp: 'jsonp',
        cache: false,
        success: function(data){
            if (data.status == 'success') {
                $('#js_check_mobile_box').hide();
                $('#pingfen-ok').show();
                me.reportOk(5, '#pingfen-ok p strong');
                $(window).on('click', function(e) {
                    if (!$.contains($('#pingfen-ok'), e.target)) {
                        $('#pingfen').hide();
                        me.removeOverlay();
                        clearInterval(OK_TIMER);
                        me.resetComment();
                        $(this).off('click');
                    }
                })
            } else if (data.status == 'error') {
                throw new Error('更新评论手机验证状态失败');
            }
        }
    });
}

//再次发送短信倒计时
proto.startCount = function($btn, func, e) {
    var me          = this,
        $mobile     = e.data.$mobile,
        $mobileErr  = e.data.$mobileErr;
    clearInterval(SMS_TIMER);
    var num = 60;
    var fn = function() {
        --num;
        num = num >= 0 ? num : 0;
        $btn.find('b').html(num);
        if (num <= 0) {
            clearInterval(SMS_TIMER);
            $btn.off('click').on('click', {$mobile : $mobile, $mobileErr : $mobileErr}, $.proxy(func, me));
            $btn.removeClass('waiter').html('重新发送验证码');
        }
    };
    SMS_TIMER = setInterval(fn,1000);
}

module.exports = FeedBack;