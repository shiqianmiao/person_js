/**
 * @desc 公共js
 */
var $ = require('jquery');
var element = $('#left_nav');
var scroll = function() {
	var scrolls = $(document).scrollTop();
	console.log(scrolls);
    if (scrolls > 200) {
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
        $('#left_nav').css({
            position: "absolute",
            top: 200
        });
    }
};
var run = function() {
	opts={
	        top:200,
		};
	var FixedFun = function() {
    	var top = opts.top;
        element.css({
            "top":top
        });
    	$(window).scroll(scroll);
    };
    return element.each(function() {
        FixedFun();
    });
};
run();
var remove = function (){
$("#left_nav li a").each(function(){
	$(this).removeClass('current');
});
}
$("#left_nav li a").click(function() {
$this = $(this);
remove();
$this.addClass("current");
scroll();
});
