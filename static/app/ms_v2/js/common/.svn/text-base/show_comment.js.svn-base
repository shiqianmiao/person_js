/**
 * @desc 评论区域
 * @copyright (c) 2014 273 Inc
 * @author chenhan <chenhan@273.cn>
 * @since 2014-02-12
 */

var $ = require('jquery');
var Widget = require('lib/widget/widget.js');

var URL = 'http://data.273.cn/';


var $loadDiv = $('<div class="comment_lazy_load"><img src="http://sta.273.com.cn/app/ms/images/lazy_loading.gif"/></div>');

var ulTpl = '<ul class="eva_list"><%=liDoms%></ul>';

var userLiTpl = '<% list.forEach(function(post) { %>' +
            '<li class="clearfix">' +
                '<div class="tel"><i class="i<%=post.attitude%>"></i><p><%=post.mobile_caption%></p><span></span></div>' +
                '<div class="comment">' +
                    '<p><%=post.report_content%></p>' +
                    '<div class="other_info">' +
                        '<% if (post.attitude == 3) { %>' +
                        '<em class="tag1">重大投诉</em>' +
                        '<% } else if (post.cartitle) { %>' +
                        '被评价车源：<a href="<%=post.detail_url%>" target="_blank"><%=post.cartitle%></a>' + 
                        '<% } %>' +
                    '</div>' +
                '</div>' +
                '<div class="time"><%=post.time_caption%></div>' +
            '</li>' +
            '<% }); %>';

var deptLiTpl = '<% list.forEach(function(post) { %>' +
                '<li class="clearfix">' +
                    '<div class="tel"><i class="i<%=post.attitude%>"></i><p><%=post.mobile_caption%></p><span></span></div>' +
                    '<div class="comment">' +
                        '<p><%=post.report_content%></p>' +
                        '<% if (post.username) { %>' +
                            '<div class="other_info">' +
                                '<span>被评价顾问：' +
                                    '<% if (post.status == 1) { %>' +
                                    '<a href="<%=post.chain_user_url%>" target="_blank"><%=post.username%></a>' + 
                                    '<% } else { %>' +
                                    '<%=post.username%></a>' + 
                                    '<% } %>' +
                                '</span>' +
                                '<% if (post.attitude == 3) { %>' +
                                '<em class="tag1">重大投诉</em>' +
                                '<% } %>' +
                            '</div>' +
                        '<% } %>' +
                    '</div>' +
                    '<div class="time"><%=post.time_caption%></div>' +
                '</li>' +
                '<% }); %>';

var noMsg = '<p class="no_eva"><%=msg%></p>';

var pageTpl1 = '' +
'<div id="page">' +
    '<% if (current != first) { %>' +
        '<a href="javascript:;" class="a1" data-pn="<%=prev%>">上一页</a>' +
    '<% } %>' +
    '<% if (current > 3) { %>' +
        '<% for (var i = 1; i != 4; ++i) { %>' +
            '<a href="javascript:;" data-pn="<%=i%>"><%=i%></a>' +
        '<% } %>' +
    '<% } %>' +
    '<% if (current > 4) { %>' +
        '...' +
    '<% } %>' +
    '<% var i = current > 5 ? 1 : (current - 2); var j = current + 3 > last ? last + 1 : (current + 3);' +
    'for (; i != j; ++i) {' +
        'if (i == current) { %>' +
            '<em><%=current%></em>' +
        '<% } else if (i > 0) { %>' +
            '<a href="javascript:;" data-pn="<%=i%>"><%=i%></a>' +
        '<% } %>' +
    '<% } %>' +
    '<% if (current != last) { %>' +
        '<a href="javascript:;" class="a1" data-pn="<%=next%>">下一页</a>' +
    '<% } %>' +
'</div>';

var pageTpl = '' +
'<div id="page">' +
    '<% if (current !== first) { %>' +
        '<a id="js_prev" href="javascript:;" class="a1" data-pn="<%=prev%>">上一页</a>' +
    '<% } %>' +
    '<% if (show_type == 1 || show_type == 2) { %>' +
        '<% for (var i = 1; i !== last + 1; ++i) { %>' +
            '<% if (i === current) { %>' +
                '<em><%=current%></em>' +
                '<% continue; %>' +
            '<% } else if (i <= 0) { %>' +
            '<% } %>' +
                '<% if (show_type == 2 && i > 8) { %>' +
                    '...' +
                    '<% break; %>' +
                '<% } %>' +
                '<a href="javascript:;" data-pn="<%=i%>"><%=i%></a>' +
        '<% } %>' +
    '<% } else if (show_type == 3 || show_type == 4) { %>' +
        '<% for (var i = 1; i != 4; ++i) { %>' +
            '<a href="javascript:;" data-pn="<%=i%>"><%=i%></a>' +
        '<% } %>' +
        '...' +
        '<% var i = current < 6 ? 4 : (current - 2); var j = current + 3 > last ? last + 1 : (current + 3);' +
        'for (; i != j; ++i) {' +
            'if (i == current) { %>' +
                '<em><%=current%></em>' +
            '<% } else if (i > 0) { %>' +
                '<a href="javascript:;" data-pn="<%=i%>"><%=i%></a>' +
            '<% } %>' +
        '<% } %>' +
        '<% if (show_type == 3) { %>' +
            '...' +
        '<% } %>' +
    '<% } %>' +
    '<% if (current !== last) { %>' +
        '<a id="js_next" href="javascript:;" class="a1" data-pn="<%=next%>">下一页</a>' +
    '<% } %>' +
'</div>';

var PAGE_SHOW = {
    all : 1,
    head : 2,
    centre : 3,
    end : 4
};

var ShowComment = function(options) {
    if (!options) {
        throw new Error('配置信息不存在');
    }
    
    this.config = $.extend({}, ShowComment.defaults, options);
    this.$noMsg = Widget.template(noMsg);
    this.ulTpl = Widget.template(ulTpl);
    this.userLiTpl = Widget.template(userLiTpl);
    this.deptLiTpl = Widget.template(deptLiTpl);
    this.pageTpl = Widget.template(pageTpl);
    this.loadHelfW = 16;    //$loadDiv.width() / 2;$loadDiv在没有插入页面前取不到高和宽
    this.loadHelfH = 16;    //$loadDiv.height() / 2;
    this.init();
};

var proto = ShowComment.prototype = {};

$.extend(proto, {
    init : function() {
        var config = this.config;
        if (config && !config.$el) {
            throw new Error('$el未定义');
        }
        this.index = 0;
        this.$comBox = config.$el.find('.below');
        this.$userBox = $('<div id="js_user">');
        this.$deptBox = $('<div id="js_dept" style="display:none;">');
        
        this._tab();
        
        this.$comBox.append(this.$userBox).append(this.$deptBox);
        
        this._pageEvent();
        
        this._select(0, 0);
    },
    
    _tab : function() {
        var me = this;
        var config  = this.config;
        var $tabs = config.$el.find('.link_title .js_tab');
        
        $tabs.on('click', function() {
            $(this).addClass('a_current').siblings().removeClass('a_current');
            me._type = $(this).index();
            me._switch(me._type);
        });
        
        var $typeBtns = this.$typeBtns = $tabs.find('.font .eva span');
        
        $typeBtns.on('click', function() {
            var index = $typeBtns.index(this);
            if (index != me.index) {
                var type = index - 3;
                var cType = index % 3;
                type = type >= 0 ? 1 : 0;
                me._select(type, cType, $(this));
            }
            me.index = index;
        });
    },
    
    _switch : function(type) {
        if (type == 0) {
            !this.$userBox.children().length && this._showInit(0, 0);
            this.$userBox.show();
            this.$deptBox.hide();
            return this.$userBox;
        } else {
            !this.$deptBox.children().length && this._showInit(1, 0);
            this.$deptBox.show();
            this.$userBox.hide();
            return this.$deptBox;
        }
    },
    
    _select : function(type, cType) {
        var config  = this.config;
        var $typeBtn = $(this.$typeBtns[(type * 3) + cType]);
        $typeBtn.addClass('current').siblings().removeClass();
        this._showInit(type, cType);
        this._type = type;
        this._cType = cType;
    },
    
    _showInit : function(type, cType) {
        this._goToPage(type, cType, 1);
    },
    
    _get : function(type, cType, pageNum) {
        var config = this.config;
        var data = {
                username : config.username,
                dept_id : config.deptId,
                type : type,
                c_type : cType,
                pn : pageNum
        };
        return $.ajax({
            url : URL + '?_mod=comment&_act=getcomment',
            data : data,
            dataType : 'jsonp',
            context : this,
            beforeSend : function() {
                this._lazyLoad(type);
            }
        });
    },
    
    _lazyLoad : function(type) {
        var $box        = type === 1 ? this.$deptBox : this.$userBox,
            $otherBox   = type === 1 ? this.$userBox : this.$deptBox,
            $ul         = $box.find('.eva_list'),
            $noMsg      = $box.find('.no_eva'),
            $load       = $loadDiv.clone(),
            $curDom = $ul.length ? $ul : $noMsg;
        $box.append($load).show();
        $otherBox.hide();
        if ($curDom.length === 1) {
            var top = Math.round($curDom.outerHeight() / 2) - this.loadHelfH;
            var left = Math.round($curDom.outerWidth() / 2) - this.loadHelfW;
            $load.css({
                'position' : 'absolute',
                'top' : top,
                'left' : left
            });
        } else {
            $load.css({
                'position' : 'relative',
                'height' : '73px'
            });
        }
    },
    
    _show : function(type, data) {
        var config = this.config;
        var $box = this._switch(type);
        $box.empty();
        var doms = this._createDom(data);
        
        $box.append(doms);
    },
    
    _createDom : function(data) {
        if (!data['list'] || data['list'].length === 0) {
            return this._noMsg(data['type']);
        }
        var doms = '';
        var liDoms = '';
        if (data['type'] == 0) {
            liDoms = this.userLiTpl(data);
        } else {
            liDoms = this.deptLiTpl(data);
        }
        var ulDoms = this.ulTpl({liDoms : liDoms});
        doms += ulDoms;
        
        var pageDoms = this._setPage(data);
        doms += pageDoms;
        return doms;
    },
    
    _setPage : function(data) {
        var current = data['page'].current,
            last = data['page'].last;
        
        if (last <= 8) {
            data['page']['show_type'] = PAGE_SHOW.all;
        } else {
            //第一页到第六页之间
            if (current <= 6) {
                data['page']['show_type'] = PAGE_SHOW.head;
            //第六页到倒数第三页之间
            } else if (current <= last - 3) {
                data['page']['show_type'] = PAGE_SHOW.centre;
            //倒数第三页到末页之间
            } else {
                data['page']['show_type'] = PAGE_SHOW.end;
            }
        }
        var pageDoms = this.pageTpl(data['page']);
//        this._keyEvent(pageDoms);
        return pageDoms;
    },
    
    /**
     * 快捷键跳转
     */
    _keyEvent : function(pageDoms) {
        KeyContorl({
            key : 'left',
            context : this,
            callback : function() {
                var $prev = $(pageDoms).find('#js_prev');
                this._goToPage(this._type, this._cType, $prev.data('pn'));
            }
        });
        KeyContorl({
            key : 'right',
            context : this,
            callback : function() {
                var $next = $(pageDoms).find('#js_next');
                this._goToPage(this._type, this._cType, $next.data('pn'));
            }
        });
    },
    
    _pageEvent : function() {
        var me = this;
        this.$comBox.delegate('#page a', 'click', function() {
            $.proxy(me._goToPage(me._type, me._cType, $(this).data('pn')), me);
        });
    },
    
    /**
     * 页面跳转
     */
    _goToPage : function(type, cType, pn) {
        if (!pn) {
            return false;
        }
        var defer = this._get(type, cType, pn);
        defer.done(function(data) {
            this._show(type, data);
        });
    },
    
    _noMsg : function(type) {
        var msg = '该';
        if (type == 1) {
            msg += '门店';
        } else {
            msg += '顾问';
        }
        msg += '暂无评价记录';
        return this.$noMsg({msg : msg});
    }
});

ShowComment.defaults = {
        
};

module.exports = ShowComment;