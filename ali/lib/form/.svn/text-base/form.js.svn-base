/**
 * @desc 表单验证form类
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-08-19
 */

var $ = require('jquery');
var Field = require('lib/form/field.js');

// default config
var defaults = {};

// form class
var Form = function (config) {

    $.extend({}, defaults, config || {});

    var $el = $(config.el);

    if (!$el.size()) {
        throw new Error('el is incorrect');
    }

    this.$el = $el;
    this.config = config;

    this._init();
};

// prototype
var proto = Form.prototype = {constructor: Form};

$.extend(proto, {

    _init : function () {

        var self = this;

        var $form = this.$el;

        // 遍历表单字段
        // todo: type hidden input
        $form.find('input[name], select[name], textarea[name]').each(function () {

            var $input = $(this);
            var type = $input.attr('type');
            var name = $input.attr('name');
            var rules = $input.data('rules') || {};

            // 丢弃没有规则的field
            // if ($.isEmptyObject(rules)) {
            //     return true;
            // }

            var config = {};

            if (type == 'radio' || type == 'checkbox') {
                config.el = $('[type="' + type + '"][name="' + name + '"]', $form);
            } else {
                config.el = $input;
            }

            if (!self.getField(name)) {
                $.extend(config, $input.data());
                self.addField(config);
            }
        });

    },

    /**
     * @desc 添加字段
     * @param {} config || Field
     */
    addField : function (config) {

        var fields = this.fields || (this.fields = {});

        var field, name;

        if (config instanceof Field) {

            field = config;
        } else {

            config.form = this;
            field = new Field(config);
        }

        fields[field.name] = field;
    },

    /**
     * @desc 添加字段集合
     * @param array
     */
    addFields : function (fields) {

        var self = this;

        $.each(fields, function (index, field) {

            self.addField(field);
        });
    },

    /**
     * @desc 获取字段
     * @param string name
     */
    getField : function (name) {

        var fields = this.fields || (this.fields = {});

        if (name === undefined) {
            return fields;
        }

        return fields[name] || null;
    },

    /**
     * @desc 删除字段
     * @param string | array
     */
    removeField : function (name) {

        var self = this;
        var fields = this.fields || (this.fields = {});

        if ($.isArray(name)) {
            $.each(name, function (index, value) {

                self.removeField(value);
            });
            return this;
        }

        if (name) {
            delete fields[name];
        }

        return this;
    },

    /**
     * @desc 表单验证
     * @return {} defer
     */
    validate : function () {

        var self = this;
        var fields = this.fields || {};
        var filtered = {};

        var defers = $.map(fields, function (field) {

            var name = field.name;

            if (!field.isValid() && !filtered[name]) {

                var defer = field.validate();
                var next = field.getNext();

                // next不支持异步
                if (next) {
                    defer.fail(function () {
                        do {
                            filtered[next.name] = true;
                            next = next.getNext();
                        } while (next);
                    });
                }
                return defer;
            }
        });

        return $.when.apply($, defers)
            .done(function () {
                self.$el.trigger('form-done');
            })
            .fail(function (error) {
                self.$el.trigger('form-fail');
            })
            .always(function () {
                // todo : something
            });
    }
});

module.exports = Form;