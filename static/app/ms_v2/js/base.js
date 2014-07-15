/**
 * @desc 页面基类
 * @copyright (c) 2014 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-06-24
 */

// dependences
var $ = require('jquery');
var Log    = require('util/log_v2.js');
var Uuid   = require('util/uuid_v2.js');
var Widget = require('lib/widget/widget.js');
var Hover  = require('app/common/hover.js');
var AutoComplete = require('widget/autocomplete/autocomplete_v2.js');
var Cookie  = require('util/cookie.js');

// public
var Base = exports;

//统计对象
Base.log = null;
// 收藏
Base.favor = function (config) {

    var $el = config.$el;

    $el.on('click', function () {

        require.async(['app/common/favorite.js'], function (Favor) {

            Favor.add();
        });
    });
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

    $win.on('scroll', function () {
        if ($win.scrollTop() > window.screen.availHeight) {
            $top.show();
        } else {
            $top.hide();
        }
    });

    $top.click(function () {
        $('html, body').animate({
            scrollTop : '0px'
        }, 500);
    });

    $win.scroll();
};

//城市切换
Base.changeCity = function (config) {
    var $el = config.$el;
    var $cityDiv = $el.find(".down");
    var timer = null;
    $el.hover(function() {
        timer = setTimeout(display, 200);
    }, function() {
        clearTimeout(timer);
        hideCity();
    });
    function display(){
        //判断是否已经存在
        var exist = $cityDiv.children().length;
        if(!exist) {
            $.ajax({
                type:'GET',
                url:'/ajax.php?module=change_city',
                data:{province:$el.attr('province'),name:$el.attr('domainName')},
                dataType:'JSON',
                success :function(data) {
                    var $html ='';
                    $html = returnHtml(data, $el.attr('flagCityList'));
                    $cityDiv.append($html);
                    $el.addClass('city_on');
                    $cityDiv.css("display","block");
                }
            });
        } else {
            $el.addClass('city_on');
            $cityDiv.css("display","block");
        }
    }
    function hideCity(){
        $cityDiv.css("display","none");
        $el.removeClass('city_on');
    }
    function returnHtml(data,$flag) {
        var $html ='';
        var $sale = $flag.length !=0 ? $flag :'/';
        if (data['city'].length) {
            $html +='<dl class="d1 clearfix" data-273-click-log="/city@etype=click@city=zbcs">';
            $html +='<dt>周边省市</dt>';
            for ( i = 0 ,count =data['city'].length; i<count; i++) {
                  if (data['city'][i]['name'] == data['currentName']) {
                  $html +='<dd><a class="current" data-273-click-log="/city@etype=click@city='+data['city'][i]["domain"]+'" title="' + data['city'][i]['name'] +'" href="http://'+data['city'][i]["domain"]+'.273.cn'+$sale+'">'+data['city'][i]["name"].substring(0, 4)+'</a></dd>';
                  } else {
                    $html +='<dd><a data-273-click-log="/city@etype=click@city='+data['city'][i]["domain"]+'" title="' + data['city'][i]['name'] +'" href="http://'+ data['city'][i]["domain"]+'.273.cn'+$sale+'">'+data['city'][i]["name"].substring(0, 4)+'</a></dd>';
                  }
            }
            $html +='</dl>';
       }
       if(data['hot'].length) {
         $html +='<dl class="clearfix" data-273-click-log="/city@etype=click@city=rmcs">';
         $html +='<dt>热门省市</dt>';
         for ( i = 0 ,count = data['hot'].length; i<count; i++) {
             $html +='<dd><a data-273-click-log="/city@etype=click@city='+data['hot'][i]["domain"]+'" title="' + data['hot'][i]['name'] +'" href="http://'+ data['hot'][i]["domain"]+'.273.cn'+$sale+'">'+ data['hot'][i]["name"].substring(0, 4)+'</a></dd>';
         }
         $html +='</dl>';
       }
       $html +='<div class="more"><a data-273-click-log="/city@etype=click@city=more" href="http://www.273.cn'+$sale+'city.html">更多省市</a></div>';
       return $html;
    }
};

//头部搜索框自动完成
Base.autoComplete = function (config) {
    //自动完成类型，1为城市页，2为门店页
    var type = config.type || 1 ;
    var $elem = config.$el;
    var $input = $elem.find('#keywords');
    if (type == 1) {
        $input.focus(function(){
            $(this).parent().addClass('click_input');
        });
        $input.blur(function(){
            $(this).parent().removeClass('click_input');
        });
        var width = 338;
        var defaultValue = '请输入车辆名称 如：别克 或 别克 君威';
        var template = '' +
        '<div class="auto-custom" >' +
            '<ul class="auto-custom-items" data-role="items">' +
                '<% items.forEach (function (item) {%>' +
                    '<li class="auto-custom-item" data-eqselog="/top@etype=click@search=<%= item.text %>" data-role="item" data-value="<%= item.value %>">' +
                        '<a href="javascript:;"><%= item.text || item.value %></a>' +
                        '<span>约<%= item.count %>条车源</span>'+
                    '</li>' +
                '<% }); %>' +
            '</ul>' +
        '</div>';
        
    } else {
        var width = 208;
        var defaultValue = '输入信息编号、车源关键字';
        var template = '' +
        '<div class="auto-custom" >' +
            '<ul class="auto-custom-items" data-role="items">' +
                '<% items.forEach (function (item) {%>' +
                    '<li class="auto-custom-item" data-eqselog="/top/shop@etype=click@search=<%= item.text %>" data-role="item" data-value="<%= item.value %>">' +
                        '<a href="javascript:;"><%= item.text || item.value %></a>' +
                    '</li>' +
                '<% }); %>' +
            '</ul>' +
        '</div>';
    }
    
    $elem.find('form').submit(function(){
        if (!$input.val() || $input.val() == defaultValue) {
            return false;
        }
    });

    var auto = new AutoComplete({
            el : '#keywords',
            width: width,
            placeholder : defaultValue,
            dataSource : 'http://data.273.cn/?_mod=AutoCompleteV2&wd=<%=query%>',
            dataType : 'jsonp',
            // 模版
            template : template,
            onItemSelect : function (data) {
                window.location.href = data.value;
            },
            params : function () {
                var temp = {
                    domain : $('#search_domain').val() || 'www'
                };
                return temp;
            }
    });

    $(".auto-custom").delegate("li.auto-custom-item", "hover", function(e) {
            $(this).addClass("on").siblings().removeClass("on");
    });
};

//百度分享
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

//会员认证信息
Base.auth = function () {
    //会员认证信息
    var mt = Cookie.get('MEMBER_TYPE');
    var mu = Cookie.get('MEMBER_NAME');
    if (!mt || !mu || mt==0 || mu==0) {
        return false;
    }
    return {'member_type':mt,'username':mu};
};

//用户信息
var userInfo = function() {
    var authInfo = Base.auth();
    if (authInfo) {
        var $logined = $('#logined');
        $('.nologin').hide();
        $logined.find('#login-username').html('您好，' + authInfo.username);
        $logined.show();
    }
};

//底部js
Base.footerJs = function(config) {
    var $elem = config.$el;
    var $titles = $elem.find('.js_link_title');
    var $contents = $elem.find('.js_link_detail');

    $titles.each(function(index){
        var $curTitle = $($titles[index]);
        var $curContent = $($contents[index]);
        $curTitle.click(function(){
            $curContent.addClass('on');
            $contents.not($curContent).removeClass('on');
            $titles.not($curTitle).removeClass('on');
            $curTitle.addClass('on');
        });
    });
};

//底部热门品牌车系
Base.hotVehicle = function (config) {
    var $elem = config.$el;
    var $letters = $elem.find('.letter a');
    var $contents = $elem.find('.last ul');
    $elem.find('.last ul li a').attr('target','_blank');

    $letters.each(function (index) {
        var $this = $(this);
        var $curContent = $($contents[index]);
        if ($this.hasClass('more')){
            return;
        }
        $this.hover(function () {
            $curContent.show().css("margin-left", "-10px");
            $contents.not($curContent).hide();
            $this.siblings('.current').removeClass('current');
            $this.addClass('current');
        });
    });
};

//显示隐藏图标
Base.showIcon = function(config) {
    var $el = config.$el;
    $el.delegate('ul li .price .down', 'hover',function(event) {
        if (event.type == 'mouseenter') {
            $(this).find('.down_bg').show();
        } else {
            $(this).find('.down_bg').hide();
        }
    });
};

//js实现url跳转
Base.jsLinks = function (config) {
    var $elem = config.$el;
    $elem.find('[data-jslink]').click(function(e){
        //flag标记为1的元素不触发js链接跳转
        var $this = $(this);
        var $target = $(e.target);
        var flag = $target.data('flag');
        if (!flag) {
            var target = $this.data('target');
            var url = $this.data('jslink');
            var eqselog = $this.attr('data-eqselog');
            if (eqselog) {
                eqselog += '@href=' + url;
                Base.log.sendTrack(eqselog);
            }
            if (url) {
                if (target == '_blank') {
                    window.open(url);
                } else {
                    window.location.href = url;
                }
            }
            return false;
        }
    });
};


var logTracker = function (param) {

    Base.log = new Log(param || {});

    Base.log.bindTrackEvent();

    Log.initBdTrack();
    Log.initGgTrack();

    Base.log.trackPageView();
};

Base.init = function (param) {
    userInfo();
    //导航提取target='_blank'
    $('#daohang li a').attr('target','_blank');
    param || (param = {});

    Widget.initWidgets();

    logTracker(param);

    // uuid 检测
    setTimeout(function () {
        Uuid.detect();
    }, 1000);
};

