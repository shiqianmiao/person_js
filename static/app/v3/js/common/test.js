/**
 * @desc 头部公共js
 */

var headerModule = exports;
var $ = require('jquery');

headerModule.init = function(data) {
    var cityTpl = require('app/v3/js/tpl/switch_city.tpl');
    $('#citychange').html(cityTpl(data));
    console.log(data);
};