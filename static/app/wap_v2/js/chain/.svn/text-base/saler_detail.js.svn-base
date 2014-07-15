/**
 * @desc 顾问详情车源列表页
 * @copyright (c) 2013 273 Inc
 * @author 王纪光 <wangjg@273.cn>
 * @since 2014-01-03
 */
var $ = require('lib/zepto/zepto-1.0.js');
var Widget = require('app/wap_v2/js/common/widget.js');
var Common = require('app/wap_v2/js/common/common.js');

var Base = require('app/wap_v2/js/sale/base.js');

var SalerDetail = exports;
var PostTpl = require('app/wap_v2/js/tpl/post.tpl');

var userName = ''; //顾问编号
var pageSize=15;// 每页个数

//排序选项
SalerDetail.sortList=function (config){
    var $elem = config.$el;
    //上一个被选中的排序
    preSort = null;
    $elem.find('ul > li > a ').click(function() {
        $("#moreCar").text("查看更多");
        preSort = $elem.find('ul .active a').attr("id");
        var sort=$(this).attr("id");
        if (preSort != sort) {
            resetSortIcon($elem.find('ul .active'));
        }
        var sortType='desc';
        sortType = getSortType($(this));
        switch ($(this).attr('id')){
             case 'create_time': 
                 $('#create_time').parent().addClass('active activel tc');
                 break; 
             case 'price': 
                 $('#price').parent().addClass('active');
                 break; 
             case 'kilometer': 
                 $('#kilometer').parent().addClass('active activer');
                 break;
             default:
                 break;
        }
        $(this).parent().siblings('li').removeClass();
        
        $('#moreCar').attr('data-sort',sort);
        $('#moreCar').attr('data-page',2);
        $('#moreCar').attr('data-sorttype',sortType);
        $.ajax({
            type: 'POST',
            url: '/ajax.php?module=loadMorePost',
            data: { sort: sort,sortType: sortType,userName:userName,pageSize:pageSize },
            dataType: 'json',
            timeout: 800,
            async:false,
            success: function(data){
                 $('.carlist').html(PostTpl(data));
                 Common.lazyLoadPic();
            },
            error: function(xhr, type){
               $('.carlist').html("<div class='search-none'><h4>很抱歉，查询有误，请稍后重试</h4></div>");
            }
        });
    });
};

//重置排序的图标
function resetSortIcon($el) {
    switch ($el.find('a').attr('id')){
         case 'create_time': 
             $el.find('span').attr('class','arrow-down');;
             break; 
         case 'price': 
             $el.find('span').attr('class','arrow-up');
             break; 
         case 'kilometer': 
             $el.find('span').attr('class','arrow-up');
             break;
         default:
             break;
    }
}
//判断是升序还是降序
function getSortType($el) {
    var sortType = '';
    var $li = $el.parent();
    var $span = $el.siblings('span');
    if ($li.hasClass('active')) {
        if ($span.hasClass('arrow-down')){
            sortType='asc';
            $span.attr('class','arrow-up');
        }else {
            sortType='desc';
            $span.attr('class','arrow-down');
        }
    } else {
        if ($span.hasClass('arrow-down')){
            sortType='desc';
        }else {
            sortType='asc';
        }
    }
    return sortType;
}

SalerDetail.morePost = function (config) {
       var $elem = config.$el;
       var sort = 'create_time';
       var sortType = 'desc';
       var page = 1;
       $elem.click(function(){
           sort = $elem.data('sort');
           sortType = $elem.data('sorttype');
           page = $elem.data('page');
           if(parseInt(page)<1)return; //小于1就代表没数据了，不用在请求服务器了
           $elem.data('page', parseInt(page)+1);
           
           $.ajax({
               type : 'POST',
               url  : '/ajax.php?module=loadMorePost',
               data : {sort:sort,sortType:sortType,page:page,userName:userName},
               dataType : 'json',
               success:function(data){
                   if (data['post_list'].length>0) {
                        $('.carlist').append(PostTpl(data));
                   }else {
                        $elem.text("已全部加载完");
                        $elem.data('page', 0); //设为0 到时判断小于1就代表没数据了，不用在请求服务器了
                   }
                   
                   Common.lazyLoadPic();
               },
           });
       });
};

SalerDetail.start = function (param) {
    param || (param = {});
    if (param) {
        userName = param['userName'];
        pageSize = param['pageSize'];
    }
    Base.init(param);
    Widget.initWidgets();
    Common.lazyLoadPic();
};