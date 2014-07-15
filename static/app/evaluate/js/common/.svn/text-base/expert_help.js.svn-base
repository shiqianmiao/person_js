/**
 * @desc 结果页 专家评估
 * @copyright (c) 2013 273 Inc
 * @author chenhan <chenhan@273.cn>
 * @since 2013-11-29
 */

var $ = require('jquery');
var Widget = require('lib/widget/widget.js');
require('lib/jquery/plugin/jquery.overlay.js');
var Log = require('util/log.js');

/**
 * 专家评估的弹出层
 */
var tpl = '<div id="js_expert_box" class="evalute_box pop_box">' +
              '<h4>专家评估<span class="close js_close">关闭</span></h4>' +
              '<div id="js_mobile_box" class="content">' +
                  '<form>' +
                  '<div class="input_box"><input class="input1" name="mobile" value="请输入您的手机号码" autocomplete="off" /><i class="js_i"></i></div>' +
                  '<div id="js_error_box" class="clearfix err">' +
                      '<span class="error_tips">请输入正确的手机号码！</span>' +
                  '</div>' +
                  '<div class="warm_tips"><p><span>温馨提示:</span>留下您的手机号码，等候专家短信回复评估结果！手机号码仅用于回复评估结果，不会在网站上显示，也不会告知第三方！</p></div>' +
                  '<div class="btn"><label></label><button id="js_submit" type="button">提　交</button><button type="button" class="cancel js_close">取　消</button></div>' +
                  '</form>' +
              '</div>' +
              '<div id="js_expert_box" class="content" style="display:none;">' +
                  '<strong class="tit">提交成功！专家评估团将第一时间告知您评估结果!</strong>' +
                  '<p class="autoclose"><span>10</span>秒后本窗口将自动关闭</p><br />' +
              '</div>' +
          '</div>';
var $BOX = null,
    OK_TIMER = null; //完成的timer
var ExpertHelp = function($el, option) {
    var me = this,
        id = option.id || '';
    $(id).after(tpl);
    $BOX = $('body').find('#js_expert_box');
    me.init($el);
}

var proto = ExpertHelp.prototype = {};

proto.init = function($el) {
    var me = this;
    proto.initBoxEvent($el);
    //初始化打开表单事件
    $el.on('click', $.proxy(me.initOpenEvent, me)).click();
}

proto.initBoxEvent = function($el) {
    var me      = this,
        $moBox  = $BOX.find('#js_mobile_box'),
        $retBox = $BOX.find('#js_expert_box'),
        $mobile = $BOX.find('input[name=mobile]'),
        $moTip  = $mobile.next(),
        $errTip = $BOX.find('#js_error_box .error_tips'),
        $close  = $BOX.find('.js_close'),
        $submit = $BOX.find('#js_submit');
    focusInput($mobile);
    $close.on('click', $.proxy(function() {
        me.closeBox();
    }, me));
    $mobile.on('input propertychange', function() {
        if (me.isTel($mobile.val())) {
            $moTip.removeClass().addClass('i_true');
            $errTip.hide();
        } else {
            $moTip.removeClass();
            $errTip.show();
        }
    });
    $submit.on('click', function() {
        var flag = true;
        if (!me.isTel($mobile.val())) {
            $errTip.show();
            flag = false;
        } else {
            $moTip.removeClass().addClass('i_true');
            $errTip.hide();
        }
        if (!flag) {
            return false;
        }
        checkCount().done(function(data) {
            if (data == 1) {
                $moBox.hide();
                $retBox.find('.tit').text('该号码今天内已申请过相同车源的专家评估，请耐心等待专家回复!');
                $retBox.show();
                me.reportOk(10, '#js_expert_box p.autoclose span');
            } else {
                save();
            }
        });
    });
    function checkCount() {
        var option = $el.data('json'),
        mobile = {
        name : 'mobile',
        value : $mobile.val()
        };
        option.push(mobile);
        return $.ajax({
            url : 'http://www.273.cn/ajax.php?module=evaluate&a=getCount',
            type : 'POST',
            dataType : 'jsonp',
            data : option
        });
    }
    function save() {
        var option = $el.data('json'),
            mobile = {
            name : 'mobile',
            value : $mobile.val()
        };
        option.push(mobile);
        return $.ajax({
            url : 'http://www.273.cn/ajax.php?module=evaluate&a=save',
            dataType : 'jsonp',
            data : option,
            success : function(data) {
                if (data == 1) {
                    var log = '/evaluate/result/submit_expert';
                    log += $el.data('log');
                    Log.trackEventByGjalog(log, $el, 'click');
                    $moBox.hide();
                    $retBox.show();
                    me.reportOk(10, '#js_expert_box p.autoclose span');
                }
            }
        });
    }
}

proto.closeBox = function() {
    var me = this,
        $moBox  = $BOX.find('#js_mobile_box'),
        $retBox = $BOX.find('#js_expert_box');
    me.removeOverlay();
    $BOX.hide();
    $moBox.show();
    $retBox.hide();
    me.resetBox();
}

proto.resetBox = function() {
    var $mobile = $BOX.find('input[name=mobile]'),
        $moTip  = $mobile.next(),
        $errTip = $BOX.find('#js_error_box .error_tips');
    
    $BOX.find('#js_expert_box .tit').text('提交成功！专家评估团将第一时间告知您评估结果!');
    $errTip.hide();
    $moTip.removeClass();
    var defMobile  = $mobile[0].defaultValue;
    $mobile.val(defMobile).removeClass('focus').css('color', '#aaa');
}

/**
 * 打开窗口
 */
proto.initOpenEvent = function() {
    var me = this;
    $BOX.overlay({
        effect: 'fade',
        opacity: 0.8,
        closeOnClick: false,
        onShow: function() {
            clearInterval(OK_TIMER);
            $BOX.show();
            me.centerDisplay($BOX.selector);
            $('.overlay').css({height: $(document).height()});
        }
    });
}

proto.reportOk = function(n, selector) {
    var me = this;
    clearInterval(me.OK_TIMER);
    var num = n;
    $(selector).html(num);
    var fn = function() {
        --num;
        num = num>=0 ? num : 0;
        $(selector).html(num);
        if (num<=0) {
            clearInterval(OK_TIMER);
            me.closeBox();
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

proto.removeOverlay = function() {
    $(".overlay-trigger").removeClass('overlay-trigger');
    $("body").css('overflow', 'auto');
    $(".overlay").remove();
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


module.exports = ExpertHelp;