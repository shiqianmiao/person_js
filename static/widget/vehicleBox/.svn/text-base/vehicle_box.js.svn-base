/**
 * @desc 车型表格选择框封装
 * @copyright (c) 2013 273 Inc
 * @author chenhan <chenhan@273.cn>
 * @since 2013-8-6
 */

/**加载依赖模块START**/
var $ = require('jquery');
require('widget/vehicleBox/vehicle_box.css');
/**加载依赖模块END**/

module.exports = VehicleBox;

/**
 * 车型选择框构造函数
 * @param array config (
 * $el                 绑定插件的dom元素
 * type  插件类型        选择框和非选择框                       select和li                  默认select
 * arrange  排列形式     横和竖                                horizontal vertical         默认vertical
 * showNum             从第几个显示到第几个(默认为全显示)       [0,3]                        默认[0,3],可选值[0,2][1,3]
 * useCss              是否调用默认css(在选择非选择框时使用)                                 默认li时调用
 * saveName            在对应的地方加上字段的name,可以在ajax的时候将对应的字段用ajax传回       默认['type_id', 'brand_id', 'series_id', 'model_id']
 * title               字段对应的title {}                     []                          默认['类　型','品　牌'...]
 * firstValue          第一个选项的值                         []                           默认['不限类型', '不限品牌...']
 * saveValue           保存选中字段value的名称                data--value                  默认data-value
 * shortName            是否显示短车型名                     boolean
 * }
 * 选择框相关全部废弃
 */
function VehicleBox(config) {
    //载入设定,设置默认值(有设定值的使用设定值,没有使用默认值)
    if (config && config.el) {
        this.self               = this;
        this.config             = config;
        this.$el                = $(config.el);
        this.url                = 'http://data.273.cn/';
        this.$bodyBox           = {};
        this.boxNum             = 0;
        this.getFirstType       = ['type', 'brand'];
        this.getType            = ['brand', 'series', 'model'];
        
        this.type               = config.type || 'li';
        this.arrange            = config.arrange || 'vertical';
        this.showNum            = config.showNum || [0, 3];
        //当是非选择框时默认使用true或设定的配置,选择框时为false
        this.useCss             = config.useCss || true;
        this.useCss             = this.type == 'li' ? this.useCss : false;
        this.saveName           = config.saveName || ['type_id', 'brand_id', 'series_id', 'model_id'];
        this.getName            = ['type_id', {0 : 'type_id', 1 : 'brand_id'}, {0 : 'type_id', 2 : 'series_id'}, 'model_id'];
        this.saveValue          = config.saveValue || 'data-vehicle-value';
        this.liClass            = config.liClass || ['type', 'brand', 'series', 'model'],
        this.defaultTitle       = ['类　型', '品　牌', '&nbsp', '&nbsp'];
        this.defaultFirstValue  = ['不限类型', '不限品牌', '不限车系', '不限车型'];
        this.width              = config.width || null;
        this.defaultId          = config.defaultId || [];
        this.title              = config.title || [];
        this.firstValue         = config.firstValue || [];
        this.shortName          = config.shortName || false;
        this.keyValue           = {};
        this._init();
    } else {
        throw new Error('车型选择插件错误:请填写config.el的值!');
    }
}

/**
 * 初始化所有默认行为
 */
VehicleBox.prototype._init = function(fn) {
    this._verifyParams();
    this._initParams();
    this._initBasicStruct();
    this._initDefaultValue();
    this._initAjaxEvent(-1, this._initFirstStruct, this._initDefaultDl);
    this._initClickEvent();
}

/**
 * 重新设置id值
 */
VehicleBox.prototype.setDefaultId = function(defaultId) {
    this.defaultId = defaultId;
}

VehicleBox.prototype.initValue = function() {
    this._resetAllNextData();
    this._initDefaultValue();
    this._initAjaxEvent(-1, this._initFirstStruct, this._initDefaultDl);
}
/**
 * 初始化必要的参数
 * 1.初始化title
 * 2.初始化firstValue
 * 3.初始化选择框个数
 * 4.初始化keyValue键值对
 * 5.初始化url
 */
VehicleBox.prototype._initParams = function() {
    //1
    if (this.title.length == 0) {
            this.title = this.defaultTitle;
    }
    //2
    if (this.firstValue.length == 0) {
        this.firstValue = this.defaultFirstValue;
    }
    //3
    this.boxNum = this.showNum[1] - this.showNum[0] + 1;
    //4
    for (var i = 0; i < this.boxNum; i++) {
        //要先定义this.keyValue[this.saveName[i]]的类型
        this.keyValue[this.saveName[i]] = {};
        this.keyValue[this.saveName[i]].title      = this.title[i];
        this.keyValue[this.saveName[i]].firstValue = this.firstValue[i];
    }
    this._initUrl();
}

/**
 * 选择要使用的构造dom基本框架方法
 */
VehicleBox.prototype._initBasicStruct = function() {
    //生成id为vehicle_box的div
    this.$bodyBox = $('<div>');
    this.$bodyBox.addClass('vehicle_box');
    this.$el.append(this.$bodyBox);
    
    if (this.type == 'li') {
        this._initLiStruct();
    } else if (this.type == 'select'){
        this._initSelectStruct();
    }
}

/**
 * 构造非选择框时的基本框架(ul>em li > span dl input)
 */
VehicleBox.prototype._initLiStruct = function() {
    
    if (this.arrange == 'horizontal') {
        this.$bodyBox.addClass('horizontal');
    }
    //添加ul (选择框父窗口)
    this.$ul = $('<ul>');
    this.$bodyBox.append(this.$ul);
    this.$liArr = [];
    //添加em (title)
    this.$emArr = [];
    //添加li (选择框本体)
    if (this.arrange == 'horizontal') {
        for (var i = 0; i < this.boxNum; i++) {
            if (this.title[i] != '') {
                this.$emArr[i] = $('<em>').html(this.title[i]);
                if (this.arrange == 'horizontal') {
                    this.$emArr[i].addClass('horizontal');
                }
                this.$emArr[i].addClass('em-' + this.liClass[i + this.showNum[0]]);
                this.$ul.append(this.$emArr[i]);
            }
            this.$liArr[i] = $('<li>');
            if (this.arrange == 'horizontal') {
                this.$liArr[i].addClass('horizontal');
            }
            this.$liArr[i].addClass('li-' + this.liClass[i + this.showNum[0]]);
            this.$ul.append(this.$liArr[i]);
        }
    } else {
        for (var i = 0; i < this.boxNum; i++) {
            this.$liArr[i] = $('<li>');
            if (this.arrange == 'horizontal') {
                this.$liArr[i].addClass('horizontal');
            }
            this.$liArr[i].addClass('li-' + this.liClass[i + this.showNum[0]]);
            this.$ul.append(this.$liArr[i]);
        }
        for (var i = 0; i < this.boxNum; i++) {
            if (this.title[i] != '') {
                this.$emArr[i] = $('<em>').html(this.title[i]);
                if (this.arrange == 'horizontal') {
                    this.$emArr[i].addClass('horizontal');
                }
                this.$emArr[i].addClass('em-' + this.liClass[i + this.showNum[0]]);
                this.$liArr[i].append(this.$emArr[i]);
            }
        }
    }
    //添加span (选中的选项)
    this.$spanArr = [];
    for (var i = 0; i < this.boxNum; i++) {
        this.$spanArr[i] = $('<span>').addClass('selected').html(this.firstValue[i]);
        this.$spanArr[i].addClass('s-' + this.liClass[i + this.showNum[0]]);
        //更改下拉框长度
        this._changeWidth(this.$spanArr[i], i, 'span');
        this.$liArr[i].append(this.$spanArr[i]);
    }
    //添加dl (选项下拉框)
    this.$dlArr = [];
    for (var i = 0; i < this.boxNum; i++) {
        this.$dlArr[i] = $('<dl>').addClass('select');
        if (this.arrange == 'horizontal') {
            this.$dlArr[i].addClass('horizontal');
        }
        //更改下拉框长度
        this._changeWidth(this.$dlArr[i], i, 'dl');
        this.$dlArr[i].addClass('dl-' + this.liClass[i + this.showNum[0]]);
        this.$liArr[i].append(this.$dlArr[i]);
    }
    //添加input(隐藏,在同步提交表单时可以使用)
    this.$inputArr = [];
    for (var i = 0; i < this.boxNum; i++) {
        var trueIndex = i + this.showNum[0];
        this.$inputArr[i] = $('<input>').hide();
        if (this._isObject(this.saveName[trueIndex])) {
            var nameKey = Object.keys(this.saveName[trueIndex]).length - 1;
            this.$inputArr[i].attr('name', this.saveName[trueIndex][nameKey]);
        } else {
            this.$inputArr[i].attr('name', this.saveName[trueIndex]);
        }
        this.$liArr[i].append(this.$inputArr[i]);
    }
    
    this._setLiwidth();
}

/**
 * 设置li的宽度(ie6兼容)
 */
VehicleBox.prototype._setLiwidth = function() {
    if (this.arrange != 'horizontal') {
        for (var i = 0; i < this.boxNum; i++) {
            if (this.$emArr[i] && this.$emArr.length) {
                var width = this.$emArr[i].innerWidth() + this.$spanArr[i].innerWidth() + 2;
                this.$liArr[i].css('width', width + 'px');
            }
        }
    }
}

/**
 * 改变元素宽度
 */
VehicleBox.prototype._changeWidth = function($obj, i, domName) {
    if (this.width) {
        if (this._isArray(this.width)) {
            if (this.width[i]) {
                switch (domName) {
                    case 'dl' : 
                        $obj.css({
                            'width' : 1 * this.$spanArr[i].width() + 20 + 'px'
                        });
                        break;
                    case 'span' :
                        $obj.css({
                            'width' : this.width[i]
                        }).css({
                            'background-position' : 1 * $obj.width() + 5 + 'px 10px'
                        });
                        break;
                    default:
                        break;
                }
            }
        } else {
            switch (domName) {
                case 'dl' : 
                    $obj.css({
                        'width' : 1 * this.$spanArr[i].width() + 20 + 'px'
                    });
                    break;
                case 'span' :
                    $obj.css({
                        'width' : this.width
                    }).css({
                        'background-position' : 1 * $obj.width() + 5 + 'px 10px'
                    });
                    break;
                default:
                    break;
            }
        }
    }
}
/**
 * 构造选择框时的基本框架()
 */
VehicleBox.prototype._initSelectStruct = function() {

}

/**
 * 构造第一个选择框的内容
 */
VehicleBox.prototype._initFirstStruct = function(data, index) {
    if (this.type == 'li') {
        this._initFirstLiStruct(data, index);
    } else if (this.type == 'select'){
        this._initFirstSelectStruct(data, index);
    }
}

/**
 * 构造非选择框类型的选择框的内容
 */
VehicleBox.prototype._initFirstLiStruct = function(data, index) {
    //添加dt (选项下拉框首选项)
    this.$dlArr[index].$dt = {};
    this.$dlArr[index].$dt = $('<dt>');
    var a = $('<a></a>').attr('href', 'javascript:void(0)').html(this.firstValue[index]);
    
    this.$dlArr[index].$dt.append(a);
    this.$dlArr[index].append(this.$dlArr[index].$dt);
    //添加dd (选项下拉框)
    this.$dlArr[index].$ddArr = [];
        if (data) {
        for (var i = 0; i < data.length; i++) {
            this.$dlArr[index].$ddArr[i] = $('<dd>').attr(this.saveValue, data[i].id);
            var a = $('<a></a>').attr('href', 'javascript:void(0)').attr('title', data[i].name).html(data[i].name);
            //ie兼容
            a.css('width', 1 * this.$spanArr[index].width() -2 + 'px');
            this.$dlArr[index].$ddArr[i].append(a);
            this.$dlArr[index].append(this.$dlArr[index].$ddArr[i]);
        }
    }
}

/**
 * 构造选择框类型的第一个选择框的内容
 */
VehicleBox.prototype._initFirstSelectStruct = function(data) {

}

/**
 * ajax,载入下拉框的选项
 */
VehicleBox.prototype._initAjaxEvent = function(index, func, func2) {
    var fn = func;
    var fn2 = func2
    var url = '';
    if (index >= this.showNum[1] - this.showNum[0]) {
        return;
    }
    if (index == -1) {
        url = this.url + this.getFirstType[this.showNum[0]];
    } else {
        var trueIndex = index + this.showNum[0];
        url = this.url + this.getType[trueIndex];
        if (!this._isObject(this.getName[trueIndex])) {
            url += '&' +this.getName[trueIndex] + '=' + this.$spanArr[index].attr(this.saveValue);
        } else {
            for (var i in this.getName[trueIndex]) {
                var realKey = i - this.showNum[0];
                if (realKey < 0) {
                    continue;
                }
                url += '&' +this.getName[trueIndex][i] + '=' + this.$spanArr[realKey].attr(this.saveValue);
            }
        }
    }
    index++;
    $.ajax({
        type:'GET',
        url:url,
        dataType:'jsonp',
        jsonp:'jsonp',
        context:this,
        success:function(data) {
            if (data == null) {
//                throw new Error(url + '返回的值为null');
                //do nothing
            }
            if (fn) {
                fn.call(this, data, index);
            }
            if (fn2) {
                fn2.call(this);
            }
        },
        error:function() {
//            throw new Error('没有取得来自' + url + '的值');
        }
    });
}

/**
 * 组件正确的url地址
 */
VehicleBox.prototype._initUrl = function() {
    for (var i in this.getType) {
        if (this.getType[i] == '') {
            continue;
        }
        this.getType[i] = '?_mod=vehicle&_act=get' + this.getType[i] + 'byid';
        if (this.shortName) {
            this.getType[i] += '&get_type=short';
        }
    }
    for (var i in this.getFirstType) {
        if (this.getFirstType[i] == '') {
            continue;
        }
        this.getFirstType[i] = '?_mod=vehicle&_act=get' + this.getFirstType[i];
    }
}
/**
 * 绑定点击事件
 */
VehicleBox.prototype._initClickEvent = function() {
    if (this.type == 'li') {
        this._bindLiClickEvent();
    } else if (this.type == 'select') {
        this._bindSelectClickEvent();
    }
}

/**
 * 绑定非选择框的点击事件
 */
VehicleBox.prototype._bindLiClickEvent = function() {
    //li绑定点击事件
    for (var i = 0; i < this.$spanArr.length; i++) {
        this.$spanArr[i].on('click', {Func : this, i : i}, this._bindLiShowEvent);
    }
}

/**
 * 初始化初始值
 */
VehicleBox.prototype._initDefaultValue = function() {
    for (var i = 0; i < this.defaultId.length; i++) {
        if (this.defaultId[i] == '') {
            continue;
        }
        if (this.defaultId[i]) {
            this.$spanArr[i].attr(this.saveValue, this.defaultId[i]);
            this.$inputArr[i].attr('value', this.defaultId[i]);
            this.$spanArr[i].html(this.$dlArr[i].find('dd[' + this.saveValue + '='+  this.defaultId[i] +'] a').html());
        }
    }
}

/**
 * 初始化默认下拉框
 */
VehicleBox.prototype._initDefaultDl = function() {
    for (var i = 0; i < this.defaultId.length; i++) {
        if (this.defaultId[i] == '') {
            continue;
        }
        this._initAjaxEvent(i, this._initFirstLiStruct, this._initDefaultValue);
    }
}

/**
 * li绑定点击显示dl事件
 */
VehicleBox.prototype._bindLiShowEvent = function(e) {
    var Func = e.data.Func;
    var i = e.data.i;
    //绑定焦点离开事件
    Func.$dlArr[i].on('mouseleave', {Func : Func, i : i}, Func._bindLiHideEvent);
    //绑定该li下所有dt,dd的点击事件(选中值,隐藏dl框)
    if (!Func.$dlArr[i] || !Func.$dlArr[i].$dt) {
        return false;
    }
    Func.$dlArr[i].$dt.on('click', {Func : Func, i : i}, Func._bindLiHideEvent);
    Func.$dlArr[i].$dt.on('click', {Func : Func, i : i, dom : 'dt'}, Func._bindLiChooseEvent);
    for (var j = 0; j < Func.$dlArr[i].$ddArr.length; j++) {
        Func.$dlArr[i].$ddArr[j].on('click', {Func : Func, i : i}, Func._bindLiHideEvent);
        Func.$dlArr[i].$ddArr[j].on('click', {Func : Func, i : i}, Func._bindLiChooseEvent);
    }
    if (Func.$dlArr[i] && Func.$dlArr[i].$ddArr.length > 0) {
        Func.$dlArr[i].addClass('click').scrollTop(0);
        if (Func.arrange == 'horizontal') {
            Func.$spanArr[i].hide();
        }
        Func.$liArr[i].css('z-index', '10'); //ie6遮盖bug
    }
}


/**
 * 绑定非选择框的点击事件
 */
VehicleBox.prototype._bindLiChooseEvent = function(e) {
    var Func = e.data.Func;
    var i = e.data.i;
    if ($(this).attr(Func.saveValue) == undefined) {
        Func.$spanArr[i].removeAttr(Func.saveValue);
    } else {
        Func.$spanArr[i].attr(Func.saveValue, $(this).attr(Func.saveValue));
    }
    //选择时,清空所有下级dl里的dt,dd
    Func._resetAllNextData(e);
    
    Func.$spanArr[i].html($(this).find('a').html());
    Func.$inputArr[i].attr('value', $(this).attr(Func.saveValue));
    if (!e.data.dom || e.data.dom != 'dt') {
        Func._initAjaxEvent(i, Func._initFirstStruct);
    }
    
}

/**
 * dl隐藏事件
 */
VehicleBox.prototype._bindLiHideEvent = function(e) {
    var Func = e.data.Func;
    var i = e.data.i;
    
    Func.$dlArr[i].removeClass('click');
    Func.$liArr[i].css('z-index', '0');  //ie6遮盖bug
    
    Func.$dlArr[i].off('mouseleave', Func._bindLiHideEvent);
    Func.$dlArr[i].off('click', Func._bindLiHideEvent);
    Func.$dlArr[i].$dt.off('click');
    for (var j = 0; j < Func.$dlArr[i].$ddArr.length; j++) {
        Func.$dlArr[i].$ddArr[j].off('click');
        if (Func.arrange == 'horizontal') {
            Func.$spanArr[i].show();
        }
    }
    return false;
}

/**
 * 选择时,重置所有下级dl里的dt,dd
 */
VehicleBox.prototype._resetAllNextData = function(e) {
    if (e) {
        var Func = e.data.Func;
        var i = e.data.i;
    } else {
        var Func = this;
        var i = -1;
    }
    var num = i + 1;
    for (; num <= Func.showNum[1]; num++) {
        if (Func.$dlArr[num] && Func.$dlArr[num].$dt) {
            Func.$dlArr[num].$dt.remove();
            for (var j = 0; j < Func.$dlArr[num].$ddArr.length; j++) {
                Func.$dlArr[num].$ddArr[j].remove();
            }
            Func.$dlArr[num].$ddArr = {};
          //为了ie6下的兼容,还是需要搜索dom元素进行删除
            Func.$dlArr[num].find('dt').remove();
            Func.$dlArr[num].find('dd').remove();
            //将所有下级下拉框重置
            Func.$spanArr[num].html(Func.firstValue[num]).removeAttr(Func.saveValue);
            Func.$inputArr[num].removeAttr('value');
        }
    }
    //选择的是dt则重置当前以及下级的input框的值(可以改成只清除当前dt下input的值)
    if (e && e.data.dom && e.data.dom == 'dt') {
        for (num = i; num < Func.showNum[1]; num++) {
            Func.$inputArr[num].removeAttr('value');
        }
    }
}

/**
 * 绑定选择框下所有的点击事件
 */
VehicleBox.prototype._bindSelectClickEvent = function() {
    
}

/**
 * 参数验证
 */
VehicleBox.prototype._verifyParams = function () {
    
}

VehicleBox.prototype._isObject = function(obj) { 
    return Object.prototype.toString.call(obj) === '[object Object]'; 
} 
VehicleBox.prototype._isArray = function(obj) { 
    return Object.prototype.toString.call(obj) === '[object Array]'; 
} 







