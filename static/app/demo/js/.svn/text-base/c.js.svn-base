/**
 * @desc 模块C
 * @path app/demo/js/c.js
 */

var $ = require('jquery');  // jquery <=> lib/jquery/jquery-1.8.2.js
var Widget = require('lib/widget/widget.js');

exports.change = function (config) {

    var $el = config.$el;
    var text = config.text || '';

    $el.click(function () {

        $(this).html(text);
    });
};

exports.start = function (param) {
    Widget.initWidgets();
}