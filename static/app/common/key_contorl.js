/**
 * @desc 键盘控制控件
 * @copyright (c) 2014 273 Inc
 * @author chenhan <chenhan@273.cn>
 * @since 2014-02-23
 */

var $ = require('jquery');


var KEY_CODE = {
    'left' : 37,
    'up' : 38,
    'right' : 39,
    'bottom' : 40
};

var defaults = {
    namespace : 'keyContorl'
};

/**
 * @params options {}
 *  - key
 *  - callback
 */
module.exports = function(options) {
    
    /**
     * 保护input和textarea不被影响
     */
    function _protect() {
        var $doms = $('input, textarea');
        
        $doms.off(proFocusName).on(proFocusName, cancelEvent)
             .off(proBlurName).on(proBlurName, startEvent);
    }
    
    function cancelEvent() {
        $curDom.off(keyupName, curEvent);
    }
    
    function startEvent() {
        $curDom.on(keyupName, curEvent);
    }
    
    function proEvent(e) {
        var e = e || event;
        if(e.keyCode == keyCode){
            $.proxy(options.callback, options.context)();
        }
    }
    
    function normalEvent(e) {
        var e = e || event;
        if(e.keyCode == keyCode){
            options.callback();
        }
    }
    
    if (!options) {
        throw new Error('options不存在');
    }
    
    if (options && !options.key) {
        throw new Error('key不存在');
    }
    
    if (options && !(options.key in KEY_CODE)) {
        throw new Error('key:' + options.key + '未配置');
    }
    
    if (options && !options.callback) {
        throw new Error('callback不存在');
    }
    
    var config = $.extend({}, defaults, options);

    var keyCode = KEY_CODE[config.key];
    
    var keyupName = 'keyup.' + config.namespace + '.' + config.key;
    var proFocusName = 'focus.' + config.namespace + '.' + config.key;
    var proBlurName = 'blur.' + config.namespace + '.' + config.key;
    var curEvent = options.context ? proEvent : normalEvent;
    var $curDom = $(document);
    
    
    $curDom.off(keyupName).on(keyupName, curEvent);
    
    _protect();
    
    return {
        cancel : cancelEvent,
        start : startEvent
    };
};
