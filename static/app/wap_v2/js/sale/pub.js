/**
 * 我要卖车
 * @copyright (c) 2013 273 Inc
 * @author chenchaoyang <chency@273.cn>
 * @since 2014-3-13
 */
var $ = require('zepto');
var Widget = require('lib/widget/widget.js');
var allBrand = require('app/wap_v2/js/tpl/all_brand.tpl');
var seriesTpl = require('app/wap_v2/js/tpl/series_list.tpl');
var modelList = require('app/wap_v2/js/tpl/model_list.tpl');
var Common = require('app/wap_v2/js/common/common.js');
var Base = require('app/wap_v2/js/sale/base.js');
var Pub = exports;

Pub.submit = function(config) {
    var $el         = config.$el,
        $tel        = $el.find('#telephone'),
        $button     = $el.find('.btn-green');
    $el.submit(validate);
    function validate() {
        var telephone = $.trim($tel.val());
        var title = $.trim($('#js_title').val());
        if (!telephone) {
            alert('请输入您的手机号！');
            return false;
        }
        if (!Common.isPhone(telephone)) {
            alert('请输入正确的手机号！');
            return false;
        }
        if (title) {
            $button.attr("disabled",true);
            return true;
        } else {
            alert('请选择车型品牌！');
            return false;
        }
    }
};

Pub.start = function(param) {
    Base.init(param);
    Widget.initWidgets();
    var $caption = $('#js_title');
    if ($caption.val()) {
        $('.js_brand').html($caption.val());
    }
    
    $('#pageheader .reback a').on('click', function(){
        if ($(this).data("type") == 'home') {
            location.href = $(this).data('url');
        } else if ($(this).data('type') == 'vehicle') {
            showBox('main');
        } else if ($(this).data('type') == 'city') {
            showBox('main');
        }
    });
    
    //不选
    $('body').delegate('.unlimit','click', function(){
        showBox('main');
    });
    
    $('.js_brand').on('click',function() {
        $('#main').addClass('hidden');
        $('#footer').addClass('hidden');
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
        scrollTop();
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
                        data.unlimit = true;
                        updateFormData(data.brand.id, 0, 0, data.brand.name);
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
            if ($(this).parent().hasClass('unlimit')) {
                return;
            }
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
                        data.unlimit = true;
                        updateFormData(data.brand.id, data.series.id, 0, data.brand.name + ' ' + data.series.name);
                        $('#series').addClass('hidden');
                        $('#model').html(modelList(data)).removeClass('hidden');
                        scrollTop();
                        bindModelEvent(data);
                    }
                },
                error: function(xhr, type){
                    alert('网络异常，未请求到数据，请检查网络或重试');
                }
            });
        });
    }
    
    function bindModelEvent(data) {
        $('#model .js_back_brand').on('click', function() {
            showBox('brand');
        });
        $('#model .js_back_series').on('click', function() {
            showBox('series');
        });
        $('#model ul li a').on('click', function() {
            var $this = $(this);
            if ($this.parent().hasClass('chexi') || $this.parent().hasClass('unlimit')) {
                return;
            }
            updateFormData(data.brand.id, data.series.id, $this.data('id'), $this.data('title'));
            $('#js_title').val($this.data('title'));
            showBox('main');
        });
    }
    
    function showBox(boxType) {
        switch(boxType) {
            case 'main':
                $('#main').removeClass('hidden');
                $('#footer').removeClass('hidden');
                $('.gohome').removeClass('hidden');
                $('#pageheader .pagetitle').html('发布卖车');
                $('#brand').addClass('hidden');
                $('#series').addClass('hidden');
                $('#model').addClass('hidden');
                $('#city').addClass('hidden');
                $('#pageheader .reback a').data('type','home');
                
                var $anchor = $('#zhaoshang');
                var top = $anchor.offset().top;
                window.scroll(0, top);
                
                break;
            case 'brand':
                $('#brand').removeClass('hidden');
                $('#series').addClass('hidden');
                $('#model').addClass('hidden');
                scrollTop();
                break;
            case 'series':
                $('#series').removeClass('hidden');
                $('#model').addClass('hidden');
                scrollTop();
                break;
        }
    }
    
    function updateFormData($brandId, $seriesId, $modelId, $title) {
        $('.js_brand').html($title);
        $('#js_title').val($title);
        if ($brandId > 0) {
            $('#js_brand_id').val($brandId);
        } else {
            $('#js_brand_id').val('');
        }
        if ($seriesId > 0) {
            $('#js_series_id').val($seriesId);
        } else {
            $('#js_series_id').val('');
        }
        if ($modelId > 0) {
            $('#js_model_id').val($modelId);
        } else {
            $('#js_model_id').val('');
        }
    }
    
    function scrollTop() {
        var $top = $('.uptop');
        $top.css('visibility', 'hidden');
        window.scroll(0, 0);
    }
};
