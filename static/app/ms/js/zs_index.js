/**
 * @desc        招商旧版首页zs.273.cn/index.html
 * @author      daiyuancheng<daiyc@273.cn>
 * @date        14-5-14
 */
var zsModule = exports;
var Log    = require('util/log.js');
var $ = require('jquery');
var Widget = require('lib/widget/widget.js');
var Position = require('widget/position/position.js');

zsModule.start = function(ch) {
    justPosition();
    Widget.initWidgets();
};
var justPosition = function() {
    var $win = $(window);

		$("#show_scan_code").css({
                  "display":"block"
              });

		$win.resize(function () {
			Position.pin({
				el : '#show_scan_code',
				fixed : true
			}, {
				el : '#wrap',
				x: '-17%',
				y: '30'
			});
		});
		$win.resize();
}

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
