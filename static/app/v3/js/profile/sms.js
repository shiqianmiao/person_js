/**
 * @brief       业管发送短信函数
 * @author      chenhan<chenhan@273.cn>
 * @date        2013-6-14
 */
var smsModule = exports;
/**加载依赖模块start**/
var $ = require('jquery');
/**加载依赖模块end**/

smsModule.sendSMS = function(e) {
    var form = e.data.form;
    var btn = e.data.btn;
    var url = e.data.url;
    var data = {};
    //如果用户名存在,则一起发送
    if (form.find('input[name=username]').val()) {
        data['username'] = form.find('input[name=username]').val();
    }
    data['bind_mobile'] = form.find('input[name=bind_mobile]').val();
    
    var input = form.find('input[name=bind_mobile]');
    if (input.length != 0) {
        var inputParent = form.find('input[name=bind_mobile]').parent();
        var errorMsg = inputParent.find('div.m2');
        errorMsg.remove();
        //手机空值判定
        if (data['bind_mobile'] == '') {
            if (inputParent.find('div.m2').length == 0) {
                errorMsg = $('<div>');
                iNode = $('<i>')
                iNode.attr('class', 'i3');
                errorMsg.append(iNode);
            } else {
                errorMsg = inputParent.find('div.m2');
            }
            errorMsg.attr('class', 'msg m2');
            errorMsg.append('请您输入需要绑定的手机号码');
            inputParent.append(errorMsg);
            input.css('border', '1px solid red');
            return false;
        }
        //手机格式判定
        var re = new RegExp(/^(13|15|18|14)\d{9}$/);
        if (re.test(data['bind_mobile']) == false) {
            if (inputParent.find('div.m2').length == 0) {
                errorMsg = $('<div>');
                iNode = $('<i>')
                iNode.attr('class', 'i3');
                errorMsg.append(iNode);
            } else {
                errorMsg = inputParent.find('div.m2');
            }
            errorMsg.attr('class', 'msg m2');
            errorMsg.append('您输入手机号码格式有误');
            inputParent.append(errorMsg);
            input.css('border', '1px solid red');
            return false;
        }
    }
    btn.unbind('click', smsModule.sendSMS);
    data = JSON.stringify(data);
    $.ajax({
        url:url,
        type:'POST',
        context:btn,
        data:({json:data}),
        success:function(msg) {
            this.html('重新发送(<i>60</i>)');
            //显示成功发送消息
            var $sendSuccesss = null;
            if (this.parent().find('div.m5').length == 0) {
                $sendSuccesss = $('<div>');
            } else {
                $sendSuccesss = this.parent().find('div.m5');
            }
            $sendSuccesss.attr('class', 'msg m5');
            $sendSuccesss.html('短信验证码已发送,请注意查收短信');
            this.parent().append($sendSuccesss);
            startCount(e);
        }
    });
}

//再次发送短信倒计时
function startCount(e) {
    var form = e.data.form;
    var btn = e.data.btn;
    var url = e.data.url;
    var timer;
    clearInterval(timer);
    var num = 60;
    var fn = function(){
        --num;
        num = num >= 0 ? num : 0;
        btn.find('i').html(num);
        if (num <= 0) {
            clearInterval(timer);
            btn.bind('click', {form:form, btn:btn, url:url}, smsModule.sendSMS);
            btn.html('再次获取短信验证码');
        }
    };
    timer = setInterval(fn,1000);
}