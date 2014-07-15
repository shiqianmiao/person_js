/**
 * @desc 下拉框组件
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-09-05
 */

var $ = require('jquery');
var Dropdown = require('app/backend/js/plugin/dropdown.js');

module.exports = function (el) {

    var dropdown = new Dropdown(el);
    var toggle = dropdown.toggle;

    dropdown.toggle = $.proxy(toggle, el);

    return dropdown;
}