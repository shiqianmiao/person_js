/**
 * @desc 图片处理控件(包含裁剪，旋转，上传)
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-01-10
 */

var $ = require('jquery');
var Config = require('config');
var Events  = require('lib/event/event.js');

var swfUrl = Config.baseUrl + require.resolve('./swf/image_croper.swf');

var swfHtml = '' +
    '<object id="{{swfID}}" type="application/x-shockwave-flash" data="{{swfUrl}}" width="100%" height="100%">' +
        '<param name="wmode" value="transparent" />' +
        '<param name="menu" value="false" />' +
        '<param name="scale" value="noScale" />' +
        '<param name="movie" value="{{swfUrl}}"/>' +
        '<param name="quality" value="high" />' +
        '<param name="allowScriptAccess" value="always"/>' +
        '<param name="allowFullscreen" value="true">' +
        '<param name="flashvars" value="{{flashVars}}"/>' +
    '</object>';

function template (str, obj) {

    return str.replace(/{{\s*(\w+)\s*}}/g, function (match, field) {

        return (obj[field] || '');
    });
}


var defaults = {
    picSize : 5 * 1024 * 1024, //5M
    avatarSize : '170,217',
    avatarLabel : ' ',
    avatarSizeLabel : '170X217像素',
    js_handler : '__IMAGE__CROPER__',
    avatarAPI : 'http://upload.273.com.cn/upload2.php',
    sourceAvatar:"http://sta.273.com.cn/widget/imageCroper/default.png"
};

var counter = 0;

function ImageCroper (config) {

    !config && (config = {});

    options = $.extend({swfID : '__IMAGE__CROPER__' + (counter++)}, defaults);

    if (config.maxSize) {
        options.picSize = config.maxSize;
    }

    if (config.cropSize) {
        options.picSize = config.cropSize;
    }

    if (config.uploadTo) {
        options.avatarAPI = config.uploadTo;
    }

    if (config.initVal) {
        options.sourceAvatar = config.initVal;
    }

    var $el = $(config.el);

    if (!$el.length) {
        throw new Error('argument el is incorrect');
    }

    $el.html('正在加载...');

    $el.html(template(swfHtml, {
        swfUrl : swfUrl,
        swfID : options.swfID,
        flashVars : $.param(options)
    }));

    this.$el = $el;
    ImageCroper.instances[options.swfID] = this;
}

ImageCroper.instances = {};
Events.mixTo(ImageCroper.prototype = { constructor : ImageCroper});


window.__IMAGE__CROPER__ = function (obj) {

    var instance = ImageCroper.instances[obj.source];

    if (!instance) return;

    switch (obj.type) {

        case 'init' : instance.emit('ready');
            break;

        case 'cancel' : instance.emit('cancel');
            break;

        case 'avatarSuccess' : instance.emit('success', obj.data || {});
            break;

        case 'avatarError' : instance.emit('error', obj.data || {});
            break;
    }
};

module.exports = ImageCroper;