/**
 * @desc 页面基类
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-06-24
 */

// dependences
var $ = require('jquery');
var Log    = require('util/log.js');
var Uuid   = require('util/uuid.js');
var Widget = require('lib/widget/widget.js');
var Hover  = require('app/common/hover.js');


// public
var Base = exports;

// 订阅
Base.rss = function (config) {

    var $el = config.$el;
    $el.one('mouseenter', function() {
        require.async(['app/ms/js/common/rss.js'], function(Rss) {
            new Rss($el, {id : '#chewuzhi'});
        });
    });
};

// 收藏
Base.favor = function (config) {

    var $el = config.$el;

    $el.on('click', function () {

        require.async(['app/common/favorite.js'], function (Favor) {

            Favor.add();
        })
    });
};

// 百度分享
Base.bdshare = function (config) {

    var $el = config.$el;

    var doc = document;

    window.bds_config = {

        bdText : '#273二手车交易网#' + document.title
    };

    $el.attr('id', 'bdshare');

    var shareNode = doc.createElement("script");
    var shellNode = doc.createElement("script");
    var url = 'http://bdimg.share.baidu.com/static/js/shell_v2.js?cdnversion=' + Math.ceil(new Date()/3600000);

    shareNode.setAttribute('type', 'text/javascript');
    shareNode.setAttribute('id', 'bdshare_js');
    shareNode.setAttribute('data', 'type=button&amp;uid=688050');

    shellNode.setAttribute('type', "text/javascript");
    shellNode.setAttribute('id', 'bdshell_js');

    var headNode = doc.getElementsByTagName("head")[0];

    headNode.appendChild(shareNode);
    headNode.appendChild(shellNode);

    shellNode.src = url;
};

// 导航
Base.nav = function (config) {
    var $el = config.$el;
    var $target = config.$target;
    Hover($el, {target : $target});
};

// 返回顶部
Base.scrollTop = function (config) {

    var $el = config.$el;
    var $top = $el.find('.js-uptop');
    var $win = $(window);

    function show() {
        $top.css('visibility', 'visible');
    }

    function hide() {
        $top.css('visibility', 'hidden');
    }

    $win.scroll(function () {

        if ($win.scrollTop() > $win.height() / 2) {
            show();
        } else {
            hide();
        }

    }).resize(function () {
        var rspace = ($win.width() - 990) / 2;
        var right  = rspace - (5 + 58);
        var qright = rspace - (10 + 110);

        if (right > 0) {
            $el.css('right', right);
            $el.show();
        } else {
            $el.hide();
        }
        if (qright > 0) { // qrcode
            $('#m-uptop').css('right', qright);
            $('#m-uptop').show();
        } else {
            $('#m-uptop').hide();
        }
    });

    $top.click(function () {
        window.scroll(0, 0);
        $win.scroll();
        return false;
    });

    $win.resize().scroll();
};

// 顶部banner广告
Base.adBanner = function (config) {

    var $el = config.$el;
    var $close = $el.find('.js-close');

    $close.click(function () {
        $el.slideUp();
    });
};

//热门车系
Base.hotVehicle = function () {

    var $charactors = $('#friend_link .content ul li.zimu a');

    $charactors.each(function () {
        var $hoverChar = $(this).html().toLowerCase();
        var $hotVehicles = $('ul.vehicle_' + $hoverChar);
        $(this).mouseover(function () {
            $(this).css({'text-decoration':'none','background':'#f60','border-color':'#f50','color':'#fff'});
            $(this).siblings().css({'display':'block','color':'black','float':'left','width':'18px','height':'18px','line-height':'18px','border':'1px solid #ccc','background':'#f5f5f5','text-align':'center','font-size':'14px'});
            $hotVehicles.show();
            $hotVehicles.siblings().hide();
        });
    });
};

// 二维码
Base.QrCode = function (config) {

    var $el = config.$el;
    var $close = $el.find('#js-qrcode-close');

    $close.click(function(){
        $el.hide();
    });
};

// 网站临时维护通告
Base.maintenance = function (config) {

    var $el = config.$el;
    var $close = $el.find('.js-close');

    $close.click(function(){
        $el.hide();
    });
};

Base.toggleClass = function (config) {
    var $el = config.$el;
    $el.on('mouseover', function() {
        $(this).addClass('bg');
    })
    $el.on('mouseout', function() {
        $(this).removeClass('bg');
    })
};

Base.searchSubmit = function (config) {
    var $el = config.$el;
    $el.submit(function(){
        var kw = $(this).find('#kw').val();
        var to = $(this).prop('action');
        var eqslog = '/search/log@etype=enter'+'@kw=' + kw + '@to=' + to + '@count=-1';
        Log.trackEventByGjalog(eqslog, null, 'click');
    });
};

//热门城市
Base.changeCity = function (config) {
    var $el = config.$el;
    $("#head .city").hover(function(){
        //判断是否已经存在
        $exist = $(this).find(".down").children().length;
        if(!$exist) {
            $.ajax({
                type:'GET',
                url:'/ajax.php?module=change_city',
                data:{province:$el.attr('province'),name:$el.attr('domainName')},
                dataType:'JSON',
                success :function(data) {
                    var $html ='';
                    $html = returnHtml(data,$el.attr('flagCityList'));
                    if($("#head .city .down").find('dl').length  == 0) {
                        $("#head .city .down").append($html);
                    }
                }
                });
        }
      $(this).addClass('city_on');
      $(this).find(".down").css("display","block");
        },
        function () {
            $(this).find(".down").css("display","none");
            $(this).removeClass('city_on');
        }
    );

    function returnHtml(data,$flag) {
        var $html ='';
        var $sale = $flag.length !=0 ? $flag :'/';
        if (data['city'].length) {
            $html +='<dl class="d1 clearfix" data-273-click-log="/city@etype=click@city=zbcs">';
            $html +='<dt>周边省市</dt>';
            for ( i = 0 ,count =data['city'].length; i<count; i++) {
                  if (data['city'][i]['name'] == data['currentName']) {
                  $html +='<dd><a class="current" data-273-click-log="/city@etype=click@city='+data['city'][i]["domain"]+'" href="http://'+data['city'][i]["domain"]+'.273.cn'+$sale+'">'+data['city'][i]["name"]+'</a></dd>';
                  } else {
                    $html +='<dd><a data-273-click-log="/city@etype=click@city='+data['city'][i]["domain"]+'" href="http://'+ data['city'][i]["domain"]+'.273.cn'+$sale+'">'+data['city'][i]["name"]+'</a></dd>';
                  }
            }
            $html +='</dl>';
       }
       if(data['hot'].length) {
         $html +='<dl class="clearfix" data-273-click-log="/city@etype=click@city=rmcs">';
         $html +='<dt>热门省市</dt>';
         for ( i = 0 ,count = data['hot'].length; i<count; i++) {
             $html +='<dd><a data-273-click-log="/city@etype=click@city='+data['hot'][i]["domain"]+'" href="http://'+ data['hot'][i]["domain"]+'.273.cn'+$sale+'">'+ data['hot'][i]["name"]+'</a></dd>';
         }
         $html +='</dl>';
       }
       $html +='<div class="more"><a data-273-click-log="/city@etype=click@city=more" href="http://www.273.cn'+$sale+'city.html">更多省市</a></div>';
       return $html;
    }
};

//热门车系
Base.hotVehicle = function () {
    var $charactors = $('#friend_link .content ul li#series a');
    var $seriesLinks = $('#friend_link .content ul li#series_links a').attr('target','_blank');
    $charactors.each(function () {
        var $hoverChar = $(this).html().toLowerCase();
        var $hotVehicles = $('ul.vehicle_' + $hoverChar);
        $(this).mouseover(function () {
            $(this).addClass('on');
            $(this).siblings().removeClass('on');
            $hotVehicles.show().css("margin-left", "-5px");
            $hotVehicles.siblings().hide();
        });
    });
    
    
    //热门品牌
    var $charactors2 = $('#friend_link .content ul li#brand a');
    var $brandLinks = $('#friend_link .content ul li#brand_links a').attr('target','_blank');
    $charactors2.each(function () {
        var $hoverChar = $(this).html();
        var $hotBrand = $('ul.' + $hoverChar);
        $(this).mouseover(function () {
            $(this).addClass('on');
            $(this).siblings().removeClass('on');
            $hotBrand.show().css("margin-left", "-5px");
            $hotBrand.siblings().hide();
        });
    });
};

Base.init = function (param) {
    //导航提取target='_blank'
    $('#daohang li a').attr('target','_blank');
    param || (param = {});
    Uuid();
    Widget.initWidgets();
    Log.init(param['eqsch']);
};


