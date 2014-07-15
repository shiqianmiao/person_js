var $ = require('lib/zepto/zepto-1.0.js');
var EventEmitter = require('lib/event/event.js');

var Widget = exports;

Widget.initWidgets = function () {
    $('[data-widget]').each(function () {
        Widget.initWidget($(this));
    });
};

Widget.initWidget = function ($el) {
    $el = $($el);
    var config = $el.data();
    config.$el = $el;
    var roles = {};
    // 自动收集元素, 例如: config.$btn
    $el.find('[data-role]').each(function () {
        var role = $(this).data('role');

        if (!roles[role]) {
            roles[role] = [];
        }
        roles[role].push(this);
    });
    $.each(roles, function (key, role) {
        config['$'+key] = $(role);
    });

    // 加载指定的模块进行初始化
    config.widget.split(',').forEach(function (url) {
        url = $.trim(url);
         var method = '';
        if (url.indexOf('#') !== -1) {
            url    = url.split('#');
            method = url[1];
            url    = url[0];
        }
        G.use([url], function (widget) {
            if (method) {
                widget = widget[method];
            }
            widget(config);
        });
    });
};

Widget.create = function (def) {
    def = def || {};
    def.events = def.events || {};
    def.init = def.init || function (config) {
        this.$el = $(config.$el);
    };

    return function (config) {
        var self = $.extend({}, def);
        $.extend(self, new EventEmitter());

        if (config.$el) {
            self.$el = $(config.$el);
        }

        self.delegateEvents = function (events) {
            var temp = [];
            events = events || def.events;
            $.each(events, function (key, cb) {
                var index = key.indexOf(' ');
                var $el   = index === -1 ? self.$el : self.$el.find(key.substr(index+1, key.length));
                var event = index === -1 ? key : key.substr(0, index);
                if (typeof cb === 'function') {
                    cb = $.proxy(cb, self);
                } else {
                    cb = $.proxy(self[cb], self);
                }

                temp.push({
                    $el   : $el,
                    event : event,
                    cb    : cb
                });
            });
            temp.forEach(function (setting) {
                $(setting.$el).on(setting.event, $.proxy(setting.cb, self));
            });
        };
        if (self.$el) {
            self.delegateEvents();
        }
        self.init(config);
    };
};

// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed

Widget.template = function (str, data){
    // Generate a reusable function that will serve as a template
    // generator (and which will be cached).
    var fn = new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +

            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +

            // Convert the template into pure JavaScript
            str
                .replace(/[\r\t\n]/g, " ")
                .split("<%").join("\t")
                .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                .replace(/\t=(.*?)%>/g, "',$1,'")
                .split("\t").join("');")
                .split("%>").join("p.push('")
                .split("\r").join("\\'") +
            "');}return p.join('');");

    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
};
