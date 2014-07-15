/**
 * @desc 详情页V2
 * @copyright (c) 2014 273 Inc
 * @author chenhan <chenhan@273.cn>
 * @since 2014-02-12
 */
var $ = require('jquery');
var Base = require('app/ms_v2/js/base.js');
var Cookie  = require('util/cookie.js');
var ImageSlide = require('widget/imageSlide/image_slide.js');
var Map = require('widget/map/map.js');
var LazyLoad = require('lib/jquery/plugin/jquery.lazyload.js');
var ShowComment = require('app/ms_v2/js/common/show_comment.js');
var Position = require('widget/position/position.js');
var Map = require('widget/map/map.js');

var Detail = exports;

//extend
$.extend(Detail, Base);

var TAB = {
    DETAIL : 'detail',
    CHECK : 'check',
    ADVISER : 'adviser',
    MAP : 'map'
};

var goToTab = function(type) {
    var $tab = $(Detail.$goTabBar.find('[data-type=' + type + ']'));
    $tab.click();
};

/**
 * 替代hash跳转
 */
var hashJump = function() {
    var $jumpDoms = $('.js_hash_jump');
    $jumpDoms.on('click', function() {
        goToTab($(this).data('jumpType'));
        
        if ($(this).data('jumpFunc') === 'slide') {
            var id = $(this).attr('href'),
                top = $(id).offset().top;
            
            $('html,body').animate({
                scrollTop: top
            }, 1000);
            return false;
        }
    });
};


Detail.topHover = function(config) {
    var $el = config.$el,
        $hover = $el.find('.js_hover');
    $hover.hover(function() {
        $(this).addClass('on');
    }, function() {
        $(this).removeClass('on');
    });
};

/**
 * 判断标题的行数,选择合适的显示方式
 */
Detail.showTitle = function(config) {
    var $el = config.$el,
        $title = $el.find('b');
    $title.height() <= 40 ? $el.addClass('middle') : $el.removeClass('middle');
};

/**
 * 图片轮播
 */
Detail.imageSlide = function(config) {
    var $el = config.$el;
    var imgObj = $el.data('imgJson');
    var slide = new ImageSlide({
        el: $el,
        onClick: function (index, images) {
            goToTab(TAB.DETAIL);
            var id = '#big-pic-' + (index + 1);
            $bImg = $(id);
            var top = $bImg.offset().top;
            $('html,body').animate({
                scrollTop: top 
            }, 1000);
        },
        images: imgObj
    });
};

/**
 * 初始化免费发送到手机
 */
Detail.sendCarMsg = function(config) {
    var $el = config.$el;
    $el.one('click', function() {
        require.async(['app/ms_v2/js/common/send_car_msg.js'], function(SendCarMsg) {
            new SendCarMsg({
                $el : $el,
                id : Detail.id
            });
        });
    });
};

var auth = function () {
    //会员认证信息
    var mt = Cookie.get('MEMBER_TYPE');
    var mu = Cookie.get('MEMBER_NAME');
    if (!mt || !mu || mt==0 || mu==0) {
        return false;
    }
    return {'member_type':mt,'username':mu};
};

/**
 * 收藏车源
 */
Detail.addMyCarInfo = function(config) {
      var $el = config.$el;
      var title = config.title;
      var memberLogin = null;
      $el.on('click', function() {
          var authInfo = Base.auth();
          if (authInfo) {
              $.ajax({
                  url : "http://www.273.cn/index.php?m=Sale&a=addMyCarInfo",
                  type : "get",
                  data : "title=" + title + "&carid=" + Detail.id,
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
                  require.async(['app/ms_v2/js/common/login.js'], function(MemberLogin) {
                      memberLogin = new MemberLogin({
                          $el : $el
                      });
                      memberLogin.show();
                  });
              } else {
                  memberLogin.show();
              }
          }
      });
};

/**
 * 详情页百度分享
 */
Detail.bdShare = function (config) {
    var $el = config.$el;
    Base.bdshare({$el : $el.find('#bdshare')});
    $el.one('mouseenter', function() {
        $el.hover(function() {
            $(this).addClass('share_on');
        }, function() {
            $(this).removeClass('share_on');
        });
        $el.mouseenter();
    });
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

/**
 * 反馈评论
 */
Detail.upComment = function(config) {
    var $el = config.$el;
    $el.one('click', function() {
        require.async(['app/ms_v2/js/common/feed_back.js'], function(FeedBack) {
            var FeedBack = new FeedBack({
                $el : $el,
                id : Detail.id,
                username : Detail.username
            });
        });
    });
};

Detail.carCondition = function(config) {
    var $el = config.$el;
    $el.one('click', function() {
        require.async(['app/ms_v2/js/common/car_condition.js'], function(CarCondition) {
            var carCondition = new CarCondition({
                $el : $el
                , data : $el.data()
            });
        });
    });
};

Detail.depreciate = function(config) {
    var $el = config.$el;
    $el.one('click', function() {
       require.async(['app/ms_v2/js/common/depreciate.js'], function(Depreciate) {
           var depreciate = new Depreciate({
               $el : $el
           });
       });
    });

}

/**
 * 评论展示
 */
Detail.showComment = function(config) {
    var $el = config.$el;
    var showComment = new ShowComment({
        $el : $el,
        username : Detail.username,
        deptId : Detail.deptId
    });
};

/**
 * 看车路线方式切换
 */
Detail.switchSearch = function(config) {
    var $el = config.$el;
    $el.find('a').click( function() {
        $el.find('a').removeClass('current');
        $(this).addClass('current');
        $('#search_type').val($(this).attr('type'));
    });
};

/**
 * 热门滑动
 */
Detail.slideHot = function(config) {
    var $el = config.$el,
        $ul = $el.find('.car_list ul'),
        $posts = $ul.find('li'),
        $page = $el.find('.page'),
        $left = $page.find('.left a'),
        $em = $page.find('em'),
        $right = $page.find('.right a'),
        defnum = $el.data('page') || 0,
        num = 1,
        height = $posts.outerHeight(true) * 2;
    
    $left.on('click', function() {
        if (num > 1 && num < 3) {
            --num;
            $left.addClass('no');
            $em.text(num + '/' + defnum);
            $right.removeClass('no');
            $ul.animate({'top' : $ul.position().top + height}, 500);
        } else if (num >= 3) {
            --num;
            $em.text(num + '/' + defnum);
            $right.removeClass('no');
            $ul.animate({'top' : $ul.position().top + height}, 500);
        }
    });
    
    $right.on('click', function() {
        if (num >= defnum -1 && num < defnum) {
            ++num;
            $right.addClass('no');
            $em.text(num + '/' + defnum);
            $left.removeClass('no');
            $ul.animate({'top' : $ul.position().top - height}, 500);
        } else if (num >= 1 && num < defnum - 1) {
            ++num;
            $em.text(num + '/' + defnum);
            $left.removeClass('no');
            $ul.animate({'top' : $ul.position().top - height}, 500);
        }
    });
};

/**
 * 更多顾问
 */
Detail.moreAdviser = function(config) {
    var $el = config.$el;
    var $ul = $el.prev('ul');
    $el.on('click', function() {
        var $lis = $ul.find('li:hidden');
        $.each($lis, function(i) {
            if (i == 4) {
                return false;
            }
            $(this).show();
        });
        if ($lis.length <= 4) {
            $el.remove();
        } 
    });
};

/**
 * 看车路线地图
 */
Detail.bdmap = function(config) {
    var $el = config.$el;
    var city = config.cityname;
    var point = config.point;

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
            } 
        }

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
        })
    });
};

/**
 * tabs切换
 */
var tabs = function() {
    var $relBar     = $('#js_tabs1'),
        $fixedBar   = $('#fixed_title'),
        $relTabs    = $relBar.find('h2'),
        $fixedTabs  = $fixedBar.find('h2'),
        $detail     = $('.js_tabs_detail'),
        $child      = $detail.children('div'),
        $tabBars    = $relBar.add($fixedBar),
        $tabs       = $relTabs.add($fixedTabs);
    
    $tabs.on('click', function() {
        var me = this,
            target = $(this).data('target');
        
        if ($tabs.index(this) >= $tabs.length / 2) {
            var top = $relBar.offset().top;
            $(window).scrollTop(top);
        }
        if (target) {
            $child.hide();
            $detail.children('.' + target).show();
        } else {
            $child.show();
        }
        
        $tabBars.each(function(i) {
            var $tab = $($(this).find('h2')[$(me).index()]);
            $tab.addClass('on').siblings().removeClass('on');
        });
    });
    
    //fixedTabBar定位到页面头部
    Position.pin({
        el : $fixedBar,
        fixed : true,
        x : 'center',
        y : 'top'
    }, {
        x : 'center',
        y : 'top'
    });
    
    //滚动到一定位置显示fixedTabBar
    $(window).on('scroll', function() {
        var top = $relBar.offset().top;
        if ($(this).scrollTop() >= top) {
            $fixedBar.show();
        } else {
            $fixedBar.hide();
        }
    });
    
};

//浏览量加1
var addPageView = function() {
    $.ajax({
        url : "/ajax.php?module=page_view",
        type : "post",
        data : {post_id : Detail.id}
    });
};

//服务保障弹窗
Detail.serviceDialog = function(config) {
    var $el = config.$el;
    var SEVEN_TPL = 
    '<div class="pop_gua_service">'+
    '<div class="pop_box_content">' +
        '<dl><dt class="clearfix"><i></i><strong>7天无理由退车服务合同注意事项</strong></dt><dd>在签约时请注意，只有带有“273二手车交易网盖章”的合同享受【7天无理由退车】服务哦。详细的规则均在合同。</dd></dl>'+
        '<dl><dt class="clearfix"><i></i><strong>三步即可退车</strong></dt><dd><img src="http://sta.273.com.cn/app/ms_v2/pics/gua_service_pic.png" class="pic"></dd></dl>'+
    '</div>'+
    '</div>';
    var CHECNK_TPL = 
    '<div class="pop_gua_service">'+
    '<div class="pop_box_content">'+
        '<dl><dt class="clearfix"><i></i><strong>什么是车况宝？</strong></dt><dd>车况宝是273为了让车况透明而推出的专业检测服务，主要检测汽车车身外观和结构件，帮助消费者判断二手车是否出过导致结构件损坏的事故。可提供上门检测的移动式服务。车况宝向消费者承诺“检测有误，原价退车”。</dd></dl>'+
        '<dl><dt class="clearfix"><i></i><strong>车况宝检测项目有哪些？</strong></dt><dd>主要项目包括：漆膜厚度、漆面外观、内饰、配置功能、覆盖件、加强件、结构件事故勘察。其中结构件为车况宝承诺项目，包括：前横梁、右前纵梁、右前减震座、右侧A柱、防火墙、右侧B柱、右侧C柱、右后减震座、右后纵梁、后备箱底板、左前纵梁、左前减震座、左侧A柱、驾驶舱底板、左侧B柱、后隔板、后横梁、左侧C柱、左后减震座、左后纵梁；其他项目均不做承诺。</dd></dl>'+
        '<dl><dt class="clearfix"><i></i><strong>怎样获得“原价退车”服务？</strong></dt><dd>委托车况宝检测的车辆，委托方自检测当日起7日内如发现实车结构件与车况宝出具的检测报告有较大不符，可向车况宝提出争议，经车况宝复核人员核实，若确认争议属实，车况宝将依据流程进行退车处理，或根据消费者诉求进行赔付。<br>超过7日，视为放弃主张权利，车况宝将不再受理。</dd></dl>'+
        '<dl><dt class="clearfix"><i></i><strong>如何购买延保服务？</strong></dt><dd>经车况宝检测，车况综合评定符合购买条件的车辆，并符合以下条件的，可向273连锁店申请购买最高一年的延保服务。<br>1、在273成交且在交易当天购买延保服务。<br>2、车辆使用时间须在10年以内，且行驶里程在20万公里内。 <br>3、营运车辆转向非营运车辆不得购买。 </dd></dl>'+
    '</div>'+
    '</div>';
    $el.find('a[data-dialog]').on('click',function() {
        var dialogType = $(this).data('dialog');
        require.async(['widget/dialog/dialog.js'], function(Dialog){
            if (dialogType == 'seven') {
                var dialog = new Dialog({
                        title : '7天无理由退车说明',
                        padding : '0px',
                        escAble : true,
                        skin : 'gray',
                        visible : true,
                        width : 667,
                        content : SEVEN_TPL
                });
            } else if (dialogType == 'free_check') {
                var dialog = new Dialog({
                        title : '免费车况检测说明',
                        padding : '0px',
                        escAble : true,
                        skin : 'gray',
                        visible : true,
                        width : 667,
                        content : CHECNK_TPL
                });
            }
        });
    });
};

Detail.init = function(params) {
    Detail.id = 1 * params.id;
    Detail.username = 1 * params.username;
    Detail.deptId = 1 * params.deptId;
    
    // lazyload
    if ($('.scroll').length != 0) {
        LazyLoad({
            el : '.scroll',
            effect : 'fadeIn',
            data_attribute : 'url', // data-url
            skip_invisible : false,
            load:function(){
                $(this).parents('.lazy_load').removeClass('lazy_load');
            }
        });
    }
    
    tabs();
    Detail.$goTabBar = $('#js_tabs1');
    hashJump();
    
    Base.init(params);
    //浏览量加1
    addPageView();
};