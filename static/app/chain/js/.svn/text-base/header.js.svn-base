/**
 * @desc 门店头部js
 * @copyright (c) 2014 273 Inc
 * @author 陈朝阳<chency@273.cn>
 * @since 2014-06-10
 */

var Header = exports;
var $ = require('jquery');
var Map = require('widget/map/map.js');
var MapTpl = require('app/chain/tpl/shop_map.tpl');

Header.comment = function() {
    $('.js_comment').hover(function(){
        $(this).toggleClass('on');
    });
    $('#shop-good').click(function() {
        location.href = $('#shop-comment-url').val();
    });

    $('#shop-bad').click(function() {
        location.href = $('#shop-comment-url').val() + '#';
    });

    $('#adviser-good').click(function() {
        location.href = $('#adviser-comment-url').val();
    });

    $('#adviser-bad').click(function() {
        location.href = $('#adviser-comment-url').val() + '#';
    });

    var currentUrl = window.location.href;
    if (currentUrl.indexOf('#') >= 0) {
            $('#stores_eva h2:eq(2)').trigger('click');
    } else {
            $('#stores_eva h2:eq(1)').trigger('click');
    }
};

/**
 * 看车路线地图
 */
var bdmap = function(mapinfo) {
    var $el = $('#js_map');
    var city = mapinfo.city_name;
    var point = mapinfo.shop_point;
    var contentHeight = $('.ui-dialog-content').height();
    
    $el.find('.find h6 a').click( function() {
        $el.find('a').removeClass('current');
        $(this).addClass('current');
        $('#search_type').val($(this).attr('type'));
    });
    
    var map = Map.create({
        el : '#bdMap',
        center : point,
        city : city
    });

    map.ready(function() {
        $('#bdMap').removeClass('lazy_load');
        point = Map.formatPoint(point);
        this.addControl({ctype:'navigation', type : BMAP_NAVIGATION_CONTROL_ZOOM});
        this.addOverlay({
            type : 'marker',
            point: point
        });
        this.initAutoComplete({
            el : $('#qidian')[0]
        });
        var transit = this.initRoute({
            el : '#ms_result',
            onSearchComplete : callback
        });
        var driving = this.initRoute({
            el : '#ms_result',
            type : 'driving',
            onSearchComplete : callback,
            policy : BMAP_DRIVING_POLICY_LEAST_TIME
        });

        function callback(results) {
            var type = $el.find('#search_type').val();
            var route = type === 'gj' ? transit : driving;
            if (route.getStatus() !== BMAP_STATUS_SUCCESS) {
                $('#mst_result').html('未找到合适的路线');
            } else {
                $('.ui-dialog-content').css({height: contentHeight, overflowY: "scroll"});
            }
        }
        //单击查找路线
        $('#map_search').click(function() {
            var type = $el.find('#search_type').val();
            var start = $('#qidian').val();

            $('#ms_result').html('');
            $('#mst_result').html('');
            if (!$.trim(start)) {
                $('#mst_result').html('请输入起点');
                return;
            }
            if (type === 'gj') {
                transit.search(start, point);
            } else {
                driving.search(start, point);
            }
        });

    });
};

//地图弹窗
Header.mapDialog = function(config) {
    var $el = config.$el;
    var mapInfo = {};
    mapInfo.data = config.mapinfo;
    $el.on('click',function() {
        require.async(['widget/dialog/dialog.js'], function(Dialog){
            var dialog = new Dialog({
                    title : '看车路线',
                    padding : '0px',
                    escAble : true,
                    skin : 'gray',
                    visible : true,
                    width : 990,
                    scrollAble:false,
                    content : MapTpl(mapInfo)
            });
            dialog.ready(function () {
                bdmap(config.mapinfo);
            });
        });
    });
};

//全站与本店搜索切换
Header.searchHover = function(config) {
    var $el = config.$el;
    var $ul = $el.find('ul');
    $el.hover(function () {
            $ul.show();
        },
        function () {
            $ul.hide();
        }
   );
   $el.find('ul li').click(function(){
       var domain = $(this).data('domain');
       $('#search_domain').val(domain);
       $el.find('span').html($(this).find('a').html());
       $ul.hide();
       $('#stores_search').find('form').attr('action','http://'+domain+'.273.cn/car/');
   });
};
