var commonModule = exports;
var $ = require('jquery');
var cookieModule = require('util/cookie.js');

commonModule.sinput = function(focusid) {
    var focusblurid = $(focusid);
    var defval = focusblurid.val();
    focusblurid.css('color','#aaa');
    focusblurid.focus(function(){
        var thisval = $(this).val();
        if(thisval==defval){
            $(this).val("");
            $(this).css('color','#333');
        }
    });
    focusblurid.blur(function(){
        var thisval = $(this).val();
        if(thisval==""){
            $(this).val(defval);
            $(this).css('color','#aaa');
        }
    });
};

//改进的sinput
commonModule.focusInput = function(focusid,defval) {
    var focusblurid = $(focusid);
    if (defval==null) {
        defval = focusblurid.val();
    }
    if (focusblurid.val()==defval) {
        focusblurid.css('color','#aaa');
    } else {
        focusblurid.css('color','#333');
    }
    focusblurid.focus(function(){
        var thisval = $(this).val();
        if(thisval==defval){
            $(this).val("");
            $(this).css('color','#333');
        }
    });
    focusblurid.blur(function(){
        var thisval = $(this).val();
        if(thisval==""){
            $(this).val(defval);
            $(this).css('color','#aaa');
        }
    });
};

//会员认证信息
commonModule.auth = function() {
    var mt = cookieModule.get('MEMBER_TYPE');
    var mu = cookieModule.get('MEMBER_NAME');
    if (!mt || !mu || mt==0 || mu==0) {
        return false;
    }
    return {'member_type':mt,'username':mu};
}

commonModule.isUndefined = function(o){
    return typeof o === 'undefined';
};

commonModule.isNumber = function(val){
    var reg = /^[\d|\.|,]+$/;
    return reg.test(val);
};

//设置cookie
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