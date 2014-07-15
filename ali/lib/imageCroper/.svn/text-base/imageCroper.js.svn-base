var $ = require('jquery');
var Events = require('lib/event/event.js');

var ImageCroper = function (config) {
    var self = this;
    $.extend(this, new Events());

    var defer = $.Deferred();
    var $el = self.$el = $(config.$el);

    this
        .on('fetched', function () {
            defer.resolve();
        })
        .on('fetch-fail', function () {
            defer.reject();
        });

    this.ready = defer.done;

    if ($el[0].tagName === 'IMG') {
        $('<img>')
            .load(function () {
                self.width = this.width;
                self.height = this.height;

                if ($el[0].complete) {
                    init();
                } else {
                    $el.on('load', init);
                }
            })
            .attr('src', $el.attr('src'));
    } else {
        init();
    }

    function init () {
        var pattern = /(|_[\w-]*)(.[a-z]{3,})$/i;
        var url = $el.data('url') || $el.attr('src');
        self.url = url;
        self.uploadTo = config.uploadTo;

        ImageCroper.instance[self.url] = self;
        ImageCroper.flash.done(function () {
            self.createFlashInstance();
            self.fetch();
        });
    }
}

$.extend(ImageCroper, new Events());

var defer = $.Deferred();

ImageCroper.flash = defer.promise();
ImageCroper.instance = {};
ImageCroper.debug = false;

ImageCroper.log = function () {
    if (this.debug && console && console.log) {
        console.log.apply(console, arguments);
    }
    
}

ImageCroper.init = function (config) {
    var flash_url = G.config('baseUrl') + require.resolve('./swf/ImageCroper.swf');
    $('body').prepend('' +
        '<object style="position: absolute; top: -10000px; left: -10000px" id="__ImageRotater__SWF_CONTAINER" type="application/x-shockwave-flash" data="' + flash_url + '" width="1" height="1">' +
            '<param name="wmode" value="opaque" />' +
            '<param name="movie" value="' + flash_url + '" />' +
            '<param name="quality" value="high" />' +
            '<param name="allowScriptAccess" value="always" />' +
            '<param name="flashvars" value="" />' +
        '</object>');

    ImageCroper.$flash = $('#__ImageRotater__SWF_CONTAINER');
};

ImageCroper.flashReady = function () {
    defer.resolve();
    this.emit('flash::ready');
};

ImageCroper.loadPolicyFile = function (url) {
    ImageCroper.callFlash('loadPolicyFile', [url]);
}

// Private: callFlash handles function calls made to the Flash element.
// Calls are made with a setTimeout for some functions to work around
// bugs in the ExternalInterface library.
ImageCroper.callFlash = function (functionName, argumentArray) {
    var returnValue, returnString;

    argumentArray = argumentArray || [];

    // Flash's method if calling ExternalInterface methods (code adapted from MooTools).
    try {
        returnString = this.$flash[0].CallFunction('<invoke name="' + functionName + '" returntype="javascript">' + __flash__argumentsToXML(argumentArray, 0) + '</invoke>');
        returnValue = eval(returnString);
    } catch (ex) {
        // console.log("Exception calling flash function '" + functionName + "': " + ex.message);
    }

    // Unescape file post param values
    if (returnValue != undefined && typeof returnValue.post === "object") {
        returnValue = this.unescapeFilePostParams(returnValue);
    }

    return returnValue;
};

ImageCroper.prototype.reset = function (w, h) {
    this.callFlash('reset');
}

ImageCroper.prototype.createFlashInstance = function () {
    this.callFlash('createInstance');
};

ImageCroper.prototype.fetch = function () {
    this.callFlash('fetch');
};

ImageCroper.prototype.rotate = function (deg) {
    this.callFlash('rotate', deg);
}

ImageCroper.prototype.cut = function (x, y, w, h) {
    this.callFlash('cut', x, y, w, h);
}

ImageCroper.prototype.upload = function (params) {

    params || (params = {});
    this.callFlash('upload', this.uploadTo, params)
}

ImageCroper.prototype.callFlash = function (method) {
    var args = [].slice.call(arguments, 1);
    // console.log([this.url].concat(args));
    ImageCroper.callFlash(method, [this.url].concat(args));
}

ImageCroper.init();


ImageCroper
    .on('fetched', function (url) {
        ImageCroper.instance[url].emit('fetched');
    })
    .on('fetch-fail', function (url) {
        ImageCroper.instance[url].emit('fetch-fail');
    })
    .on('uploaded', function (url, data) {
        ImageCroper.instance[url].emit('uploaded', data);
    })
    .on('upload-fail', function (url) {
        ImageCroper.instance[url].emit('upload-fail');
    });

window.ImageCroper = module.exports = ImageCroper;

