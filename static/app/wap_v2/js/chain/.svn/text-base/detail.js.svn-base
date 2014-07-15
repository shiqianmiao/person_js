/**
 * @desc 门店详情页
 * @copyright (c) 2013 273 Inc
 * @author 陈朝阳 <chency@273.cn>
 * @since 2013-07-24
 */
var Detail = exports;
var Widget = require('app/wap_v2/js/common/widget.js');

var Base = require('app/wap_v2/js/sale/base.js');
var _ = require('lib/underscore/underscore.js');
var Common = require('app/wap_v2/js/common/common.js');

_.extend(Detail, Base);

Detail.bdMap = function (shopPoint,infoBox) {
    $('#map_img').click(function(){
        // $('#store_info').hide();
       
        // $('#bottom-call').hide();
        $('#main').hide();
        $('#pageheader').hide();
        // $('#footer').hide();
        // $('#viewmap').siblings('div').hide();
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
                height: 30,
                enableCloseOnClick:false
            };
            var info = infoBox;
            var infoWindow = new BMap.InfoWindow(info, opts);
            marker.openInfoWindow(infoWindow);
        }
    });
    //地图返回事件
    $('#viewmap .btn_back').click(function(){
        // $('#store_info').show();
        // $('#bottom-call').show();
        // $('#pageheader').show();
        // $('#footer').show();
        // $('#viewmap').siblings('div').show();
        $('#main').show();
        $('#pageheader').show();
        $('#viewmap').hide();
    });
    
    $(window).on('orientationchange', function() {
        setTimeout(function () {
             $('#address').height($(window).height());
        }, 400);
    });
};

//门店详情页，门店信息与门店车源切换
Detail.tap = function (config) {
    var $elem = config.$el;
    $spans = $elem.find('span');
    $spans.click(function(){
        var index = $spans.index($(this));
        $spans.find("a").removeClass('active');
        $(this).find("a").addClass('active');
        if (index == 0) {
            $('#store_car').hide();
            $('#store_info').show();
        } else if(index == 1) {
            $('#store_car').show();
            $('#store_info').hide();
            Common.lazyLoadPic();
        }
    });
};

//门店车源翻页
Detail.page = function (config) {
    var $elem = config.$el;
    var chain_id = $elem.data('chainid');
    $elem.delegate('.page a', 'click', function(){
        var page = $(this).data('page');
        if (page > 0) {
            getPostByPage(page);
        }
    });
    
    $elem.delegate('.page select', 'change', function(){
        var page = $(this).val();
        if (page > 0) {
            getPostByPage(page);
        }
    });
    
    var getPostByPage = function(page) {
        $.ajax({
                type: 'POST',
                url: '/ajax.php?module=getPostByPage',
                data: {page: page,chain_id:chain_id},
                dataType: 'html',
                timeout: 2000,
                success: function(data){
                    if (data) {
                        $('#store_car').html(data);
                        Common.lazyLoadPic();
                    }
                },
                error: function(xhr, type){
                    //alert('数据载入错误');
                }
        });
    };
};

Detail.start = function (param) {
    param || (param = {});
    if (param.point) {
        Detail.bdMap(param.point,param.infoBox);
    }
    Base.init(param);
    Widget.initWidgets();
};