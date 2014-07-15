/**
 * @desc wap车源详情页
 * @copyright (c) 2013 273 Inc
 * @author 陈朝阳 <chency@273.cn>
 * @since 2013-06-24
 */

var $ = require('lib/zepto/zepto-1.0.js');
var Widget = require('app/wap/js/common/widget.js');
var Base = require('app/wap/js/sale/base.js');
var _ = require('lib/underscore/underscore.js');
var Detail = exports;
_.extend(Detail, Base);

//百度地图自定义消息框
require('app/wap/js/util/InfoBox.js');
//百度地图自定义html
var infoBoxHtml = '';

var curPicIndex = 0;
//详情页顶部图片滑动
Detail.swipePic = function (config){
    var $elem = config.$el;
    var curIndex = 0;
    var blockWidth = 312;
    var blockCount = Math.ceil(config.count/3);
    var $picUl = $elem.find('ul');
    var $imgs = $elem.find('img');
    var marginLeft = 0;
    loadImg(); //预加载图片
    $elem.swipeLeft(function(){
        if (curIndex==(blockCount-1)) {
            return;
        }
        curIndex = (curIndex + 1) % blockCount;
        loadImg();
        marginLeft = curIndex * blockWidth;
        $picUl.animate({ 'marginLeft': -marginLeft+"px" }, 'fast');
        $('.plan .current').removeClass('current');
        $('.plan a').eq(curIndex).addClass('current');
    });
    $elem.swipeRight(function(){
        if (curIndex==0) {
            return;
        }
        curIndex = (curIndex - 1 + blockCount) % blockCount;
        loadImg();
        marginLeft = curIndex * blockWidth;
        $picUl.animate({ 'marginLeft': -marginLeft+"px" }, 'fast');
        $('#point_small .current').removeClass('current');
        $('#point_small a').eq(curIndex).addClass('current');
    });
    //显示当前鼠标移到的图片
    $imgs.each(function(index) {
        $(this).click(function() {
            curPicIndex = index;
            $('#main').hide();
            $('#viewBigImagebg').css('height','100%');
            $('#viewBigImagebg').show();
            $('#viewBigImage').show();
            centerDisplay('.bigimg_box');
            showPic($('#viewBigImage ul').find('img'), true);
        });
    });
    //图片预加载
    function loadImg() {
        var start = curIndex * 3;
        var end = (config.count > (start+3)) ? start+3 : config.count;
        for (var i = start; i < end; i++){
            var img = $imgs[i];
            if (img.src != img.getAttribute("ref")) {
                img.src = img.getAttribute("ref");
            }
        }
    }
};

Detail.swipeBigPic = function (config) {
    var $elem = config.$el;
    var $imgs = $elem.find('img');
    var length = $imgs.length;
    $elem.swipeLeft(function(){
        if (curPicIndex==(length-1)) {
            return;
        }
        curPicIndex = (curPicIndex + 1) % length;
        showPic($('#viewBigImage ul').find('img'), false);
    });
    $elem.swipeRight(function(){
        if (curPicIndex==0) {
            return;
        }
        curPicIndex = (curPicIndex - 1) % length;
        showPic($('#viewBigImage ul').find('img'), false);
    });
    $elem.find('.btn_back').click(function() {
        $('#main').show();
        $('#viewBigImagebg').hide();
        $('#viewBigImage').hide();
    });
    //屏幕旋转事件
    $(window).on('orientationchange', function() {
        setTimeout(function () {
            centerDisplay('.bigimg_box');
        }, 400);
    });
};

Detail.bdMap = function (config) {
    var $elem = config.$el;
    var shopPoint = config.point;
    $elem.click(function(){
        $('#main').hide();
        $('#viewmap').show();
        $('#address').height($(window).height());
        var map = new BMap.Map("address");                        // 创建Map实例
        if (shopPoint) {
            var srr = shopPoint.split(/,|，/);
            var point = new BMap.Point(parseFloat(srr[0]),parseFloat(srr[1]));
            map.centerAndZoom(point, 16);     // 初始化地图,设置中心点坐标和地图级别
            var marker = new BMap.Marker(point);
            map.addOverlay(marker);         //添加中心点标志
            map.addControl(new BMap.NavigationControl({type:BMAP_NAVIGATION_CONTROL_ZOOM}));// 添加平移缩放控件
            
            var opts = {
                width : 150,
                enableCloseOnClick:false
            };
            var info = infoBoxHtml;
            var infoWindow = new BMap.InfoWindow(info, opts);
            marker.openInfoWindow(infoWindow);
            /*
            var infoBox = new BMapLib.InfoBox(map,infoBoxHtml.join(""),{
                            boxStyle:{
                                //background:"url('tipbox.gif') no-repeat center top",
                                 width: "300px",
                                 height: "60px"
                            }
                            ,offset:new BMap.Size(0,10)
                            ,enableAutoPan: true
                            ,align: BMapLib.INFOBOX_AT_TOP
                        });
                        
                        infoBox.open(marker);*/
            
        }
    });
    //地图返回事件
    $('#viewmap .btn_back').click(function(){
        $('#main').show();
        $('#viewmap').hide();
    });
    $(window).on('orientationchange', function() {
        setTimeout(function () {
             $('#address').height($(window).height());
        }, 400);
    });
};

//相同价格帖子和相同品牌帖切换
Detail.tapMore = function(config){
    var $elem = config.$el;
    $spans = $elem.find('.carlist-tab span');
    $spans.click(function(){
        var index = $spans.index($(this));
        $spans.removeClass('on');
        $(this).addClass('on');
        if (index == 0) {
            $elem.find('#more_family').hide();
            $elem.find('#more_price').show();
        } else if(index == 1) {
            $elem.find('#more_family').show();
            $elem.find('#more_price').hide();
        }
    });
};

function showPic($imgs,click) {
    var img = $imgs[curPicIndex];
    if (img.src != img.getAttribute("ref")) {
        img.src = img.getAttribute("ref");
    }
    var marginLeft = curPicIndex * 320;
    if (click) {
        //点击详情页小图时不使用动画
        $('#viewBigImage ul').css({'margin-left': -marginLeft+"px"});
    } else {
        //侧滑大图时使用动画
        $('#viewBigImage ul').animate({ 'marginLeft': -marginLeft+"px" }, 'fast');
    }
    $('#point_big .current').removeClass('current');
    $('#point_big a').eq(curPicIndex).addClass('current');
}
function centerDisplay(id) {
    var div = $(id);
    var winHeight = $(window).height();
    var divHeight = div.height();
    var top = (winHeight - divHeight) / 2 + $(window).scrollTop();
    div.css({ top: top + "px"});
}
Detail.start = function (param) {
    param || (param = {});
    if (param) {
        infoBoxHtml = param['infoBox'];
    }
    Base.init(param);
    Widget.initWidgets();
};