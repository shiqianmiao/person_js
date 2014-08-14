var lang = new Array();
var userAgent = navigator.userAgent.toLowerCase();
var is_opera = userAgent.indexOf('opera') != -1 && opera.version();
var is_moz = (navigator.product == 'Gecko') && userAgent.substr(userAgent.indexOf('firefox') + 8, 3);
var is_ie = (userAgent.indexOf('msie') != -1 && !is_opera) && userAgent.substr(userAgent.indexOf('msie') + 5, 3);

function $$(id) {
	return document.getElementById(id);
}
function doane(event) {
	e = event ? event : window.event;
	if(is_ie) {
		e.returnValue = false;
		e.cancelBubble = true;
	} else if(e) {
		e.stopPropagation();
		e.preventDefault();
	}
}

function $_GET(name) {
	var getArray = {};
	var get = location.search;
	gets = get.substr(1).split('&');
	for (i in gets) {
		t = gets[i].split('=');
		getArray[t[0]] = t[1];
	}
	return getArray[name];
}
function tabhide(id){
	$('#'+id).toggle();
}
function menu(obj) {//
	var $mainmenu=$(obj)
	var $headers=$mainmenu.find("ul").parent()
	$headers.each(function(i){
		var $curobj=$(this)

		this._dimensions={h:$(this).outerHeight(),w:$(this).outerWidth()}

		$curobj.hover(
			function(e){
				var $targetul=$(this).children("ul:eq(0)")
				if ($targetul.queue().length<=1)
					$targetul.css({left: $curobj.offset().left, top: $mainmenu.offset().top+this._dimensions.h})
					$targetul.show()
			},
			function(e){
				var $targetul=$(this).children("ul:eq(0)")
				$targetul.hide()

			}
		) //end hover
	})
}

function getCookieVal(offset) {
	var endstr = document.cookie.indexOf (";", offset);
	if(endstr == -1) {
		endstr = document.cookie.length;
	}
	return unescape(document.cookie.substring(offset, endstr));
}
function getCookie(name) {
	var arg = name + "=";
	var alen = arg.length;
	var clen = document.cookie.length;
	var i = 0;
	var j = 0;
	while(i < clen) {
		j = i + alen;
		if(document.cookie.substring(i, j) == arg)
			return getCookieVal(j);
		i = document.cookie.indexOf(" ", i) + 1;
		if(i == 0)
			break;
	}
	return null;
}
function deleteCookie(name) {
	var exp = new Date();
	var cval = getCookie(name);
	exp.setTime(exp.getTime() - 1);
	document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
}
var gCookieExpDays = 1;
function setCookie(name, value) {
	var argv = setCookie.arguments;
	var argc = setCookie.arguments.length;
	var exp = (argc > 2) ? argv[2] : gCookieExpDays;
	var path = (argc > 3) ? argv[3] : null;
	var domain = (argc > 4) ? argv[4] : null;
	var secure = (argc > 5) ? argv[5] : false;
	var expires = new Date();
	deleteCookie(name);
	expires.setTime(expires.getTime() + (exp*24*60*60*1000));
	document.cookie = name + "=" + value +
		"; expires=" + expires.toGMTString() +
		((domain == null) ? "" : ("; domain=" + domain)) +
		((path == null) ? "" : ("; path=" + path)) +
		((secure == true) ? "; secure" : "");
}