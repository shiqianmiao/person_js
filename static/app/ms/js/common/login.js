/**
 * @desc 详情页 会员登录
 * @copyright (c) 2013 273 Inc
 * @author chenhan <chenhan@273.cn>
 * @since 2013-12-04
 */

var $ = require('jquery');
require('lib/jquery/plugin/jquery.overlay.js');

var TPL = '<h4>会员登录<span id="close_login" class="close">关闭</span></h4>' +
          '<form action="http://member.273.cn/login.php?action=login" method="POST">' + 
              '<input type="hidden" id="comefromurl" name="comeurl"/>' +
              '<p class="phone"><input type="text"  id="login_uname" name="username" value="用户名" /><span>&nbsp;</span></p>' +
              '<p class="phone"><span class="label">密　码</span><input type="password"  id="login_pword" name="passwd"  value="" /><span>&nbsp;</span></p>' +
              '<p class="message" id="showmsg" style="display:none;"><span></span></p>' +
              '<p class="btn"><input id="submitLogin" class="submit" type="button" value="确认提交" /><input id="loginCancel" type="button" value="取　消" /></p>' +
              '<p class="note">不是会员？<a href="http://member.273.cn/reg.html">立即注册</a>，享受更多的实惠！</p>'
          '</form>';

var MemberLogin = function($el, option) {
    var me          = this,
        id          = option.id || '';
    me.$LoginDiv  = $(id);
    me.$LoginDiv.html(TPL);
    me.initLogin($el);
}

var proto = MemberLogin.prototype = {};

//初始化登录
proto.initLogin = function($el) {
    var me = this;
    me.initLoginBoxEvent($el);
}

/**
 * 打开登录页面
 */
proto.showLogin = function($el) {
    var me = this;
    me.centerDisplay('#js_login');
    inputFocus('#login_uname');
    $el.overlay({
        effect: 'fade',
        opacity: 0.8,
        closeOnClick: true,
        onShow: function() {
            me.$LoginDiv.show();
        },
        onHide: function() {
            me.closeLogin();
        }
    });
    $('.overlay').css({height: $(document).height()});
}
/**
 * 初始化登录窗体事件
 */
proto.initLoginBoxEvent = function($el) {
    var me = this;
    me.$LoginDiv.find('#login_uname').focus(function() {
        $(this).next().removeAttr('class').removeAttr('title');
    });
    me.$LoginDiv.find('#login_pword').focus(function() {
        $('#js_login .label').hide();
        $(this).next().removeAttr('class').removeAttr('title');
    });
    me.$LoginDiv.find('#login_pword').blur(function() {
        var thisval = $.trim($(this).val());
        if(thisval == ''){
            $('#js_login .label').show();
        }
    });
    $('#comefromurl').val(window.location);
    $('#submitLogin').click(function() {
        var usernames = $.trim($('#login_uname').val());
        var password = $.trim($('#login_pword').val());
        if (usernames == '' || usernames == '用户名') {
            $('#login_uname').next().attr('class', 'form-msg-no');
            $('#login_uname').next().attr('title', '用户名不能为空');
            return false;
        } else if (password == ''){
            $('#login_pword').next().attr('class', 'form-msg-no');
            $('#login_pword').next().attr('title', '密码不能为空');
            return false;
        }
        $('#js_login form').submit();
    });
    $('#close_login').click($.proxy(function() {
        me.closeLogin();
    }, me));
    $('#loginCancel').click($.proxy(function() {
        me.closeLogin();
    }, me));
}

//关闭登陆窗
proto.closeLogin = function() {
    var me = this;
    //遮罩层移除，其他元素复位
    me.removeOverlay();
    
   //登陆窗移除，复位
    $('#js_login').hide();
    var uNameDef = $("#login_uname")[0].defaultValue;
    var pwordDef = $("#login_pword")[0].defaultValue;
    $("#login_uname").val(uNameDef);
    $("#login_pword").val(pwordDef);
    $("#login_uname").next().removeAttr('class');
    $("#login_uname").next().removeAttr('title');
    $("#login_pword").next().removeAttr('class');
    $("#login_pword").next().removeAttr('title');
}

var inputFocus = function(focusid) {
    var focusblurid = $(focusid);
    var defval = focusblurid.val();
    focusblurid.css('color','#aaa');
    focusblurid.focus(function() {
        var thisval = $(this).val();
        if(thisval == defval){
            $(this).val('');
            $(this).css('color','#333');
        }
    });
    focusblurid.blur(function() {
        var thisval = $(this).val();
        if(thisval == '') {
            $(this).val(defval);
            $(this).css('color','#aaa');
        }
    });
}

proto.removeOverlay = function() {
    $('.overlay-trigger').removeClass('overlay-trigger');
    $('body').css('overflow', 'auto');
    $('.overlay').remove();
}

proto.centerDisplay = function(id) {
    var div = $(id);
    var winHeight = $(window).height();
    var winWidth = $(window).width();
    var divHeight = div.height();
    var divWidth = div.width();
    var top = (winHeight - divHeight) / 2 + $(window).scrollTop();
    var left = (winWidth - divWidth) / 2;
    div.css({top: top + 'px', left: left + 'px'});
}
module.exports = MemberLogin;