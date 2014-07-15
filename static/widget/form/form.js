/**
 * @desc 表单验证组件
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-08-20
 */

var $ = require('jquery');
var Form = require('lib/form/form.js');
var Widget = require('lib/widget/widget.js');

module.exports = Widget.define({
    name : 'form',
    attrs : {
        'fieldClass' : 'ui-field',
        'focusClass' : 'ui-field-focus',
        'doneClass' : 'ui-field-done',
        'failClass' : 'ui-field-fail',
        'processClass' : 'ui-field-process'
    },
    events : {
        'field-fail' : 'onFieldFail',
        'field-done' : 'onFieldDone',
        'field-disabled :input' : 'onFieldDisabled',
        'click button[type=submit]' : 'onSubmit',
        'focus input[name], textarea[name]' : 'onFocus',
        'field-validate' : 'onValidate',
        'blur input[name!=radio][name!=checkbox], textarea[name]' : 'onValidate',
        'change select[name], input[type=radio], input[type=checkbox]' : 'onValidate'
    },
    init : function () {
        var $el = this.$el;

        if (!$el.size() || $el[0]['tagName'].toLowerCase() !== 'form') {
            throw new Error('el is incorrect');
        }

        this.form = new Form({
            el : $el
        });

        this.onInit();
    },
    submit : function () {
        return true;
    },
    onInit : function () {

        var fields = this.form.getField();

        // 初始错误信息
        $.each(fields, function (name, field) {

            var $el = field.$el;
            var $target = $(field.getAttr('tipTarget'));

            var type = $el.attr('type');
            var filtered = field.getAttr('filtered');
            var postValue = field.getAttr('postValue');
            var errorMessage = field.getAttr('errorMessage');
            var defaultMessage = field.getAttr('defaultMessage') || '';

            // 后端返回
            if (postValue != undefined) {

                if (type === 'checkbox' || type === 'radio') {

                    postValue = $.isArray(postValue) ? postValue : [postValue];

                    for (var i = 0, l = postValue.length; i < l; i++) {

                        for (var j = 0, m = $el.size(); j < m; j++) {

                            var $tmp = $($el[j]);
                            if ($tmp.val() == postValue[i]) {
                                $tmp.attr('checked', 'checked');
                                break;
                            }
                        }
                    }
                } else {
                    $el.val(postValue);
                }

                if (errorMessage) {
                    $($el[0]).trigger('field-fail', [errorMessage]);
                } else {
                    $($el[0]).trigger('field-done');
                }
            } else if ($target.size()){

                if (!filtered) {
                    $target.html(defaultMessage);
                }

            }
        });

        var offset = this.$el.find('.ui-field-fail').offset();

        if (offset) {
            $('html , body').scrollTop(offset.top);
        }
    },
    onFocus : function (e) {

        var $input = $(e.target);
        var name = $input.attr('name');

        var form = this.form;
        var field = form.getField(name);

        if (!field) return;

        var focusMessage = field.getAttr('focusMessage') || '';
        var $target = $(field.getAttr('tipTarget'));

        if ($target.size !== 0) {
            $target.html(focusMessage)
                .parents('.' + this.getAttr('fieldClass'))
                .removeClass(this.getAttr('doneClass'))
                .removeClass(this.getAttr('failClass'))
                .removeClass(this.getAttr('processClass'))
                .addClass(this.getAttr('focusClass'));
        }
    },
    onValidate : function (e) {

        var $input = $(e.target);
        var name = $input.attr('name');

        var form = this.form;
        var field = form.getField(name);

        if (!name || !field) return;

        var $target = $(field.getAttr('tipTarget'));

        if ($target.size !== 0) {
            $target
                .parents('.' + this.getAttr('fieldClass'))
                .removeClass(this.getAttr('focusClass'))
                .addClass(this.getAttr('processClass'));
        }

        field.validate();

    },
    onFieldFail : function (e, message) {

        var $input = $(e.target);
        var name = $input.attr('name');

        var form = this.form;
        var field = form.getField(name);

        if (!field) return;

        var errorMessage = message || '';
        var $target = $(field.getAttr('tipTarget'));

        if ($target.size !== 0) {
            $target.html(errorMessage)
                .parents('.' + this.getAttr('fieldClass'))
                .removeClass(this.getAttr('processClass'))
                .removeClass(this.getAttr('doneClass'))
                .addClass(this.getAttr('failClass'));
        }
    },
    onFieldDone : function (e, tag) {

        var $input = $(e.target);
        var name = $input.attr('name');

        var form = this.form;
        var field = form.getField(name);

        if (!field) return;

        var message = '';
        var $target = $(field.getAttr('tipTarget'));
        var $parent = $target.parents('.' + this.getAttr('fieldClass'));

        if ($target.size !== 0) {
            $target.html(message);

            $parent.removeClass(this.getAttr('processClass'))
                .removeClass(this.getAttr('failClass'));

            // disabled | 非required
            if (!tag) {
                $parent.addClass(this.getAttr('doneClass'));
            }
        }
    },
    onFieldDisabled : function (e, disabled) {

        var $input = $(e.target);
        var $hidden = null;
        var hiddenName = $input.data('hiddenName');

        if (hiddenName) {
            $hidden = $input.next('[name=' + hiddenName + ']');
            if (!$hidden.size()) {
                $hidden = $('<input>').attr({
                    type : 'hidden',
                    name : hiddenName
                });

                $input.after($hidden);
            }
        }

        if (disabled === false) {

            if ($hidden) {
                $hidden.val(0).attr('disabled', 'disabled');
            }
            $input.removeAttr('disabled');
        } else {

            if ($hidden) {
                $hidden.val(1).removeAttr('disabled');
            }
            $input.attr('disabled', 'disabled');
        }

    },
    onSubmit : function (e) {

        var $form = this.$el;
        var $button = $(e.target);


        if ($button.data('disabled')) {
            return false;
        }

        // 阻止默认操作（表单提交）
        e.preventDefault();

        var self = this;
        var form = this.form;
        var onSubmit = this.submit;

        // 禁止button
        $button.data('disabled', true)
            .addClass('ui-button-disabled');

        form.validate()
            .done(function () {

                if (onSubmit.apply(self) !== false) {
                    $form.submit();
                } else {
                    $button.data('disabled', false)
                        .removeClass('ui-button-disabled');
                }
            })
            .fail(function () {

                var offset = $form.find('.ui-field-fail').offset(),
                    $doc = $(document),
                    winTop,
                    winBottom;

                if (offset) {
                    winTop = $doc.scrollTop();
                    winBottom = $doc.scrollTop() + window.screen.availHeight;
                    if (offset < winTop || offset > winBottom) {
                        $('html , body').scrollTop(offset.top);
                    }
                }

                $button.data('disabled', false)
                    .removeClass('ui-button-disabled');
            });
    }
});
