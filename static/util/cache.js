/**
 * @desc 从前端缓存(cache-control)或从后端缓存(etag)获取uuid
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-12-02
 */

var Cache = exports;

var done = module.async();

// var url = 'http://static.273.cn/' + require.resolve('./uuid.php');
var url = 'http://www.273.cn/uuid.php';

var uuid;

var win = window;
var doc = document;
var head = doc.head || doc.getElementsByTagName('head')[0] || doc.documentElement;
var noop = function () {};

function send (url, fnDone, fnFail) {

    var node  = doc.createElement('script');
    var timer = win.setTimeout( function () {
        head.removeChild(node);
        fnFail();
    }, 1000 * 10 );// 10s超时处理

    !fnDone && (fnDone = noop);
    !fnFail && (fnFail = noop);

    node.setAttribute('type', 'text/javascript');
    node.setAttribute('charset', 'utf-8' );
    node.setAttribute('src', url);
    node.setAttribute('async', true);

    node.onload = node.onreadystatechange = function(){
        if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete" ) {
            win.clearTimeout(timer);
            node.onload = node.onreadystatechange = null;
            fnDone();
        }
    };

    node.onerror = function () {
        win.clearTimeout(timer);
        head.removeChild(node);
        fnFail();
    };

    head.appendChild( node );
}

Cache.get = function () {
    return uuid;
};

Cache.set = function () {
    send(url);
};

send(url, function () {
    uuid = window.__EQS_UUID__;
    done();
}, function () {
    Cache.get = noop;
    Cache.set = noop;
    done();
});
