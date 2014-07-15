/**
 * @desc RPC 远程方法调用（Remote Procedure Calls）
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-12-22
 */

var $ = require('jquery');
var Messager = require('lib/messager/messager');

var slice = [].slice;
var cIndex = 0;
var cPrefix = '__RPC_CH__';
var mPrefix = '__RPC_MSG__';
/**
 * 参数配置
 * @params config {}
 * - remote : iframe.contentWindow || parent.frames['xx']
 */
function RPC (config) {

    config = config || {};

    if (!config.remote) throw new Error('argument[remote] is missing');

    this.remote = config.remote;
    this.methods = {};          // 注册函数集合
    this.callbacks = {};        // 回调函数集合
    this.cache = {};
    this.cid = cPrefix + (cIndex++);
    this.mIndex = 0;

    this._init();
}

RPC.prototype = {

    constructor : RPC,

    _init : function () {

        var me = this,
            cid = this.cid,
            cache = this.cache,
            methods = this.methods,
            callbacks = this.callbacks,
            messager = new Messager();

        function callback (msg) {

            var fn, cb, ret, act,
                message = JSON.parse(msg),
                mid = message.mid,
                name = message.name;

            // 调用方法
            if (name) {

                if (message.epoll) {
                    delete message.epoll;
                    msg = JSON.stringify(message);
                    if (cache[msg]) {
                        return;
                    }
                }

                fn = methods[name];

                if (fn) {
                    try {
                        // 不支持异步
                        ret = fn.apply(me, message.params);
                        act = 'resolve';
                    } catch (e) {
                        ret = e.message;
                        act = 'reject';
                    }
                    
                } else {
                    ret = name + ' function do not exist';
                    act = 'reject';
                }

                cache[msg] = true;

                messager.send(JSON.stringify({
                    cid : message.cid,
                    mid : mid,
                    ret : ret,
                    act : act
                }));
            }

            // 执行回调
            else {

                if ((cb = callbacks[mid]) && cb.state() === 'pending' && message.cid === cid) {
                    cb[message.act](message.ret);
                }
            }
        }

        messager
            .add(this.remote)
            .listen(callback);

        this.messager = messager;
    },

    /**
     * 注册本地方法
     * @params name string 函数名
     * @params params 函数体
     */
    register : function (name, fn) {

        var me = this,
            methods = this.methods,
            method = methods[name];

        // 不支持注册同名函数
        if (method) throw new Error('name function has been registered');

        // (xxx)
        if (!fn) {

            // ({fn1: xxx, fn2: xxx});
            if ($.isPlainObject(name)) {
                $.each(name, function (k, v) {
                    me.register(k, v);
                });
                return this;
            } else if ($.isArray(name)) {
                $.each(name, function (i, v) {
                    me.register(v);
                });
                return this;
            }

            // (function xxx () {})
            fn = name;
            name = fn.name;
            return this;
        }

        if (!name) throw new Error('function name is missing when registering');

        methods[name] = fn;

        return this;
    },

    /**
     * 调用远程方法
     * @params name string 函数名
     * @params params [] | args 函数形参
     * @return defer 注册回调
     */
    call : function (name, params) {

        if (!Array.isArray(params)) {
            params = slice.call(arguments, 1);
        }

        var timer,
            defer = $.Deferred(),
            messager = this.messager,
            message = {
                cid : this.cid,                     // rpc实例唯一标识
                mid : mPrefix + (this.mIndex++),    // 回调消息唯一标识
                name : name,
                params : params
            };

        this.callbacks[message.mid] = defer;

        try {
            messager.send(JSON.stringify(message));
            
            message.epoll = true;
            message = JSON.stringify(message);
            timer = window.setInterval(function () {
                if (defer.state() === 'pending') {
                    messager.send(message);
                } else {
                    window.clearInterval(timer);
                }
            }, 200);

        } catch (e) {
            defer.reject(e.message);
        }

        return defer;
    },

    /**
     * 停止远程监听
     */
    destory : function () {

        this.messager.destory();

        return this;
    }
};

module.exports = RPC;

