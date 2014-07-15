/*
 * 新版门店顾问车源ajax筛选
 * @author WangYu
 * @since 2014-6-6
 */

var Filter = exports;
var Base = require('app/ms_v2/js/base.js');
var $ = require('jquery');
var LazyLoad = require('lib/jquery/plugin/jquery.lazyload.js');
//车源列表js模板
var SaleTpl = require('app/chain/tpl/sale_list.tpl');
//继承Base
$.extend(Filter, Base);

//初始化
Filter.start = function(params) {
    Filter.getSale();
    Filter.click();
    Filter.brand();
    Filter.series();
    Filter.model();
    Base.init(params);
};

//js事件
Filter.click = function() {
    //仿下拉框
    $('.carfilter dd')
        .mouseover(function() {
            $(this).children('.morelayer').css('display', 'block');
        })
        .mouseout(function() {
            $(this).children('.morelayer').css('display', 'none');
        });

    //单击下拉框内容，触发筛选
    $('.carfilter dd ul li').live('click', function() {
        $('#current_page').val('1');
        var value = $(this).attr('id');
        var text = $(this).children('a').html() + '<i></i>';
        $(this).parent('ul').parent('.morelayer').children('.title').attr('value', value);
        $(this).parent('ul').parent('.morelayer').children('.title').html(text);
        $(this).parent('ul').parent('.morelayer').prev('a').html(text);
        $(this).parent('ul').parent('.morelayer').css('display', 'none');
        Filter.getSale();
    });

    //翻页条，触发筛选
    $('#page a').live('click', function() {
        if ($(this).html() == '上一页') {
            $('#current_page').val(parseInt($('#current_page').val()) - 1);
        } else if ($(this).html() == '下一页') {
            $('#current_page').val(parseInt($('#current_page').val()) + 1);
        } else {
            $('#current_page').val($(this).html());
        }
        Filter.getSale();
    });

    //排序, 单击触发筛选
    $('#sort a').live('click', function() {
        //设置当前页码为1
        $('#current_page').val('1');
        $(this).addClass('on').siblings().removeClass('on');
    });
    //默认排序、发布时间排序、表显里程排序
    $('#default-sort,#post-time-sort,#kilometer-sort').live('click', function() {
        Filter.getSale();
    });
    //上牌时间排序
    $('#brand-time-sort').live('click', function() {
        if ($(this).children('i').attr('class') == 'i-time') {
            $(this).children('i').attr('class', 'i-mid');
            $(this).attr('title', '按上牌时间从远到近排序');
            $(this).attr('value', 'desc');
        } else {
            $(this).children('i').attr('class', 'i-time');
            $(this).attr('title', '按上牌时间从近到远排序');
            $(this).attr('value', 'asc');
        }
        Filter.getSale();
    });
    //价格排序
    $('#price-sort').live('click', function() {
        if ($(this).children('i').attr('class') == 'i-time') {
            $(this).children('i').attr('class', 'i-mid');
            $(this).attr('title', '按价格从低到高排序');
            $(this).attr('value', 'desc');
        } else {
            $(this).children('i').attr('class', 'i-time');
            $(this).attr('title', '按价格从高到低排序');
            $(this).attr('value', 'asc');
        }
        Filter.getSale();
    });
};

//品牌
Filter.brand = function() {
    $('#brand').hover(function() {
        $('#series ul #all').trigger('click');
        $('#model ul #all').trigger('click');
        $.ajax({
               type: 'get',
               url: '/ajax.php?module=GetAdviserSale',
               data: {action:'getBrandList'},
               dataType: 'json',
               success: function(data) {
                   var brandList = '<li id="all"><a href="#">全部品牌</a></li>';
                   for (var item in data) {
                       brandList += "<li id="+data[item].id+"><a href='#'>"+data[item].name+"</a></li>";
                   }
                   $('#brand ul').html(brandList);
               }
        });
    });
};

//车系
Filter.series = function() {
    $('#series').hover(function() {
        $('#model ul #all').trigger('click');
        var brandId = Filter.data().brand_id;
        if (brandId == undefined || brandId == 'all') {
            $('#series ul').css('height', 0);
            return;
        }
        $('#series ul').css('height', 350);
        $.ajax({
               type: 'get',
               url: '/ajax.php?module=GetAdviserSale',
               data: {action:'getSeriesListByBrandId', 'brand_id':brandId},
               dataType: 'json',
               success: function(data) {
                   var seriesList = '<li id="all"><a href="#">全部车系</a></li>';
                   for (var item in data) {
                       seriesList += "<li id="+data[item].id+"><a href='#'>"+data[item].name+"</a></li>";
                   }
                   $('#series ul').html(seriesList);
               }
        });
    });
};

//车型
Filter.model = function() {
    $('#model').hover(function() {
        var seriesId = Filter.data().series_id;
        if (seriesId == undefined || seriesId == 'all') {
            $('#model ul').css('height', 0);
            return;
        }
        $('#model ul').css('height', 350);
        $.ajax({
               type: 'get',
               url: '/ajax.php?module=GetAdviserSale',
               data: {action:'getModelListBySeriesId', 'series_id':seriesId},
               dataType: 'json',
               success: function(data) {
                   var modelList = '<li id="all"><a href="#">全部车型</a></li>';
                   for (var item in data) {
                       modelList += "<li id="+data[item].id+"><a href='#'>"+data[item].sale_name+"</a></li>";
                   }
                   $('#model ul').html(modelList);
               }
        });
    });
};

//筛选条件 返回JSON对象
Filter.data = function() {
    var data = {
        'brand_id':$('#brand .title').attr('value'),
        'series_id':$('#series .title').attr('value'),
        'model_id':$('#model .title').attr('value'),
        'price':$('#price .title').attr('value'),
        'age':$('#age .title').attr('value'),
        'emission_standards':$('#emission_standards .title').attr('value'),
        'sort':$('#sort .on').attr('id') + "_" + $('#sort .on').attr('value'),
        'store_id':$('#store_id').val(),
        'follow_user_id':$('#follow_user_id').val(),
        'current_page':$('#current_page').val(),
    };
    return $.parseJSON(JSON.stringify(data));
};

//获取车源
Filter.getSale = function() {
    $('.stores_list_nocar').remove();
    var filterData = Filter.data();
    $.ajax({
        type: 'get',
        url: '/ajax.php?module=GetAdviserSale',
        data: {action:'getSale', filter:filterData},
        dataType: 'json',
        success: function(data) {
            var saleData = new Array();
            saleData['data'] = data.info;
            var saleCount = data.count;
            //数据为空,清空各种数据，并给出提示语
            if (saleCount < 1) {
                $('#saleList').html(' ');
                $('#page').html(' ');
                $('.car_sum strong').html('0');
                $('#page').after('<div class="stores_list_nocar clearfix"><div class="icon"></div><p><strong>很抱歉，没有找到相关车辆！</strong>您可以更换关键字后再搜索或者调整以上筛选条件。</p></div>');
                return;
            }
            var pager = data.pager;
            $('#saleList').html(SaleTpl(saleData));
            $('#page').html(pager);
            $('.car_sum strong').html(saleCount);
            if ($('.js_scroll').length != 0) {
                LazyLoad({
                    el : '.js_scroll',
                    effect : 'fadeIn',
                    data_attribute : 'url', // data-url
                    skip_invisible : false,
                    load:function(){
                        $(this).parents('.lazy_load').removeClass('lazy_load');
                    }
                });
            }

        }
    });
};


