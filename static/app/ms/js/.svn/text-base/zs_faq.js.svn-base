/**
 * @desc        招商旧版faqzs.273.cn/wenti.html
 * @author      daiyuancheng<daiyc@273.cn>
 * @date        14-5-14
 */
var zsModule = exports;
var Log    = require('util/log.js');
var $ = require('jquery');
var Widget = require('lib/widget/widget.js');
var Position = require('widget/position/position.js');

zsModule.start = function(ch) {
    Widget.initWidgets();
};

zsModule.callback = function(config) {
    var $el = config.$el;
    $el.one('click', function() {
        require.async(['app/ms/js/common/zs_callback.js'], function(Callback) {
            var cb = new Callback({
                $el : $el
            });
        });
    });
};
