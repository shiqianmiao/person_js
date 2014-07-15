/**
 * @desc 弹出框助手组件 -- 协助跨域操作
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-12-26
 */

var RPC = require('lib/rpc/rpc');

function DialogHelper () {

    var rpc = new RPC({
        remote : parent
    });

    rpc.register('size', function () {

        return {
            width : Math.max(
                document.documentElement.clientWidth,
                document.body.scrollWidth, document.documentElement.scrollWidth,
                document.body.offsetWidth, document.documentElement.offsetWidth  
            ),
            height : Math.max(
                document.documentElement.clientHeight,  
                document.body.scrollHeight, document.documentElement.scrollHeight,
                document.body.offsetHeight, document.documentElement.offsetHeight
            )
        };
    });

    this.rpc = rpc;
}


DialogHelper.prototype = {

    constructor : DialogHelper,

    close : function () {
        this.rpc.call('close');
        return this;
    },

    refresh : function () {
        this.rpc.call('refresh');
        return this;
    },

    resize : function (width, height) {
        this.rpc.call('resize', width, height);
        return this;
    },

    setTitle : function (title) {
        this.rpc.call('setTitle', title);
        return this;
    },

    setContent : function (content) {
        this.rpc.call('setContent', content);
        return this;
    },

    call : function (name) {
        this.rpc.call(name, Array.prototype.slice.call(arguments,1));
    }
};

module.exports = DialogHelper;
