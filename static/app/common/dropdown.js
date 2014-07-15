/**
 * @desc 下拉控件
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-06-25
 */

var $ = require('jquery');


var Dropdown  = function ($el, tip, right) {

    var me = this;

    this.$el = $el = $($el);
    this.cb = [];
    var name = $el.attr('name');

    if (!$el.size() || !name) return null;

    right = right ? 'right' : '';
    tip = this.tip = tip || '请选择';

    var $input = this.$input = $('<input>');
    var $span = this.$span = $('<span>');

    $input.attr({
        type : 'hidden',
        name : name
    })

    $span.text(tip)
        .addClass('selected' + ' ' + right)
        .insertBefore($el);

    $input.insertAfter($el);

    $el.delegate('dd, dt', 'click', function () {

        var $this = $(this);
        var value = $this.attr('value');
        var name = $this.text() || $this.attr('name');

        if (value !== me.value) {
            me.value = value;
            $input.val(value);
            $span.text(name);
            $el.trigger('change', [value]);
        }
        $el.removeClass('click');
        return false;
    }).mouseleave(function () {
        $el.removeClass('click');
    });

    $span.click(function () {

        if ($el.css('display') == 'none' && $el.children().size() > 1) {
            $el.addClass('click');
        } else {
            $el.removeClass('click');
        }
    });
}



var proto = Dropdown.prototype = {};

proto.on = function (type, callback) {

    this.$el.on(type, callback);

    return this;
};

proto.off = function (type, callback) {

    this.$el.off(type, callback);

    return this;
}

proto.trigger = function (type) {

    this.$el.trigger(type);

    return this;
}

proto.fix = function (num) {

    if (num > 12) {

        this.$el.css({
            overflowY : 'scroll',
            height : 288
        });
    } else {
        this.$el.css({
            overflowY : 'auto',
            height : 'auto'
        });
    }
}

proto.reset = function () {

    this.$el.css({
        overflowY : 'auto',
        height : 0
    });
}

proto.error = function () {
    this.$span.css('borderColor', '#DD0100');
    return this;
}

proto.ok = function () {
    this.$span.css('borderColor', '#cecece');
    return this;
}

proto.validate = function (cb) {

    if ($.isFunction(cb)) {
        this.cb.push(cb);
    } else {
        cb = this.cb
        for (var i = 0, l = cb.length; i < l; i ++) {

            if (!cb[i].apply(this)) {
                this.error();
                return false;
            }
        }
    }
    this.ok()
    return true;
}

module.exports = Dropdown;



 

