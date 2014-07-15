/**
 * @desc        列表页已保存筛选条件
 * @author      daiyuancheng<daiyc@273.cn>
 * @date        14-4-11
 */

var $ = require('jquery');
var Dialog = require('widget/dialog/dialog.js');
var Widget = require('lib/widget/widget.js');
var Storage = require('util/storage.js');
var Cookie = require('util/cookie.js');
var Base = require('app/ms_v2/js/base.js');

// 只用最低位bit
var COOKIE_NEW_FEATURES = 'list_features';

var EQS_SUBMIT = '/list@etype=click@filters_btn=submit';
var EQS_SAVED = '/list@etype=click@filters_btn=saved';
var EQS_DELETE = '/list@etype=click@filters_btn=delete';

// 按钮条
var OPS_BAR_TPL = '<a href="javascript:;" class="js_save_filter a1"><%if (!isSaved) {%><i class="i-save"></i>保存筛选条件</a> <%}%> <%if (!isSaved && savedCount > 0) {%>|<%}%> <%if (savedCount > 0) {%><a href="javascript:;" data-eqselog="/list@etype=click@filters_btn=saved" class="js_saved_filters a2">已保存(<%=savedCount%>)</a><%}%>';
var PANEL_TPL = '<div class="arrow"></div>'
    + '<div class="down js_fr_panel">'
    + '<ul>'
    + '<%for (var i = 0; i < filters.length; i++) {%>'
    + '<%var filter=filters[i];%>'
    + '<li data-eqselog="/list@etype=click@filters_btn=delete" <%if (i + 1 == filters.length) {%> class="last" <%}%> ><div class="li_c clearfix" data-jslink="<%=filter.url%>" title="<%=filter.caption%>"><i class="i-s" data-parent="1"></i><em class="font" data-parent="1"><%=filter.caption%></em><a href="javascript:;" data-parent="-1" data-pos="<%=i%>" class="js_filter_del close"></a></div></li>'
    + '<%}%>'
    + '</ul>'
    + '</div>';

var NEW_TIP_TPL = '<div class="tips js_filter_tip"><div class="tips_inner"><a class="js_filter_tip_close" href="javascript:;"></a></div></div>';

var WARN_TPL = '<div class="pop_save_con">'
    + '<div class="pop_box_content clearfix">'
    + '<div class="success_tips clearfix">'
    + '<div class="icon"></div>'
    + '<p>'
    + '<strong>已保存的筛选条件已达到上限(最多只能保存5个)，继续保存将会删除最早保存的条件，确定保存吗？</strong>'
    + '</p>'
    + '</div>'
    + '<dl class="clearfix">'
    + '<dt>　</dt>'
    + '<dd><button class="button1 js_f_confirm">确定保存</button><button class="button2 js_f_cancel">取消</button></dd>'
    + '</dl>'
    + '</div>'
    + '</div>';

var STORAGE_KEY = 'filters';

var MAX_FILTERS_COUNT = 5;

var WARN_TITLE = '温馨提醒';

var CUR_URL = 'http://' + window.location.host + window.location.pathname;

ListFilters = function(options) {
    if (!options) {
        throw new Error('配置信息为空');
    }

    if (!options.$el) {
        throw new Error('$el为空');
    }

    this.$el = options.$el;
    this.config = $.extend({
        data : options.$el.data()
    }, ListFilters.defaults, options);

    this._init();
};

ListFilters.defaults = {};

var proto = ListFilters.prototype = {};

$.extend(proto, {
    /**
     * 筛选条件，时间从近到远
     */
    filters : []
    , warnDialog : null
    , $savedPanel : null
    , $opsBar : null
    , $el : null
    , isPanelInited : false
    , curFilter : {}
    , _init : function() {
        var config = this.config;

        this._initData();
        this._initDom();
    }
    , _initData : function() {
        var filterstr = Storage.get(STORAGE_KEY),
            arr = [];
        if (filterstr) {
            try {
                var arr = JSON.parse(filterstr) || [];
            } catch (ex) {
            }
        }
        this.filters = arr || [];

        this.curFilter = {url: CUR_URL, caption: this.config.data.caption, key: this.config.data.filterKey || this.config.data.caption};
    }
    , _initDom : function() {

        this.$opsBar = this.$el.find('.js_filter_ops');
        this.$savedPanel = this.$el.find('.js_filter_panel');

        var me = this;

        this._createBarDom();

        this.$el.delegate('.js_save_filter', 'click', function(e) {
            Base.log.sendTrack(EQS_SUBMIT);
            me.saveFilter(this.curFilter, function() {
                me._createBarDom();
                if (me.isPanelInited) {
                    me._updatePanel();
                }
            });
        });
        this.$el.delegate('.js_saved_filters', 'click', function(e) {
            Base.log.sendTrack(EQS_SAVED);
            if (!me.isPanelInited) {
                me._initPanel();
            }
            me.showPanel();
            return false;
        });

        this.$el.delegate('div.li_c', 'mouseover', function(e) {
            var $target = $(e.target);
            var findParent = $target.data('parent') || 0;
            if (findParent < 0) {
                return false;
            }
            if (findParent != -1) {
                $target = $target.parent('div');
            }
            $target.addClass('li_c_on');
            return false;
        }).delegate('div.li_c', 'mouseout', function(e) {
            var $target = $(e.target);
            var findParent = $target.data('parent') || 0;
            if (findParent < 0) {
                return false;
            }
            if (findParent == 1) {
                $target = $target.parent('div');
            }
            $target.removeClass('li_c_on');
            return false;
        }).delegate('div.li_c', 'click', function(e) {
            var $target = $(e.target);
            var findParent = $target.data('parent') || 0;
            if (findParent < 0) {
                return false;
            }
            if (findParent == 1) {
                $target = $target.parent('div');
            }
            var url = $target.data('jslink') || '';
            if (url) {
                window.location.href = url;
            }
        });

        var newFeatures = Cookie.get(COOKIE_NEW_FEATURES) || 0;
        if ((newFeatures & 1) == 0) { // 未提醒
            this.showFeaturesTip(newFeatures);
        }
    }
    , _createBarDom : function() {
        var content = Widget.template(OPS_BAR_TPL, {
            isSaved : this.isSaved(),
            savedCount : this.filters.length
        });
        this.$opsBar.html(content);
    }

    /**
     * 初始化已选择panel，绑定事件
     * @private
     */
    , _initPanel : function() {
        this.isPanelInited = true;
        this._updatePanel();
        var me = this;
        this.$el.delegate('.js_filter_del', 'click', function(e) {
            Base.log.sendTrack(EQS_DELETE);
            var $target = $(e.target);
            var pos = $target.data('pos');
            if (pos >= 0 && pos < MAX_FILTERS_COUNT) {
                me.deleteFilter(pos);
                me._updatePanel();
                me._createBarDom();
            }
            return false;
        });

    }

    , showPanel : function() {
        this.$savedPanel.css('display', 'block');
        var me = this,
            $body = $('html,body');
        $body.on('click', function(e) {
            if (!$.contains(me.$savedPanel[0], e.target)) {
                me.$savedPanel.css('display', 'none');
                $body.off('click');
            }
        });
    }

    /**
     * 根据filters更新panel
     * @private
     */
    , _updatePanel : function() {
        if (this.filters.length > 0) {
            var content = Widget.template(PANEL_TPL, {
                filters : this.filters
            });
            this.$savedPanel.html(content);
        } else {
            this.$savedPanel.html('').css('display', 'none');
        }
    }

    , _saveToStorage : function() {
        var filters = this.filters || [];
        var str = JSON.stringify(filters);

        Storage.set(STORAGE_KEY, str);
    }

    /**
     * 显示新功能提醒
     */
    , showFeaturesTip : function(newFeatures) {
        var $content = $(NEW_TIP_TPL);
        $content.find('.js_filter_tip_close').click(function(e) {
            Cookie.set(COOKIE_NEW_FEATURES, newFeatures | 1, {expires : 365, domain : '273.cn', path : '/'});
            $content.remove();
            return false;
        });
        this.$el.append($content);
    }

    /**
     *
     * @param filter:
     * {
     *      url : 'http://xxxx/',
     *      caption : '福州，宝马，1-3年',
     * }
     */
    , saveFilter : function(filter, cb) {
        if (this.filters.length >= MAX_FILTERS_COUNT) { // 已达到最大保存数
            this._showWarnBox(filter, cb);
        } else { // 直接保存
            this._saveFilter(filter);
            if (cb) {
                cb();
            }
        }
    }

    , _saveFilter : function(filter) {
        filter = filter || this.curFilter;
        if (filter.url) {
            if (this.isSaved(filter)) {
                return false;
            }
            if (this.filters.length >= MAX_FILTERS_COUNT) {
                var count = this.filters.length - MAX_FILTERS_COUNT + 1;
                this.deleteFilter(MAX_FILTERS_COUNT - 1, count);
            }

            this.filters.unshift(filter);
            this._saveToStorage();
        }
        return true;
    }

    /**
     * 覆盖提醒
     */
    , _showWarnBox : function(filter, cb) {
        var $content = $(Widget.template(WARN_TPL, {}));
        var $confirm = $content.find('.js_f_confirm'),
            $cancel  = $content.find('.js_f_cancel'),
            me = this;

        $confirm.on('click', function() {
            me._saveFilter(filter);
            if (cb) {
                cb();
            }
            me.warnDialog.close();
        });

        $cancel.on('click', function() {
            me.warnDialog.close();
        });

        this.warnDialog = new Dialog({
            title : WARN_TITLE,
            padding : '0px',
            escAble : true,
            skin : 'gray',
            content : $content
        });
    }
    /**
     * 删除某个筛选
     * @param pos [0 - length)
     * @param count
     */
    , deleteFilter : function(pos, count) {
        count = count || 1;
        if (pos >= 0 && pos < MAX_FILTERS_COUNT && pos < this.filters.length) {
            var filter =  this.filters.splice(pos, count);
            this._saveToStorage();
            return filter;
        } else {
            return false;
        }
    }

    , isSaved : function(filter) {
        filter = filter || this.curFilter;
        var len = this.filters.length,
            i = 0;
        for (; i < len; i ++) {
            if (filter.key == this.filters[i].key) {
                return true;
            }
        }
        return false;
    }
});


module.exports = ListFilters;