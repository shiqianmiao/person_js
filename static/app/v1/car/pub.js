/**
 * @brief      发布页js
 * @author     daiyc@273.cn
 * @filepath   static/app/v1/car/pub.js
 */

var pubModule = exports;

var $ = require('jquery');
var uuidModule = require('app/v1/common/uuid');
var formModule = require('lib/form/theme-1');


pubModule.init = function () {
    pubModule.readyAction();
}

//品牌分类筛选框与智能提示
pubModule.sortingPanel = function() {
    var flag = true;
    var $pp = $('#pp-div');
    var $vehicleInfos = [$('#choose-make'), $('#choose-series'), $('#choose-vehicle')];
    var $vehicleHiddens = [$(':input[name="make_code"]'), $(':input[name="family_code"]'), $(':input[name="vehicle_key"]')];
//    var $ppList = $('#pp-list');
    $chooseMake = $('#choose-make');
    $vehicleInfos[0].focus(function(){
        $pp.css('display', '');
        flag = true;
    }).blur(function(){
        if (flag) {
            $pp.css('display','none');
        }
    }).click(function(event){
        event.stopPropagation();
    });
    $('#pp-close').click(function(){
        $pp.css('display', 'none');
    });
    $pp.mousedown(function(event){
        flag = false;
        return false;
    }).click(function(event){
        return false;
    });
    var $body = $('body');
    $body.click(function(){
        $pp.css('display','none');
        $('#auto-com').css('display', 'none');
        $('#auto-com2').css('display', 'none');
    });
    //筛选框选择品牌
    $pp.find('.hot a').click(function(){
        selectMakeByPPDiv(this);
    });
    function selectMakeByPPDiv(obj) {
        var $this = $(obj);
        $vehicleInfos[0].val($this.html());
        $vehicleHiddens[0].val($this.attr('code'));
        $pp.css('display', 'none');
        $vehicleInfos[1].css('display', '').focus().val('');
        $vehicleInfos[2].css('display', 'none').val('');
        $vehicleHiddens[1].val('');
        $vehicleHiddens[2].val('');
    };

    $feileiLis = $('#pp-div .fenlei li');
    $feileiLis.mouseover(function(){
        var $this = $(this);
        $feileiLis.removeClass('on');
        $this.addClass('on');
        $.get('ajax.php',{'action':'get_makes_by_fletter', 'letter':$this.attr('qword'), 'm_type' : $this.attr('m_type')},function(data){
            var html = '';
            if (data != undefined && data != '') {
                var dataO = JSON.parse(data);
                for (var i = 0; i < dataO.length; i ++) {
                    html += '<dd><a href="javascript:;" code="' + dataO[i].code + '" >' + dataO[i].des + '</a></dd>';
                }
            }
            $('#pp-div .fenlei-car dl').html(html);
            $('#pp-div .fenlei-car dl a').click(function(){
                selectMakeByPPDiv(this);
            });
        })
    });
    $('.fenlei li:nth-child(2)').mouseover();

    function autoComplete($fieldObj, $hFieldObj, $divObj, infoType) {
        var curData = [];
        var curSelectId = -1;
        var preStr = '';
        $fieldObj.keydown(function(event){
            if (event.keyCode == 13) {
                return false;
            }
            preStr = $fieldObj.val();
        }).keyup(function(event){
            switch (event.keyCode) {
            case 40: //向下
                if (curData.length < 1) {
                    return false;
                }
                curSelectId ++;
                if (curSelectId >= curData.length) {
                    curSelectId = 0;
                }
                changeSelecteStatus($($autoDiv.find('tr')[curSelectId]));
                return false;
            case 38: //向上
                if (curData.length < 1) {
                    return false;
                }
                if (curSelectId != -1) {
                    curSelectId --;
                }
                if (curSelectId < 0) {
                    curSelectId += curData.length;
                }
                changeSelecteStatus($($autoDiv.find('tr')[curSelectId]));
                return false;
            case 13: //enter
                if (curSelectId >= 0 && curSelectId < curData.length) {
                    selectItem($($autoDiv.find('tr')[curSelectId]));
                }
                return false;
            default :
                refreshData();
                break;
            }
        });

        function changeSelecteStatus($item) {
            $divObj.find('.mo').addClass('ml').removeClass('mo');
            $item.removeClass('ml').addClass('mo');
        }

        function refreshData() {
            var str = $chooseMake.val();
            curSelectId = -1;
            if (str != preStr) {
                var startIdx = 0;
                if (infoType == 1) {
                    startIdx = 1;
                }
                for (var i = startIdx; i < 3; i ++) {
                    $vehicleHiddens[i].val('');
                }
                for (i = startIdx + 1; i < 3; i ++) {
                    $vehicleInfos[i].val('').css('display', 'none');
                }
            }
            if (str!=undefined && str != '' && str != preStr) {
                $pp.css('display', 'none');
                var num = new Date().getTime();
                if (infoType == 1) {
                    $.get('ajax.php?module=test&action=auto', {'kw': str, 't': num}, function(data) {
                        var dataO = JSON.parse(data);
                        var d2 = [];
                        for (var i = 0; i < dataO.length; i++) {
                            if (dataO[i].series_code != undefined) {
                                d2.push(dataO[i]);
                            }
                        }
                        curData = d2;
                        createFrame(d2);
                    });
                } else {
                    $.get('ajax.php?module=test&action=auto', {'kw': str, 't': num}, function(data) {
                        var dataO = JSON.parse(data);
                        curData = dataO;
                        createFrame(dataO);
                    });
                }
            } else {
                curData = [];
                $('#auto-com').html('').css('display', 'none');
            }
        }
        //根据获取的数据创建下拉选项框
        function createFrame(data) {
            var html = '<table><tbody>';
            for (var i = 0; i < data.length; i++) {
                html += '<tr idx = "' + i + '" class="ml"><td>';
                if (infoType == 1) {
                    html += data[i].series_name;
                } else {
                    html += data[i].brand_name;
                    if (data[i].series_code != undefined && data[i].series_code != '') {
                        html += ' ' + data[i].series_name;
                    }
                    html += '</td></tr>';
                }
            }
            html += '</tbody></table>';
            $divObj.html(html).css('display', 'block');
        }

        $divObj.find('tr').live('click',function() {
            selectItem($(this));
//            return false;
        }).live('mouseover', function(){
            changeSelecteStatus($(this));
        });

        function selectItem($this) { //隐藏表单
            var id = $this.attr('idx');
            if (infoType == 1) {
                $fieldObj.val(curData[id].series_name);
                $vehicleHiddens[1].val(curData[id].series_code);
                $vehicleHiddens[2].val('');
                $vehicleInfos[2].val('').css('display', '').focus();
            } else {
                $fieldObj.val(curData[id].brand_name);
                $hFieldObj.val(curData[id].brand_code);
                if (curData[id].series_code != undefined && curData[id].series_code != '') {
                    $vehicleInfos[1].val(curData[id].series_name).css('display', '');
                    $vehicleHiddens[1].val(curData[id].series_code);
                    $vehicleInfos[2].css('display', '').focus();
                } else {
                    $vehicleInfos[1].css('display', '').val('').focus();
                    $vehicleHiddens[1].val('');
                    $vehicleInfos[2].css('display', 'none');
                }
                $vehicleHiddens[2].val('');
            }
            $divObj.css('display', 'none');
        }
    }
    //end
    autoComplete($vehicleInfos[0], $vehicleHiddens[0], $('#auto-com'), 0);
    autoComplete($vehicleInfos[1], $vehicleHiddens[1], $('#auto-com2'), 1);
};
//品牌分类框end


pubModule.readyAction = function() {
    $("#form-sale").each(function(){
        var form = new formModule({
            $el : $(this),
            onSubmit : function(e) {
                if (!form.validate()) {
                    e.preventDefault();
                }
            }
        });
    });
    //区域start
    var $selProvince1 = $('#plate_province');
    var $selProvince = $('#province');
    var $selCity1 = $('#plate_city');
    var $selCity = $('#city');
    getCitys = function($proO, $cityO){
        var proId = $proO.val();
        if (proId > 0) {
            $.get('ajax.php', {'module':'geo','action':'get_citys_by_province', 'pro_id':proId}, function(data){
                var o = JSON.parse(data);
                if (o.err == 0) {
                    $cityO.html(o.html);
                }
            });
        }
    };
    $selProvince1.change(function(){
        getCitys($selProvince1, $selCity1);
    });
    $selProvince.change(function(){
        getCitys($selProvince, $selCity);
    });

    $idDeptAddress = $('#dept_address');
    $selCity.change(function(){
        var proId = $selProvince.val();
        $.get('ajax.php',{'module':'geo', 'action':'has_shop', 'is_get_depts' : '1', 'pro_id':$selProvince.val(), 'city_id':$selCity.val()}, function(data){
            var dataO = JSON.parse(data);
            var $noShop = $('.no-shop');
            var $hasShop = $('.has-shop');
            if (dataO.code == 1 && dataO.depts.length > 1) {
                $noShop.css('display', 'none');
                $noShop.find('select').attr('disabled', 'disabled');
                $noShop.find('input').attr('disabled', 'disabled');
                $hasShop.css('display', '');
                $hasShop.find('select').removeAttr('disabled');
                var html = '';
                for (var i = 0; i < dataO.depts.length; i++) {
                    html += '<option value="' + dataO.depts[i].id + '">' + (dataO.depts[i].dept_address.length > 4 ? dataO.depts[i].dept_address :dataO.depts[i].dept_name) + '</option>';
                }
                $idDeptAddress.html(html);
            } else {
                $noShop.css('display', '');
                $noShop.find('select').removeAttr('disabled');
                $noShop.find('input').removeAttr('disabled');
                $hasShop.css('display', 'none');
                $hasShop.find('select').attr('disabled', 'disabled');
                $idDeptAddress.html('');
            }
        });
    });
    $selCity.change();

    //输入框提示start/////////////
    $('input[tip]').focus(function(){
        var $self = $(this);
        if ($self.val() == $self.attr('tip')) {
            $self.val('').removeClass('tip-msg');
        }
    }).blur(function(){
        var $self = $(this);
        if ($self.val() == '') {
            $self.val($self.attr('tip')).addClass('tip-msg');
        }
    });
    //输入框提示end////////////////

    dealCheck = function($objList, obj, $fieldObj, attrName) {
        $this = $(obj);
        if (!$this.hasClass('on')) {
            $fieldObj.attr(attrName)
            $objList.removeClass('on');
            $this.addClass('on');
        }
    };

    var $colors = $('.color a');
    var $carColorField = $('input[name=car_color]');
    $colors.click(function(){
        dealCheck($colors, this, $carColorField, 'colorid');
    });

    var $useQualitys = $('#use_quality a');
    var $useQualitysField = $('input[name=use_quality]');
    $useQualitys.click(function(){
        dealCheck($useQualitys, this, $useQualitysField, 'useid');
    });

    var $transfers = $('#id-transfer-num a');
    var $transfersField = $('input[name=transfer_num]');
    $transfers.click(function(){
        dealCheck($transfers, this, $transfersField, 'transferid');
    });

    var $maintains = $('#id-maintain-address a');
    var $maintainsField = $('input[name=maintain_address]');
    $maintains.click(function(){
        dealCheck($maintains, this, $maintainsField, 'addressid');
    });
};