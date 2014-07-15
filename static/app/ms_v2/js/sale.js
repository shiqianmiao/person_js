/**
 * @desc 我要卖车
 * @copyright (c) 2013 273 Inc
 * @author 陈朝阳 <chency@273.cn>
 * @since 2013-12-11
 */

var $ = require('jquery');
var Base = require('app/ms_v2/js/base.js');

var Sale = exports;
var Form = require('widget/form/form.js');
var Cookie = require('util/cookie.js');

Sale.init = function (param) {
    Base.init(param);
    var form = new Form({
        el : '#sale_form'
    });
    
    $('#sale_form button').on('click', function() {
        form.validate().done(function() {
            var eqselog = getLogStr('/maiche/success');
            Base.log.sendTrack(eqselog);
        }).fail(function() {
            var eqselog = getLogStr('/maiche/fail');
            Base.log.sendTrack(eqselog);
        });
    });
    
    function getLogStr(key){
        var eqselog = key + '@etype=click@brand_name='+form.getField('brand_name').getVal().replace('请选择品牌','')+
                '@series_name='+form.getField('series_name').getVal().replace('请选择车系','')+
                '@model_name='+form.getField('model_name').getVal().replace('请选择车型','')+
                '@telephone='+form.getField('telephone').getVal()+
                '@province_id='+form.getField('deal_province_id').getVal()+
                '@city_id='+form.getField('deal_city_id').getVal()+
                '@uuid='+Cookie.get('eqs_uuid')+
                '@time='+Math.round(new Date().getTime()/1000);
        eqslog = encodeURIComponent(eqselog);
        return eqslog;
    }
};
