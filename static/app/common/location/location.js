/**
 * @fileoverview 地域选择
 * @version v0.3.1
 * @author chenhan <chenhan@273.cn>
 * @desc
 * > v1.0.0 05-30
 *   * 合并js数据源
 *   * 设置本地缓存
 * > v0.3.1 05-26
 *   * 修复group中的对象没有按正常排序会报错的情况
 *   * 优化代码
 * *******
 * > v0.3.0 05-24
 *   * 改变数据来源,从jsonp改成从js文件加载
 * *******
 * > v0.2.1 05-22
 *   * 增加在表单中更加安全的调用方式(真实的值放在隐藏域中)
 *   * 增加在初始化完成后的回调函数finish
 *   * 修复group=0时判断错误的bug
 * *******
 * > v0.1.0
 *   * 提供省市区门店的下拉框快速调用
 * *******
 */
"use strict";
var $ = require('jquery'),
    EventEmitter = require('lib/event/event.js'),
    LEvent = require('./location_event.js'),
    Field;
var DISPLAY_URL = {
    select: './display/select.js'
};

/**
 * @constructor
 * @param {Object} options 初始化配置（下面的参数为配置项，配置会写入属性，详细的配置说明请看属性部分,不包括dom上的属性）
 * @param {!$|string} options.$el - 选择字符串或选中的jquery元素
 * @param {!selectType} [options.type=selectType.SELECT] - 节点展示类型
 * @param {!hideMode|null} [options.hideMode=hideMode.hide] - 没有数据时默认的处理方式, 设置成null不做任何操作
 *
 * @example
 * 节点上的data属性在有两种设置方法的情况下,优先度如下
 * 1.data-location-$name
 * 2.data-$name
 * 在data-$name冲突时请使用上一种
 *
 * 节点参数:
 * data-location-type | data-type 下拉框类型 {province, city, dist, dept}
 *
 * data-location-group | data-group 下拉框组 {1,2,3...}
 *
 * data-location-default | data-default 默认值选项title
 *
 * data-post-value | value 默认值,兼容验证框架 (有隐藏域时,写(绑定)在隐藏域上,没有时写(绑定)在相应select节点上)
 *
 * data-post-field 真正用来传值的隐藏域,写在select节点上,
 * {sizzle选择器: #id | .class | input[name=province]} 建议使用id
 * @example
 * <caption>
 *     <p>在有更新数据库操作的表单字段上,请使用隐藏域提交,搜索性质的表单可以直接绑定在select上
 *     <p>data-post-field 真正用来传值的隐藏域 {sizzle选择器: #id | .class | input[name=province]}
 *     <p>data-default 默认值选项title
 * </caption>
 * <form action="/addToDatabase">
 * <label><select class="js_location" data-type="province" data-group="3" data-default="请选择省份"
 *      data-post-field="#js_province"></select></label>
 * <label><select class="js_location" data-type="city" data-group="3" data-default="请选择城市"
 *      data-post-field=".js_city"></select></label>
 * <label><select class="js_location" data-type="dist" data-group="3" data-default="请选择地区"
 *      data-post-field="input[name=dist]"></select></label>
 *
 * <input id="js_province" type="hidden" name="province" value="14" />
 * <input class="js_city" type="hidden" <?php echo $this->form->getField('city'); ?> />
 * <input type="hidden" name="dist" <?php echo $this->form->getField('dist'); ?> />
 * <button type="submit"></button>
 * </form>
 * G.use(['jquery', 'app/common/location/location.js'], function ($, Location) {
 *    Location({
 *        $el: '.js_location'
 *    });
 * });
 * @example
 * <caption><p>data-location-type 下拉框类型</caption>
 * <select class="js_location" name="province" data-location-type="province"></select>
 * <select class="js_location" name="city" data-location-type="city"></select>
 *
 * G.use(['app/common/location/location.js'], function (Location) {
 *    var location = Location({
 *        $el : '.js_location'
 *    });
 * }
 * @example
 * <caption><p>data-location-group 下拉框组{1,2,3...}</caption>
 * <select class="js_location" name="province1" data-location-type="province" data-location-group="1"></select>
 * <select class="js_location" name="city1" data-location-type="city" data-location-group="1"></select>
 * <select class="js_location" name="province2" data-location-type="province" data-location-group="2"></select>
 * <select class="js_location" name="city2" data-location-type="city" data-location-group="2"></select>
 *
 * G.use(['app/common/location/location.js'], function (Location) {
 *    var location = Location({
 *        $el : '.js_location',
 *        //没有值时不隐藏表单,做disabled处理
 *        hideMode: 'disabled'
 *    });
 * }
 * @example
 * <caption><p>data-post-value 默认值,兼容验证框架</caption>
 * <select class="js_location" name="province" data-location-type="province" data-post-value="12"></select>
 * <select class="js_location" name="city" data-location-type="city" data-post-value="1"></select>
 *
 * G.use(['app/common/location/location.js'], function (Location) {
 *    Location({
 *        $el : '.js_location'
 *    }).finish(function() {
 *        console.log('finish');
 *    });
 * }
 * @example
 * demo url: http://sta.273.com.cn/app/common/location/demo.html
 * demo src: v3/static/app/common/location/
 */
var Location = function(options) {
    if (!options) {
        throw new Error('配置信息不存在');
    }
    if (!options.$el) {
        throw new Error('$el不存在');
    }
    options.$el = $(options.$el);
    this.config = $.extend({}, Location.defaults, options);
    this.groups = groups();
    EventEmitter.mixTo(this);
    this._init();
};

var cacheFunc = [],
    loadDefers = [],
    initDefers = [];

/**
 * 节点展示类型
 * @readonly
 * @enum {string}
 */
var selectType = {
    /** select节点类型 */
    SELECT: 'select'
};
/**
 * 没有数据时默认的处理方式
 * @readonly
 * @enum {string}
 */
var hideMode = {
    /** 直接隐藏 */
    HIDE: 'hide',
    /** 设置成disabled */
    DISABLED: 'disabled'
};
/**
 * 类型优先级
 * @enum {number}
 * @private
 */
var typeLevel = {
    /** 省份节点 */
    province: 1,
    /** 城市节点 */
    city: 2,
    /** 区域节点 */
    dist: 3,
    /** 门店节点 */
    dept: 3
};
/**
 * 类型详情信息
 * @type {Object<Object.<Function>>}
 * @private
 */
var typeInfo = {
    province: {
        init: LEvent.getProvince,
        city: LEvent.getCityListById
    },
    city: {
        dist: LEvent.getDistrictListByCityId,
        dept: LEvent.getDeptListByCityId
    }
};

var prop = Location.prototype;

$.extend(prop, {
    /**
     * 初始化组件
     * @private
     */
    _init: function() {
        var self = this,
            config = self.config;
        try {
            require.async([DISPLAY_URL[config.type]], function(func) {
                //这里的this是window
                LEvent.getLocationData();
                self._extendField(func);
                self._decide();
                self._initInfo();
                self._initDisplay();
                self._setTimer();
            });
        } catch (e) {
            console.log(e.stack);
        }
    },
    /**
     * 扩展Field构造函数
     * @param {Object} Func Field构造函数
     * @private
     */
    _extendField: function(Func) {
        var self = this,
            config = self.config,
            hideMode = config.hideMode;

        Field = Func;

        //自定义隐藏方法的时候需要同时定义show和hide的行为
        if (Object.prototype.toString.call(hideMode) === '[object Object]') {
            $.extend(Field.prototype, hideMode);
        } else if (typeof hideMode === 'string') {
            Field.prototype.hide = Field.prototype.getHideFunc(hideMode);
            Field.prototype.show = Field.prototype.getShowFunc(hideMode);
        } else {
            Field.prototype.hide = $.noop;
            Field.prototype.show = $.noop;
        }
    },
    /**
     * 分离重整节点,分组,每组默认最多{max}个元素
     * @private
     */
    _decide: function() {
        var self = this,
            config = self.config,
            $els = config.$el,
            groups = self.groups;
        $els.each(function(i, el) {
            var $el = $(el),
                data = $el.data(),
                type = data.locationType || data.type,
                gIndex = data.locationGroup || data.group,
                defTitle = data.locationDefault || data.default || '请选择',
                defVal = $el.val() || data.postValue || data.value || null,
                fieldId = data.postField,
                $postEl, field, fieldOps;

            if (typeof gIndex === 'number') {
                if (gIndex <= 0) {
                    throw new Error('group最小值是1');
                }
                --gIndex;
            }

            fieldOps = {
                $el: $el,
                type: type,
                defTitle: defTitle,
                defVal: parseInt(defVal)
            };
            $postEl = fieldId && $(fieldId);
            if ($postEl && $postEl.size() !== 0) {
                fieldOps.$postEl = $postEl;
            }
            field = new Field(fieldOps);

            groups.insertTo(field, gIndex);
        });
        groups.gSort();
    },
    /**
     * 初始化所有事件对象的信息
     * @private
     */
    _initInfo: function() {
        var self = this,
            groups = self.groups;
        $.each(groups, function(index, group) {
            var nextType = '',
                i,
                field;
            if (group) {
                for (i = group.length - 1; i >= 0; --i) {
                    field = group[i];
                    //取得初始化方法
                    if (i === 0) {
                        field.init = typeInfo[field.type].init;
                    }
                    //取得关联方法
                    if (nextType) {
                        field.next = group[i + 1];
                        if (typeInfo[field.type]) {
                            field.event = typeInfo[field.type][nextType];
                        } else {
                            throw new Error('event:' + nextType + '不存在');
                        }
                    }
                    nextType = field.type || field.$el.data('type');
                    self._setEvent(field);
                }
            }
        });
    },
    /**
     * 设置事件
     * @private
     */
    _setEvent: function(field) {
        var $el = field.$el,
            eventFunc = field.event;
        //trigger触发的事件,第一个参数是jQuery.Event对象
        $el.on(field.EV_INIT_VALUE, function(ev, val) {
            loadDefers.push(field.evInit(val));
        });
//            $el.on(field.EV_SET_VALUE, function(ev, val) {
//                field.evSet(val);
//            });

        $el.on(field.EV_CHANGE, function() {
            var $this = $(this),
                val = parseInt($this.val());
            field.reset();
            if (eventFunc) {
                field.evChange(val);
            } else {
                field.val(val);
            }
        });
    },
    /**
     * 初始化UI和默认值
     * @private
     */
    _initDisplay: function() {
        var self = this,
            groups = self.groups;
        $.each(groups, function(i, group) {
            if (!$.isArray(group)) {
                return;
            }
            $.each(group, function(j, field) {
                var cacheIndex,
                    defer;
                field.display(field.defTitle);
                if (j === 0 && field.init) {
                    cacheIndex = $.inArray(field.init, cacheFunc);
                    if (cacheIndex === -1) {
                        cacheIndex = cacheFunc.push(field.init) - 1;
                        defer = field.init();
                        initDefers[cacheIndex] = defer;
                    } else {
                        defer = initDefers[cacheIndex];
                    }
                    defer.done(function(data) {
                        field.display(field.defTitle, data);
                    });
                }
                if (field.defVal) {
                    field._initValue(field.defVal);
                }
            });
        });
    },
    /**
     * 设置定时器,在选项载入完成时,初始化值
     * @private
     */
    _setTimer: function() {
        var self = this,
            timer;
        if (!loadDefers.length) {
            return;
        }
        timer = setInterval(function() {
            var resolved = true;
            $.each(loadDefers, function(i, deferObj) {
                if (deferObj.defer.state() !== 'done' && deferObj.defer.state() !== 'resolved') {
                    resolved = false;
                }
            });
            if (resolved) {
                clearInterval(timer);
                $.each(loadDefers, function(i, deferObj) {
                    deferObj.defer.done(function(data) {
                        var field = deferObj.field;
                        field.val(field.defVal);
                    });
                });

                self.trigger('finish');
            }
        }, 20);
    },
    /**
     * 加载结束后的回调函数(默认值加载完成后)
     * @param {function} callback 回调函数
     */
    finish: function(callback) {
        var self = this;
        self.on('finish', callback);
    }
});

var groups = function() {
    var groups = [],
        max = 3;

    /**
     * 向group插入数据,如果同组$el元素已经达到上限则忽略
     * @param {!Object} field field对象
     * @param {number=} gIndex 组号
     */
    groups.insertTo = function(field, gIndex) {
        var group;

        if (typeof gIndex === 'number') {
            group = groups[gIndex];
            if ($.isArray(group)) {
                if (group.length < max) {
                    group.push(field);
                }
            } else {
                groups[gIndex] = [];
                groups[gIndex].push(field);
            }
        } else {
            gIndex = groups._getUnfullGroup();
            groups[gIndex].push(field);
        }
    };
    /**
     * 将所有group中的fields按照优先度从小到大排序
     */
    groups.gSort = function() {
        $.each(groups, function(i, group) {
            group.sort(function(field1, field2) {
                var level1 = typeLevel[field1.type],
                    level2 = typeLevel[field2.type];
                return level1 > level2;
            });
        });
    };
    /**
     * 取得靠前一个未满的group
     * @private
     * @return {number} group组索引
     */
    groups._getUnfullGroup = function() {
        var group, i, length;
        for (i = 0, length = groups.length; i <= length; ++i) {
            group = groups[i];
            if ($.isArray(group)) {
                if (group.length < max) {
                    break;
                }
            } else {
                groups[i] = [];
                break;
            }
        }
        return i;
    };
    return groups;
};

/**
 * 默认值
 * @readonly
 * @private
 */
Location.defaults = {
    type: selectType.SELECT,
    hideMode: hideMode.HIDE
};

module.exports = function(options) {
    return new Location(options);
};
