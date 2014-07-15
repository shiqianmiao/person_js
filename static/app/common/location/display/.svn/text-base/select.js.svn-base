/**
 * @fileoverview 地域选择select实现方案
 * @author chenhan <chenhan@273.cn>
 */
'use strict';
var $ = require('jquery');

/**
 * 字段对象基本型
 * @param {!Object} options
 * @param {!$} options.$el 展示的节点对象
 * @param {!string} options.type dom类型
 * @param {string} options.defTitle 首个option的text
 * @param {number} options.defVal 默认值
 * @param {!$} options.$postEl 真正用来传值的节点对象
 * @param {function} options.event 取数据的函数
 * @constructor
 */
function Field(options) {
    this.$el = options.$el;
    this.type = options.type;
    this.defTitle = options.defTitle;
    this.defVal = options.defVal;
    this.$postEl = options.$postEl || options.$el;
    this.cache = [];
    this.event = null;

    if (options.$postEl) {
        this.defVal = parseInt(this.$postEl.val());
    }
}

var prop = Field.prototype = {};

(function(window, undefined) {
    var NAMESPACE = '.widget.location';

    $.extend(prop, {
        EV_CHANGE: 'change' + NAMESPACE,
        EV_SET_VALUE: 'setValue' + NAMESPACE,
        EV_INIT_VALUE: 'initValue' + NAMESPACE,
        display: function(defTitle, data) {
            var self = this;
            var fragment = document.createDocumentFragment();
            if (defTitle) {
                var $option = $('<option>');
                $option.val('').text(defTitle);
                fragment.appendChild($option[0]);
            }

            self.show();
            if ($.isArray(data)) {
                $.each(data, function(i, obj) {
                    var $option = $('<option>');
                    $option.val(obj.id).text(obj.name);
                    fragment.appendChild($option[0]);
                });
            //data === null 说明是回调无值,undefined 说民
            } else if (data === null) {
                self.hide();
            }
            self.$el.html(fragment);
            return this;
        },
        empty: function() {
            var self = this;
            self.$el.empty();
            return this;
        },
        evCallback: function(defTitle, data) {
            var self = this,
                nextField = self.next;
            this.display.call(nextField, defTitle, data);
            return this;
        },
        val: function(val) {
            this.$postEl.val(val).trigger('field-validate');
            this.$el.val(val);
            return this;
        },
        _initValue: function(val) {
            this.$el.trigger(prop.EV_INIT_VALUE, val);
        },
        setVal: function(val) {
            this.$el.trigger(prop.EV_SET_VALUE, val);
            return this;
        },
        /**
         * 取得隐藏用方法
         * @param name
         * @returns {*}
         */
        getHideFunc: function(name) {
            var funcList = {
                /**
                 * @this Field
                 */
                hide: function() {
                    this.$el.hide();
                },
                /**
                 * @this Field
                 */
                disabled: function() {
                    this.$el.attr('disabled', 'disabled');
                }
            };
            if (name in funcList) {
                return funcList[name];
            }
        },
        /**
         * 取得显示用方法
         * @param name
         * @returns {*}
         */
        getShowFunc: function(name) {
            var funcList = {
                /**
                 * @this Field
                 */
                hide: function() {
                    this.$el.show();
                },
                /**
                 * @this Field
                 */
                disabled: function() {
                    this.$el.removeAttr('disabled');
                }
            };
            if (name in funcList) {
                return funcList[name];
            }
        },
        /**
         * 设置初始化事件
         * @returns {{field: Field, defer: defer}} 包含field节点和延迟对象的object
         */
        evInit: function(val) {
            var self = this,
                eventFunc = self.event,
                defer;
            if (eventFunc) {
                defer = self._displayCallback(val);
            } else {
                defer = $.Deferred();
                defer.resolve();
            }
            return {
                field: self,
                defer: defer
            };
        },
        /**
         * 设置赋值事件
         */
        evSet: function(val) {
            var self = this,
                eventFunc = self.event;
            if (eventFunc) {
                self._displayCallback(val, function() {
                    self.val(val);
                });
            } else {
                self.val(val);
            }
        },
        /**
         * 设置change事件
         */
        evChange: function(val) {
            var self = this,
                nextField = self.next;

            if (val >= 0) {
                self._displayCallback(val);
            } else {
                nextField.display(nextField.defTitle);
            }
        },
        /**
         * 执行事件,取得数据,改变下一个对象的渲染
         * @param {!number} val 赋值
         * @param {Function} callback 取得数据后的回调
         * @returns {defer|undefined} 延迟对象
         * @private
         */
        _displayCallback: function(val, callback) {
            var self = this,
                cache = self.cache,
                eventFunc = self.event,
                nextField = self.next,
                defer;

            //清空以便触发表单验证
            nextField.empty();
            self.val(val);
            if (cache[val]) {
                self.evCallback(nextField.defTitle, self.cache[val]);
                if (callback) {
                    callback();
                }
            } else {
                defer = eventFunc(val).done(function(data) {
                    data = typeof data === 'undefined' ? null : data;
                    self.evCallback(nextField.defTitle, data);
                    cache[val] = data;
                    if (callback) {
                        callback();
                    }
                });
            }
            return defer;
        },
        /**
         * 重新选择选项后,重置需要重置的选择框(两级后的选择框)
         */
        reset: function() {
            var self = this,
                nextField = self.next;
            if (!nextField) {
                return;
            }
            nextField = nextField.val('').next;
            while (nextField) {
                nextField.display(nextField.defTitle).val('');
                nextField = nextField.next;
            }
        }
    });
} (window, undefined));

module.exports = Field;
