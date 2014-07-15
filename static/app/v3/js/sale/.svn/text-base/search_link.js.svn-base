/**
 *@desc 列表页筛选条件处的js实现
 */

var searchLinkModule = exports;
var commonModule = require('app/v3/js/common/common');
var $ = require('jquery');

searchLinkModule.init = function() {
    //searchLinkModule.defaultAction();
    searchLinkModule.brandEvent();
    searchLinkModule.seriesEvent();
    searchLinkModule.customParams();
    searchLinkModule.customParamsRemoveOn();
    searchLinkModule.searchOptionsEvent();
    searchLinkModule.fixedSpan();
};

searchLinkModule.defaultAction = function() {
    //ie6下添加‘更多选项’hover js支持
    if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) {
        
        $('.pp form').click(function(){
            $(this).find('span').hide()
        });
        
        $("ul#xuanxiang li").mouseenter(function(){
            $(this).addClass('on');
        });
        
        $("ul#xuanxiang li").mouseleave(function(){
            $(this).removeClass('on');
        });
    }
};
//品牌事件处理
searchLinkModule.brandEvent = function() {
    var $brandMore = $('#brand_more');
    var $brandLayer = $('#brand_more_layer');
    commonModule.sinput('#brand-kw');
    $brandMore.click(function(){
        $brandLayer.show();
    });
    $brandLayer.find('.close').click(function(){
        $brandLayer.hide();
    });

    var $kwInput = $('#brand-kw');
    $brandChar = $brandLayer.find('#brand_char').find('a');
    $brandChar.click(function(){
        var $index = $(this).index();
        $kwInput.val('').blur();
        $(this).addClass('on').siblings().removeClass('on');
        $brandLayer.find('ul').hide().eq($index).show();
    });

    //品牌模糊搜索
    var $fuzzyBlock = $('#fuzzy-brand');
    var preKeyword = '';
    $kwInput.keyup(function(event){
        var keyword = $kwInput.val();
        if (keyword) {
            $.get('/ajax.php?module=fuzzy_brand_list&kw=' + encodeURI(keyword) + G.config('request_params'), [], function(data){
                $fuzzyBlock.html(data);
                $fuzzyBlock.siblings('ul').hide();
                $fuzzyBlock.show();
                $brandChar.removeClass('on');
            });
        } else {
            $fuzzyBlock.html('');
            $fuzzyBlock.hide();
            $brandChar.eq(0).click();
            $kwInput.focus();
        }
    });
};

//车系事件处理
searchLinkModule.seriesEvent = function() {
    var $seriesMore = $('#series_more');
    var $seriesLayer = $('#series_more_layer');
    $seriesMore.click(function(){
        $seriesLayer.show();
    });
    $seriesLayer.find('.close').click(function(){
        $seriesLayer.hide();
    });
};

//自定义范围参数事件处理
searchLinkModule.customParams = function() {
    $('.price_inp').focus(function(){
        setTimeout(function(){
            $('#price_input').addClass('input');
        }, 300);
    });
    $('.price_inp').blur(function(){
        setTimeout(function(){
            $('#price_input').removeClass('input');
        }, 300);
    });
    $('.age_inp').focus(function(){
        setTimeout(function(){
            $('#age_input').addClass('input');
        }, 300);
    });

    $('.age_inp').blur(function(){
        setTimeout(function(){
            $('#age_input').removeClass('input');
        }, 300);
    });

    $('body').on('click', '[data-custom-param]', function() {
        var $type = $(this).data('custom-param');
        var $min = $('input[name=min'+$type+']').val();
        if($min == 0.0) {
            $min = 0;
        }
        var $max = $('input[name=max'+$type+']').val();
        if(($min == '' && $min !=0) || ($max == '' && $max != 0)) {
            return false;
        }
        if($type != 4 && (!searchLinkModule.isNum($min))) {
            return false;
        }
        if($min >=0 && $max >= 0) {
            var $url = '';
            if(G.config('keywords')) {
                $url = '/ajax.php?module=custom_param_url&cu_type='+$type+'&min='+$min+'&max='+$max+G.config('request_params')+'&keywords=' + G.config('keywords');
            } else {
                $url = '/ajax.php?module=custom_param_url&cu_type='+$type+'&min='+$min+'&max='+$max+G.config('request_params');
            }
            $.ajax({
                url : $url,
                success : function(data) {
                    location.href=data;
                }
            });
        }
    });
    //自定义参数的自动过滤
    $('body').on('keyup', '[data-custom-input]', function() {
        var $type = $(this).data('custom-input');
        var $newVal = $(this).val();
        //type=2表示是排量，可以为小数
        var $newLength = $newVal.length;
        if($type == 1 && $newLength > 5) {
            $newVal = $newVal.substr(0, 5);
            $(this).val($newVal.substr(0, 5));
        } else if(($type == 2 || $type == 3) && $newLength > 2) {
            $newVal = $newVal.substr(0, 2);
            $(this).val($newVal.substr(0, 2));
        } else if($type == 20 && $newLength > 5) {
            $newVal = $newVal.substr(0, 5);
            $(this).val($newVal.substr(0, 5));
        }
        var $ch = '';
        var $isBreak = false;
        var $isPoint = false;
        for(var i = 0; i < $newLength; i++) {
            $ch = $newVal.charAt(i);
            if($type < 20 && (!searchLinkModule.isNum($ch) || $ch == '.')) {
                $(this).val($newVal.substr(0, i));
                $isBreak = true;
                break;
            }
            //排量，可以为小数
            if($type == 20 && isNaN($ch)) {
                if($ch == '.') {
                    if($isPoint) {
                        $(this).val($newVal.substr(0, i));
                        $isBreak = true;
                        break;
                    } else {
                        $isPoint = true;
                    }
                } else {
                    $(this).val($newVal.substr(0, i));
                    $isBreak = true;
                    break;
                }
            }
            //去空格
            if($ch == ' ') {
                $(this).val($newVal.substr(0, i));
                $isBreak = true;
                break;
            }
        }
        if(!$isBreak) {
            $(this).val($newVal);
        }
    });
};


//去除自定义范围参数的选中样式
searchLinkModule.customParamsRemoveOn = function() {
    if($('input[name=min1]').val() != '') {
        $('#price_input').siblings('dd').find('a').removeClass('current');
    }
    if($('input[name=min2]').val() != '') {
        $('#age_input').siblings('dd').find('a').removeClass('current');
    }
    if($('input[name=min3]').val() != '') {
        $('#kilometer').find('span').find('a').removeClass('on');
    }
    if($('input[name=min4]').val() != '') {
        $('#displacement').find('span').find('a').removeClass('on');
    }
};

searchLinkModule.searchOptionsEvent = function() {
    $rec = $('.m_condic');
    $rec.hover(function(){
        $(this).find('.morelayer').toggle();
    });
};

//筛选条件悬浮
searchLinkModule.fixedSpan = function() {
    var $optBarDiv = $("#car_list_title");
    var $barH = $optBarDiv.offset().top;
    var $barL = $optBarDiv.offset().left;
    var $optionBarTitle = $optBarDiv.find('#optionBarTitle');
    var $closeDiv = $optBarDiv.find('.close');
    
    $closeDiv.hide();

    $(window).scroll(function(){
        var $closeStatus = $closeDiv.data('close-status');
        //获取滚动条的滑动距离 
        var scroH = $(this).scrollTop(); 
        //滚动条的滑动距离大于等于定位元素距离浏览器顶部的距离，就固定，反之就不固定 
        if(scroH >= $barH && $closeStatus == 0){
            $optionBarTitle.hide();
            $closeDiv.show();
            if(navigator.appVersion.indexOf("MSIE 6")>-1) {
                $optBarDiv.css({"z-index":9999});
                $optBarDiv.addClass('car-list-title-ie6');
            } else {
                $optBarDiv.css({"position":"fixed","top":0,"left":$barL,"z-index":9999,"width":"780px"});
            }
        }else if(scroH < $barH){
            if(navigator.appVersion.indexOf("MSIE 6")>-1) {
                $optBarDiv.removeClass('car-list-title-ie6');
            } else {
                $optBarDiv.css({"position":"static"});
            }
            $optionBarTitle.show();
            $closeDiv.hide();
        } 
    });

    $closeDiv.click(function(){
        if(navigator.appVersion.indexOf("MSIE 6")>-1) {
               $optBarDiv.removeClass('car-list-title-ie6');
           } else {
               $optBarDiv.css({"position":"static"});
           }
        $optionBarTitle.hide();
        $(this).data('close-status', "1");
    });
};

searchLinkModule.isNum = function(s) {
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
