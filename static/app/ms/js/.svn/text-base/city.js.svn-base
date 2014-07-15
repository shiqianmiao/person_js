/**
 *@desc 切换城市页js实现
 */
var cityModule = exports;
var Dropdown = require('app/common/dropdown.js');
var Log    = require('util/log.js');
var Uuid   = require('util/uuid.js');
var $ = require('jquery');

cityModule.init = function(param) {
    cityModule.selectEvent();
    Uuid();
    Log.init(param['eqsch']);
}

cityModule.selectEvent = function() {
    var dpProvince = new Dropdown($('#js-province'), '请选择省份');
    $('#js-province').append('<dd value="www"><a href="#">全国</a></dd>');
    var dpCity     = new Dropdown($('#js-city'), '请选择城市', true);
    var url = 'http://www.273.cn/data.php?';

    dpProvince.on('change', function (e, value) {

        var province = value;

        if (province) {
            if (province == 'www') {
                var html = '<dt value=""><a href="#">请选择城市</a></dt>';
                html += '<dd value="www" ><a href="#">全国</a></dd>';
                dpCity.fix(1);
                dpCity.$el.html(html);
                dpCity.$span.html(dpCity.tip);
            } else {
                $.ajax(url + 'a=city&province=' + province, {

                   dataType: 'jsonp',
                   jsonp: 'jsonCallback'
                }).done(function (data) {

                    var html = '', item;
                    html += '<dt value="#"><a href="#">请选择城市</a></dt>';
                    for (var i = 0, l = data.length; i < l; i++) {
                        item = data[i];
                        html += '<dd value="' + item['domain'] + '"><a href="#">' + item['name'] + '</a></dd>';
                    }

                    dpCity.fix(data.length);
                    dpCity.$el.html(html);
                    dpCity.$span.html(dpCity.tip);
                    //$('.js-city-iform').find('.selected').html('请选择城市');
                });
            }
        } else {

            dpCity.$el.html('<dt value=""><a href="#">请选择城市</a></dt>');
            dpCity.$input.val('');
            dpCity.reset();
            dpCity.$span.text(dpCity.tip);
        }
    }).validate(function () {
        if (!this.$input.val()) {
            return false;
        } else {
            return true;
        }
    });


    var auTip = "直接输入城市名称";
    var $auCity = $("#autocity");

    $auCity.focus(function () {

        var $this = $(this);

        if ($this.val() == auTip) {
            $this.val('');
        }
        $this.addClass('on');
    }).blur(function () {

        var $this = $(this);

        if (!$.trim($this.val())) {
            $this.val(auTip);
        }
        $this.removeClass('on');
    });

    var $subCity = $("#su");
    $subCity.click(function(){
        var $val = $.trim($auCity.val());
        var url = "http://www.273.cn/ajax.php?module=validate_city&city="+encodeURI($val);
        if (!$val || $val == auTip) {
            alert('您还没有输入城市名称');
        } else {
             $.ajax(url,{
                dataType: 'jsonp',
                jsonp: 'jsonCallback'
            }).done(function(data){
                var html='';
                if (data) {
                    if (data.code == 1) {
                        var listUri = $auCity.data('uri');
                        location.href = data.url + listUri;
                    } else if(data.code == 0) {
                        alert('没有找到该城市');
                    }
                }
            });
        }
        return false;
    });

    var $subPro = $("#js-subpro");
    $subPro.click(function(){
        var province = $.trim(dpProvince.$input.val());
        var city = $.trim(dpCity.$input.val());
        if (province || city) {
            var url = "http://www.273.cn/ajax.php?module=validate_city&type=1&province="+province+"&city="+city;
            $.ajax(url,{
                dataType: 'jsonp',
                jsonp: 'jsonCallback'
            }).done(function(data){
                var html='';
                if (data) {
                    if (data.code == 1) {
                        var listUri = $auCity.data('uri');
                        location.href = data.url + listUri;
                    } else if(data.code == 0) {
                        alert('没有找到该城市');
                    }
                }
            });
        } else {
            alert('您还没有选择省份');
        }
    });
    
}
