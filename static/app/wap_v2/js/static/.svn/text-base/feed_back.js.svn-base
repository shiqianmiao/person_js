var $ = require('zepto');
var Log    = require('app/wap_v2/js/util/log.js');
var Uuid   = require('util/uuid.js');
var Widget = require('app/wap_v2/js/common/widget.js');

require('app/wap_v2/js/util/overlay.js');

// public
var FeedBack = exports;

FeedBack.validate = function(config) {
    $el = config.$el;
    $advice = $el.find('#js_advice');
    $contact = $el.find('#js_contact');
    $tip = $el.find('#js_tip');
    $submit = $el.find('#js_submit');
    $source = $el.find('#js_source');
    $advice.on("input", validateAdvice);
    
    $submit.on('click', submitValidte);
    
    function submitValidte(e) {
        var $this = $(e.target);
        if (!validateAdvice()){
            return false;
        } else {
            window.scroll(0, 0);
            var content  = $advice.val().replace(/(^\s*)|(\s*$)/g, "");
            var contact = $contact.val().replace(/(^\s*)|(\s*$)/g, "");
            var source = $source.val();
            $submit.attr("disabled",true);
            $.ajax({
                type : 'POST',
                url  : '/ajax.php?module=feed_back',
                data : {content:content,contact:contact,source:source},
                dataType : 'json',
                success:function(data){
                    if (data.ret == 1) {
                        $advice.val('');
                        $this.overlay({
                            effect: 'none',
                            opacity: 0.8,
                            closeOnClick: true,
                            glossy:true,
                            onShow: function() {
                                showBox();
                                centerDisplay('#fb_success');
                            },
                            onHide: function() {
                                closeMessage();
                            },
                        });
                    } else if (data.msg) {
                        $tip.html(data.msg);
                        $tip.removeClass('hidden');
                    } else {
                        $tip.html('提交出错，请重试');
                        $tip.removeClass('hidden');
                    }
                    $submit.removeAttr("disabled");
                },
                error:function(data){
                    $submit.removeAttr("disabled");
                }
            });
        }
    }
    
    function validateAdvice() {
        var length = $advice.val().replace(/(^\s*)|(\s*$)/g, "").length;
        if (length == 0) {
            $tip.html('请填写反馈内容');
            $tip.removeClass('hidden');
            return false;
        } else {
            if (length > 200 || length < 5) {
                $tip.html('反馈内容请控制在5~200个字');
                $tip.removeClass('hidden');
                return false;
            } else {
                $tip.addClass('hidden');
                return true;
            }
        }
    }
    function showBox() {
        var template = 
        '<div id="fb_success" class="popbox show" style="z-index: 1001;">'+
            '<div class="popbox-contents">'+
                '<span class="close">关闭</span>'+
                '<p class="tc" style="width: 95%;"><b>您的意见已成功提交，感谢您的支持</b></p>'+
                '<div class="popbox-btn"><a href="/"><span class="btn">返回首页</span></a></div>'+
            '</div>'+
        '</div>';
        if ($('#fb_success').length) {
            $('#fb_success').addClass('show');
        } else {
            $('body').append(template);
        }
        $('#fb_success').find('.close').on('click', function(){
            closeMessage();
        });
    }
    function closeMessage(){
        $('#fb_success').removeClass('show');
        removeOverlay();
    }
    function removeOverlay(){
        $(".overlay-trigger").removeClass('overlay-trigger');
        $("body").css('overflow', 'auto');
        $(".overlay").remove();
    }
};

function centerDisplay(id) {
    var div = $(id);
    var winHeight = $(window).height();
    var divHeight = div.height();
    var top = (winHeight - divHeight) / 2 + $(window).scrollTop();
    div.css({ top: top + "px"});
}

FeedBack.init = function(){
    if ($('#footer').length) {
        var marginTop = $(window).height()-$('#footer').offset().top - $('#footer').height();
        if (marginTop > 0) {
            $('#footer').css('marginTop',marginTop);
        }
    }
    
    Uuid();
    Widget.initWidgets();
    Log.init('/wap/feedback', false);
};
