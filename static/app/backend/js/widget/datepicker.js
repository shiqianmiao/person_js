/**
 * @desc 日期组件
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-09-13
 */

var $ = require('jquery');
var Datepicker = require('app/backend/js/plugin/datepicker.js');

var defaults = {
    autoclose: false,
    beforeShowDay: $.noop,
    calendarWeeks: false,
    clearBtn: false,
    daysOfWeekDisabled: [],
    endDate: Infinity,
    forceParse: true,
    format: 'yyyy-mm-dd',
    keyboardNavigation: true,
    language: 'zh-CN',
    minViewMode: 0,
    orientation: "auto",
    rtl: false,
    startDate: -Infinity,
    startView: 2,
    todayBtn: false,
    todayHighlight: false,
    weekStart: 1,
    hidePrevNext: false //隐藏左右按键
};

module.exports = function (el) {

    var datepicker = new Datepicker(el, $.extend({}, defaults, $(el).data()));

    datepicker.element.on('changeDate', function () {

        datepicker.hide();

        $(this).blur(); // 触发验证
    });

    return datepicker;
}