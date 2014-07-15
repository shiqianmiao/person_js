/**
 * @desc 跨域组件RPC（Remote Procedure Calls）
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-10-29
 */

var $ = require('jquery');
var Transport = require('./transport');

var cindex = 0,
    C_PEFIX = 'RPC_CHANNEL_',
    M_PEFIX = 'RPC_MESSAGE_';

/**
 * @params config {}
 * - remote : 'http://www.b.com',
 * - method : {
 * -    fn1 : function () {...},
 * -    fn2 : function () {...},
 * -    fn3 : [function () {...}, function () {...}]
 * -}
 */
function RPC (config) {

    config = config || {};
    config.host = config.remote ? true : false;

    var methods = config.method || {};          // 注册的函数集
    var defers = {};                            // 回调函数集
    var mindex = 0;
    // var ready = false;                          // iframe message ready
    // var load = config.load || function () {};   // iframe onload callback

    delete config.method;

    if (config.host) {
        config.cid = C_PEFIX + (cindex++);      // channel_id用于保证父窗口与子窗口的对应关系
        // config.load = open;
    }

    var transport = new Transport(config);

    // transport.on('ready', function () {
    //     ready = true;
    // })
    transport.on('message', function (message) {

        message = JSON.parse(message);

        var name = message.name;
        var mid = message.mid;
        var fn, result;

        // 执行方法
        if (name) {
            fn = methods[name];
            if (fn) {
                try {
                    result = fn.apply(rpc, message.params);
                    transport.send(JSON.stringify({
                        mid : message.mid,
                        status : 'resolve',
                        result : result
                    }));
                } catch (e) {
                    transport.send(JSON.stringify({
                        mid : message.mid,
                        status : 'reject',
                        result : e.message
                    }));
                }
            } else {
                transport.send(JSON.stringify({
                    mid : message.mid,
                    status : 'reject',
                    result : name + ' function do not exist'
                }));
            }
        }
        // 回调函数
        else {
            defers[message.mid][message.status](message.result);
        }


    }).init();

    // function open () {
    //     transport.open();
    //     load.call(config.iframe);
    // }

    // 执行方法 ｜ 回调函数
    function execute () {

    }

    /**
     * 返回rpc实例（函数）
     * @params name string 函数名
     * @params params [] 函数形参
     */
    function rpc (name, params) {

        var message, defer;

        if (!name) {
            throw new Error('name is incorrect');
        }

        params = params || [];

        if (!Array.isArray(params)) {
            params = [params];
        }

        message = {
            mid : M_PEFIX + (mindex++),         // message_id用于通信后的回调
            name : name,
            params : params
        };

        defer = $.Deferred();

        defers[message.mid] = defer;

        setTimeout(function () {

            try {
                transport.send(JSON.stringify(message));    // 部分浏览器依赖json2.js
            } catch (e) {
                // defer.reject('fail to send');
                throw new Error('rpc argument is incorrect when using JSON.stringify');
            }

        }, 0);

        return defer;
    }

    rpc.set = function (name, fn) {

        var method;

        if (!name || !$.isFunction(fn)) {
            throw new Error('name | fn is incorrect');
        }

        method = methods[name] || (methods[name] = []);

        // fn | [fn1, fn2, ..., fnn ]
        if ($.isArray(method)) {
            method.push(fn);
        } else {
            (methods[name] = []).push(method, fn);
        }

        return rpc;
    };

    // rpc.ready = function (fn) {

    //     if (!$.isFunction(fn)) {
    //         throw new Error('ready fn must be a function');
    //     }

    //     if (ready) {
    //         fn.call(rpc);
    //     } else {
    //         transport.on('ready', function () {
    //             fn.call(rpc);
    //         })
    //     }

    //     return rpc;
    // };

    return rpc;
}

// for sameorigin
(function () {

    var map = {};

    if (window.RPC_FN) {
        return;
    }

    window.RPC_FN = {
        set : function (cid, fn) {
            map[cid] = fn;
        },
        get : function (cid) {
            return map[cid];
        },
        remove : function (cid) {
            delete map[cid];
        }
    };
})();

module.exports = RPC;

