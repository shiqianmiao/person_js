/**
 * @desc        详情页降价通知工具
 * @author      daiyuancheng<daiyc@273.cn>
 * @date        2014-4-3
 */
var $ = require('jquery');
var Dialog = require('widget/dialog/dialog.js');
var Widget = require('lib/widget/widget.js');
var Base = require('app/ms_v2/js/base.js');


var DEFAULT_TPL = '<div id="price_notice">'
    + '<div class="pop_box_content">'
    + '<form>'
    + '<dl class="form_text clearfix">'
    + '<dt>价格降到</dt>'
    + '<dd><div class="input_box clearfix"><input class="input1" id="js_deprice" value="<%=defaultPrice%>"><em class="tips">万元，通知我！</em></div></dd>'
    + '</dl>'
    + '<dl class="form_text clearfix">'
    + '<dt>手机号码</dt>'
    + '<dd><div class="input_box clearfix"><input class="input1" id="js_demobile" value="<%=mobileTip%>" style="<%=mstyle%>"><i style="display: none;"></i></div></dd>'
    + '</dl>'
    + '<dl class="form_text clearfix">'
    + '<dt>　</dt>'
    + '<dd><button class="button1" type="submit" id="depreciate_submit">提　交</button></dd>'
    + '</dl>'
    + '</form>'
    + '</div>'
    + '</div>';

var SUCESS_TPL = '<div id="price_notice" style=" top: 300px;">'
    + '<div class="pop_box_content">'
    + '<div class="success_tips clearfix">'
    + '<div class="icon"></div>'
    + '<p>'
    + '<strong>车价订阅成功！车辆降价，会及时发送到您的手机！</strong>'
    + '本窗口将在 <em>4秒</em> 后自动关闭'
    + '</p>'
    + '</div>'
    + '</div>'
    + '</div>';

var isTel = function (tel) {
    var rphone = /^1[3458]\d{9}$|^(0\d{2,4}-)?[2-9]\d{6,7}(-\d{2,5})?$|^(?!\d+(-\d+){3,})[48]00(-?\d){7,10}$/;
    if (!rphone.test(tel)) {
        return false;
    }
    return true;
}

var SUBMIT_LOG = '/car@etype=click@under=submit';

var TITLE = '降价通知我';

var DIALOG_COFING = {
    title: TITLE,
    padding: '0px',
    escAble: true,
    skin: 'gray',
    content: '',
    close: null
};

var CLOSE_SECOND = 4;

var NORMAL_BORDER_COLOR = '#ededed';
var ERR_BORDER_COLOR    = 'red';

var MOBILE_TIP = '请输入您的手机号';

var Depreciate = function (options) {
    if (!options) {
        throw new Error('配置信息为空');
    }

    if (!options.$el) {
        throw new Error('$el为空');
    }

    this.config = $.extend({data : options.$el.data()}, Depreciate.defaults, options);

    this._init();
}

Depreciate.defaults = {};

var proto = Depreciate.prototype = {};

$.extend(proto, {
    _dialog: null
    , $price : null
    , $mobile : null
    , _init: function () {
        var config = this.config;

        config.$el.on('click', $.proxy(this._initBox, this)).click();
    }
    , _initBox: function () {
        var $content = $(Widget.template(DEFAULT_TPL, {defaultPrice: this.config.data.defaultPrice, mobileTip: this.config.data.mobile || MOBILE_TIP, mstyle: this.config.data.mobile ? '' : 'color:#999'}));
        this._createDialog(TITLE, $content);

        this.$price = $content.find('#js_deprice');

        this.$mobile = $content.find('#js_demobile');

        var me = this;
        this.$price.on('focus', function(e) {
            var $this = $(this);
            $this.css('border-color', NORMAL_BORDER_COLOR);
        }).on('blur', function(e) {
            me._checkPrice();
        });
        this.$mobile.on('focus', function(e) {
            me.$mobile.next().hide();
            var $this = $(this);
            $this.css({'border-color': NORMAL_BORDER_COLOR, 'color' : '#585858'});
            if ($this.val() == MOBILE_TIP) {
                $this.val('');
            }
        }).on('blur', function(e) {
            me._checkMobile();
            var $this = $(this);
            if (!$this.val()) {
                $this.val(MOBILE_TIP).css('color', '#999');
            }
        });

        var $submit = $content.find('#depreciate_submit'),
            isSended = false;
        $submit.on('click', function(e) {
            e.preventDefault();
            if (isSended) {
                return false;
            }
            if (me._checkForm()) {
                // 手动发送统计日志
                Base.log.sendTrack(SUBMIT_LOG + '@price=' + me.$price.val() + '@mobile=' + me.$mobile.val() + '@car_id=' + me.config.data.carId + '@time=' + (Date.parse(new Date()) / 1000));
                isSended = true;
                $.ajax({
                    url : 'http://www.273.cn/ajax_v3.php?module=depreciate_notice',
                    data : {
                        mobile : me.$mobile.val(),
                        price : me.$price.val(),
                        car_id : me.config.data.carId
                    },
                    dataType : 'jsonp',
                    jsonp : 'jsonp'
                }).done(function(result) {
                    if (result.error == 0) {
                        me._close();
                        me._showRetBox();
                        me.config.data.mobile = me.$mobile.val();
                    } else {
                        me._checkForm();
                    }
                }).fail(function() {
                }).always(function() {
                    isSended = false;
                });
            } else {
                return false;
            }
        });
    }
    , _createDialog: function (title, $content, cb) {
        this._dialog = new Dialog({
            title: title,
            padding: '0px',
            escAble: true,
            skin: 'gray',
            content: $content,
            close: cb ? cb : null
        });
    }

    /**
     * 验证表单
     */
    , _checkForm : function() {
        return this._checkPrice() && this._checkMobile();
    }
    , _checkMobile : function() {
        var mobile = this.$mobile.val();
        if (mobile && isTel(mobile)) {
            return true;
        } else {
            this.$mobile.next().show();
            this.$mobile.css('border-color', ERR_BORDER_COLOR);
            return false;
        }
    }
    , _checkPrice : function() {
        var price = this.$price.val() * 10000,
            curPrice = this.config.data.price;
        if (price > curPrice * 0.5 && price < curPrice) {
            return true;
        } else {
            this.$price.css('border-color', ERR_BORDER_COLOR);
            return false;
        }
    }
    /**
     * 提交订阅
     */
    , _submitSubscribe: function () {

    }, _showRetBox: function () {
        var sec = CLOSE_SECOND;
        var $content = $(Widget.template(SUCESS_TPL, {second : sec}));
        var $time = $content.find('em');
        this._createDialog(TITLE, $content);
        var me = this;
        var fn = function() {
            if (-- sec > 0) {
                $time.html(sec + '秒');
                setTimeout(arguments.callee, 1000);
            } else {
                me._close();
            }
        }
        setTimeout(fn, 1000);
    }, _close: function () {
        this._dialog.close();
    }
});

module.exports = Depreciate;
