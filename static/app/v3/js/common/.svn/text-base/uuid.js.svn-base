var cookie = require('util/cookie');
var commonModule = require('app/v3/js/common/common');
var $ = require('jquery');
var module_uuid = exports;
var name = 'eqs_uuid';
//毫秒为单位
var cookieExpire = 365*24*60*60*1000;

	module_uuid.init = function () {
        if (window.name === "") {
            window.name = "{}";
        } else {
            try {
                JSON.parse(window.name);
            } catch(ex) {
                window.name = "{}";
            }
        }
    };
    module_uuid.setUuid = function() {
        var uuid = cookie.get(name);
        if (uuid) {
            return;
        }
        var storage = getApi();
        var s_uuid = storage.get(name);
        var w_uuid = get(name);
        uuid = s_uuid || w_uuid;
        if (uuid == null) {
            uuid = createUuid();
            storage.set(name, uuid);
            set(name, uuid);
        }
        commonModule.setCookie(name,uuid,cookieExpire,'/','.273.cn','');
    }

    function set(key, value) {
        var obj = {};
        try {
            obj = JSON.parse(window.name);
        } catch (ex) {
                    
        }
        obj[key] = value;
        window.name = JSON.stringify(obj);
    };
    function get(key) {
        try {
            return JSON.parse(window.name)[key];
        } catch (ex) {
            return {};
        }
    };
    function getApi() {
    	var api = {}; 
    	var isSupportLocalStorage = true;
    	api.set    = function (key, value) {};
    	api.get    = function (key)        {};
    	api.remove = function (key)        {};
    	isSupportLocalStorage = !!window.localStorage;
    	document.domain = '273.cn';
	    if (!isSupportLocalStorage) {
	        var iframe = document.createElement('IFRAME');
	        iframe.src = "http://s.273.cn/crossdomain.html";
	        iframe.style.display = "none";
	        document.insertBefore(iframe, document.firstChild);
	        $(iframe).on('load', function(){
	            var doc = iframe.contentWindow.document;
	            data = doc.createElement('input');
	            data.type = 'hidden';
	            doc.insertBefore(data, doc.firstChild);
	            if (!data.addBehavior) {
	                throw new Error('this browser does not support userData');
	            }
	            data.addBehavior('#default#userData');
	            var storeName = "EQS_LOCAL_STORAGE";
	            api.set=function (k, v) {
	                data.setAttribute(k, v);
	                data.save(storeName);
	            }
	            api.get=function (k) {
	                data.load(storeName);
	                return data.getAttribute(k);
	            }
	            api.remove=function (k) {
	                data.removeAttribute(k);
	                data.save(storeName);
	            }
	        });
	    } else {
	            api.set=function (k, v) {
	                return localStorage.setItem(k, v);
	            }
	            api.get=function (k) {
	                return localStorage.getItem(k);
	            }
	            api.remove=function (k) {
	                return localStorage.removeItem(k);
	            }
	    }
	    return api;
	};
	function createUuid() {
        var tm = +new Date(),
        rm = G.util.math.random(10000000, 99999999),
        strSwitch = function(str) {
            var ret = '', i, len = str.length;
            while (len > 0) {
                len--;
                ret += str.substr(len, 1);
            }
            return ret;
        },
        str = strSwitch(tm + '' + G.util.math.random(1, 9));
        str = (str * 1 + rm) + '' + rm;
        return str;
    };
