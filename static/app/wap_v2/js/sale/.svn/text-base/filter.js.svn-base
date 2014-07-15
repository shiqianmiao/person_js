/**
 * @desc m版列表页搜索js
 * @copyright (c) 2013 273 Inc
 * @author 陈朝阳 <chency@273.cn>
 * @since 2013-12-11
 */

var $ = require('lib/zepto/zepto-1.0.js');
var BrandTpl = require('app/wap_v2/js/tpl/brand_filter.tpl');
var Filter = exports;
var IScroll = require('app/wap_v2/js/util/iscroll.js');
var plateform = '';
//高级选项主页面点击事件
Filter.filter = function(config) {
    //android或ios,ios下自定义滚动条
    plateform = config.plateform;
    
    //禁止遮罩层的滑动
    $('.shaixuan .shaixuan-left').on("touchmove", function(e) {
        e.preventDefault();
    });
    //筛选层显示事件绑定
    $('#search .otherlink').on('click', function(){
        $('.shaixuan').addClass('show');
        var mainHeight = $(window).height() - $('#search').height();
        setTimeout(function(){
            $('#main').css({height:mainHeight,overflow:'hidden'});
            $('.shaixuan-right').css({right:0});
            //筛选层自定义滚动
            if (typeof(mainScroll) != 'undefined') {
                mainScroll.refresh();
            } else if (plateform == 'ios') {
                window.mainScroll = new IScroll('#main_wrap',{preventDefault: false,HWCompositing:false});
                resizeSearchBox();
                $('#main_page').on("touchmove", function(e) {
                    e.preventDefault();
                });
            }
        },10);
    });
    //筛选表单提交
    $('.js_submit').on('click', function(){
        $('#searchForm').submit();
    });
    //表单清空
    bindClearClick();
    //筛选取消
    bindCancelClick();
    
    var $elem = config.$el;
    var $searchForm = $elem.find('#searchForm');
    var data = {};
    var id = '';
    var brandCache = true;
    $elem.find('.shaixuan-type').on('click',function() {
        id = $(this).parent().attr('id');
        data.id = id;
        if (id == 'type') {
            //用户重新选择类型后，品牌数据需重新取
            brandCache = false;
        }
        if (id != 'brand' && $.trim($(this).parent().find('.shaixuan-box').html()) || id == 'brand' && $('.shaixuan-page').length==2 && brandCache) {
            //已经取过数据了，直接展示
            expendSubOption(id);
            return;
        }
        
        if (id == 'district' && $searchForm.find('input[name="city_id"]').length>0) {
            data.city_id = $searchForm.find('input[name="city_id"]').val();
        }
        if (id == 'brand' && $searchForm.find('input[name="type"]').length>0) {
            data.type = $searchForm.find('input[name="type"]').val();
        }
        if (id == 'series' && $searchForm.find('input[name="brand"]').length>0) {
            data.brand = $searchForm.find('input[name="brand"]').val();
            if ($searchForm.find('input[name="type"]').length>0) {
                data.type = $searchForm.find('input[name="type"]').val();
            }
        }
        $.ajax({
            type: 'POST',
            url: '/ajax.php?module=advancedSearch',
            data: data,
            dataType: 'json',
            success: function(data){
                if (data) {
                    if (id == 'brand') {
                        brandCache = true;
                    }
                    showSubOptions(data);
                }
            },
            error: function(xhr, type){
                alert('网络异常，未请求到数据，请检查网络或重试');
            }
        });
    });
};

//子筛选项数据展示
function showSubOptions(data) {
    if (data.data) {
        if (data.key == 'brand') {
            if ($('input[name="'+data.key+'"]').length > 0) {
                data.value = $('input[name="'+data.key+'"]').val();
            } else {
                data.value = null;
            }
            $('#brand_page').remove();
            $('.shaixuan-right').append(BrandTpl(data));
            $('#brand_page').addClass('show');
            $('#main_page').removeClass('show');
            bindBrandClick();
        } else {
            if ($('input[name="'+data.key+'"]').length>0) {
                data.value = $('input[name="'+data.key+'"]').val();
                var $nameSpan = $('#'+data.key).find('label');
                data.value_name = $nameSpan.html();
            } else {
                data.value = null;
            }
            $html = getSubOptionsHtml(data);
            if ($html) {
                $("#" + data.key).find('.shaixuan-box').html($html);
                bindSubOptionClick(data.key);
                expendSubOption(data.key);
            }
            //$('#sub_option').html(SearchTpl(data)).show();
            //$('#main').hide();
            //bindOptionClick();
        }
        //bindBackClick();
    }
}

//子筛选项的展开与收起
function expendSubOption (id) {
    if (id != 'brand') {
        var $elem = $('#'+id);
        if ($elem.hasClass('click')) {
            $elem.removeClass('click');
            $elem.find('.arrow-open').removeClass('arrow-open').addClass('arrow-close');
        } else {
            $elem.addClass('click');
            $elem.find('.arrow-close').removeClass('arrow-close').addClass('arrow-open');
        }
        //展开或收起后需重新刷新滚动条
        if (typeof(mainScroll) != 'undefined') {
            mainScroll.refresh();
        }
    } else {
        if ($('#brand_page').hasClass('show')) {
            $('#brand_page').removeClass('show');
            $('#main_page').addClass('show');
        } else {
            $('#main_page').removeClass('show');
            $('#brand_page').addClass('show');
        }
    }
}

//生成子筛选项的html
function getSubOptionsHtml(data) {
    var items = data.data;
    $html = '<span class="select" data-273-click-log="/wap/list/choice@etype=click@choice='+data.key+'_default">不限</span>';
    for (var i=0; i < items.length; i++) {
        if (items[i].key == data.value){
            $html += '<span  class="selected" data-273-click-log="/wap/list/choice@etype=click@choice='+data.key+'_'+items[i].key+'" data-value="'+ items[i].key +'">' + items[i].value + '</span>';
        } else {
            $html += '<span class="select" data-273-click-log="/wap/list/choice@etype=click@choice='+data.key+'_'+items[i].key+'" data-value="'+ items[i].key +'">' + items[i].value + '</span>';
        }
    };
    return $html;
}

//子条件选择和事件
function bindSubOptionClick(id) {
    $('#' + id).find('.shaixuan-box span').on('click',function(){
        var name = $(this).html();
        var value = $(this).data('value');
        var optionType = id;
        var $nameSpan = $('#' + id).find('label');
        //最小值
        var low = $('.mileage input[name="low"]').val();
        //最大值
        var high = $('.mileage input[name="high"]').val();
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
        var oldName = $nameSpan.html();
        if (name !='不限' ) {
            if (oldName == '不限') {
                $nameSpan.html(name);
                $nameSpan.parent().removeClass('select').addClass('selected');
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
            $(this).siblings('.selected').removeClass('selected').addClass('select');
            $(this).removeClass('select').addClass('selected');
        } else if(name == '不限' && oldName != '不限') {
            $nameSpan.html(name);
            $nameSpan.parent().removeClass('selected').addClass('select');
            $(this).siblings('.selected').removeClass('selected').addClass('select');
            if ($('input[name="'+optionType+'"]').length>0) {
                $('input[name="'+optionType+'"]').remove();
            } else if ($('input[name="'+minKey+'"]').length > 0 && $('input[name="'+maxKey+'"]').length > 0) {
                $('input[name="'+minKey+'"]').remove();
                $('input[name="'+maxKey+'"]').remove();
            }
        }
        expendSubOption(id);
    });
}


function bindBrandClick () {
    $('#brand_page li a').on('click',brandClick);
    $('#hot_brand a').on('click',brandClick);
    function brandClick (e) {
        var name = $(this).html();
        var value = $(this).attr('data-brand-url');
        var $nameSpan = $('#brand').find('label');
        var oldName = $nameSpan.html();
        if (name != oldName) {
            if (name == '不限') {
                $nameSpan.html(name);
                $nameSpan.parent().removeClass('selected').addClass('select');
                if ($('input[name="brand"]').length>0) {
                    $('input[name="brand"]').remove();
                    $('input[name="series"]').remove();
                    $("#series").hide();
                }
            } else{
                if (oldName == '不限') {
                    $nameSpan.html(name);
                    $nameSpan.parent().removeClass('select').addClass('selected');
                    if (!$('input[name="brand"]').length > 0) {
                        $('#searchForm').append('<input name="brand" value="'+value+'" type="hidden" />');
                    }
                } else{
                    $nameSpan.html(name);
                    if ($('input[name="brand"]').length > 0) {
                        $('input[name="brand"]').val(value);
                    }
                }
                //选中品牌后，车系还原
                var $seriesSpan = $('#series').find('label');
                if($seriesSpan.html() != '不限') {
                    $seriesSpan.html('不限');
                    $seriesSpan.parent().removeClass('selected').addClass('select');
                    if ($('input[name="series"]').length > 0) {
                        $('input[name="series"]').remove();
                    }
                }
                $("#series").show();
            }
        }
        expendSubOption('brand');
    };
} 

//绑定清空条件事件
function bindClearClick () {
    $('#clear').on('click',function(){
        //清除所有选中样式
        $('#main_page .shaixuan-list li').removeClass('click');
        $('#main_page .shaixuan-list .shaixuan-type .selected label').html('不限');
        $('#main_page .shaixuan-list .shaixuan-type .selected').removeClass('selected').addClass('select');
        $('#main_page .shaixuan-list .shaixuan-box .selected').removeClass('selected').addClass('select');
        //清除城市id以外的所有表单值
        $('#searchForm').find('input').each(function(){
            if ($(this).attr('name') == 'city_id' || $(this).attr('name') == 'province_id' || $(this).attr('name') == 'order') {
                
            } else {
                $(this).remove();
            }
        });
    });
}

//绑定
function bindCancelClick () {
    $('.shaixuan-left').on('click',cancel);
    $('.js_cancel').on('click',cancel);
    function cancel(e) {
        $('.shaixuan-right').css({right:'-85%'});
        setTimeout(function(){
            $('#main').attr('style','');
            $('.shaixuan').removeClass('show');
            $('.shaixuan-page').removeClass('show');
            $('#main_page').addClass('show');
        }, 0.4 * 1000);
    }
}

//绑定
function resizeSearchBox() {
    var height = $(window).height() - $('#main_page .shaixuan-header').height() - $('#main_page .bottom-btn .left').height();
    $('#main_wrap').css({height:height,overflow:'hidden'});
}
