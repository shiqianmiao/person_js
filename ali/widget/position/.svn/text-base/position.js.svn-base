/**
 * @desc 定位组件
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-11-26
 */

var $ = require('jquery');
var Ua = require('util')['ua'];

var Position = exports,
    isIE6 = (Ua.ie == 6) ? true : false;

// 目标元素相对于基准元素定位
Position.pin = function (pinObj, baseObj) {

    var defer = $.Deferred(),
        fixed = !!pinObj.fixed,
        pinEl, baseEl;

    pinObj = normalizeObj(pinObj);
    baseObj = normalizeObj(baseObj);

    $pinEl = $(pinObj.el);
    $baseEl = $(baseObj.el);

    if ($pinEl[0] === $baseEl[0]) {
        throw new Error('pinEl adn baseEl must be different')
    }


    normalizeXY(pinObj, 'x');
    normalizeXY(pinObj, 'y');
    normalizeXY(baseObj, 'x');
    normalizeXY(baseObj, 'y');

    var baseOffset = baseObj.offset();
    var $offsetParent = $pinEl.offsetParent();
    var parentOffset = $offsetParent.offset();

    var $body = $(document.body);
    var $html = $('html');
    var $win = $(window);

    var scrollTop = $win.scrollTop();
    var scrollLeft = $win.scrollLeft();
    if (!fixed && $offsetParent[0] === document.body) {
        parentOffset.top = 0;
        parentOffset.left = 0;
    }

    // fixed
    if (fixed) {
        var left = baseOffset.left + baseObj.x - pinObj.x;
        var top = baseOffset.top + baseObj.y - pinObj.y;
        // simulate fixed
        if (isIE6) {

            left -= scrollLeft;
            top -= scrollTop;
            // note : 不要对body处理异常情况
            if ($html.css('backgroundAttachment') !== 'fixed' && $body.css('backgroundAttachment') !== 'fixed') {
                $html.css({
                    zoom: 1, // 避免偶尔出现body背景图片异常的情况，图片乱成一团
                    backgroundImage: 'url(about:blank)',
                    backgroundAttachment: 'fixed'
                });
            };
            $pinEl.css('position', 'absolute');
            $pinEl[0].style.setExpression('top','(document).documentElement.scrollTop' + '+' + top);
            $pinEl[0].style.setExpression('left','(document).documentElement.scrollLeft' + '+' + left);

        } else {
            if ($baseEl[0] != window && $baseEl[0] != document) {
                left -= scrollLeft;
                top -= scrollTop;
            }
            $pinEl.css({
                position : 'fixed',
                left : left,
                top : top
            });
        }
    }
    // absolute
    else {
        $pinEl.css({
            position : 'absolute',
            left : baseOffset.left + baseObj.x - pinObj.x - parentOffset.left,
            top : baseOffset.top + baseObj.y - pinObj.y - parentOffset.top
        });
    }

    defer.resolve();
    return defer;
};

// 格式化成标准定位对象{el: dom, x: number, y: number}
function normalizeObj (obj) {

    obj = $(obj)[0] || {};

    // obj为dom对象
    if (obj.nodeType) {
        obj = {
            el : obj
        }
    }

    var result = {
        el : $(obj.el)[0] || document,
        x : obj.x || 0,
        y : obj.y || 0
    };

    var $el = $(result.el);

    result.size = function () {

        return {
            x : $el.outerWidth(),
            y : $el.outerHeight()
        }
    };

    result.offset = function () {

        return $el.offset() || {top:0, left: 0};
    };

    return result;
}

// 格式化xy -> 数值
function normalizeXY (obj, type) {

    var coor = obj[type];

    coor = coor + '';

    coor = coor.replace(/px/gi, '');

    if (/\D/.test(coor)) {
        coor = coor.replace(/(?:left|top)/gi, '0%').replace(/center/gi, '50%').replace(/(?:right|bottom)/gi, '100%');
    }

   if (coor.indexOf("%") > -1) {
        coor = coor.replace(/(\d+(?:\.\d+)?)%/gi, function(m, d) {
            return obj.size()[type] * (d / 100);
        });
    }

    // + - * /
    if (/[+\-*\/]/.test(coor)) {
        try {
            coor = new Function("return " + coor)();
        } catch (e) {
            throw new Error('invalid ' + type + ' value: ' + coor);
        }
    }

    obj[type] = numberize(coor);
}

function numberize(str) {
    return parseFloat(str, 10) || 0;
}



