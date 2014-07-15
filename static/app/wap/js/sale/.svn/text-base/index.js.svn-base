/**
 * @desc 首页
 * @copyright (c) 2013 273 Inc
 * @author 陈朝阳 <chency@273.cn>
 * @since 2013-06-24
 */

var $ = require('lib/zepto/zepto-1.0.js');
var Widget = require('app/wap/js/common/widget.js');
var Common = require('app/wap/js/common/common.js');
var Auto = require('app/wap/js/common/autocomplete.js');
var Base = require('app/wap/js/sale/base.js');
var _ = require('lib/underscore/underscore.js');
var Index = exports;

var domain = '';
//extend
_.extend(Index, Base);

Index.menuTap = function(config) {
    $el = config.$el;
    $el.find('#typetab li').click(function(){
        var index = $(this).index();
        $(this).addClass("on");
        $(this).siblings().removeClass('on');
        if(index!=3){
            $el.find('.typetab-data').hide();
            $el.find('.typetab-data').eq(index).show();
        }
    });
};

//进入全国站时的地理定位
Index.location = function() {
    Common.location( function(city) {
        if (city) {
            $.ajax({
                type: 'POST',
                url: '/ajax.php?module=getCityByName',
                data: { name: city },
                dataType: 'json',
                timeout: 800,
                success: function(data){
                    if (data && data.url) {
                        window.location.href = data.url;
                    }
                },
                error: function(xhr, type){
                    alert('无法定位您的位置，可手动选择城市');
                }
            });
        }
    });
};

//首页搜索框自动完成
Index.autoComplete = function() {
    var domainParam = '';
    if (domain) {
        domainParam = '&domain='+domain;
    }
    var autoKeyword = Auto({
        inputEl : 'vehicle_search',
        source : '/ajax.php?module=getVehicleFromWord' + domainParam,
        eventType : 'keyup',
        appendEl : '#vehicle_search_form' ,
        resultsClass : 'dropdown',
        extraWidth : 50,
        clickLogKey: '/wap/autocomplete@etype=click@url=',
        formatItem : function (q, d) {
            var tpl = '<%=text%><span>约<%=count%>条车源</span>'
            return autoKeyword.render(tpl,d);
        },
        extraItem : '<li class="close">关 闭</li>',
        onComplete : function () {
          $('.close')
              .off('click')
              .on('click', function () {
                  autoKeyword.close();
                  return false;
              });
        }
      });
};

//首页入口函数
Index.start = function (param) {
    param || (param = {});
    Base.init(param);
    Widget.initWidgets();
    Common.lazyLoadPic();
    if (param) {
        domain = param['domain'];
        if (param['domain'] == 'www') {
            Index.location();
        }
    }
    Index.autoComplete();
};