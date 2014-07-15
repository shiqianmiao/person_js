var commonModule = exports;
var $ = require('jquery');
//设为首页
commonModule.SetHome = function(obj,vrl){
	try{
		obj.style.behavior='url(#default#homepage)';obj.setHomePage(vrl);
    }catch(e){
		if(window.netscape) {
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");  
			}catch (e){ 
				alert("抱歉！您的浏览器不支持直接设为首页。请在浏览器地址栏输入“about:config”并回车然后将[signed.applets.codebase_principal_support]设置为“true”，点击“加入收藏”后忽略安全提示，即可设置成功。");  
			}
			var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
			prefs.setCharPref('browser.startup.homepage',vrl);
		}
	}
};
//加入收藏
commonModule.addBookmark = function(config) {
    var $el = $(config.$el);
    $el.on('click', function(){
        var title = config.title;
        var url='http://'+document.domain;
        if (window.sidebar) {
          window.sidebar.addPanel(title, url,""); 
        } else if( document.all ) {
          window.external.AddFavorite( url, title);
        } else if( window.opera && window.print ) {
          return true;
        }
    })
};
commonModule.htmlEncode = function(text){
  return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};
commonModule.trim = function( text ){
    if (typeof(text) == "string"){
        return text.replace(/^\s*|\s*$/g, "");
    }
    else{
    	return text;
    }
};
commonModule.isEmpty = function( val ){
    switch (typeof(val)){
    	case 'string':
      		return trim(val).length == 0 ? true : false;
      		break;
    	case 'number':
      		return val == 0;
      		break;
    	case 'object':
      		return val == null;
      		break;
    	case 'array':
      		return val.length == 0;
      		break;
    	default:
      		return true;
    }
};
commonModule.isNumber = function(val){
    var reg = /^[\d|\.|,]+$/;
    return reg.test(val);
};

commonModule.isInt = function(val){
    if (val == ""){
    	return false;
    }
    var reg = /\D+/;
    return !reg.test(val);
};

commonModule.isEmail = function( email ){
    var reg1 = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)/;
	return reg1.test( email );
};
commonModule.isUndefined = function(o){
    return typeof o === 'undefined';
};
commonModule.isTel = function ( tel ){
    var reg = /^1[3458]\d{9}$|^(0\d{2,4}-)?[2-9]\d{6,7}(-\d{2,5})?$|^(?!\d+(-\d+){3,})[48]00(-?\d){7,10}$/;; //只允许使用数字-空格等
	return reg.test( tel );
};

commonModule.isUrl = function ( url ){
	var reg = /([\w]+)\.273\.(com|cn|cc){1}/i
	return reg.test( url );
};

commonModule.fixEvent = function(e){
  var evt = (typeof e == "undefined") ? window.event : e;
  return evt;
};

commonModule.srcElement = function(e){
  if (typeof e == "undefined") e = window.event;
  var src = document.all ? e.srcElement : e.target;
  return src;
};

commonModule.isTime = function(val)
{
  var reg = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/;
  return reg.test(val);
};

commonModule.setCookie = function(name, value, expire, path, domain, s){
    if (commonModule.isUndefined(document.cookie)){
        return false;
    }
    expire = !commonModule.isNumber(expire) ? 0 : parseInt(expire);
    if (expire < 0){
        value = '';
    }
    var dt = new Date();
    dt.setTime(dt.getTime() + 1000 * expire);
    document.cookie = name + "=" + encodeURIComponent(value) +
    ((expire) ? "; expires=" + dt.toGMTString() : "") +
    "; path=" + (path || '/') +
    "; domain=" + (domain || '273.cn') +
    ((s) ? "; secure" : "");
    return true;
};

commonModule.lazyLoadPic = function() {
    // 延迟载入图片
    $.fn.scrollLoading = function(options){
      var defaults={attr:"datasrc"};
      var params=$.extend({},defaults,options||{});
      params.cache=[];$(this).addClass('loadingimg').each(function(){
          var node=this.nodeName.toLowerCase(),
          url=$(this).attr(params["attr"]);
          if(!url){
              return
          }
          var data={obj:$(this),tag:node,url:url};params.cache.push(data)});
      var loading=function(){
          var st=$(window).scrollTop(),
          sth=st+$(window).height();
          $.each(params.cache,function(i,data){
            var o=data.obj,tag=data.tag,url=data.url;if(o){post=o.offset().top-500;posb=post+o.height();if((post>st&&post<sth)||(posb>st&&posb<sth)){if(tag==="img"){o.attr("src",url)}else{o.load(url)}data.obj=null}}});return false};loading();$(window).bind("scroll",loading)};

    // 分页
    $(function(){
      $('button[pageurl]').click(function(){
        var _this = $(this),
          url = _this.attr('pageurl'),
          page = _this.prev().val(),maxpage = _this.attr('maxpage');
        (Utils.isNumber(page)&&parseInt(page)<=parseInt(maxpage)) ? location.href=url.replace('{page}',page) : alert('请输入正确的页数。');
      });
      $('button[pageurl]').each(function(){
        $(this).prev().keydown(function(event){
          event.keyCode==13 && $(this).next().click();
        });
      });
      $("img[datasrc]").scrollLoading(); // 延时载入图片
    });
};

commonModule.popularize = function() {
    var $popuBanner = $('#top-bd');
    $popuBanner.find('.close').click(function(){
        $popuBanner.children('div').hide();
    });
    setTimeout(function(){
        $popuBanner.find('.one').slideUp(1000, function(){
            $popuBanner.find('.two').animate({height:'100px'}, 1000);
        });
    }, 5000);
};
