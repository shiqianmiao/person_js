/**
 * @desc 城市自动完成
 * @copyright (c) 2013 273 Inc
 * @author zhuangjx <chency@273.cn>
 * @since 2013-10-14
 */

var $ = require('lib/zepto/zepto-1.0.js');
var Widget = require('app/wap/js/common/widget.js');
var Common = require('app/wap/js/common/common.js');
var Auto = require('app/wap/js/common/autocomplete.js');
var Base = require('app/wap/js/sale/base.js');
var _ = require('lib/underscore/underscore.js');
var Index = exports;
var inputcity = '';
//城市自动完成
Index.autoComplete = function() {
    var autoKeyword = Auto({
        inputEl : "js-aucity",
        source : 'http://www.273.cn/ajax.php?module=auto_city' + inputcity,
        eventType : 'keyup',
        appendEl : "#promptCity",
        resultsClass : 'dropdown',
        extraWidth : 50,
        maxLength  :10,
        formatItem : function (q, d) {
            var tpl = '<%=text%>'
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

Index.start = function (param) {
    param || (param = {});
    Base.init(param);
    Widget.initWidgets();
    Index.autoComplete();
};
