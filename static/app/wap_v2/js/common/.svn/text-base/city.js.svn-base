var $ = require('lib/zepto/zepto-1.0.js');
var Widget = require('app/wap_v2/js/common/widget.js');
var Common = require('app/wap_v2/js/common/common.js');
var City = exports;
var Log    = require('app/wap_v2/js/util/log.js');
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
                        if (channel=='chain/') {
                            url = 'http://chain.m.273.cn/?domain='  + data.domain;
                        }else {
                            url = 'http://' + data.domain + '.m.273.cn/' + channel;
                        }
                        //$('#city').html('<a class="current" href="'+url+'">'+data.name+'</a>');
                        $('#current_city dd a').attr('href', url);
                        $('#current_city dd a span').html(data.name);
                        $('#current_city').show();
                    }
                }
            });
        }
    });
};

City.skip = function (config){
    var $elem = config.$el;
    var channel = from;
    if (channel != '') {
        channel = channel + '/';
    }
    $elem.find('[data-domain]').click(function(){
        var domain = $(this).data('domain');
        if (domain) {
            var url=null;
            if (channel=='chain/') {
                url= 'http://chain.m.273.cn/?domain='  + domain;
            }else {
                url = 'http://' + domain + '.m.273.cn/' + channel;
            }
            window.location.href = url;
        }
    });
};

City.start = function (param) {
    $('.showall').nextAll().hide();
    $('.showall').click(function(){
        $(this).nextAll().show();
        $(this).remove();
    });
    param || (param = {});
    Log.init(param['eqsch'], false);
    from = param.from;
    Widget.initWidgets();
    City.location();
};
