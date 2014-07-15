/**
 * @desc  详情页，车况保证
 */

var $ = require('jquery');
var Dialog = require('widget/dialog/dialog.js');
var Widget = require('lib/widget/widget.js');

var boxTpl = '<div class="pop_frame"><div class="pop_box_content clearfix">' +
        '<div class="left">' +
            '<p><img src="<%=image%>"></p>' +
          '<dl class="clearfix">' +
            '<dt>图示说明：</dt>' +
                '<dd><i class="i2"></i>有事故痕迹</dd>' +
                '<dd><i class="i1"></i>未见事故痕迹</dd>' +
          '</dl>' +
        '</div>' +
        '<div class="right">' +
          '<table border="0" cellspacing="0" cellpadding="0" class="table_style2">' +
            '<tbody>' +
                '<%=content%>' +
            '</tbody>' +
          '</table>' +
        '</div>' +
    '</div></div>';

var title = '车架结构图';

var CarCondition = function(options) {
    if (!options) {
        throw new Error('配置信息为空');
    }

    this.config = $.extend({}, CarCondition.defaults, options);

    this._init();
}

CarCondition.defaults = {};

var proto = CarCondition.prototype = {};

$.extend(proto, {
    dialog : null
    , _init : function() {
        var config = this.config;
        if (!config) {
            throw new Error('配置不能为空');
        }

        if (!config.$el) {
            throw new Error('$el不存在');
        }

        config.$el.on('click', $.proxy(this._initBox, this)).click();
    }
    , _initBox : function() {
        var $content = $(Widget.template(boxTpl, this.config.data));
        var me = this;
        this._createDialog(title, $content);
    }
    , _createDialog : function(title, $content, cb) {
        this.dialog = new Dialog({
            title : title,
            padding : '0px',
            escAble : true,
            skin : 'gray',
            content : $content,
            close : cb ? cb : null
        });
    }
});

module.exports = CarCondition;