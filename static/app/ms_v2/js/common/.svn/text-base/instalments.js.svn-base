/**
 * @desc 分期贷款弹窗
 * @copyright (c) 2014 273 Inc
 * @author chenhan <chenhan@273.cn>
 * @since 2014-02-12
 */

var $ = require('jquery');
var Dialog = require('widget/dialog/dialog.js');
var Widget = require('lib/widget/widget.js');

var TPL = '<div id="pop_install_details" sytle="display:none;">' +
              '<div class="pop_box_content">' +
                  '<div class="tips"><div class="tel">全国咨询热线 <strong class="hot">400-6000-273</strong></div>支持分期付款购车的银行如下：</div>' +
                  '<table border="0" cellpadding="0" class="pop_table1">' +
                      '<thead>' +
                          '<tr><td width="16%">银行</td><td width="16%">首付</td><td width="20%">期数</td><td width="16%">月供</td><td width="16%">总价</td></tr>' +
                      '</thead>' +
                      '<tbody></tbody>' +
                  '</table>' +
                  '<dl class="app_con">' +
                      '<dt><i></i>申请条件</dt>' +
                      '<dd>1.贷款人为福州户口，并且在本地有房产；</dd>' +
                      '<dd>2.贷款人为福州户口，在异地工作，需要持有本地房产；</dd>' +
                      '<dd>3.贷款人为异地户口，在福州居住，在福州有连续缴社保记录或代发工资记录满1年；</dd>' +
                      '<dd>4.贷款人为异地户口，在福州居住，在福州有公司且公司成立一年；</dd>' +
                      '<dd>5.贷款人为异地户口，在福州有房产且房产持有时间满1年。</dd>' +
                  '</dl>' +
              '</div>' +
          '</div>';

var bankTPL = '<tr>' +
                  '<td><img src="<%=img%>" class="bank" alt="<%=name%>" /></td>' +
                  '<td><%=firstPay%>万</td>' +
                  '<td><select class="select1 js_period">' +
                  '<% for(var i=0; i != rate.length; ++i) { %>' +
                      '<option><%=rate[i].period%>期</option>' +
                  '<% } %>' +
                  '</select></td>' +
                  '<td><strong class="hot js_monthly_pay"></strong></td>'+
                  '<td class="js_total"></td>' +
              '</tr>';

/**
 * price 首付款
 * 
 * [{
 * name: 平安银行
 * img: 银行图片地址,
 * rate: [{period: 12,rate: 0.068},{period: 12,rate: 0.068}]
 * }]
 */
var Instalments = function(options) {
    if (!options) {
        throw new Error('配置信息不存在');
    }
    this.config = $.extend({}, Instalments.defaults, options);
    this.init();
};

var proto = Instalments.prototype = {};

$.extend(proto, {
    init : function() {
        var config = this.config;
        var me = this;
        if (config && !config.$el) {
            throw new Error('$el未定义');
        }
        if (config && !config.price) {
            throw new Error('price未定义');
        }
        if (config && !config.bankConf instanceof Array) {
            throw new Error('options格式非法');
        }
        
        Instalments.$TPL = $(TPL);
        Instalments.$tBody = Instalments.$TPL.find('table.pop_table1 tbody');
        Instalments.bankTPL = Widget.template(bankTPL);
        
        for(var i = 0; i != config.bankConf.length; ++i) {
            me._add(config.bankConf[i]);
        }
        
        this._dialog();
        
        this.dialog.ready(function() {
            me._bindEvent();
            config.$el.click();
        });
    },
    
    _add : function(bankConf) {
        var config = this.config;
        
        var firstPay = numSub(config.price / 10000, Math.floor(config.price / 200 / 100));
        $.extend(bankConf, {
            price : config.price,
            firstPay : firstPay
        });
        
        this._createDom(bankConf);
    },
    
    _createDom : function(bankConf) {
        var $bankDom =  $(Instalments.bankTPL(bankConf));
        Instalments.$tBody.append($bankDom);
    },
    
    _bindCalculate : function() {
        var config = this.config;
        var $trs = $('#pop_install_details table.pop_table1 tbody tr');
        for(var i = 0; i != config.bankConf.length; ++i) {
            var $bankDom = $($trs[i]),
                $tdPeriod = $bankDom.find('.js_period');
            $tdPeriod.on('change', {i: i}, _calculate);
            $tdPeriod.trigger('change');
        }
        
        function _calculate(e) {
            var i = e.data.i;
            var bankConf = config.bankConf[i];
            var $parent = $(this).parents('tr').eq(0);
            var $tdMonthly = $parent.find('.js_monthly_pay');
            var $tdTotal = $parent.find('.js_total');
            
            var index = this.selectedIndex;
            var instal = Math.floor(config.price / 200 /100) * 10000;
            var helf = numSub(config.price, instal);
            var interset = 1 * instal * bankConf.rate[index].rate * (bankConf.rate[index].period / 12);
            var total = 1 * config.price + interset;
            var monthlyPay = (instal + interset) / bankConf.rate[index].period;
            
            var rate = bankConf.rate[index].rate * 100 + '%';
            total = '约' + Math.round(total / 1000) / 10 + '万';
            monthlyPay = '约' + Math.round(monthlyPay) + '元';
            $tdMonthly.text(monthlyPay);
            $tdTotal.text(total);
        };
    },
    
    _dialog : function() {
        var config = this.config;
        this.dialog = new Dialog({
                title : '分期购车明细',
                padding : '0px',
                escAble : true,
                skin : 'gray',
                visible : false,
                content : Instalments.$TPL
        });
    },
    
    _bindEvent : function() {
        var me = this;
        var config = this.config;
        config.$el.on('click', function() {
            me.dialog.show();
            setTimeout($.proxy(me._bindCalculate, me), 50);
        });
    }
});

function numSub(num1, num2) {
    var baseNum, baseNum1, baseNum2;
    var precision;// 精度
    try {
        baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
        baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
    return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
};

//配置
Instalments.defaults = {
    bankConf : [{
        name: '平安银行',
        img: 'http://sta.273.com.cn/app/ms_v2/pics/bank1.gif',
        rate: [{period: 12,rate: 0.078}, {period: 24,rate: 0.0816}, {period: 36,rate: 0.0828}]
    }]
};

module.exports = Instalments;

