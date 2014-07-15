/**
 * @desc 表单验证field类
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-08-19
 */

var $ = require('jquery');
var Validator = require('lib/form/validator.js')

// field class
var Field = function (config) {

    config = config || {};

    var $el = $(config.el);
    var name = $el.attr('name');

    if (!$el.size()) {
        throw new Error('el is incorrect');
    } else if (!name) {
        throw new Error('name is incorrect');
    }

    this.$el = $el;
    this.name = name;
    this.config = config;
    this.form = config.form;

    this._init();
};

// prototype
var proto = Field.prototype = {constructor: Field};

$.extend(proto, {

    _init : function () {

        var self = this;
        var config = this.config;
        var rules = config.rules || {};

        $.each(rules, function (name, rule) {

            if (!$.isArray(rule)) {

                rule = [rule];
            }

            $.each(rule, function (index, config) {

                var options = {};

                if ($.isPlainObject(config)) {
                    $.extend(options, config);
                }

                options.name = name;

                self.addRule(options);
            });
        });

        if (this.$el.attr('disabled')) {
            this.setDisabled(true);
        }
    },

    /**
     * @desc 添加规则
     * @param {} config || Rule
     */
    addRule : function (config) {

        var rules = this.rules || (this.rules = {});
        var rule, name;

        if (config instanceof Validator.Rule) {

            rule = config;
            name = rule.name;
        } else {

            name = config.name;
            delete config.name;
            rule = Validator.getRule(name, $.extend(config, {$el : this.$el}));
        }

        if (!rule) {
            return this;
        }

        // 同一个rule多个条件并存
        if (!Validator.rules[name]) {
            rules[name] = rule;
        } else {
            if (!rules[name]) {
                rules[name] = [];
            } 
            rules[name].push(rule);
        }

        if (!this.required && name === 'required') {
            this.required = true;
        }

        if (this.isValid()) {
            this.setValid(false);
        }

        return this;
    },

    /**
     * @desc 添加规则集合
     * @param array
     */
    addRules : function (rules) {

        var self = this;

        $.each(rules, function (index, rule) {

            self.addRule(rule);
        });
    },

    /**
     * @desc 删除规则
     * @param string | array
     */
    removeRule : function (name) {

        var self = this;
        var rules = this.rules || (this.rules = {});

        if ($.isArray(name)) {
            $.each(name, function (i, v) {

                self.removeRule(v);
            });
            return this;
        }

        if (name) {
            delete rules[name];
        }

        if (this.required && name === 'required') {
            this.required = false;
        }

        if (this.isValid()) {
            this.setValid(false);
        }

        return this;
    },

    /**
     * @desc 获取规则
     * @param {} config
     */
    getRule : function (name) {

        var rules = this.rules || (this.rules = {});

        if (name === undefined) {
            return rules;
        }

        return rules[name] || null;
    },

    /**
     * @desc 字段验证
     * @return {} defer
     */

    validate : function (flag) {

        var self = this;
        var value = this.getVal();
        var rules = this.rules || {};

        var defers = [];
        var valid = true;

        // 下一个表单验证,只在flag不为true时去取,要不然双向next会死循环报错
        if (!flag) {
            var next = this.getNext();
        }

        // reset valid
        this.setValid(false);

        // disabled | 非required
        if (this.isDisabled() || (!this.isRequired() && this.isEmpty(value))) {
            return $.Deferred().done(function () {
                self.setValid(true);
                $(self.$el[0]).trigger('field-done', [!flag]);
            }).resolve();
        }

        $.each(rules, function (name, rule) {

            if (!$.isArray(rule)) {
                rule = [rule];
            }

            $.each(rule, function (i, r) {

                var defer = r.validate({value:value});

                var state = defer.state();

                defers.push(defer);

                // 屏蔽没必要的验证
                if (state === 'rejected') {
                    valid = false;
                    return false;
                }
            });

            if (!valid) {
                return false;
            }
        });

        return $.when.apply($, defers)
            .done(function () {

                self.setValid(true);

                if (next) {
                    // for next disabled | required
                    next.validate(true);
                } else {
                    $(self.$el[0]).trigger('field-done');
                }
            })
            .fail(function (msg) {

                self.setValid(false);
                $(self.$el[0]).trigger('field-fail', [msg]);
            })
            .always(function () {
                // todo : something
            });
    },

    /**
     * @desc 获取字段值
     * @return []
     */
    getVal : function () {

        var $el = this.$el;

        var value = $.map($el.serializeArray(), function (item) {
            return $.trim(item.value);
        });

        if ($el.size() === 1 && !$el.is('select[multiple]')) {
            value = value[0] || '';
        } 

        return value;
    },

    /**
     * @desc 获取关联的下一个field
     * @return bool
     */

    getNext : function () {

        var config = this.config;

        return config.next ? this.form.getField(config.next) : null;
    },

    /**
     * @desc 字段验证状态
     * @return bool
     */
    isValid : function () {

        return !!this.valid;
    },

    /**
     * @desc 设置字段验证状态
     * @return bool
     */
    setValid : function (valid) {

        this.valid = !!valid;
    },

    /**
     * @desc 字段有效状态
     * @return bool
     */
    isDisabled : function () {

        return !!this.disabled;
    },

    /**
     * @desc 字段必填项
     * @return bool
     */
    isRequired : function () {

        return !!this.required;
    },

    /**
     * @desc 字段值是否为空
     * @return bool
     */
    isEmpty : function (value) {

        !value && (value = this.getVal());

        if ($.isArray(value) && value.length === 0) {
            return true;
        }

        if (!$.isArray(value) && value === '') {
            return true;
        }

        return false;
    },

    /**
     * @desc 设置字段有效状态
     * @return bool
     */
    setDisabled : function (disabled) {

        var $el = this.$el;
 
        if (disabled == undefined) {
            disabled = true;
        }

        disabled = !!disabled;

        if (disabled) {

            $el.trigger('field-disabled');

        } else {

            $el.trigger('field-disabled', [false]);
        }

        this.disabled = disabled;
    },
    /**
     * @desc 获取配置(属性)
     * @return bool
     */
    getAttr : function (name) {

        if (!name) {
            return this.config;
        } else {
            return this.config[name];
        }
    }
});

module.exports = Field;