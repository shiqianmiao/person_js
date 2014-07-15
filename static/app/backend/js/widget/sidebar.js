/**
 * @desc 菜单组件
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-09-12
 */

var $ = require('jquery');
var _ = require('underscore');
var Backend = require('app/backend/js/backend.js');
var Backbone = require('lib/backbone/backbone.js');

var menuTpl = '' +
'<li <% if (typeof active !== "undefined") {%>class="active" <%}%> >' +
    '<% if (text != "notsee") {%><h2><a href="javascript:void(0)"><i class="<%=icon%>"></i><%=text%></a></h2><%}%>' +
    '<% if(menu) {%>' +
        '<ul class="nav nav-list">' +
            '<% _.each(menu, function (m) {%>' +
            '<li <% if (m.active) {%>class="active" <%}%>><a href="<%=m.url%>" target="<%=m.target || \"_self\"%>"><%=m.text%></a></li>' +
            '<%});%>' +
        '</ul>' +
    '<%}%>' +
'</li>';

var SideBar = Backbone.View.extend({

    // 数据源
    source : {},

    template : _.template(menuTpl),

    events : {
        'click h2 a' : 'toggle'
    },
    constructor : function (el) {

        this.el = el;
        Backbone.View.apply(this, arguments);
    },
    initialize : function () {

        var $el = this.$el;

        this.source = $el.data('source') || {};
        this.$menu = this.$('#menu');

        this.render();
    },
    render : function () {

        var self = this;
        var menu = this.source.menu || {};
        var html = _.map(menu, function (m) {

            return self.template(m);
        }).join('');

        this.$menu.html(html);
    },
    toggle : function (e) {

        var $a = $(e.currentTarget);
        var $li = $a.closest('li');

        if ($li.hasClass('active')) {
            $li.removeClass('active');
        } else {
            $li.addClass('active');
        }
    }
});

module.exports = function (el) {

    return new SideBar(el);
}