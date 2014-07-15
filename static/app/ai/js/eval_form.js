/**
 * 价格评估
 * @copyright (c) 2013 273 Inc
 * @author chenhan <chenhan@273.cn>
 * @since 2013-12-5
 */
var $ = require('jquery');
var Widget = require('lib/widget/widget.js');
var App = require('util/app.js');

var Evaluation = exports;
/**
 * 选择车系
 */
Evaluation.selectCarType = function(config) {
    var $el             = config.$el,
        $select         = $el.find('.content'),
        $brandCaption   = $el.find('#js_brand_caption'),
        $modelId        = $el.find('#js_model_id');
    $el.on('click', function() {
        App.call('getCarType');
    });
    
    /**
     * 设置车型品牌
     * param carName 车型完整名
     * param modelId 车型id
     */
    App.addCallback('setCarType', function(carName, modelId) {
        $select.text(carName);
        $brandCaption.val(carName);
        $modelId.val(modelId);
    });
}

/**
 * 选择上牌时间
 */
Evaluation.selectCardTime = function(config) {
    var $el     = config.$el,
        from    = $el.data('from');
    
    if (from == 'android') {
        var $select = $el.find('.content'),
            $year   = $el.find('#js_year'),
            $month  = $el.find('#js_month');
        $el.on('click', function() {
            App.call('getCardTime');
        });
    } else if (from == 'ios') {
        var $cardTime = $el.find('#js_card_time');
        $el.on('click', function() {
            $cardTime.focus();
        });
    }
    
    /**
     * 设置上牌时间
     * param year 年 2009
     * param month 月 1
     */
    App.addCallback('setCardTime', function(year, month) {
        $select.text(year + ' 年 ' + month + ' 月');
        $year.val(year);
        $month.val(month);
    });
}

/**
 * 选择车辆属地
 */
Evaluation.selectCarCity = function(config) {
    var $el         = config.$el,
        $select     = $el.find('.content'),
        $cityName   = $el.find('#js_city_name'),
        $cityId     = $el.find('#js_city_id');
    $el.on('click', function() {
        App.call('getCarCity');
    });
    /**
     * 设置车辆所属地
     * param cityName 城市名
     * param cityId 城市id
     */
    App.addCallback('setCarCity', function(cityName, cityId) {
        $select.text(cityName);
        $cityName.val(cityName);
        $cityId.val(cityId);
    });
}

/**
 * 输入行驶里程
 */
Evaluation.inputKm = function(config) {
    var $el         = config.$el,
        $input      = $el.find('#js_kilometer'),
        $select     = $el.find('.content'),
        $tip        = $el.find('.tishi');
    $el.on('click', function() {
        $input.focus();
    });
    $input.on('focus', function() {
        if (!$input.val()) {
            $tip.hide();
        } else {
            setSelectionRange($input[0], $input.val().length, $input.val().length);
        }
    }).on('blur', function() {
        if (!$input.val()) {
            $tip.show();
        }
        return false;
    });
    showInput($input);
    //限制输入字数
    function showInput($obj) {
        changeNoteLabel($obj);
        $obj.on('input onpropertychange', function() {
            changeNoteLabel($obj);
        });
    }
    function changeNoteLabel($obj) {
        var length = $obj.val().length;
        if (length > 6) {
            $obj.val($obj.val().substring(0, 6));
        }
    }
    
    function setSelectionRange(input, selectionStart, selectionEnd) {
        if (input.setSelectionRange) {
          input.focus();
          input.setSelectionRange(selectionStart, selectionEnd);
        } else if (input.createTextRange) {
          var range = input.createTextRange();
          range.collapse(true);
          range.moveEnd('character', selectionEnd);
          range.moveStart('character', selectionStart);
          range.select();
        }
      }
}

Evaluation.submit = function(config) {
    var $el         = config.$el,
        $submit     = $el.find('#js_submit'),
        from        = $el.data('from'),
        $modelId    = $el.find('#js_model_id'),
        $year       = $el.find('#js_year'),
        $month      = $el.find('#js_month'),
        $cardTime   = $el.find('#js_card_time'),
        $city       = $el.find('#js_city_id'),
        $km         = $el.find('#js_kilometer');
    if (from == 'ios') {
        $submit.on('click', validate);
    } else {
        $el.submit(validate);
    }
    function validate() {
        if (!$modelId.val()) {
            App.call('showToast', ['请选择车型品牌']);
            return false;
        }
        if (!$city.val()) {
            App.call('showToast', ['请选择车辆属地']);
            return false;
        }
        if (from == 'android') {
            if (!$year.val() || !$month.val()) {
                App.call('showToast', ['请选择上牌时间']);
                return false;
            }
            var $timeStamp = new Date($year.val(), $month.val() - 1, 01).getTime() / 1000;
        } else if (from == 'ios') {
            if (!$cardTime.val()) {
                App.call('showToast', ['请选择上牌时间']);
                return false;
            }
            var $time = $cardTime.val().split('-');
            var $timeStamp = new Date($time[0], $time[1] - 1, 01).getTime() / 1000;
        }
        if ($timeStamp > $el.data('time')) {
            App.call('showToast', ['上牌时间不得超过今天']);
            return false;
        }
        
        var km = $km.val() * 1;
        if (!km) {
            App.call('showToast', ['请输入行驶里程']);
            return false;
        }
        App.call('showResultDone');
        if (from == 'ios') {
            setTimeout(function() {
                $el.submit();
            }, 100);
        }
    }
}

//最多有两位小数
function isKm(val) {
    var twoDecimal = /^\d+(\.[\d]{1,2})?$/;
    return twoDecimal.test(val);
}

/**
 * 初始化表单
 */
function initForm() {
    var $el = $('#js_form'),
        from = $el.data('from');
    
    var $brandDiv       = $el.find('#js_brand_div'),
        $brandSelect    = $brandDiv.find('.content'),
        $brandCaption   = $el.find('#js_brand_caption');
    if ($brandCaption.val()) {
        $brandSelect.text($brandCaption.val());
    } else {
        return false;
    }
    
    var $cardDiv        = $el.find('#js_card_div'),
        $cardSelect     = $cardDiv.find('.content'),
        $cardTime       = $el.find('#js_card_time'),
        $year           = $el.find('#js_year'),
        $month          = $el.find('#js_month');
    if (from == 'android') {
        if ($year.val() && $month.val()) {
            $cardSelect.text($year.val() + ' 年 ' + $month.val() + ' 月');
        }
    }
    
    var $provinceDiv    = $el.find('#js_province_div'),
        $provinceSelect = $provinceDiv.find('.content'),
        $cityName       = $el.find('#js_city_name'),
        $city           = $el.find('#js_city_id');
    if ($city.val() && $cityName.val()) {
        $provinceSelect.text($cityName.val());
    }
}

Evaluation.init = function(config) {
    initForm();
    Widget.initWidgets();
}
