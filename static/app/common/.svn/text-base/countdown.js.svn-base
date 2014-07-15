/**
 * 倒计时 v0.0.1
 * Created by han on 4/14/14.
 */

"use strict";
var $ = require('jquery');


var Countdown = function(options) {
    if (!options) {
        throw new Error('配置信息不存在');
    }
    this.config = $.extend({}, Countdown.defaults, options);

    this.init();
};

var prop = Countdown.prototype = {};
(function(window, undefined) {
    var unitName = {
        milliSeconds: 1,
        seconds: 2,
        minutes: 3,
        hour: 4
    };

    var unitDelay = {
        milliSeconds: 1,
        seconds: 1000,
        minutes: 60000
    };

    var unitInfo = {
        milliSeconds: {
            max: 1000,
            rounding: 'seconds'
        },
        seconds: {
            max: 60,
            rounding: 'minutes'
        },
        minutes: {
            max: 60,
            rounding: 'hour'
        },
        hour: {
            max: 60,
            rounding: null
        }
    }

    var rSymbol = /^[:：-]$/,
        rNum = /^\d+$/,
        rDecide = /^((\d+)\s*([:：-])\s*)?((\d+)\s*([:：-])\s*)?(\d+)$/;

    $.extend(prop, {
        init: function() {
            var that = this,
                config = that.config;

            try {
                that.decide();
                that.setTimer();
            } catch (e) {
                console.log(e.stack);
            }
        },
        //判断输入类型,分类数据
        decide: function() {
            var that = this,
                config = that.config,
                defaultVal = that.default = config.val,
                match = that.match = rDecide.exec(defaultVal),
                decided = this.decided = [],
                curUnitInfo,
                minVal,
                i;

            if (match) {
                minVal = parseInt(match[match.length - 1]);
                if (minVal) {
                curUnitInfo = unitInfo[config.minUnit];
                decided[0] = {
                    val: minVal,
                    unitInfo: curUnitInfo
                };
                for (i = match.length - 2; i > 0; --i) {
                    if (rSymbol.test(match[i])) {
                        decided[decided.length - 1].prevSym = match[i];
                    } else if (rNum.test(match[i])) {
                        curUnitInfo = unitInfo[curUnitInfo.rounding];
                        decided.push({
                            val: parseInt(match[i]),
                            unitInfo: curUnitInfo
                        });
                    }
                }
                } else {
                    throw new Error('没有取得最小单位上的数值');
                }
            } else {
                throw new Error('val格式不正确');
            }
        },

        //设置定时器
        setTimer: function() {
            var that = this,
                config = that.config,
                delay = unitDelay[config.minUnit],
                isEnd,
                timer;
            timer = setInterval(function() {
                that.exec();
                isEnd = that.checkEnd();
                if (isEnd) {
                    config.onEnd();
                    clearInterval(timer);
                } else {
                    config.onCount(that.getFormated());
                }
            }, delay);
        },
        exec: function() {
            var that = this,
                decided = that.decided,
                length = 0,
                flag = false,
                sDecide;

            while (decided[length]) {
                sDecide = decided[length];
                flag = that.down(sDecide);
                if (!flag) {
                    ++length;
                } else {
                    break;
                }
            }
            that.formatCount();
        },
        down: function(sDecide) {
            --sDecide.val;
            if (sDecide.val < 0) {
                sDecide.val += sDecide.unitInfo.max;
                return false;
            } else {
                return true;
            }
        },
        checkEnd: function() {
            var that = this,
                decided = that.decided,
                length = decided.length,
                i;
            for (i = 0; i < length; ++i) {
                if (decided[i].val !== 0) {
                    return false;
                }
            }
            return true;
        },
        formatCount: function() {
            var that = this,
                decided = that.decided,
                formated = '',
                i;

            for (i = decided.length - 1; i >= 0; --i) {
                if (decided[i].prevSym !== undefined) {
                    formated += decided[i].prevSym;
                }
                formated += decided[i].val;
            }
            this.formated = formated;
        },
        getFormated: function() {
            return this.formated;
        }
    });
} (window, undefined));


//配置
Countdown.defaults = {
    type: null,
    minUnit: 'seconds',
    onCount: $.noop,
    onEnd: $.noop
};

module.exports = Countdown;