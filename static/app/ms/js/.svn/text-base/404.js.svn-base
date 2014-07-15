/**
 * @desc 404页面
 * @copyright (c) 2013 273 Inc
 * @author 缪石乾 <miaosq@273.cn>
 * @since 2013-07-28
 */

var _ = require('lib/underscore/underscore.js');
var Base = require('app/ms/js/base.js');
var headerModule = require('app/v3/js/common/header.js');
var $ = require('jquery');

var Module404 = exports;

//extend
_.extend(Module404, Base);

Module404.start = function ($params) {
    //获取用户登录信息
    headerModule.init();
    Base.init($params);

    var $secElm = $('#sec');
        $val = $secElm.html();
        if ($params['nextUrl']) {
            var url = $params['nextUrl'];
        } else {
            var url = "http://www.273.cn";
        }
    setInterval(function(){
        if ($val > 0) {
            $secElm.html(--$val);
        } else {
            location.href = url;
        }
    }, 1000);
    //param['eqsch']
}