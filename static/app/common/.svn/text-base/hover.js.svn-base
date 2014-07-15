/**
 * @desc hover控件
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-06-25
 */

var $ = require('jquery');


/**
 * @params $el
 * @params options {}
 *  - target dom || $(dom)
 *  - enter function
 *  - leave function
 */
module.exports = function ($el, options) {

    options = options || {};

    var $el = $($el);

    var $target = $(options.target);

    if (!$el.size()) return;

    var enter = options.enter && $.isFunction(options.enter) ? options.enter : null;

    var leave = options.leave && $.isFunction(options.leave) ? options.leave : null;

    $el.hover(function (e) {

        enter && (enter.apply($el, [e]));
        $target.show();
        $el.addClass('on');
    }, function (e) {

        leave && (leave.apply($el, [e]));
        $target.hide();
        $el.removeClass('on');
    });
}