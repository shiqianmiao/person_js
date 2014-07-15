/**
 * @desc 跨域组件
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-12-19
 */

var slice = [].slice;
var prefix = '__EQS__MSG__'; // 消息前缀用于辨别消息来源（message回调进行过滤）
var supported = 'postMessage' in window;

/******************************/
/********** Target ************/
/******************************/
function Target (win) {
    this.win = win;
}

Target.prototype = {constructor : Target};

// IE8+, Firefox 3+, Opera 9+, Chrome 2+ and Safari 4+
if (supported) {
    Target.prototype.send = function (msg) {

        this.win.postMessage(prefix + msg, '*');
    };
}
// IE 6/7
else {
    Target.prototype.send = function (msg) {
        var messager, cb,
            cbs = [],
            win = this.win,
            messagers = window.navigator.messagers || [];

        msg = msg || '';

        for (var i = 0, l = messagers.length; i < l; i++) {
            // note: must be == (why?)
            messager = messagers[i];
            if (messager['win'] == win) {
                cbs = messager['cbs'];
                break;
            }
        }

        for (var i = 0, l = cbs.length; i < l; i++) {
            cb = cbs[i];
            if (cb && typeof cb === 'function') {
                (function (_cb) {
                    window.setTimeout(function () {
                        _cb(prefix + msg, window);
                    }, 0);
                })(cb);
            }
        }

    };
}

/******************************/
/********** Messager **********/
/******************************/
function Messager () {

    // array-like
    this.length = 0;
    this.listeners = [];

    this._init();
}


Messager.prototype = {

    constructor : Messager,

    _init : function () {

        var me = this, messager,
            listeners = this.listeners,
            messagers = window.navigator.messagers || (window.navigator.messagers = []);

        function callback (msg, source) {

            var targets = me.get(), flag = false;

            if(!source){
                source = msg.source;
                msg = msg.data;
            }

            for (var i = 0, l = targets.length; i < l; i++) {

                if (targets[i]['win'] == source) {
                    flag = true;
                    break;
                }
            }

            // filter message
            // 1. from target windows
            // 2. from message prefix
            if (msg.indexOf(prefix) > -1 && flag) {
                msg = msg.slice(prefix.length);
                for (var i = 0, l = listeners.length; i < l; i++) {
                    listeners[i].call(me, msg);
                }
            }
        }

        this._callback = callback;

        if (supported) {
            Dom.on(window, 'message', callback);
        } else {

            for (var i = 0, l = messagers.length; i < l; i++) {
                messager = messagers[i];
                if (messager['win'] == window) {
                    messager['cbs'].push(callback);
                    return;
                }
            }

            messagers.push({
                win : window,
                cbs: [callback]
            });
        }
    },

    // target window
    // iframe.contentWindow || parent.frames['xx']
    add : function (win) {

        this[this.length] = new Target(win);

        this.length++;

        return this;
    },

    get : function (index) {

        return index == null ?

            // whole array of win
            slice.call(this) :

            // The specified win
            (index < 0 ? this[this.length + index] : this[index]);
    },

    // send message
    send : function (msg) {

        var targets = this.get();

        for (var i = 0, l = targets.length; i < l; i++) {
            targets[i].send(msg);
        }

        return this;
    },

    // detect message
    listen : function (callback) {

        this.listeners.push(callback);

        return this;
    },

    destory : function () {

        var messager, cbs, cb,
            callback = this._callback,
            messagers = window.navigator.messagers || [];

        if (supported) {
            Dom.off(window, 'message', callback);
        } else {

            for (var i = 0, l = messagers.length; i < l; i++) {
                messager = messagers[i];
                if (messager['win'] == window) {
                    cbs = messager['cbs'];
                    for (var j = 0, m = cbs.length; j < m; j++) {
                        cb = cbs[j];
                        if (cb === callback) {
                            cbs.splice(j, 1);
                            return;
                        }
                    }
                }
            }
        }

        return this;
    }
};

/******************************/
/********** Dom ***************/
/******************************/

Dom = {
    on : function (elem, type, handle) {
        if (elem.addEventListener) {
            elem.addEventListener(type, handle, false );
        } else if (elem.attachEvent) {
            elem.attachEvent('on' + type, handle );
        }
    }, 

    off : function (elem, type, handle) {
        if (elem.removeEventListener) {
            elem.removeEventListener(type, handle, false );
        } else if (elem.detachEvent) {
            elem.detachEvent('on' + type, handle );
        }
    }
};

module.exports = Messager;