/**
 * @desc 模块B
 * @path app/demo/js/b.js
 */

var $ = require('jquery');  // jquery <=> lib/jquery/jquery-1.8.2.js

exports.say = function () {
    $(function () {
        console.log('Module B');
        console.log('change to test and sim');
    });
};