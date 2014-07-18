/**
 * @desc 数据网格组件
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-09-06
 */

var $ = require('jquery');
var _ = require('underscore');
var Backend = require('app/backend/js/backend.js');
var Backbone = require('lib/backbone/backbone.js');
var maodian = $('#mao');

var rowTpl = '' +
'<%_.each(keys, function (v) {%>' +
    '<td data-field-name="<%=v%>"><%=cols[v]%></td>'+
'<%});%>';

var pagerTpl = '' +
'<ul>' +
    '<li class="disabled"><a href="javascript:void(0);"><%=current%>/<%=total%>页，共<%=count%>条</a></li>' +
    '<% if (total) {%>' +
    '<li><a href="javascript:void(0);" data-action-type="grid-jump" data-page="1">首页</a></li>' +
    '<% if (prev) {%><li><a href="javascript:void(0);" data-action-type="grid-jump" data-page="<%=prev%>">上一页</a></li><%}%>' +
    '<%}%>' +
    '<% for(var i = first; i <= last; i++) {%>' +
    '<li class="<% if (i === current) {%>active<%}%>"><a href="javascript:void(0);" data-action-type="grid-jump" data-page="<%=i%>"><%=i%></a></li>' +
    '<%}%>' +
    '<% if (total) {%>' +
    '<% if (next) {%><li><a href="javascript:void(0);" data-action-type="grid-jump" data-page="<%=next%>">下一页</a></li><%}%>' +
    '<li><a href="javascript:void(0);" data-action-type="grid-jump" data-page="<%=total%>">末页</a></li>' +
    '<%}%>' +
'</ul>';

var rowModel = Backbone.Model.extend({});

var rowModelList = Backbone.Collection.extend({

    model : rowModel,

    sync : function (name, model, options) {

        // 重写success方法
        var success = options.success;

        // todo: for test
        // options.dataType = 'jsonp';

        options.success = function (resp) {

            success(resp.data.rows || []);
        }
        return Backbone.sync.apply(this, arguments)
    }
});

var rowView = Backbone.View.extend({

    tagName : 'tr',

    template : _.template(rowTpl),

    render : function () {

        this.$el.html(this.template({
            cols : this.model.toJSON(),
            keys : this.options.fields
        }));

        return this.$el;
    }
});

var GridView = Backbone.View.extend({

    template :  _.template(pagerTpl),

    constructor : function (el) {

        this.el = el;
        Backbone.View.apply(this, arguments);
    },
    initialize : function () {

        this.$table = this.$('table');
        this.$tbody = this.$('tbody');
        this.$pager = this.$('.pagination');
        this.$loading = this.$('.ui-datagrid-loading');


        var $el = this.$el;
        var url = $el.data('url');
        var fields = $el.data('show-fields') || [];

        var rows = new rowModelList;

        if (!this.$loading.size()) {
            this.$loading = $("<div class='ui-datagrid-loading'>载入中...</div>").appendTo($el);
        }

        this.fields = fields;
        this.parseUrl(url);
        this.rows = rows;
        this.listenTo(rows, 'reset', this.addRows);

        this.load(url);

    },
    load : function (url) {

        var self = this;
        url = url ? url : this.makeUrl();

        this._ready = false;
        this.showLoading();
        return this.rows.fetch({
            url : url,
            reset : true
        }).done(function (resp) {
            self.renderPager(resp.data.pager);
            $.each(self.callbacks || [], function (i, cb) {
                cb.call(self, resp.data);
            });
            self.hideLoading();
            self._ready = true;
            if (maodian.length > 0) {
                destination = maodian.offset().top;
                $('body,html').animate({scrollTop:destination}, 100);
            } else {
                $('body,html').animate({scrollTop:0}, 10);
            }
        });
    },
    ready : function (cb) {
        !this.callbacks && (this.callbacks = []);

        if (this._ready) {
            cb.call(this);
        } else {
            this.callbacks.push(cb);
        }
    },
    addRow : function (row) {

        var view = new rowView({model:row, fields: this.fields});

        this.$tbody.append(view.render());
    },
    addRows : function (rows) {

        var self = this;

        // reset
        this.$tbody.html('');

        rows.each(function (row) {

            self.addRow(row);
        });
    },
    renderPager : function (pager) {

        if (!pager) {return;}

        if (pager.current < 6) {
            pager.first = 1;
        } else {
            pager.first = pager.current - 5;
        }

        pager.total = Math.ceil(pager.count / pager.size);
        pager.last = pager.first + 9;

        if (pager.last > pager.total) {
            pager.last = pager.total;
        }

        this.$pager.html(this.template(pager));
    },
    jump : function (page) {

        this.query.page = page;

        this.load();
    },
    showLoading : function () {

        var width = this.$table.width();
        var height = this.$table.height();

        this.$loading.css({
            width : width,
            height : height,
            lineHeight : height + 'px'
        }).show();
    },
    hideLoading : function () {

        this.$loading.hide();
    },
    parseUrl : function (url) {

        this.url = url;
        this.query = {};

        if (url.indexOf('?') !== -1) {
            var tmp = url.split('?');
            var self = this;

            this.url = tmp[0];
            tmp = tmp[1] || '';
            tmp = tmp.split('#')[0];

            _.each(tmp.split('&'), function (qs) {

                if (qs && qs.indexOf('=') !== -1) {
                    qs = qs.split('=');

                    self.query[qs[0]] = qs[1] || '';
                }
            });
        }

    },

    setQuery : function (params) {

        var query = this.query;

        if (_.isString(params)) {
            _.each(params.split('&'), function (qs) {

                if (qs && qs.indexOf('=') !== -1) {
                    qs = qs.split('=');

                    query[qs[0]] = qs[1] || '';
                }
            });
        } else if (_.isObject(params)) {
            _.extend(query, params || {});
        }

    },

    makeUrl : function () {

        return this.url + '?' + $.param(this.query);
    }
});


// 设置grid独有方法

// 分页
Backend.on('grid-jump', function (e) {

    var $el = $(this);
    var page = $el.data('page') || '';

    Backend.widget(this, 'datagrid').ready(function () {
        this.jump(page);
    });
});

module.exports = function (el) {

    return new GridView(el);
}
