/**
 * @desc 提示框
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-10-08
 */

var $ = require('jquery');
var Backend = require('app/backend/js/backend.js');
var Alert = require('app/backend/js/plugin/alert.js');

var types = {
    success : 'success',
    info : 'info',
    warning : 'warning',
    error : 'danger'
};

var templates = '<div class="alert alert-<%=type%>"><%=message%><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button></div>';

var template = Backend.template(templates);

var $body = $('body');

$.each(types, function (k, v) {

    Backend.on('alert-' + k, function (msg) {

        var $alert = $(template({
            type : v,
            message : msg || ''
        }));

        var $win = $(window);

        $alert.css({
            position : 'fixed',
            zIndex : 9999,
            marginBottom : 0
        });
        $body.append($alert);

        // 显示后取宽高
        $alert.css({
            left : $win.width() / 2 - $alert.width() /2,
            top : $win.height() / 2 - $alert.height() /2
        });

        new Alert($alert[0]);

        window.setTimeout(function () {
            $alert.find('.close').click();
        }, 3000)
    })
});

module.exports = function (el) {
    return new Alert(el);
}
