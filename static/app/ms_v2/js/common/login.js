/**
 * @desc 会员登录弹窗
 * @copyright (c) 2014 273 Inc
 * @author chenhan <chenhan@273.cn>
 * @since 2014-02-19
 */

var $ = require('jquery');
var Dialog = require('widget/dialog/dialog.js');

var TPL = '' + 
'<form id="js_login_box" action="http://member.273.cn/login.php?action=login" method="POST">' +
    '<div class="pop_login">' +
        '<div class="pop_box_content clearfix">' +
            '<div class="input_box clearfix"><input id="js_user" name="username" class="input1" value="用户名" /><i style="display:none;"></i></div>' +
            '<div class="input_box clearfix"><input id="js_passwd" type="password" name="passwd" class="input1" /><i style="display:none;"></i><span id="js_passwd_label" class="label" style="display: block;">密　码</span></div>' +
            '<div class="btn"><button id="js_submit" type="submit" class="button1">确认提交</button><button id="js_close" class="button2" type="button">取消</button></div>' +
            '<div class="tips">不是会员？<a href="http://member.273.cn/reg.html">立即注册</a>，享受更多的实惠！</div>' +
            '<input type="hidden" id="js_come_url" name="comeurl" />' +
        '</div>' +
    '</div>' +
'</form>';

var MemberLogin = function(options) {
    if (!options) {
        throw new Error('配置信息不存在');
    }
    
    this.config = $.extend({}, MemberLogin.defaults, options);
    
    this.init();
}

var proto = MemberLogin.prototype = {};

$.extend(proto, {
    init : function() {
        var config = this.config;
        var me = this;
        if (config && !config.$el) {
            throw new Error('$el未定义');
        }
    },
    
    _dialog : function() {
        var config = this.config;
        this.dialog = new Dialog({
                title : '会员登录',
                padding : '0px',
                escAble : true,
                skin : 'gray',
                visible : false,
                content : this.$TPL
        });
    },
    
    _bindEvent : function() {
        var config = this.config;
        var $loginBox = $('#js_login_box');
        $user = $loginBox.find('#js_user');
        $passwd = $loginBox.find('#js_passwd');
        $passLabel = $loginBox.find('#js_passwd_label');
        $close = $loginBox.find('#js_close');
        
        $('#js_come_url').val(window.location);
        
        inputFocus($user);
        inputFocus($passwd);
        
        $user.focus(function() {
            $(this).next('i').hide();
        });
        $passwd.focus(function() {
            $passLabel.hide();
            $(this).next('i').hide();
        });
        
        $passwd.blur(function() {
            var thisval = $.trim($(this).val());
            if(thisval == ''){
                $passLabel.show();
                $(this).next('i').show();
            }
        });
        
        $loginBox.submit(function() {
            var username = $.trim($user.val());
            var password = $.trim($passwd.val());
            if (username == '' || username == '用户名') {
                $user.next('i').show().attr('title', '用户名不能为空');
                return false;
            } else if (password == ''){
                $passwd.next('i').show().attr('title', '密码不能为空');
                return false;
            }
        });
        
        $close.click($.proxy(this.close, this));
    },
    
    show : function() {
        var me = this;
        this.$TPL = $(TPL);
        this._dialog();
        this.dialog.ready(function() {
            me.dialog.show();
            setTimeout($.proxy(me._bindEvent, me), 50);
        });
    },
    
    close : function() {
        this.dialog.close();
    }
});

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

MemberLogin.defaults = {
        
};

module.exports = MemberLogin;