/**
 * 价格评估
 * @copyright (c) 2013 273 Inc
 * @author chenchaoyang <chency@273.cn>
 * @since 2013-12-5
 */
var $ = require('zepto');
var Widget = require('app/wap_v2/js/common/widget.js');
var allBrand = require('app/wap_v2/js/tpl/all_brand.tpl');
var seriesTpl = require('app/wap_v2/js/tpl/series_list.tpl');
var modelList = require('app/wap_v2/js/tpl/model_list.tpl');
var allCity = require('app/wap_v2/js/tpl/all_city.tpl');
var Common = require('app/wap_v2/js/common/common.js');
var Base = require('app/wap_v2/js/sale/base.js');
var Evaluation = exports;
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
};

Evaluation.submit = function(config) {
    
    var $el         = config.$el,
        $submit     = $el.find('#js_submit'),
        $modelId    = $el.find('#js_model_id'),
        $year       = $el.find('#js_year'),
        $month      = $el.find('#js_month'),
        $city       = $el.find('#js_city_id'),
        $km         = $el.find('#js_kilometer');
    $el.submit(validate);
    function validate() {
        if (!$modelId.val()) {
            alert('请选择车型品牌');
            return false;
        }
        if (!$city.val()) {
            alert('请选择车辆属地');
            return false;
        }
        if (!($year.val() > 0) || !($month.val() > 0)) {
            alert('请选择上牌时间');
            return false;
        }
        
        var $timeStamp = new Date($year.val(), $month.val() - 1, 01).getTime() / 1000;
        if ($timeStamp > $el.data('time')) {
            alert('上牌时间不得超过今天');
            return false;
        }
        
        var km = $km.val() * 1;
        if (!km) {
            alert('请输入行驶里程');
            return false;
        }
    }
};

Evaluation.init = function(param) {
    Base.init(param);
    var $km = $('#js_kilometer');
    if (!$km.val()) {
        $('#js_tishi').removeClass('hidden');
    }
    var $caption = $('#js_brand_caption');
    if ($caption.val()) {
        $('.js_brand .content').html($caption.val());
    }
    var $cityName = $('#js_city_name');
    if ($cityName.val()) {
         $('.js_city .content').html($cityName.val());
    }
    
    if ($('#footer').length > 0) {
        var marginTop = $(window).height()-$('#footer').offset().top - $('#footer').height();
        if (marginTop > 0) {
            $('#footer').css('marginTop',marginTop);
        }
    }
    
    Widget.initWidgets();
    $('#pageheader .reback a').on('click', function(){
        console.log($(this).data('type'));
        if ($(this).data("type") == 'home') {
            location.href = $(this).data('url');
        } else if ($(this).data('type') == 'vehicle') {
            showBox('main');
        } else if ($(this).data('type') == 'city') {
            showBox('main');
        }
    });
    
    $('.js_brand').on('click',function() {
        $('#js_kilometer').blur();
        $('#main').addClass('hidden');
        $('#footer').addClass('hidden');
        $('.gohome').addClass('hidden');
        $('#pageheader .pagetitle').html('车型品牌');
        $('#pageheader .reback a').data('type','vehicle');
        if ($('#brand').html() != "") {
            $('#brand').removeClass('hidden');
        } else {
            var param = {};
            $('#brand').html(allBrand(param)).removeClass('hidden');
            Common.lazyLoadPic();
            bindBrandEvent();
        }
    });
    
    function bindBrandEvent(e) {
        Common.anchor($('#brand .zimu'));
        $('#brand .shaixuan-page .row a').on('click', brandClick);
        $('#brand .shaixuan-page ul li a').on('click', brandClick);
        function brandClick(e) {
            var data = {};
            data.type='series';
            data.brand = $(this).data('id');
            $.ajax({
                type: 'POST',
                url: '/ajax.php?module=getModelSeries',
                data: data,
                dataType: 'json',
                success: function(data){
                    if (data) {
                        $('#brand').addClass('hidden');
                        $('#series').html(seriesTpl(data)).removeClass('hidden');
                        scrollTop();
                        bindSeriesEvent();
                    }
                },
                error: function(xhr, type){
                    alert('网络异常，未请求到数据，请检查网络或重试');
                }
            });
        }
    }
    
    function bindSeriesEvent(e) {
        $('#series .js_back_brand').on('click', function() {
            showBox('brand');
        });
        $('#series ul li a').on('click', function seriesClick(e) {
            var data = {};
            data.type='model';
            data.series = $(this).data('id');
            $.ajax({
                type: 'POST',
                url: '/ajax.php?module=getModelSeries',
                data: data,
                dataType: 'json',
                success: function(data){
                    if (data) {
                        $('#series').addClass('hidden');
                        $('#model').html(modelList(data)).removeClass('hidden');
                        scrollTop();
                        bindModelEvent();
                    }
                },
                error: function(xhr, type){
                    alert('网络异常，未请求到数据，请检查网络或重试');
                }
            });
        });
    }
    
    
    function bindModelEvent(e) {
        $('#model .js_back_brand').on('click', function() {
            showBox('brand');
        });
        $('#model .js_back_series').on('click', function() {
            showBox('series');
        });
        $('#model ul li a').on('click', function() {
            var $this = $(this);
            if ($this.parent().hasClass('chexi')) {
                return;
            }
            $('#pinggu .js_brand .content').html($this.data('title'));
            $('#js_brand_caption').val($this.data('title'));
            $('#js_model_id').val($this.data('id'));
            showBox('main');
        });
    }
    
    function showBox(boxType) {
        switch(boxType) {
            case 'main':
                $('#main').removeClass('hidden');
                $('#footer').removeClass('hidden');
                $('.gohome').removeClass('hidden');
                $('#pageheader .pagetitle').html('车价评估');
                $('#brand').addClass('hidden');
                $('#series').addClass('hidden');
                $('#model').addClass('hidden');
                $('#city').addClass('hidden');
                $('#pageheader .reback a').data('type','home');
                break;
            case 'brand':
                $('#brand').removeClass('hidden');
                $('#series').addClass('hidden');
                $('#model').addClass('hidden');
                break;
            case 'series':
                $('#series').removeClass('hidden');
                $('#model').addClass('hidden');
                break;
        }
        scrollTop();
    }
    
    $('.js_city').on('click', function(){
        $('#js_kilometer').blur();
        $('#main').addClass('hidden');
        $('#footer').addClass('hidden');
        $('.gohome').addClass('hidden');
        $('#pageheader .pagetitle').html('地区选择');
        $('#pageheader .reback a').data('type','city');
        if ($('#city').html() != "") {
            $('#city').removeClass('hidden');
        } else {
            var param = {};
            $('#city').html(allCity(param)).removeClass('hidden');
            bindCityEvent();
        }
        
    });
    
    function bindCityEvent() {
        $('#city .letter').siblings().find('a').on('click', function(){
            var $this = $(this);
            $('#pinggu .js_city .content').html($this.html());
            $('#js_city_name').val($this.html());
            $('#js_city_id').val($this.data('id'));
            showBox('main');
        });
    }
    $('#js_kilometer').on('input', function(e) {
        var $newVal = $(this).val();
        var $newLength = $newVal.length;
        if($newLength > 6) {
            $newVal = $newVal.substr(0, 6);
            $(this).val($newVal.substr(0, 6));
        }
    });
    
    function scrollTop() {
        var $top = $('.uptop');
        $top.css('visibility', 'hidden');
        window.scroll(0, 0);
    }
};
