/**
 *@desc 招商页面效果JS
 */
var zsModule = exports;
var Log    = require('util/log.js');
var Uuid   = require('util/uuid.js');
var $ = require('jquery');
var Widget = require('lib/widget/widget.js');



var clickaction = function() {
    $('#welcome_words_close1, #welcome_words_close2').click(function () {
         
         $("#welcome_words").css({
                  "display":"none"
              });
              return false;
      });
      
      $('#go_words, #to_leave_words, #now_leave_words').click(function () {
         $("#welcome_words").css({
                  "display":"none"
              });
      });
      
    
    $('#case_man li a').mouseover(function () {
            $.each($('#case_man li a'),function(){
              $(this).removeClass('current');
            });
            $(this).addClass('current');
            $('#case_man li a').next('dl').hide();
            $(this).next('dl').show();
            
            $nowId = $(this).attr('id');
            
            
            $.each($('.man_con'),function(){
              $(this).css({
                  "display":"none"
              });
            });
            /**/
            
            $('#' + $nowId + '_detail').css({
                  "display":"block"
              });
        });
    
    $('#shownav a').click(function () {
          
          $.each($('#shownav a'),function(){
              $(this).removeClass('current');
          });
      
           $(this).addClass('current');
        });
}

var picscroll = function() {
    var speed1=10;//控制速度，数越多速度越慢
       
    function Marquee1(itemName)  
    {  
        itemName = 'product';
        
        if($("#"+itemName).get(0).scrollLeft>=1800)  
        {   
            $("#"+itemName).get(0).scrollLeft=0;  
        }  
        else  
        {  
            $("#"+itemName).get(0).scrollLeft++;  
        }
    }  
  
    $("#product2").get(0).innerHTML = $("#product1").get(0).innerHTML;
    var MyMar1=setInterval(Marquee1,speed1);  
    
    $('#product').mouseover(function(){    
       clearInterval(MyMar1);
    });
    
    $('#product').mouseout(function(){    
       MyMar1=setInterval(Marquee1,speed1)
    });   
        
    function Marquee2(itemName)  
    {  
        itemName = 'product_m';
        
        if($("#"+itemName).get(0).scrollLeft>=1400)  
        {   
            $("#"+itemName).get(0).scrollLeft=0;  
        }  
        else  
        {  
            $("#"+itemName).get(0).scrollLeft++;  
        }
    }  
  
    $("#product_m2").get(0).innerHTML = $("#product_m1").get(0).innerHTML;
    var MyMar2=setInterval(Marquee2,speed1);  
    
    $('#product_m').mouseover(function(){    
       clearInterval(MyMar2);
    });
    
    $('#product_m').mouseout(function(){    
       MyMar2=setInterval(Marquee2,speed1)
    });
}

var citylocation = function() {
    $('#intent_province').change(function(){
            var val = $(this).val();
            if (val == '') {
                $('#intent_city').html('<option value="">--城市--</option>');
            }
            else {
                $('#intent_city').load('/data.php?a=city&province='+val,'',function(responseTxt,statusTxt,xhr){
                //$('#intent_city').load('http://zs.273.cn/index.php?_mod=data&_dir=sale','',function(responseTxt,statusTxt,xhr){
                    if(statusTxt=="success") {
                    
                        var dataObj=eval("("+responseTxt+")");//转换为json对象 
                        
                        var cityStr = '';
                        for(var i=0;i<dataObj.length;i++){
        
                            cityStr = cityStr + '<option value="' + dataObj[i]['id'] + '">' + dataObj[i]['name'] + '</option>'
                        }
                        
                        $('#intent_city').html(cityStr);
                    }
                    if(statusTxt=="error"){
                        alert("城市数据加载失败！");
                    }
                });
            }
        });
        
    $('#resetbotton').click(function(){    
        $('#intent_city').html('<option value="">--城市--</option>');
    });
}

var formsub = function() {
    $('#form1').submit(function(){
                
                var real_name_reg =/^[A-Za-z\u4E00-\u9FA5]+$/g; 
                var real_name = $('#real_name').val();
                
                var reg = /^1[3-9]\d{9}$/g; 
                var telNum = $('#mobile').val();
                
                var reg_email = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/g;
                var now_email = $('#email').val();
                
                
                if (real_name == '') {
                    alert('请输入您的姓名！');
                    $('#real_name').focus();
                    return false;
                }
                
                if (!real_name_reg.test(real_name)) {
                    alert('对不起，您输入的姓名可能有误！');
                    $('#real_name').focus();
                    return false;
                }
                
                if ($('#mobile').val() == '') {
                    alert('请输入您的手机号码！');
                    $('#mobile').focus();
                    return false;
                }
                
                if (!reg.test(telNum)) {
                    alert('对不起，您输入的手机号可能有误！');
                    $('#mobile').focus();
                    return false;
                }
                
                if (now_email != '' && !reg_email.test(now_email)) {
                    alert('对不起，您输入的邮箱地址可能有误！');
                    $('#email').focus();
                    return false;
                }
                
                if ($('#intent_province').val() == '') {
                    alert('请选择省份！');
                    $('#intent_province').focus();
                    return false;
                }
                
                if ($('#intent_city').val() == '') {
                    alert('请选择城市！');
                    $('#intent_city').focus();
                    return false;
                }
                
                if ($('#suggest').val().length >= 500) {
                    alert('对不起，您输入的留言内容过长，请输入500个字符以内的留言！');
                    $('#suggest').focus();
                    return false;
                }
                var logKey = '/zs@etype=click@form=submit@phone=' + $('#mobile').val();
                Log.trackEventByGjalog(logKey,$('#form1'),'click');
            });
}

var scrolltonav = function() {
    function setNavNoFocus() {
        $.each($('#shownav a'),function(){
                  $(this).removeClass('current');
              });
    }
    
    function showload(){ 
        lazyheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop()); 
        
        if (lazyheight >=9643 ) {
            setNavNoFocus();
            $("#leave_words_nav").addClass('current');
        }
        else if (lazyheight >= 7901 && lazyheight < 9643 ) {
            setNavNoFocus();
            $("#successful_case_nav").addClass('current');
        }
        else if (lazyheight >= 7224 && lazyheight < 7901 ) {
            setNavNoFocus();
            $("#join_nav").addClass('current');
        }
        else if (lazyheight >= 4902 && lazyheight < 7224 ) {
            setNavNoFocus();
            $("#products_services_nav").addClass('current');
        }
        else if (lazyheight >= 2193 && lazyheight < 4902 ) {
            setNavNoFocus();
            $("#platform_nav").addClass('current');
        }
        else if (lazyheight >= 1322 && lazyheight < 2193 ) {
            setNavNoFocus();
            $("#market_outlook_nav").addClass('current');
        }
    } 
    
    $(window).bind("scroll", function(){ 
    
        //当滚动条滚动时
        showload();
    
    })
}

zsModule.start = function(ch) {
    Uuid();
    Log.init('/ms/zs');
    //点击事件
    clickaction();
    //图片滚动
    picscroll();
    //城市加载
    citylocation();
    //表单提交验证
    formsub();
    //滚动区域和菜单对应
    scrolltonav();

    Widget.initWidgets();
};
zsModule.callback = function(config) {
    var $el = config.$el;
    $el.one('click', function() {
       require.async(['app/ms/js/common/zs_callback.js'], function(Callback) {
           var cb = new Callback({
               $el : $el
           });
       });
    });
};