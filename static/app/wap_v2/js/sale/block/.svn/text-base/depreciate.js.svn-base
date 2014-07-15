/**
 * @desc        详情页降价通知工具
 * @author      daiyuancheng<daiyc@273.cn>
 * @date        2014-4-3
 */
var $ = require('zepto');
var Widget = require('app/wap_v2/js/common/widget.js');
var Common = require('app/wap_v2/js/common/common.js');
var Log = require('app/wap_v2/js/util/log.js');
require('app/wap_v2/js/util/overlay.js');

var DEFAULT_TPL = 
'<div id="price_dialog" class="popbox2" style="z-index:1001;">' +
    '<div class="inner">' +
        '<div class="popbox2_title"><a href="javascript:;" class="close2 js_close"></a><i></i><span>降价通知</span></div>' +
        '<div class="popbox2_content">'+
            '<div class="popbox2_form">'+
                '<p class="tips" style="display: none;"></p>'+
                '<p class="cor-888">请填写手机号，车辆降价我们会及时通知您。</p>'+
                '<p class="p_input"><span class="label">车价降到</span><span class="select-span2 short"><input type="text" id="js_deprice" value="<%=defaultPrice%>" class="pub-tel"></span><span class="other">万元，通知我。</span><span id="price_tip" class="error"></span></p>'+
                '<p class="p_input"><span class="label">手机号码</span><span class="select-span2"><input type="number" id="js_demobile" value="<%=mobileTip%>" class="pub-tel"></span><span id="mobile_tip" class="error"></span></p>'+
                '<p class="btn_box">'+
                    '<button class="btn btn-green" id="depreciate_submit">提　交</button>'+
                '</p>'+
            '</div>'+
        '</div>'+
    '</div>'+
'</div>';

var SUCCESS_CONTENT = '降价通知设置成功！<br>车辆降价我们会及时通知您。';
var FAIL_CONTENT = '提交失败了，请返回重试。';
var BTN_YES = '确　定';
var BTN_SUBMIT = '提　交';
var BTN_RETRY = '返回重试';

var Depreciate = function (options) {
    if (!(this instanceof Depreciate)) return new Depreciate(config);
    this.init(options);
};

Depreciate.defaults = {};

var proto = Depreciate.prototype = {};

proto.constructor = Depreciate;

proto.init = function (options) {
    if (!options) {
        throw new Error('配置信息为空');
    }

    if (!options.$el) {
        throw new Error('$el为空');
    }

    this.config = $.extend({data : options.$el.data()}, Depreciate.defaults, options);
    
    this.$content = $(Widget.template(DEFAULT_TPL, {defaultPrice: this.config.data.defaultprice, mobileTip: this.config.data.mobile}));
    this.$price = this.$content.find('#js_deprice');
    this.$priceTip = this.$content.find('#price_tip');
    this.$mobile = this.$content.find('#js_demobile');
    this.$mobileTip = this.$content.find('#mobile_tip');
    
    options.$el.on('click', $.proxy(this._initBox, this)).click();
     
    return this;
};

proto._initBox = function() {
    this._createDialog(this.$content);
    var me = this;
    var $content = this.$content;
    this.$price.on('focus', function(e) {
        me.$priceTip.html('');
        focusFunction();
    }).on('blur', function(e) {
        me._checkPrice();
        blurFunction();
    });
    
    this.$price.on('input', function(e) {
        var $newVal = $(this).val();
        var $newLength = $newVal.length;
        if ($newLength > 8) {
            $newVal = $newVal.substr(0, 8);
            $(this).val($newVal);
        }
    });
    
    this.$mobile.on('focus', function(e) {
        me.$mobileTip.html('');
        focusFunction();
    }).on('blur', function(e) {
        me._checkMobile();
        blurFunction();
    });
    
    //iphone 现输入键盘时的兼容性代码
    function focusFunction() {
        $(window).off('orientationchange.focus').on('orientationchange.focus', function() {
            setTimeout(function () {
                 me.$mobile.blur();
                 me.$price.blur();
            }, 400);
        });
    }
    
    function blurFunction() {
        $(window).off('orientationchange.focus');
    }

    var $submit  = $content.find('#depreciate_submit'),
        isSended = false;
        
    $submit.on('click', function(e) {
        if ($submit.html() == BTN_SUBMIT) {
            //数据提交
            if (!isSended && me._checkForm()) {
                // 手动发送统计日志
                var eqslog = '/wap_detail@etype=click@name=submit';
                Log.trackEventByEqslog(eqslog, $(this), 'click');
                isSended = true;
                $submit.addClass('btn-gray');
                $submit.html('正在提交');
                $.ajax({
                    url : 'http://www.273.cn/ajax_v3.php?module=depreciate_notice',
                    data : {
                        mobile : me.$mobile.val(),
                        price  : me.$price.val(),
                        car_id : me.config.data.carid,
                        source : 1
                    },
                    dataType : 'jsonp',
                    jsonp : 'jsonp',
                    success:function(result){
                        $submit.removeClass('btn-gray');
                        isSended = false;
                        if (result.error == 0) {
                            $content.find('.popbox2_form .tips').siblings().hide();
                            $content.find('.popbox2_form .tips').html(SUCCESS_CONTENT).show();
                            $submit.parent().show();
                            $submit.html(BTN_YES).addClass('js_close');
                        } else {
                            $content.find('.popbox2_form .tips').siblings().hide();
                            $content.find('.popbox2_form .tips').html(FAIL_CONTENT).show();
                            $submit.parent().show();
                            $submit.html(BTN_RETRY);
                        }
                    },
                    error:function(result){
                        $submit.removeClass('btn-gray');
                        isSended = false;
                        $content.find('.popbox2_form .tips').siblings().hide();
                        $content.find('.popbox2_form .tips').html(FAIL_CONTENT).show();
                        $submit.parent().show();
                        $submit.html(BTN_RETRY);
                    }
                });
            } else {
                return false;
            }
        } else if ($submit.html() == BTN_RETRY) {
            $content.find('.popbox2_form .tips').html('').hide();
            $content.find('.popbox2_form .tips').siblings().show();
            $submit.html(BTN_SUBMIT);
        }
    });
};

proto._createDialog = function($content) {
    this.config.$el.overlay({
        effect: 'none',
        opacity: 0.8,
        closeOnClick: true,
        glossy:true,
        closeBtn:'.js_close',
        onShow: function() {
            if ($('#price_dialog').length) {
                $('#price_dialog').show();
            } else {
                $('body').append($content);
            }
        },
        onHide: function() {
             $('#price_dialog').hide();
        },
    });
    $('.overlay,#price_dialog').on("touchmove", function(e) {
        e.preventDefault();
    });
};

//验证表单
proto._checkForm = function() {
    return this._checkPrice() && this._checkMobile();
};

//价格验证
proto._checkPrice = function() {
    var price = $.trim(this.$price.val());
    if (price) {
        //判断是不是有效数字
        if (!isNaN(parseFloat(price)) && isFinite(price)) {
            var curPrice = this.config.data.price;
            price    = parseFloat(price);
            curPrice = parseFloat(curPrice);
            if (price < curPrice * 0.5) {
                this.$priceTip.html('*价格过低，不合理');
            } else if (price > curPrice) {
                this.$priceTip.html('*价格不应高于原价');
            } else {
                return true;
            }
        } else {
            this.$priceTip.html('*请输入有效价格');
        }
        
    } else {
        this.$priceTip.html('*请填写价格');
    }
    return false;
};

//手机号验证
proto._checkMobile = function() {
    var mobile = $.trim(this.$mobile.val());
    if (mobile) {
        if (Common.isPhone(mobile)) {
            return true;
        }else {
            this.$mobileTip.html('*请输入正确的手机号');
        }
    } else {
         this.$mobileTip.html('*手机号必填');
    }
    return false;
};

module.exports = Depreciate;
