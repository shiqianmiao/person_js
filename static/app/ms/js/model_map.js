/**
 * @desc        车型导航
 * @author      daiyuancheng<daiyc@273.cn>
 * @date        14-5-23
 */
var mapModule = exports;
var $ = require('jquery');
var Widget = require('lib/widget/widget.js');
var fixed = function() {
    $.fn.capacityFixed = function(options) {
          var opts = $.extend({},$.fn.capacityFixed.default,options);
        var FixedFun = function(element) {
            var top = opts.top;
            var right = ($(window).width()-opts.pageWidth)/2+opts.right;
            element.css({
                  "right":right
              });
            $(window).resize(function(){
                  var right = ($(window).width()-opts.pageWidth)/2+opts.right;
                  element.css({
                      "right":right
                  });
              });
            $(window).on('scroll', function() {
                  var scrolls = $(this).scrollTop();
                  if (scrolls > top) {
                      if (window.XMLHttpRequest) {
                          element.css({
                              position: "fixed",
                              top: 0
                          });
                      } else {
                          element.css({
                              top: scrolls
                          });
                      }
                  } else {
                      element.css({
                          position: "absolute"
                      });
                  }
                  $('#show_space').css("display", "block");
              }).scroll();
        };
        return $(this).each(function() {
              FixedFun($(this));
          });
    };
    $.fn.capacityFixed.default={
          left:0,
          right : 0,//相对于页面宽度的右边定位
          top:moreTop,
          pageWidth : 990
      };
    $("#brand-more").capacityFixed();
}

mapModule.scrollBtns = function(config) {
    var $el = config.$el;
    $el.delegate('.scroll-btn', 'click', function(e) {
        var $btn = $(e.target);
        $('html, body').scrollTop(moreTop + $btn.data('index') * 65);
        $('.scroll-btn').removeClass('current');
        $btn.addClass('current');

    });
}
var moreTop = $('#brand-more').offset().top;
var init = function() {
    $('#show_space').height($('#brand-more').outerHeight(true) - 1);
}
mapModule.start = function(ch) {
    init();
    Widget.initWidgets();
    fixed();
}
