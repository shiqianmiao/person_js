/**
 * 价格评估结果页
 * @copyright (c) 2013 273 Inc
 * @author chenhan <chenhan@273.cn>
 * @since 2013-12-5
 */
var $ = require('jquery');
var Widget = require('lib/widget/widget.js');
var App = require('util/app.js');
var Common = require('app/wap_v2/js/common/common.js');

var EvalRet = exports;

EvalRet.jumpDetail = function(config) {
    var $el  = config.$el;
    var $as = $el.find('li a');
    $as.on('click', function() {
        App.call('showCarDetail', ['' + $(this).data('id'), JSON.stringify($(this).data('json'))]);
    });
}

EvalRet.init = function(config) {
    Common.lazyLoadPic();
    Widget.initWidgets();
}
