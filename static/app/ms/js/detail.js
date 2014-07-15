/**
 * @desc 详情页
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-06-24
 */
var Base = require('app/ms/js/base.js');
var Cookie  = require('util/cookie.js');
var $ = require('jquery');
var Header = require('app/v3/js/common/header');

// lazyload 
var LazyLoad = require('lib/jquery/plugin/jquery.lazyload.js');

//弹出窗组件
require('lib/jquery/plugin/jquery.overlay.js');
var Detail = exports;

//extend
$.extend(Detail, Base);

//图片滚动区，当前图片下标
var currPicIndex = 1;
//uuid
var uuid = Cookie.get('eqs_uuid');

//图片滚动区
Detail.picShow = function(config) {
    var $elem = $(config.$el);
    var $linkPre = $elem.find('.left_arrow a');
    var $picList = $elem.find('.s_pic img');
    var $linkNext = $elem.find('.right_arrow a');
    //上一张
    $linkPre.click(function() {
        set(-1);
    });
    //下一张
    $linkNext.click(function() {
        set(1);
    });
    //显示当前鼠标移到的图片
    $picList.each(function() {
        $(this).mouseenter(function() {
            set($(this));
        });
    });
    function set(el) {
        var imgs = $elem.find('img[bigimg]');
        var totalPic = imgs.length;
        var bigPic = $elem.find('.b_pic img');
        var c = currPicIndex + el-1;
        var onewidth = $elem.find('#pic-box').parent().width() / 4;
        var currSmallPic = typeof el=='object' ? $(el) : imgs.eq(c>=totalPic ? 0 : c);
        if (!currSmallPic.length) return;
        // 计算偏移
        currPicIndex = imgs.index(currSmallPic) + 1;
        bigPic.attr('src', currSmallPic.attr('bigimg'));
        $elem.find('li.current').removeClass('current');
        currSmallPic.parent().parent().addClass('current');
        $elem.find('.b_pic a').attr('href',currSmallPic.parent().attr('href'));
        if(totalPic > 4){
            if (typeof el != 'object') {
              // 创建动画
              var marginLeft = -(currPicIndex-(el>0 ? 4 : 1))*onewidth;
              marginLeft = marginLeft>0 ? 0 : marginLeft;
              marginLeft = marginLeft<=-onewidth*(imgs.length-4) ? -onewidth*(imgs.length-4) : marginLeft;
              $elem.find('#pic-box').stop().animate({ 'marginLeft': marginLeft+"px" }, 'slow');
          }
        }
    }
};

/**
 * 了解分期购车
 */
Detail.instalments = function(config) {
    var $el = config.$el;
    var price = config.price;
    $el.one('click', function() {
        require.async(['app/ms_v2/js/common/instalments.js'], function(Instalment) {
            var instalment = new Instalment({
                $el : $el,
                price : price
            });
        });
    });
};

//看车路线方式切换
Detail.switchSearch = function(config) {
    var $elem = $(config.$el);
    $elem.find('a').click( function() {
        $elem.find('a').removeClass('current');
        $(this).addClass('current');
        $('#search_type').val($(this).attr('type'));
    });
};

//详情页百度分享
Detail.bdShare = function (config) {
    var $elem = $(config.$el);
    Base.bdshare({$el : $elem.find('#bdshare')});
    $elem.one('mouseenter', function() {
        $elem.hover(function() {
            $(this).addClass('on');
        }, function() {
            $(this).removeClass('on');
        });
        $elem.mouseenter();
    });
};

//初始化反馈评论
Detail.openCarComment = function(config) {
    var $el = config.$el;
    $el.one('click', function() {
        require.async(['app/ms/js/common/feed_back.js'], function(FeedBack) {
            new FeedBack($el, {id: '#js_feed_back'});
        });
    });
}

Detail.closeWorstTip = function(config) {
    var $el = config.$el;
    var $close = $el.find('.close');
    $close.on('click', function() {
        $el.remove();
    });
}

//更多顾问
Detail.moreScorePost = function(config) {
    var $elem = $(config.$el);
    var $fourth = $('#fourth');
    var $lasth = $('#lasth');
    $elem.click(function(){
        $('.more_list').show();
        $lasth.addClass('last');
        $fourth.removeClass('last');
        $('.view_more').hide();
    });
}

//用户评价分页事件
$(".evaluatepager").live('click', function() {
    $.ajax({
        type:"get",
        url:'/ajax.php?module=comment&a=getcommentlimit',
        data:{pn:$(this).attr('pn'),ps:$(this).attr('ps'),user_id:$(this).attr('user_id')},
        beforeSend:function(){
            var height = $("#car_info_comment ul")[0].offsetHeight-100;
            if(height > 300) {
                height -=90;
            }
            $("#car_info_comment ul").append("<span id='lazy_loading' style='padding-left:370px;position: absolute;top: "+height+"px;'><img src='http://sta.273.com.cn/app/ms/images/lazy_loading.gif'/></span>");
        },
        dataType : "html",
        cache: true,
        success : function(data) {
            removeul();
            $("#car_info_comment ul span#lazy_loading").remove();
            $("#car_info_comment ul ").append(data);
        }
});
});
//门店评价分页事件
$(".deptevaluatepager").live('click', function() {
    $.ajax({
        type:"get",
        url:'/ajax.php?module=comment&a=getcommentdept',
        data:{pn:$(this).attr('pn'),ps:$(this).attr('ps'),dept_id:$(this).attr('dept_id')},
        beforeSend:function(){
            var height = $("#car_info_comment ul")[0].offsetHeight-100;
            if(height > 300) {
                height -=90;
            }
            $("#car_info_comment ul").append("<span id='lazy_loading' style='padding-left:370px;position: absolute;top: "+height+"px;'><img src='http://sta.273.com.cn/app/ms/images/lazy_loading.gif'/></span>");
        },
        dataType : "html",
        success : function(data) {
            removedeptul();
            $("#car_info_comment ul span#lazy_loading").remove();
            $("#car_info_comment ul ").append(data);
        }
   });
});
function removeul(){
    $("#car_info_comment  ul li.pj-user").each(function(){
        $(this).remove();
        });
}

function removedeptul(){
    $("#car_info_comment ul li.pj-dept").each(function(){
        $(this).remove();
        });
}

function showDept() {
    $("#car_info_comment ul li.pj-dept").each(function() {
        $(this).show();
    });
}

function showUser() {
    $("#car_info_comment ul li.pj-user").each(function() {
        $(this).show();
    });
}

function hideDept() {
    $("#car_info_comment ul li.pj-dept").each(function() {
        $(this).hide();
    });
}

function hideUser() {
    $("#car_info_comment ul li.pj-user").each(function() {
        $(this).hide();
    });
}
/**
 * 选择车源评价tab
 */
Detail.selectCommentType = function(config) {
    var $el = config.$el;
    
    var $tabs = $el.find('.tabs');
    $tabs.on('click', selectComTypeEvent);
    
    //选择车源评价类型事件
    function selectComTypeEvent() {
        $(this).addClass('on').siblings().removeClass('on');
        var type = $(this).data('type');
        if(type == 'user') {
            showUser();
            hideDept();
        } else if(type == 'dept'){
            var $this = $("#car_info_comment ul li.pj-dept"); 
            if($this.length == 0) {
                //加载
            $.ajax({
            type:"get",
            url:'/ajax.php?module=comment&a=getcommentdept',
            data:{dept_id:$el.data('deptid')},
            beforeSend:function(){
                $("#car_info_comment ul").append("<span id='lazy_loading' style='padding-left:370px;'><img src='http://sta.273.com.cn/app/ms/images/lazy_loading.gif'/></span>");
            },
            dataType : "html",
            success : function(data) {
                    removedeptul();
                    $("#car_info_comment ul span#lazy_loading").remove();
                    $("#car_info_comment ul ").append(data);
                }
            });
            }
            hideUser();
            showDept();
        }

    }
}
//显示车源排名和成交量排名
Detail.myRank = function(config) {
    var $elem = $(config.$el);
    var $elSaleNum = $elem.find("#sale_num");
    var $elSaleRank = $elem.find("#sale_rank");
    $elSaleNum.mouseenter(function(){
        $elSaleRank.addClass('on');
        $elSaleRank.show();
    });
    $elSaleRank.mouseleave(function(){
        $(this).removeClass('on');
        $(this).hide();
    });
};

Detail.bdmap = function (config) {

    var $el = $(config.$el);
    var city = config.cityname;
    var point = config.point;

    G.use(['widget/map/map.js'], function (Map) {

        var map = Map.create({
            el : '#bdMap',
            center : point,
            city : city
        });

        map.ready(function () {
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

            function callback (results) {
                var type = $el.find('#search_type').val();
                var route = type === 'gj' ? transit : driving;
                if (route.getStatus() !== BMAP_STATUS_SUCCESS) {
                    $('#mst_result').html('未找到合适的路线');
                } 
            }

            $('#map_search').click(function () {
                var type = $el.find('#search_type').val();
                var start = $('#qidian').val();

                $('#ms_result').html('');
                $('#mst_result').html('');
                if (!$.trim(start)) {
                    $('#mst_result').html('请输入起点');
                    return;
                }
                if ( type === 'gj') {
                    transit.search(start, point);
                } else {
                    driving.search(start, point);
                }
            })
        });
    });

};
/**
 * 初始化免费发送到手机
 */
Detail.initSendCarMsg = function(config) {
    var $el = config.$el;
    $el.one('click', function() {
        require.async(['app/ms/js/common/send_car_msg.js'], function(SendMsg) {
            new SendMsg($el, {id: '#js_send_car_msg'});
        });
    });
};

//收藏车源
Detail.addMyCarInfo = function(config) {
      var $el = $(config.$el);
      var $title = config.title;
      var $carid = config.carid;
      var memberLogin = null;
      $el.click(function() {
          var authInfo = Auth();
          if (authInfo) {
              $.ajax({
                  url : "http://www.273.cn/index.php?m=Sale&a=addMyCarInfo",
                  type : "get",
                  data : "title=" + $title + "&carid=" + $carid,
                  dataType : 'jsonp',
                  success : function(msg) {
                      if (msg == 1) {
                          alert('收藏成功');
                      } else if (msg == 2) {
                          alert('你已经收藏过该车源信息');
                      } else {
                          alert('收藏失败');
                      }
                  }
              });
          } else {
              //没有登录则加载登录窗口登录
              if (!memberLogin) {
                  require.async(['app/ms/js/common/login.js'], function(MemberLogin) {
                      memberLogin = new MemberLogin($el, {id : '#js_login'});
                      memberLogin.showLogin($el);
                  });
              } else {
                  memberLogin.showLogin($el);
              }
          }
      });
};

var Auth = function () {
    //会员认证信息
    var mt = Cookie.get('MEMBER_TYPE');
    var mu = Cookie.get('MEMBER_NAME');
    if (!mt || !mu || mt==0 || mu==0) {
        return false;
    }
    return {'member_type':mt,'username':mu};
}

//导航悬浮
function fixnavbar(){
    if ($('.car-info-box').length>4) {
        $("#title_float .title_style .call").css("marginLeft","0px");
    }
    $.fn.capacityFixed = function(options) {
        var opts = $.extend({},$.fn.capacityFixed.deflunt,options);
        var FixedFun = function(element) {
            var top = opts.top;
            var right = ($(window).width()-opts.pageWidth)/2+opts.right;
            element.css({
                "right":right,
                "top":top
            });
            $(window).resize(function(){
                var right = ($(window).width()-opts.pageWidth)/2+opts.right;
                element.css({
                    "right":right
                });
            });
            $(window).scroll( function() {
                var scrolls = $(this).scrollTop();
                if (scrolls > top) {
                    if (window.XMLHttpRequest) {
                        element.css({
                            position: "fixed",
                            top: 0
                        });
                    } else {
                        element.css({
                            top: scrolls
                        });
                    }
                    $('#title_float').show();
                    //滑动切换menu
                    $('.js_tap').each(function(){
                        var n = $('.js_tap').index($(this));
                        var len = $('.js_tap').size();
                        var m = $(this).offset().top;
                        if(scrolls > m - 32 || (len-1 == n && scrolls>=$(document).height()-$(window).height())){
                            $("#title_float .js_show_tap").removeClass("current");
                            $('#title_float .js_show_tap:eq('+n+')').addClass("current");
                        }else{
                            
                        }
                    });
                } else {
                    $("#title_float").hide();
                    element.css({
                        position: "absolute",
                        top: top
                    });
                }
            });
        };
        return $(this).each( function() {
            FixedFun($(this));
        });
    };
    $.fn.capacityFixed.deflunt={
            left:0,
            right : 0,//相对于页面宽度的右边定位
            top:$('#car_info_base').offset().top,
            pageWidth : 988
    };
    $("#title_float").capacityFixed();
}

Detail.checkHover = function(config) {
    var $elem = $(config.$el);
    $elem.hover(function() {
        $("#ckb-dec").show();
    }, function() {
        $("#ckb-dec").hide();
    });
};

//更多交易顾问列表url跳转
Detail.moreSalerClick = function(config) {
    var $elem = config.$el;
    $elem.find('li').click(function(e){
        var $target = $(e.target);
        var flag = $target.data('flag');
        if (!flag) {
            window.open($(this).data('url'));
        }
    });
};

Detail.start = function (param) {
    Base.init(param);
    Header.init();
    
    // lazyload
    LazyLoad({
        el : '.scroll',
        effect : 'fadeIn',
        data_attribute : 'url', // data-url
        threshold : 100         // 100px预加载
    });

    fixnavbar();

    //图片预加载
    var $images = G.config('image') || [];
    var $bigImg = G.config('big_image') || [];
    var $imgObj = new Image();
    $.each($images, function(i,val){
        $imgObj.src = val;
    });
    $.each($bigImg, function(i,val){
        $imgObj.src = val;
    });
};