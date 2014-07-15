var $ = require('lib/zepto/zepto-1.0.js');
var Widget = require('app/wap/js/common/widget.js');
var Common = require('app/wap/js/common/common.js');
var City = exports;
var Log    = require('app/wap/js/util/log.js');
//标记从哪个栏目跳转到城市切换页面的
var from = '';

City.location = function() {
    var channel = from;
    if (channel != '') {
        channel = channel + '/';
    }
    Common.location( function(city) {
        if (city) {
            $.ajax({
                type: 'POST',
                url: '/ajax.php?module=getCityByName',
                data: { name: city },
                dataType: 'json',
                timeout: 800,
                success: function(data){
                    if (data && data.url) {
                        $('#city').html('当前定位城市:<a style="padding:0px;" href="'+data.url+channel+'">'+data.name+'</a>');
                    }
                }
            });
        }
    });
};

City.skip = function (config){
    var $elem = config.$el;
    var domain = config.domain;
    var channel = from;
    if (channel != '') {
        channel = channel + '/';
    }
    $elem.click(function(){
        if (domain) {
            var url = 'http://' + domain + '.m.273.cn/' + channel;
            window.location.href = url;
        }
    });
};

City.start = function (param) {
    param || (param = {});
    Log.init(param['eqsch'], false);
    from = param.from;
    Widget.initWidgets();
    City.location();
};