<div id="js_comment_box" class="report" style="z-index:1001;position:absolute">
    <div id="report-box" class="pingjia-box" style="position: relative">
        <h4>评价顾问<span id="close-btn" class="close">关闭</span></h4>
        <form id="report-box">
            <div id="js_report_type_box" class="clearfix">
                <div class="clearfix hp">
                    <p><span class="label"><em>*</em>评价类型</span>
                        <span class="hp2 type">信息真实</span>
                        <span class="hp2 type">车况经典</span>
                        <span class="hp2 type">看车方便</span>
                    </p>
                </div>
                <div class="clearfix cp">
                    <p>
                        <span class="label">&nbsp;</span>
                        <span class="cp2 type">信息虚假</span>
                        <span class="cp2 type">价格虚假</span>
                        <span class="cp2 type">图片虚假</span>
                        <span class="cp2 type">该车已售</span>
                        <span class="cp2 type">服务态度差</span>
                    </p>
                </div>
                <div id="report-type" style="display:none">
                    <div class="hp">
                        <input type="checkbox" name="report_type[]" value="11" />
                        <input type="checkbox" name="report_type[]" value="12" />
                        <input type="checkbox" name="report_type[]" value="13" />
                    </div>
                    <div class="cp">
                        <input type="checkbox" name="report_type[]" value="4" />
                        <input type="checkbox" name="report_type[]" value="3" />
                        <input type="checkbox" name="report_type[]" value="5" />
                        <input type="checkbox" name="report_type[]" value="1" />
                        <input type="checkbox" name="report_type[]" value="17" />
                    </div>
                </div>
                <div class="clearfix err">
                    <span class="label">&nbsp;</span>
                    <span class="form-msg-no">请至少选择一个评价</span>
                </div>
            </div>
            <div id="re-comment">
                <div class="clearfix">
                    <p>
                        <span class="label"><em>&nbsp;</em>我的评论</span>
                        <textarea id="re-content" name="report_content" maxlength="100" style="resize:none;">有更多想说的？写点评价吧～请最多不超过100个字</textarea>
                    </p>
                </div>
                <div class="clearfix err">
                    <span class="label">&nbsp;</span>
                    <span class="form-msg-no">请填写评价最多不超过100个字</span>
                </div>
            </div>
            <div class="clearfix btn" style="width: 400px;">
                <span class="label">&nbsp;</span>
                <input id="re-submit" type="button" value="提交评价" data-273-click-log="/twodetail@etype=click@place=jubao" />
                <input id="cancel" type="button" class="cancel" value="取 消" />
            </div>
        </form>
    </div>
</div>

<div id="pingfen" style="z-index:1001; display:none;">
    <h4><span class="title">评价顾问</span><span class="close">关闭</span></h4>
    <form id="js_check_mobile_box" style="display:none;">
        <div class="clearfix pingfen-ok-box" style="display:block;">
            <h5>感谢您做出的评价！</h5>
            <p>为了更好跟进您的意见，请填写手机号码。</p>
        </div>
        <div id="c_mobile" class="clearfix phone">
            <span class="title"><em>*</em> 手机号码</span>
            <input type="text" name="mobile" value="请填写您的手机号码" />
        </div>
        <div class="clearfix err">
            <span class="title">&nbsp;</span>
            <span class="form-msg-no" style="display:inline-block">请填写正确的手机号码</span>
        </div>
        <div id="sms-send" class="clearfix">
            <span class="title">&nbsp;</span>
            <span class="freesend">免费获取短信验证码</span>
            <span id="sms-send-msg" class="freesended" style="display:none;">已发送，1分钟后可重新发送</span>
        </div>
        <div id="c_code" class="clearfix phone">
            <span class="title"><em>*</em> 验 证 码</span>
            <input type="text" name="code" value="请输入短信验证码" />
        </div>
        <div class="clearfix err">
            <span class="title">&nbsp;</span>
            <span class="form-msg-no" style="width:160px;display:inline-block">请填写正确的短信验证码</span>
        </div>
        <div class="clearfix btn">
            <span class="title">&nbsp;</span>
            <input id="mobile_submit" type="button" value="确认提交" />
            <input type="button" value="取 消" class="cancel" />
            <div style="padding:10px 5px;color:#999;font-size:12px;">
            <p>如果没有收到验证短信：</p>
            <p>1.查看是否被手机安全软件屏蔽</p>
            <p>2.信号不好，请重新发送验证短信</p>
            </div>
        </div>
    </form>
    <div id="pingfen-ok" class="pingfen-ok" style="display:none">
        <h5>感谢您的评价!<br />您的评价客服验证后将会显示出来。
        </h5>
        <p><strong>5</strong>秒后本窗口将自动关闭</p>
    </div>
    <div id="pingfen-no" class="pingfen-ok" style="display:none;">
        <h5>您已对该车源评价过当前交易顾问，我们已收到您的反馈，感谢您对273的支持！</h5>
        <p><strong>5</strong>秒后本窗口将自动关闭</p>
    </div>
</div>