/**
 * @desc 头部公共js
 */

var headerModule = exports;
var $ = require('jquery');
var commonModule = require('app/v3/js/common/common');

headerModule.init = function() {
    headerModule.userInfo();
};

//用户信息
headerModule.userInfo = function() {
    var authInfo = commonModule.auth();
    if (authInfo) {
        var $logined = $('#logined');
        $('.nologin').hide();
        $logined.find('#login-username').html('您好，' + authInfo.username);
        $logined.show();
    }
};