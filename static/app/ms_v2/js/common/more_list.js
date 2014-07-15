/**
 * @desc 列表页:更多品牌(车系)
 * @copyright (c) 2014 273 Inc
 * @author chenhan <chenhan@273.cn>
 * @since 2014-02-25
 */

var $ = require('jquery');
var Widget = require('lib/widget/widget.js');

var TYPE = {
    simple : 'simple',
    fuzzy : 'fuzzy'
};

var URL = 'http://data.273.cn/';

var liTpl = '' +
'<% for (var i = 0; i !== data.length; ++i) { %>' +
    '<li><a href="<%= data[i].uri %>"><%= data[i].brand_name %></a></li>' +
'<% } %>';

var MoreList = function(options) {
    if (!options) {
        throw new Error('配置信息不存在');
    }
    
    this.config = $.extend({}, MoreList.defaults, options);
    
    this.init();
};

var proto = MoreList.prototype = {};

$.extend(proto, {
    init : function() {
        var config = this.config;
        if (config && !config.$el) {
            throw new Error('init():$el不存在');
        }
        if (config && !config.type) {
            throw new Error('init():type不存在');
        }
        
        var $el = this.$el = this.config.$el;
        this.$more = $el.find('#js_more');
        this.$list = $el.find('.ls_collapse');
        this.$moreText = this.$more.find('span');
        this.$moreList = $el.find('.js_more_list');
        this.$firstMore = this.$moreList.first();
        
        if (this.config.type === 'fuzzy') {
            var $letter = this.$letter = this.$el.find('.letterlayer');
            this.$letterBtn = $letter.find('a');
            this.$letterMore = this.$moreList.filter(':gt(0)');
            this.$fuzzyMore = this.$moreList.last();
            this.$fuzzyInput = $letter.find('#js_fuzzy_input');
        }
        
        switch (config.type) {
            case TYPE.fuzzy :
                this._letterToggle();
                this.fuzzySearch();
            case TYPE.simple :
                this._bindMore();
                break;
            default :
                break;
        }
    },
    
    _clearInput : function() {
        this.$fuzzyInput.val('');
    },
    
    _letterToggle : function() {
        var me = this;
        this.$letterBtn.on('click', function() {
            var i = $(this).index();
            $.proxy(me._toggleEvent(i), me);
        });
    },
    
    _toggleEvent : function(i) {
        if (i === -1) {
            this.$letterBtn.removeClass('on');
        } else {
            this.$letterBtn.eq(i).addClass('on').siblings().removeClass('on');
            if (i !== 0) {
                this.$fuzzyInput.val('').blur();
            }
        }
        this.$moreList.hide().eq(i).show();
    },
    
    fuzzySearch : function() {
        var me = this,
            timer = null,
            $input = this.$fuzzyInput;
        
        inputFocus($input);
        
        $input.on('keyup', function() {
            clearTimeout(timer);
            var kw = $(this).val();
            if (kw) {
                var searchList = {
                    kw : kw
                };
                timer = setTimeout(function() {
                    $.extend(searchList, me.config.request);
                    var defer = me._ajaxFuzzy(searchList);
                    defer.done(function(data) {
                        this._showFuzzy(data);
                    });
                }, 400);
            } else {
                me._toggleEvent(0);
            }
        });
    },
    
    _ajaxFuzzy : function(searchList) {
        return $.ajax({
            url : URL + '?_mod=fuzzySearch&_act=fuzzysearch',
            data : searchList,
            dataType : 'jsonp',
            context : this
        });
    },
    
    _showFuzzy : function(data) {
        this._toggleEvent(-1);
        var li = '';
        if (data) {
            li = Widget.template(liTpl, {data : data});
        }
        this.$fuzzyMore.html(li);
    },
    
    _bindMore : function() {
        var $el = this.$el,
            $more = this.$more;
        
        $more.on('click', $.proxy(function() {
            var event = $el.hasClass('filter_box') ? 'open' : 'close';
            this._btnEvent(event);
        }, this));
    },
    
    _btnEvent : function(event) {
        if (event === 'open') {
            this._open();
        } else if (event === 'close') {
            this._close();
        }
    },
    
    _open : function() {
        this.$moreText.text('收起');
        this.$el.removeClass('filter_box').addClass('more_box');
        this.$list.hide();
        this.$firstMore.show();
        if (this.config.type === 'fuzzy') {
            this.$letter.show();
        }
    },
    
    _close : function() {
        this.$moreText.text('更多');
        this.$el.removeClass('more_box').addClass('filter_box');
        this.$list.show();
        this.$firstMore.hide();
        if (this.config.type === 'fuzzy') {
            this.$letter.hide();
            this.$letterBtn.removeClass('on').eq(0).addClass('on');
            this.$moreList.hide();
            this.$fuzzyInput.val('').blur();
        }
    }
});

var inputFocus = function($dom) {
    var defval = $dom.val();
    $dom.css('color', '#989898');
    $dom.focus(function() {
        var val = $(this).val();
        if(val == defval){
            $(this).val('');
            $(this).css('color','#333');
        }
    });
    $dom.blur(function() {
        var val = $(this).val();
        if(val == '') {
            $(this).val(defval);
            $(this).css('color','#989898');
        }
    });
}

MoreList.defaults = {
        type : TYPE.simple
};

module.exports = MoreList;