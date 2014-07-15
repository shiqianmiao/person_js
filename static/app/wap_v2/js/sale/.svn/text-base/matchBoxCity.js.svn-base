/**
 * @desc 搜索框下拉列表匹配城市
 * @copyright (c) 2013 273 Inc
 * @author wangjg <wangjg@273.cn>
 * @since 2013-12-10
 */

var $ = require('lib/zepto/zepto-1.0.js');
var Auto = require('app/wap_v2/js/common/autocomplete.js');

var Match = exports;

//首页搜索框自动完成
Match.autoMatch = function(config) {
    var $elem = config.$el;
    var from=config.from;
    
    var fromParam = '';
    if (from) {
        fromParam = '&from='+from;
    }
    var autoKeyword = Auto({
        inputEl : 'vehicle_search',
        source : '/ajax.php?module=GetCityByKeyValue' + fromParam,
        eventType : 'keyup',
        appendEl : '#autocomplete' ,
        resultsClass : '',
        extraWidth : 50,
        clickLogKey: '/wap/autocomplete@etype=click@url=',
        formatItem : function (q, d) {
            var tpl = '<a href="javascript:void(0);"> <%=text%></a>';
 
            return autoKeyword.render(tpl,d);
        },
        extraItem : '<span id="close" class="btn">关闭</span>',
        onComplete : function () {
          $('#close')
              .off('click')
              .on('click', function () {
                  autoKeyword.close();
                  return false;
              });
        }
      });
    	
    
    $('#vehicle_search').on('keyup.history input.history focus.history', function(){
        var value = $.trim($('#vehicle_search').val());
        if (!value) {
            $('.js_input_clear').addClass('hidden');
            autoKeyword.close();
//            $('.area-list').hide();
        } else {
            $('.js_input_clear').removeClass('hidden'); 
//            $('.area-list').show();
        }
        
    });
    
    $('.js_input_clear').on('click', function(){
        $('#vehicle_search').val('');
        $('#vehicle_search').focus();
//        $('.area-list').show();
    });
    
      //取消全屏
      $('#cancel').click(function(){
          autoKeyword.close();
          $('#search').removeClass('search-show');
          $('#main').show();
      });
};

