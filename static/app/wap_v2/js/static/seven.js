var $ = require('zepto');
var Log    = require('app/wap_v2/js/util/log.js');
var Uuid   = require('util/uuid.js');
var Widget = require('app/wap_v2/js/common/widget.js');

require('app/wap_v2/js/util/overlay.js');

// public
var Base = exports;

Base.showBox = function(config) {
    var $elem = config.$el;
    $elem.click(function(){
        $('#pop_box').overlay({
            effect: 'none',
            opacity: 0.8,
            closeOnClick: true,
            glossy:true,
            onShow: function() {
            },
            onHide: function() {
                closeMessage();
            },
        });
        $('#pop_box').addClass('show');
        centerDisplay('#pop_box');
        function closeMessage(){
            $('#pop_box').removeClass('show');
            removeOverlay();
        }
        $('#pop_box .close').click(closeMessage);
        function removeOverlay() {
            $(".overlay-trigger").removeClass('overlay-trigger');
            $("body").css('overflow', 'auto');
            $(".overlay").remove();
        }
    });
};
function centerDisplay(id) {
    var div = $(id);
    var winHeight = $(window).height();
    var divHeight = div.height();
    var top = (winHeight - divHeight) / 2 + $(window).scrollTop();
    div.css({ top: top + "px"});
}

Base.start = function(){
    Uuid();
    Widget.initWidgets();
    Log.init('/activity/seven', false);
};
