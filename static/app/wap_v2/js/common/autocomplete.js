/**
 * @name autocomplete 自动补全组件
 * @dep zepto.js  依赖zepto
 * @author maxin@ganji.com
 */

var $ = require('lib/zepto/zepto-1.0.js');

var config  = {
    inputEl : '',           // input输入框，id || dom
    source : null,          // 数据，来源：url || data(array) || function
    eventType : 'keyup',    // 事件类型，支持两种：keyup || click
    appendEl : 'body',           //结果显示在哪个元素里
    onItemClick : null,     // 点击item的回调函数
    formatItem : null,      // 格式化数据
    maxLength : 5,          // 最大数据条数
    delay : 400,
    dataType : 'json',     // 数据请求方式
    matchCase : false,      // 忽略大小写
    onComplete : null,      // autocomplete生成后的回调函数
    extraItem : null,       // 额外的item，（如：关闭，清除历史按钮等）
    extraWidth : 0,            // input框额外的宽度
    resultsClass : '',
    clickLogKey : false,
    outClickClose : false,  // 点击外部关闭提示
};

// query 缓存
var qCache = {};

// click事件
var clickHandle = function (e) {

    this.activate();

};

// keyup事件
var keyupHandle = function (e) {

    switch (e.keyCode) {

        case 35: // end
        case 36: // home
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
        case 37: // left
        case 39: // right
        case 9:  // tab
        case 13: // return
        case 38: // up
        case 40: // down
        case 20: // caps lock
        case 91: // command
            break;

        default :
            this.activate();
            break;
    }
}

var Autocomplete = function (o) {

    var el = o.inputEl;
    var $el = $.isObject(el) ? $(el) : $('#' + el);

    if ($el.length === 0 || $el[0].tagName.toUpperCase() !== 'INPUT') {
        throw new Error('Invalid parameter for autocomplete : inputEl');
    }

    this.config = $.extend({}, config, o);

    this.$target = $el;

    this.isActive = false;

    this.timer = null;

    var me = this, type = this.config.eventType;

    // input事件是针对百度输入法之类的
    if (type === 'keyup') {
        $el.off('keyup.autocomplete input.autocomplete')
            .on('keyup.autocomplete input.autocomplete', function(e) {
                keyupHandle.apply(me, [e]);
            });
    };

    if (type === 'click') {
        $el.off('click.autocomplete')
            .on('click.autocomplete', function(e) {
                clickHandle.apply(me, [e]);
            });
    }

    // 关闭浏览器本地记忆功能
    $el.attr('autocomplete', 'off');

    var $results = this.$results = $('<div><div/>').hide();

    // 绑定表单提交
    this.$form = $el.parents('form');
    
    var me = this;
    
    // 单击别处失去焦点
    if (this.config.outClickClose) {
        $(document).on('touchend.autocomplete', function (e) {
            var dom = e.target, tag = false;
            while (dom) {
                if ($(dom).attr('data-url')) {
                    tag = true;
                    break;
                }
                dom = dom.parentNode;
            }
    
            if (!tag) {
                me.$results.hide();
            }
        });
    }
    
    // 屏幕旋转调整autocomplete宽度，采用延迟获取旋转后的input宽度
  /*  $(window).on('orientationchange', function() {
    
        setTimeout(function () {
        
            $results.width(me.$target.width() + me.config.extraWidth);
            
        }, 400);

    });*/
    
    $(this.config.appendEl).append($results);
};



Autocomplete.prototype = {

    // 激活autocomplete
    activate : function () {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        var me = this, eventType =this.config.eventType;
        // 节流
        this.timer = setTimeout(function () {

            var value = $.trim(me.$target.val());

            if (eventType !== 'keyup' || value ) {

                me.fetchData(value);

            } else{
            // 空白框不查询，隐藏结果，直接执行回调

                var callback = me.config.onComplete;

                if ($.isFunction(callback)) {
                    callback();
                }

                me.$results.hide();
            }

        }, this.config.delay);
    },

    // 获取数据
    fetchData : function (query) {
        var source = this.config.source;

        // 本地数据源
        if ($.isArray(source) && source.length > 0) {

            var results = this.filterResults(query, source);

            this.processResults(query, results);
            this.done();

        } else if ($.isFunction(source)){

        // 函数获取数据源
            var me = this;
            source(query, function (data) {
                $.isArray(data) && me.processResults(query, data);
                me.done();
            });

        } else {

        // 远程获取数据

            //读缓存
            var results = qCache[query];

            if (results) {

                this.processResults(query, results);
                this.done();

            } else {

            // jsonp请求主站数据
                var me = this;
                $.ajax({
                    url: this.makeUrl(query),
                    success: function (data) {
                        if ($.isArray(data)) {
                        
                            me.processResults(query, data , 'ajax');
                            
                        } 
                        me.done();
                    },
                    dataType: this.config.dataType
                });
            }
        }
    },

    makeUrl : function (query) {
        var url = this.config.source;

        return url + (url.indexOf('?') === -1 ? '?' : '&') 
                + this.$target.attr('name') + '=' + encodeURIComponent(query);
    },

    // 处理数据
    processResults : function (query, data, type) {
        var length = data.length;
        var maxLength = this.config.maxLength;
        var $results = this.$results;

        $results.html('');

        length = (maxLength > 0 && maxLength <= length) ? maxLength : length;

        if (!length) {
            $results.hide();
            return;
        }

        var row, html, text, $item, url, me = this;

        var formatItem = this.config.formatItem;

        var $ul = $('<ul></ul>').addClass(this.config.resultsClass);
        for (var i = 0; i < length; i++) {
            row = data[i];
            $item = $('<li></li>');
            html = $.isFunction(formatItem) ? formatItem(query, row) : this.formatItem(query, row);

            url = $.isObject(row) ? (row['url'] || '') : row;

            $item.html(html).data('url', url)
                .on('click', function () {
                    if (me.config.onItemClick) {
                        me.config.onItemClick(this);
                    } else {
                        me.selectItem(this);
                    }
                });
            if (this.config.clickLogKey) {
                $item.attr('data-273-click-log', this.config.clickLogKey + url) ;
            }
            $ul.append($item);
        }
        $results.append($ul);
        // ajax写缓存
        type && (qCache[query] = data);
        
        var extraItem = this.config.extraItem;

        extraItem = $.isFunction(extraItem) ? extraItem() : extraItem;
        
        this.$results.append($(extraItem).attr('data-url', 'autocomplete')); 
        
//        this.position();
        
        $results.show();
    },
    
    // autocomplete回调
    done : function () {
        var callback = this.config.onComplete;
        if ($.isFunction(callback)) {
            callback();
        }
    },

    // 过滤本地数据源
    filterResults : function (query, data) {

        var matchCase = this.config.matchCase;

        !matchCase && (query = query.toLowerCase());

        var results = $.map(data, function (item, index) {
            // 取第一位匹配
            var text = $.isObject(item) ? item[0] : item ;

            !matchCase && (text = text.toLowerCase());

            if (text.indexOf(query) === 0) {
                return item;
            }
        });

        return results;
    },

    // 格式化数据
    formatItem : function (query, data) {

        var tpl = '<a href="#"><span><%=text%></span></a>'; 

        return this.render(tpl, data);
    },

    // 模板渲染
    render : function (tpl, data) {

        var isObject = $.isObject(data);

        return tpl.replace(/<%=(.*?)%>/g,function (s, m) {
            m = $.trim(m);
            return isObject ? (data[m] || '') : data;
        });
    },

    // 点击选中item
    selectItem : function (item) {

        var url = $(item).data('url');

        window.location.href = url;

    },

    // 定位
    position : function () {

        var offset = this.$target.offset();

        var inputHeight = this.$target.height();

        var resultsHeight = this.$results.height();

        var windowBottom = $(window).height() + window.scrollY;

        var position = {
            top : offset.top + inputHeight + 10, //10表示间隔
            left : offset.left
        }

        var resultsBottom = position.top + resultsHeight;

        if (resultsBottom > windowBottom) {
            var resultsTop = offset.top - resultsHeight - 10;

            if (resultsTop > 0) {
                position.top = resultsTop;
            }
            
        }

        this.$results.css(position);
    }

};

module.exports = function (config) {

    var auto =  new Autocomplete(config);

    // 暴露接口
    return {
        close : function () {
            auto.$results.hide();
        },

        search : function (query) {
            auto.fetchData(query);
        },

        render : function (tpl, data) {
            return auto.render(tpl, data);
        }
    };
};

