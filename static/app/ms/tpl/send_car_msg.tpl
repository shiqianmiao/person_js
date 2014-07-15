<span class="close" data-273-click-log="/twodetail@etype=click@element=smsclose">关闭</span>
<span class="title" data-273-click-log="/twodetail@etype=click@place=sendphone"><em class="e1"></em>免费发送到手机</span>
<form id="subForm">
    <div class="left">
        <p><%= title %></p>
        <p><%= price %></p>
        <p><%= card_time %></p>
        <p><%= kilometer %></p>
        <p>信息编号：<%= id %></p>
        <p>电话：<br /><%= show_phone %></p>
    </div>
    
    <div class="right" id="right1">
        <p class="title">将左侧信息<b>免费</b>发送到手机(不支持小灵通)</p>
        <p class="phone"><input id="send_mobile" type="text" value="填写手机号码" /><span id="send_message_msg">&nbsp;</span></p>
        <p class="btn"><input class="submit" type="button" value="免费发送" id="subMessage"/><input class="btnCancel" type="button" value="取　消" /></p>
        <p class="note">273二手车交易网承诺保障您的隐私，不会泄漏您的手机号码。</p>
        <input type="hidden" name="car_sale_id_send" id="car_sale_id_send" value="<%= id %>">
        <input type="hidden" name="mobile_binded" id="mobile_binded" value="">
    </div>
    
    <div class="right" id="right2" style="display:none">
        <p class="title" style="height:60px;">确认短信已发送到您的手机<b id="send_code_moblie"></b>请于<b>1分钟内</b>输入短信中的确认码，点击“免费发送”后即可将信息发送到该手机</p>
        <p class="phone"><input id="send_code" type="text" value="请输入验证码" /><span id="send_code_msg">&nbsp;</span></p>
        <p id="code_msg"><b id="code_timer">60</b>秒后再次获取验证码</p>
        <p class="btn">
            <input id="js_scm_submit" class="submit" type="button" value="确认提交" />
            <input style="display:none;" class="submit" type="button" value="重新发送" id="reSendCode" />
            <input class="btnCancel" type="button" value="取　消" />
        </p>
    </div>
    
    <div class="right" id="right3" style="display:none" >
        <p style="padding:40px 0px 10px; border-bottom: 1px #ccc dashed;color: #67940F;font-size: 20px;font-weight: 700;font-family: Microsoft Yahei;">
            <span id="mobile_success_send"></span> 发送成功
        </p>
        <p class="note">本窗口将在<b>5秒</b>后自动关闭</p>
        <p class="note">下载短信会有一定时间延时，请耐心等待</p>
    </div>
</form>