/**
 * @desc 搜索框下拉列表
 * @copyright (c) 2013 273 Inc
 * @author 陈朝阳 <chency@273.cn>
 * @since 2013-12-6
 */

var $ = require('lib/zepto/zepto-1.0.js');
var Auto = require('app/wap_v2/js/common/autocomplete.js');
var Cookie = require('util/cookie.js');

var Match = exports;

//首页搜索框自动完成
Match.autoMatch = function(config) {
    var $elem = config.$el;
    var domain = config.domain;
    
    //绑定搜索框提交事件，记录搜索历史
    $("#search_form").on("submit", function() {
        writeHistory($('#vehicle_search').val());
    });
    
    var domainParam = '';
    if (domain) {
        domainParam = '&domain='+domain;
    }
    var autoKeyword = Auto({
        inputEl : 'vehicle_search',
        source : '/ajax.php?module=getVehicleFromWord' + domainParam,
        eventType : 'keyup',
        appendEl : '#autocomplete' ,
        resultsClass : '',
        extraWidth : 50,
        clickLogKey: '/wap/autocomplete@etype=click@url=',
        formatItem : function (q, d) {
            var tpl = '<a href="javascript:void(0);" data-273-click-log="/wap/search/input@etype=click@keyword=<%=text%>"><%=text%></a><span>约<%=count%>条车源</span>';
            return autoKeyword.render(tpl,d);
        },
        extraItem : '<span id="close" class="btn" data-273-click-log="/wap/search/input@etype=click@search=close">关闭</span>',
        onComplete : function () {
          $('#close')
              .off('click')
              .on('click', function () {
                  autoKeyword.close();
              });
        },
        onItemClick : function (item) {
            writeHistory($(item).find('a').html());
            var url = $(item).data('url');
            window.location.href = url;
        },
      });
      
      //是否是首页，首页多了（index-new类）
      var isIndex = $('.index-new').length > 0 ? true : false;
      //搜索框聚焦全屏
      $('#vehicle_search').focus(function(){
          if (isIndex) {
              $('#search').removeClass('index-new');
          }
          $('#search').addClass('search-show');
          $('#main').hide();
      });
      //取消全屏
      $('#cancel').click(function(){
          autoKeyword.close();
          if (isIndex) {
              $('#search').addClass('index-new');
          }
          $('#search').removeClass('search-show');
          $('.search-history').hide();
          $('#vehicle_search').val('');
          $('.js_input_clear').addClass('hidden');
          $('#main').show();
      });
      
      //搜索历史
      var timer = null;
      var history = null;
      $('#vehicle_search').on('keyup.history input.history focus.history', function(){
          //用户可能清楚历史，所以此处需重新判断是否有搜索历史
          history = Cookie.get("keywordHistory");
          var value = $.trim($('#vehicle_search').val());
          if (!value) {
              $('.js_input_clear').addClass('hidden');
              autoKeyword.close();
              timer = setTimeout(function () {
                  if (history) {
                      //搜索框值为空时，展示搜索历史
                      clearTimeout(timer);
                      showHistory(history);
                  }
              }, 400);
          } else {
              $('.js_input_clear').removeClass('hidden');
              $('.search-history').hide();
          }
      });
      
      $('.js_input_clear').on('click', function(){
          $('#vehicle_search').val('');
          $('#vehicle_search').focus();
      });
};

//记录用户搜索关键字
function writeHistory(data) {
    var options = {};
    options.domain = '.m.273.cn';
    options.path = '/';
    options.expires = 30;//天
    
    var m = $.trim(data);
    m = m.replace(/>/g, "&gt ;");
    m = m.replace(/</g, "&lt ;");
    m = m.replace(/"/g, "&quot ;");
    m = m.replace(/'/g, "&acute ;");
    if (m === "") {
        return false;
    }
    var l = Cookie.get("keywordHistory");
    l = l ? l.split(",") : [];
    if ($.inArray(m, l) < 0) {
        l.unshift(m);
        var k = l.length - 5;
        if (k > 0) {
            l.splice(5, k);
        }
        Cookie.set("keywordHistory", l.join(","), options);
    }
}

//展示搜索历史
function showHistory(data) {
    data = data.split(',');
    var $results = $('.search-history').hide();
    var $div = $('<div></div>');
    var $ul = $('<ul></ul>');
    var html = '';
    for (var i = 0; i < data.length; i++) {
        row = data[i];
        $item = $('<li></li>');
        html = "<a href='javascript:void(0);' data-273-click-log='/wap/search/input@etype=click@keyword="+ data[i] +"'>" + data[i] + "</a><em>&nbsp;</em>";
        $item.html(html);
        $item.find('a').on('click', function(){
            $('#vehicle_search').val($(this).html());
            $('#search_form').submit();
        });
        $item.find('em').on('click', function(){
            $('#vehicle_search').val($(this).parent().find('a').html());
            $('#vehicle_search').focus();
        });
        $ul.append($item);
    }
    $div.append($ul);
    $div.append('<a href="javascript:void(0);" data-273-click-log="/wap/search/input@etype=click@search=clear"><span id="clear_history" class="btn">清除历史纪录</span></a>');
    $div.find('#clear_history').on('click', function(){
        var options = {};
        options.domain = '.m.273.cn';
        options.path = '/';
        options.expires = 30;//天
        Cookie.set("keywordHistory", "", options);
        $results.html("").hide();
    });
    $results.html($div).show();
}