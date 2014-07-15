/**
 *@desc 积分排名列表页js实现
 */
var mapModule = exports;
var $ = require('jquery');

var showChar = function () {
    $('#show_char a').click(function () {
          
          $.each($('#show_char a'),function(){
              $(this).removeClass('current');
          });
      
           $(this).addClass('current');
        });    
        
      $('#show_key tr').mouseover(function () {
            $(this).addClass('orange');
        });
        
      $('#show_key tr').mouseout(function () {
           $(this).removeClass('orange');
        });    
}

var fixed = function() {
    $.fn.capacityFixed = function(options) {
          var opts = $.extend({},$.fn.capacityFixed.deflunt,options);
          var FixedFun = function(element) {
              var top = opts.top;
              var right = ($(window).width()-opts.pageWidth)/2+opts.right;
              element.css({
                  "right":right,
                  "top":top
              });
              $(window).resize(function(){
                  var right = ($(window).width()-opts.pageWidth)/2+opts.right;
                  element.css({
                      "right":right
                  });
              });
              $(window).scroll(function() {
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
                  }else {
                      element.css({
                          position: "absolute",
                          top: top
                      });
                  }
                    $('#show_space').css("display", "block");
              });
          };
          return $(this).each(function() {
              FixedFun($(this));
          });
      };
      $.fn.capacityFixed.deflunt={
          left:0,
          right : 0,//相对于页面宽度的右边定位
          top:200,
          pageWidth : 990
      };
      $("#brand-more").capacityFixed();
}
mapModule.start = function(ch) {
    showChar();
    fixed();
};