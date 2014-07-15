/**
 * @desc wap车源列表页
 * @copyright (c) 2013 273 Inc
 * @author 陈朝阳 <chency@273.cn>
 * @since 2013-06-24
 */

var $ = require('zepto');
var Widget = require('app/wap_v2/js/common/widget.js');
var Common = require('app/wap_v2/js/common/common.js');

var Base = require('app/wap_v2/js/sale/base.js');
var _ = require('lib/underscore/underscore.js');

var List = exports;

_.extend(List, Base);

var BrandTpl = require('app/wap_v2/js/tpl/brand.tpl');
var SearchTpl = require('app/wap_v2/js/tpl/search.tpl');
var Log    = require('app/wap_v2/js/util/log.js');

var domain = '';
//显示翻页
List.selectPage = function (config){
    var $elem = config.$el;
    $elem.find('.current').click(function() {
        $(this).find('ul').show();
        return false;
    });
    $(window).click(function (e) {
        $elem.find('ul').hide();
    });
    $elem.find('#page_select').on('change',function(){
        var str = '/wap/list/page@etype=click@value=' + $(this).get(0).selectedIndex;
        Log.trackEventByEqslog(str,$(this),'click');
        window.location.href = $(this).val();
    });
};


List.moreBrand = function(config) {
    var $elem = config.$el;
    var typeId = $elem.data('typeid');
    var urlTpl = $elem.data('urltpl');
    var data = {typeId : typeId};
    data.type = 'brand';
    $elem.on('click',function(){
        //已经有数据了，直接显示
        if ($.trim($('#sub_brand').html()) != '') {
            $('#main_option').hide();
            $('#sub_brand').show();
            return true;
        }
        $.ajax({
            type: 'POST',
            url: '/ajax.php?module=moreOption',
            data: data,
            dataType: 'json',
            success: function(data){
                if (data) {
                    showSubOptions(data, urlTpl);
                }
            },
            error: function(xhr, type){
                alert('网络异常，未请求到数据，请检查网络或重试');
            }
        });
    });
};

//更多车系
List.moreSeries= function(config) {
    var $elem = config.$el;
    var typeId = $elem.data('typeid');
    var urlTpl = $elem.data('urltpl');
    var brandId = $elem.data('brandid');
    var series = $elem.data('series');
    var defaultUrl = $elem.data('default');
    var data = {typeId : typeId, brandId : brandId, series : series};
    data.type = 'series';
    $elem.on('click',function(){
        //已经有数据了，直接显示，
        if ($.trim($('#sub_series').html()) != '') {
            $('#main_option').hide();
            $('#sub_series').show();
            return true;
        }
        $.ajax({
            type: 'POST',
            url: '/ajax.php?module=moreOption',
            data: data,
            dataType: 'json',
            success: function(data){
                if (data) {
                    showSubOptions(data, urlTpl, defaultUrl);
                }
            },
            error: function(xhr, type){
                alert('网络异常，未请求到数据，请检查网络或重试');
            }
        });
    });
};

//显示更多品牌和车系，并绑定相应点击事件
function showSubOptions(data, urlTpl, defaultUrl) {
    defaultUrl = defaultUrl || '';
    if (data.data) {
        if (data.key == 'brand') {
            //显示品牌列表
            $('#sub_brand').html(BrandTpl(data)).show();
            $('#main_option').hide();
            $('#sub_series').hide();
            
            //绑定品牌点击事件
            $('#sub_brand .brand-item').on('click',function(){
                var value = $(this).attr('data-brand-url');
                var redirectUrl = urlTpl.replace('{brandTpl}',value);
                window.location.href = redirectUrl;
            });
        } else {
            //显示车系列表
            $('#sub_series').html(SearchTpl(data)).show();
            $('#main_option').hide();
            $('#sub_brand').hide();
            
            //绑定品牌点击事件
            $('.search-list2 ul a').on('click',function(){
                var value = $(this).attr('data-value');
                if (value) {
                    var redirectUrl = urlTpl.replace('{seriesTpl}',value);
                } else {
                    var redirectUrl = defaultUrl;
                }
                
                window.location.href = redirectUrl;
            });
        }
        bindBackClick();
    }
}

//返回车源列表
function bindBackClick() {
    $('bread .first').on('click',function(){
        $('#sub_brand').hide();
        $('#sub_series').hide();
        $('#main_option').show();
    });
}

function bindSearchClick() {
    $('#search_link').click(function(){
        $('#sub_brand').hide();
        $('#sub_series').hide();
        $('#main_option').hide();
        $('#search_box').show();
    });
}
List.start = function (param) {
    param || (param = {});
    if (param) {
        domain = param['domain'];
    }
    Base.init(param);
    Widget.initWidgets();
    Common.lazyLoadPic();
    bindSearchClick();
};