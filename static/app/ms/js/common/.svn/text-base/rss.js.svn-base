/**
 * @desc 头部 免费订阅
 * @copyright (c) 2013 273 Inc
 * @author chenhan <chenhan@273.cn>
 * @since 2013-12-04
 */

var $ = require('jquery');
var Base  = require('app/ms/js/base.js');
var Hover  = require('app/common/hover.js');

var TPL = '<h5>车物志</h5>' +
          '<p class="des">每月一刊为您提供最新最全的购车、汽车美容、维修出行等资讯及服务...</p>' +
          '<form id="js-rss-form" method="get" action="http://news.273.cn/Subscribe/signup/">' +
          '<p class="mail">' +
          '<label>免费订阅请输入您的常用邮箱</label>' +
          '<input id="js-rss-input" style="width: 192px; clear: both; margin: 5px 0px 10px 0px; color: rgb(170, 170, 170);" value="abc@abc.com" name="dyEmail" autocomplete="off" />' +
          '<br>' +
          '<button type="submit" id="js-rss-btn">完成订阅</button>' +
          '</p>' +
          '</form>' +
          '<h5>分享至</h5>' +
          '<!-- S百度 -->' +
          '<div id="bdshare" class="bdshare_t bds_tools get-codes-bdshare">' +
               '<a class="bds_qzone"></a>' +
               '<a class="bds_tsina"></a>' +
               '<a class="bds_tqq"></a>' +
               '<a class="bds_renren"></a>' +
               '<a class="bds_t163"></a>' +
               '<span class="bds_more"></span>' +
          '</div>' +
          '<!-- E百度 -->';
var Rss = function($el, option) {
    var me          = this,
        id          = option.id || '';
    me.$rssDiv  = $(id);
    $el.find('#chewuzhi').html(TPL);
    me.initRss($el, me.$rssDiv);
    Base.bdshare({$el : $el.find('#bdshare')});
    me.$rssDiv.mouseenter();
}

var proto = Rss.prototype = {};

//初始化订阅
proto.initRss = function($el, $target) {
    var $input = $target.find('#js-rss-input');
    var $form = $target.find('#js-rss-form');
    var $btn = $target.find('#js-rss-btn');
    
    var defaultVal = 'abc@abc.com';
    var remail = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)/;
    
    //鼠标移到免费订阅上再动态加载弹出层
    Hover($el, {target : $target});
    
    $btn.data('enabled', false).addClass('no');
    
    $input.keyup(function () {
        
        var email = $(this).val();
        
        if (remail.test(email)) {
            $btn.data('enabled', true).removeClass('no');
        } else {
            $btn.data('enabled', false).addClass('no');
        }
        
    }).focus(function () {
        
        var $this = $(this);
        
        $this.addClass('on');
        
        if ($this.val() == defaultVal) {
            $this.val('');
        } 
    }).blur(function () {
        
        var $this = $(this);
        
        $this.removeClass('on');
        
        if (!$.trim($this.val())) {
            $this.val(defaultVal);
        } 
    });
    
    $form.submit(function () {
        
        if (!$btn.data('enabled') || $.trim($input.val()) === defaultVal) {
            return false;
        }
    });
}

module.exports = Rss;