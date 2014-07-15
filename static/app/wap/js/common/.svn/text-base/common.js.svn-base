var $ = require('lib/zepto/zepto-1.0.js');
var Common = exports;

Common.location = function(callback) {
    var ret = null;
    function getLocation() {
        var geo = navigator.geolocation;
        if (geo) {
            var options = {
                enableHighAccuracy: true,
                maximumAge: 60000,
                timeout: 10000
            };
            geo.getCurrentPosition(success, error, options);
        } else {
            alert("您的浏览器不支持定位服务");
        }
    }
    function success(position) {
        lon=position.coords.longitude;
        lat=position.coords.latitude;
        var point = new BMap.Point(lon,lat);
        var geocoder = new BMap.Geocoder();
        geocoder.getLocation(point, getCityName);
    }
    function getCityName(geocoderResult) {
        var address = geocoderResult.addressComponents;
        var city = address.city;
        if (callback) {
            callback(city);
        }
    }
    function error(e) {
        $.ajax({
            type: 'POST',
            url: '/ajax.php?module=getCityByIp',
            dataType: 'json',
            timeout: 300,
            success: function(data){
                if (data) {
                    if (callback) {
                        callback(data);
                    }
                } else {
                    alert('无法定位您的位置，可手动选择城市');
                }
            },
            error: function(xhr, type){
                alert('无法定位您的位置，可手动选择城市');
            }
        });
    }
    getLocation();
};

Common.isNum = function(s) {
    if(s == 0) {
        return true;
    } else {
        var regu = "^([0-9]*[.0-9])$"; // 小数测试
        var re = new RegExp(regu);
        if (s.search(re) != -1)
            return true;
        else
            return false;
    }
};

Common.lazyLoadPic = function(options) {
    // 延迟载入图片
    $.fn.scrollLoading = function(options){
      var defaults={attr:"datasrc"};
      var params=$.extend({},defaults,options||{});
      params.cache=[];
      $(this).addClass('loadingimg').each(function(){
          var node=this.nodeName.toLowerCase(),
          url=$(this).attr(params["attr"]);
          if(!url){
              return;
          }
          var data={obj:$(this),tag:node,url:url};
          params.cache.push(data);
      });
      var loading=function(){
          var st=$(window).scrollTop(),sth=st+$(window).height();
          $.each(params.cache,function(i,data){
            var o=data.obj,tag=data.tag,url=data.url;
            if(o){
                post=o.offset().top;
                posb=post+o.height();
                if((post>st&&post<sth)||(posb>st&&posb<sth)){
                    if(tag==="img"){
                        o.attr("src",url);
                    }else{
                        o.load(url);
                    }
                    data.obj=null;
                }
            }
          });
          return false;
      };
      loading();
      $(window).bind("scroll",loading);
    };
    $("img[datasrc]").scrollLoading(options); // 延时载入图片
};

Common.anchor = function($el) {
    $el.find('[data-anchor]').on('click',function(){
        var anchor = $(this).data('anchor');
        var top = $('#'+anchor).offset().top;
        window.scroll(0, top);
    });
};