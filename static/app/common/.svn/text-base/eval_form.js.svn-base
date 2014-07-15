/**
 * @desc 评估表单
 * @copyright (c) 2013 273 Inc
 * @author chenhan<chenhan@273.cn>
 * @since 2013-12-19
 */

var $ = require('jquery');
var Log = require('util/log.js');

var EvalForm = function($el, log) {
    var me  = this;
    me.$el = $el;
    me.log = log;
    me.init();
};

var proto = EvalForm.prototype = {};

proto.init = function() {
    var me = this;
    me.initForm();
    me.initSelect();
    me.initSelectAndChangeCity();
    me.initChangeCode();
    me.initRemoveErr();
};

proto.initForm = function() {
    var me = this,
        $el = me.$el,
    $inputs = $el.find('input.js_require'),
    $codeImg = $el.find('#js_code_img');
    $el.find('#js_submit').on('click', validate);
    
    /**
     * 验证
     */
    function validate() {
        var flag  = true;
        me.log += '@etype=click@action=submit';
        $inputs.each(function() {
            me.log += '@' + $(this).attr('name') + '=' + $(this).val();
            if (!$(this).val() || ($(this).attr('type') == 'hidden' && $(this).val() == 0)) {
                flag = valError($(this));
            } else {
                if ($(this).hasClass('js_prev')) {
                    $(this).prev().removeClass('error-red');
                } else {
                    $(this).removeClass('error-red');
                }
            }
        });
        Log.trackEventByGjalog(me.log, $el, 'click');
        
        var $numInput = $('.js_number'),
            numReg = /^\d+(\.\d{1,2})?$/;
        $numInput.each(function() {
            if (!numReg.test($(this).val())) {
                flag = valError($(this));
            }
        });
        if (!flag) {
            $codeImg.click();
            return;
        }
        var $code = $('.js_code');
        if ($code.length != 0) {
            checkCode($code).done(function(data) {
                if (data == 0) {
                    $code.addClass('error-red');
                    $codeImg.click();
                } else {
                    $el.submit();
                }
            });
        } else {
            $el.submit();
        }
    }
    
    function checkCode($code) {
        var option = [{
            name : 'code',
            value : $code.val()
        }];
        return $.ajax({
            url : 'http://www.273.cn/ajax.php?module=code&a=checkCode',
            dataType : 'jsonp',
            data : option
        });
    }
    
    function valError($input) {
        if ($input.hasClass('js_prev')) {
            $input.prev().addClass('error-red');
        } else {
            $input.addClass('error-red');
        }
        return false;
    }
}

/**
 * 初始化选择框
 */
proto.initSelect = function() {
    var me       = this,
        $el      = me.$el;
    me.$selects  = $el.find('.js_select_input');
    me.$allSelects = me.$selects.add(me.$el.find('.js_change_city'));
    me.$selects.each(function() {
        me.initDropDown($(this));
    });
};

/**
 * 初始化下拉框行为
 */
proto.initDropDown = function($el, fn) {
    var me        = this,
        $text     = $el.find('input[type=text]'),
        $valInput = $el.find('input:hidden'),
        $ul       = $el.find('ul');
    $el.on('click', function(e) {
        if ($(this).find('ul li').length == 0) {
            return false;
        }
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $(this).addClass('active');
        }
        me.$allSelects.each(function() {
            if (!$.contains(this, e.target)) {
                $(this).removeClass('active');
            }
        });
        return false;
    });
    $(document).on('click', function() {
        $el.removeClass('active');
    });
    
    $ul.delegate('li', 'click', function() {
        var $a = $(this).find('a');
        $text.val($a.text()).removeClass('error-red');
        $valInput.val($a.data('value'));
        $el.removeClass('active');
        if (fn) {
            fn();
        }
        return false;
    });
};

/**
 * 选择省份切换城市
 */
proto.initSelectAndChangeCity = function() {
    var me          = this,
        $el         = me.$el,
        $proBox     = $el.find('.js_change_city'),
        $proInput   = $proBox.find('input:hidden'),
        $cityDiv    = $proBox.next(),
        $ul         = $cityDiv.find('ul'),
        $cityInput  = $cityDiv.find('input:hidden'),
        $cityText   = $cityDiv.find('input[type=text]');
    
    me.initDropDown($proBox, resetCity);
    if ($proInput.val()) {
        getCity();
    }
    function resetCity() {
        $cityText.val('城市');
        $cityInput.val('');
        $ul.html('');
        getCity();
    }
    function getCity() {
        var option = [{
            name : 'a',
            value : 'city'
        },
        {
            name : 'province_id',
            value : $proInput.val()
        }];
        $.ajax({
            url : 'http://www.273.cn/ajax.php?module=get_city_list',
            dataType : 'jsonp',
            data : option,
            success : function(data) {
                $.each(data, function(i, val) {
                    var $li = $('<li>'),
                        $a  = $('<a>');
                    $a.attr({
                        'href' : 'javascript:void(0)',
                        'data-value' : i
                    }).html(val);
                    $li.append($a);
                    $ul.append($li);
                });
            }
        });
    }
};

/**
 * 初始化去除错误样式
 */
proto.initRemoveErr = function() {
    var me          = this,
        $el         = me.$el,
        $textBox    = $el.find('.texts_box'),
        $inputs     = $textBox.find('input');
    $inputs.on('keypress keyup', function() {
        if ($(this).val()) {
            $(this).removeClass('error-red');
        }
    });
};

/**
 * 更换验证码
 */
proto.initChangeCode = function() {
    var me       = this,
        $el      = me.$el,
        $codeBox = $el.find('#js_code_box'),
        $img     = $codeBox.find('#js_code_img'),
        $change  = $codeBox.find('.js_change_code');
    $change.on('click', function() {
        $img.attr('src', 'http://www.273.cn/ajax.php?module=code&' + Math.random());
    });
};

module.exports = EvalForm;