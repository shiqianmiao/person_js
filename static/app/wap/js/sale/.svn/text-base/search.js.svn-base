/**
 * @desc wap高级搜索页js
 * @copyright (c) 2013 273 Inc
 * @author 陈朝阳 <chency@273.cn>
 * @since 2013-7-24
 */

var $ = require('lib/zepto/zepto-1.0.js');
var Widget = require('app/wap/js/common/widget.js');
var Base = require('app/wap/js/sale/base.js');
var _ = require('lib/underscore/underscore.js');

var Search = exports;

_.extend(Search, Base);

var SearchTpl = require('app/wap/js/tpl/search.tpl');
var BrandTpl = require('app/wap/js/tpl/brand.tpl');
var Common = require('app/wap/js/common/common.js');
//展开收取更多选项
Search.expand = function (config){
    var $elem = config.$el;
    $elem.click(function(e){
        $switchBtn = $(this);
        $(".default-hide").toggle($switchBtn.html()=="更多筛选条件");
        if($switchBtn.html()=="更多筛选条件"){
            $switchBtn.html("精简筛选条件");
        } else{
            $switchBtn.html("更多筛选条件");
        }
     });
};

//高级选项主页面点击事件
Search.mainSelect = function(config) {
    var $elem = config.$el;
    var id = $elem.attr('id');
    var data = {id : id};
    $elem.on('click',function(){
        if (id == 'district' && $('input[name="city_id"]').length>0) {
            data.city_id = $('input[name="city_id"]').val();
        }
        if (id == 'brand' && $('input[name="type"]').length>0) {
            data.type = $('input[name="type"]').val();
        }
        if (id == 'series' && $('input[name="brand"]').length>0) {
            data.brand = $('input[name="brand"]').val();
            if ($('input[name="type"]').length>0) {
                data.type = $('input[name="type"]').val();
            }
        }
        $.ajax({
            type: 'POST',
            url: '/ajax.php?module=advancedSearch',
            data: data,
            dataType: 'json',
            success: function(data){
                if (data) {
                    showSubOptions(data);
                }
            },
            error: function(xhr, type){
                alert('网络异常，未请求到数据，请检查网络或重试');
            }
        });
    });
};

//高级搜索子条件选择和提交事件
function bindOptionClick() {
    $('.search-list2 ul a').on('click',function(){
        var name = $(this).html();
        var value = $(this).attr('data-value');
        var optionType = $('#option_type').val();
        var $nameSpan = $('#'+optionType).find('span');
        var oldName = $nameSpan.html();
        //最小值的key 如价格为min_price
        var minKey = '';
        //最大值的key 如价格为max_price
        var maxKey = '';
        if (optionType == 'price') {
            minKey = 'min_price';
            maxKey = 'max_price';
        } else if (optionType == 'years') {
            minKey = 'min_age';
            maxKey = 'max_age';
        } else if (optionType == 'displace') {
            minKey = 'min_displace';
            maxKey = 'max_displace';
        } else if (optionType == 'kilometer') {
            minKey = 'min_kilometer';
            maxKey = 'max_kilometer';
        }
        if (name !='不限' ) {
            if (oldName == '不限') {
                $nameSpan.html(name);
                $nameSpan.removeClass('all');
                if (!$('input[name="'+optionType+'"]').length>0) {
                    $('#searchForm').append('<input name="'+optionType+'" value="'+value+'" type="hidden" />');
                }
            } else {
                $nameSpan.html(name);
                if ($('input[name="'+optionType+'"]').length>0) {
                    $('input[name="'+optionType+'"]').val(value);
                } else if ($('input[name="'+minKey+'"]').length > 0 && $('input[name="'+maxKey+'"]').length > 0) {
                    $('input[name="'+minKey+'"]').remove();
                    $('input[name="'+maxKey+'"]').remove();
                    $('#searchForm').append('<input name="'+optionType+'" value="'+value+'" type="hidden" />');
                }
            }
        } else if(name == '不限' && oldName != '不限') {
            $nameSpan.html(name);
            $nameSpan.addClass('all');
            if ($('input[name="'+optionType+'"]').length>0) {
                $('input[name="'+optionType+'"]').remove();
            } else if ($('input[name="'+minKey+'"]').length > 0 && $('input[name="'+maxKey+'"]').length > 0) {
                $('input[name="'+minKey+'"]').remove();
                $('input[name="'+maxKey+'"]').remove();
            }
        }
        $('#sub_option').hide();
        $('#main_option').show();
    });
    
    $('.mileage .btn input[type="submit"]').on('click',function(e){
        //当前筛选条件名，如price
        var optionType = $('#option_type').val();
        //显示选中条件的span节点，如price
        var $nameSpan = $('#'+optionType).find('span');
        //选中之前的值 ，如不限
        var oldName = $nameSpan.html();
        //最小值
        var low = $('.mileage input[name="low"]').val();
        //最大值
        var high = $('.mileage input[name="high"]').val();
        var name = '';
        //最小值的key 如价格为min_price
        var minKey = '';
        //最大值的key 如价格为max_price
        var maxKey = '';
        if (low == "" && high == "") {
            return false;
        } else {
            low = (low=="") ? 0 : parseFloat(low);
            high = (high=="") ? 0 : parseFloat(high);
            if (low > high) {
                var temp = low;
                low = high;
                high = temp;
            }
        }
        if (optionType == 'price') {
            name = low + '-' + high + '万元';
            minKey = 'min_price';
            maxKey = 'max_price';
        } else if (optionType == 'years') {
            name = low + '-' + high + '年';
            minKey = 'min_age';
            maxKey = 'max_age';
        } else if (optionType == 'displace') {
            name = low + '-' + high + 'L';
            minKey = 'min_displace';
            maxKey = 'max_displace';
        } else if (optionType == 'kilometer') {
            name = low + '-' + high + '万公里';
            minKey = 'min_kilometer';
            maxKey = 'max_kilometer';
        }
        if (name !=oldName ) {
            $nameSpan.html(name);
            if (oldName == '不限') {
                $nameSpan.removeClass('all');
                $('#searchForm').append('<input name="'+minKey+'" value="'+low+'" type="hidden" />');
                $('#searchForm').append('<input name="'+maxKey+'" value="'+high+'" type="hidden" />');
            } else if ($('input[name="'+optionType+'"]').length > 0){
                $('input[name="'+optionType+'"]').remove();
                $('#searchForm').append('<input name="'+minKey+'" value="'+low+'" type="hidden" />');
                $('#searchForm').append('<input name="'+maxKey+'" value="'+high+'" type="hidden" />');
            } else if ($('input[name="'+minKey+'"]').length > 0 && $('input[name="'+maxKey+'"]').length > 0) {
                $('input[name="'+minKey+'"]').val(low);
                $('input[name="'+maxKey+'"]').val(high);
            }
        }
        $('#sub_option').hide();
        $('#main_option').show();
        e.preventDefault();
    });
};

//自定义范围参数事件处理
function bindInputKeyup() {
    //自定义参数的自动过滤
    $('input[name="low"]').css('color', '#333');
    $('input[name="high"]').css('color', '#333');
    $('body').on('keyup', '[data-custom-input]', function() {
        var $type = $(this).data('custom-input');
        var $newVal = $(this).val();
        //type=2表示是排量，可以为小数
        var $newLength = $newVal.length;
        if($type == 1 && $newLength > 5) {
            $newVal = $newVal.substr(0, 5);
            $(this).val($newVal.substr(0, 5));
        } else if(($type == 2 || $type == 3) && $newLength > 2) {
            $newVal = $newVal.substr(0, 2);
            $(this).val($newVal.substr(0, 2));
        } else if($type == 20 && $newLength > 5) {
            $newVal = $newVal.substr(0, 5);
            $(this).val($newVal.substr(0, 5));
        }
        var $ch = '';
        var $isBreak = false;
        var $isPoint = false;
        for(var i = 0; i < $newLength; i++) {
            $ch = $newVal.charAt(i);
            if($type < 20 && (!Common.isNum($ch) || $ch == '.')) {
                $(this).val($newVal.substr(0, i));
                $isBreak = true;
                break;
            }
            //排量，可以为小数
            if($type == 20 && isNaN($ch)) {
                if($ch == '.') {
                    if($isPoint) {
                        $(this).val($newVal.substr(0, i));
                        $isBreak = true;
                        break;
                    } else {
                        $isPoint = true;
                    }
                } else {
                    $(this).val($newVal.substr(0, i));
                    $isBreak = true;
                    break;
                }
            }
            //去空格
            if($ch == ' ') {
                $(this).val($newVal.substr(0, i));
                $isBreak = true;
                break;
            }
        }
        if(!$isBreak) {
            $(this).val($newVal);
        }
    });
};

function showSubOptions(data) {
    if (data.data) {
        if (data.key == 'brand') {
            if ($('input[name="'+data.key+'"]').length > 0) {
                data.value = $('input[name="'+data.key+'"]').val();
            } else {
                data.value = null;
            }
            $('#sub_option').html(BrandTpl(data)).show();
            $('#main_option').hide();
            bindBrandClick();
        } else {
            if ($('input[name="'+data.key+'"]').length>0) {
                data.value = $('input[name="'+data.key+'"]').val();
                var $nameSpan = $('#'+data.key).find('span');
                data.value_name = $nameSpan.html();
            } else {
                data.value = null;
            }
            $('#sub_option').html(SearchTpl(data)).show();
            $('#main_option').hide();
            bindOptionClick();
            if (data.key == 'price' || data.key == 'years' || data.key == 'displace' || data.key == 'kilometer') {
                bindInputKeyup();
            }
        }
        bindBackClick();
    }
}

function bindBrandClick () {
    $('#sub_option .brand-item').on('click',function(){
        var name = $(this).html();
        var value = $(this).attr('data-brand-url');
        var $nameSpan = $('#brand').find('span');
        var oldName = $nameSpan.html();
        if (name != oldName) {
            if (oldName == '不限') {
                $nameSpan.html(name);
                $nameSpan.removeClass('all');
                if (!$('input[name="brand"]').length > 0) {
                    $('#searchForm').append('<input name="brand" value="'+value+'" type="hidden" />');
                }
            } else {
                $nameSpan.html(name);
                if ($('input[name="brand"]').length > 0) {
                    $('input[name="brand"]').val(value);
                }
            }
            //选中品牌后，车系还原
            var $seriesSpan = $('#series').find('span');
            if($seriesSpan.html() != '不限') {
                $seriesSpan.html('不限');
                $seriesSpan.addClass('all');
                if ($('input[name="series"]').length > 0) {
                    $('input[name="series"]').remove();
                }
            }
            $("#seriesLi").show();
        }
        $('#sub_option').hide();
        $('#main_option').show();
    });
} 
function bindBackClick() {
    $('bread .first').on('click',function(){
        $('#sub_option').hide();
        $('#main_option').show();
    });
}
Search.start = function (param) {
    param || (param = {});
    Base.init(param);
    Widget.initWidgets();
    $(".default-hide").hide();
};