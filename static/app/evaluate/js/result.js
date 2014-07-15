/**
 * @desc 评估结果
 * @copyright (c) 2013 273 Inc
 * @author chenhan <chenhan@273.cn>
 * @since 2013-12-11
 */

var $ = require('jquery');
var Widget = require('lib/widget/widget.js');
var Base = require('app/ms/js/base.js');
require('lib/jquery/plugin/jquery.overlay.js');

var Result = exports;

/**
 * 专家评估
 */
Result.expertHelp = function(config) {
    var $el = config.$el;
    $el.one('click', function() {
        require.async(['app/evaluate/js/common/expert_help.js'], function(ExpertHelp) {
            new ExpertHelp($el, {id: '#evalute_result'});
        });
    });
}

/**
 * 积分排名轮播
 */
Result.carousel = function (config) {
    var $el  = config.$el,
        $ul  = $el.find('#js_scroll_ul'),
        $lis = $ul.find('li');
    if ($lis.length == 0) {
        return;
    }
    $ul.width(($lis[0].offsetWidth + 10) * $lis.length);
    var $as  = $el.find('#js_scroll_btn a'),
        unit = 4 * ($lis[0].offsetWidth + 10);
    $as.on('click', function() {
        $(this).addClass('current').siblings().removeClass();
        $ul.animate({right : $(this).index() * unit}, 'normal');
    });
}

Result.init = function (param) {
    Base.init(param);
}