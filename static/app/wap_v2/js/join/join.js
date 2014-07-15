/**
 *@desc 招商加盟页js实现
 */
var joinModule = exports;
var $ = require('zepto');
var Widget = require('lib/widget/widget.js');
var Common = require('app/wap_v2/js/common/common.js');
var Base = require('app/wap_v2/js/sale/base.js');
var Log  = require('app/wap_v2/js/util/log.js');

joinModule.start = function(param) {
    
    Base.init(param);
    Widget.initWidgets();
    joinModule.hidePhone();
};

//地区下拉框
joinModule.areaSelect = function(config) {
    var $elem = config.$el;
    var $province = $elem.find('#js_province');
    var $city = $elem.find('#js_city');
    
    $province.on("change", function(){
        $city.html('<option value="">城市</option>');
        $.ajax({
            url: '/ajax.php?module=getCityByProvinceId',
            data: {province_id: $province.val()},
            dataType: 'json',
            type: 'post',
            success: function(data) {
                var html ='<option value="">城市</option>';
                if(data.length > 0) {
                    for(i=0,count = data.length; i<count; i++) {
                        html += '<option value="'+data[i]["id"]+'">'+data[i]["name"]+'</option>';
                    }
                }
                $city.html(html);
            },
            error: function() {
            }
        });
    });
};

//提交申请
joinModule.subForm = function(config) {
    var $elem = config.$el;
    var $submitBtn = $elem.find('#js_submit');
    var $phone = $elem.find('#js_phone');
    var $province = $elem.find('#js_province');
    var $city = $elem.find('#js_city');
    
   
    $submitBtn.click(function() {
        var phoneVal = $phone.val();
        var provinceVal = $province.val();
        var cityVal = $city.val();
        if (!phoneVal) {
            alert('手机号不能为空！');
            return false;
        } else if (!Common.isPhone(phoneVal)) {
            alert('请输入正确的手机号！');
            return false;
        } else if (!provinceVal) {
            alert('请选择您要加盟的省份！');
            return false;
        } else if (!cityVal) {
            alert('请选择您要加盟的城市！');
            return false;
        }
        Log.trackEventByEqslog('/wap/join@etype=click@phone='+phoneVal,$submitBtn,'click');
    });
};

joinModule.hidePhone = function (config){
    //iphone Bug
    $("#js_phone").focus(function(){
        $("#bottom-call").hide();
        $("#footer").removeClass("iscall");
    });
    $("#js_phone").focusout(function(){
        $("#bottom-call").show();
        $("#footer").addClass("iscall");
    });
    
    $("#js_province").focus(function(){
        $("#bottom-call").hide();
        $("#footer").removeClass("iscall");
    });
    $("#js_province").focusout(function(){
        $("#bottom-call").show();
        $("#footer").addClass("iscall");
    });

    $("#js_city").focus(function(){
        $("#bottom-call").hide();
        $("#footer").removeClass("iscall");
    });
    $("#js_city").focusout(function(){
        $("#bottom-call").show();
        $("#footer").addClass("iscall");
    });
};
