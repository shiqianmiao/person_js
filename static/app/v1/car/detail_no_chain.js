/**
 * 
 * @brief (非连锁)详情页js代码迁移
 * @author chency@273.cn
 * @since 2013-3-11
 * @path /V2012/static/app/v1/car/detail_no_chain.js
 * 
 */
 var detailModule = exports;
 /**加载依赖模块start**/
 var $ = require('jquery');
 var logCollectModule = require('app/v1/common/log_collect');
 var uuidModule = require('app/v1/common/uuid');
 var cookieModule = require('util/cookie');
 var cheYouModule = require('app/v1/common/cheyou');
 var commonModule = require('app/v1/common/common');
 var carModule = require('app/v1/car/car');
 var bdsugModule = require('app/v1/common/bdsug');
 var widgetModule = require('lib/widget/widget');
 var headerModule = require('app/v1/common/header');
 /**加载依赖模块end**/
 
 var uuid = cookieModule.get('eqs_uuid');
 var mobile_default = cookieModule.get('mobile_default');
//初始图片编号
 var currNum = 1;
//用于统计验证码发送次数
 var yyNum = 0;
 
 /**
  * @brief 详情页js接口，供页面调用
  * @param ch 日志统计所需要的eqsch
  */
  detailModule.init = function(ch) {
      commonModule.lazyLoadPic();
      headerModule.readyAction();
      //日志统计
      uuidModule.init();
      uuidModule.setUuid();
      logCollectModule.init(ch);
      //搜索框自动提示功能
      bdsugModule.init;
      carModule.readyAction();
      detailModule.readyAction();
      //控件data-widget绑定
      widgetModule.initWidgets();
  };
  
  /**
   * 页面加载完成后执行
   */
  detailModule.readyAction = function() {
      //车况宝"查看鉴定等级说明"
      if (G.config('check_content')) {
          $("#ckb-dec-a").hover( function() {
              $("#ckb-dec").show()
          }, function() {
              $("#ckb-dec").hide()
          });
      }
      
      //cheYouModule.sinput('#kw');
      cheYouModule.sinput('#yuyue_code');
      cheYouModule.sinput('#telephone');
      
      $("#jiucuo").attr("href","http://www.273.cn/tousu/information/?url=" + window.location);
      //查询公交路线 | 查询驾车路线切换
      /*$('.search-type span').click( function() {
          $('.search-type span').addClass('out');
          $(this).removeClass('out');
          $('#search_type').val($(this).attr('type'));
      });*/
      
      if(cookieModule.get('yy273_'+G.config('car_id')) == 1){
          $('#yuyuea').parent().removeClass('yuyue-btn').addClass('yuyue-btn2');
      }
      
      if (cookieModule.get('notice_send_message') != 1) {
          $('#guide-sms').show();
      }
      //发送短信窗口弹出与关闭
      $(".js_goToToggle").click(function(){
          goToToggle('sms-box');
      });
      //导航悬浮
      fixnavbar();
      //百度地图模块
      //bmap();非连锁区域暂未启用
  };
  
  /**
   * 图片切换
   */
  detailModule.picScroll = function(config) {
      var $elem = $(config.$el);
      var $linkPre = $elem.find('.prev a');
      var $picList = $elem.find('#pic-box img');
      var $linkNext = $elem.find('.next a');
      //上一张
      $linkPre.click(function() {
          set(-1);
      });
      //下一张
      $linkNext.click(function() {
          set(1);
      });
      //显示当前鼠标移到的图片
      $picList.each(function() {
          $(this).mouseenter(function() {
              set($(this));
          });
      });
      function set(el) {
          var imgs = $elem.find('img[bigimg]');
          var c = currNum + el-1;
          var onewidth = $elem.find('#pic-box').parent().width() / 4;
          var currEl = typeof el=='object' ? $(el) : imgs.eq(c>=imgs.length ? 0 : c);
          if (!currEl.length) return;
          // 计算偏移
          currNum = imgs.index(currEl) + 1;
          //显示当前第几张图片
          $("#currentPic").html(currNum);
          // 样式
          $('#pic-show img').attr('src', currEl.attr('bigimg'));
          $elem.find('span.on').removeClass('on');
          currEl.parent().parent().addClass('on');
          $('#pic-show a').attr('href',currEl.parent().attr('href'));
          if($("#totalPic").html() > 4){
        	  if (typeof el != 'object') {
        		  // 创建动画
        		  var marginLeft = -(currNum-(el>0 ? 4 : 1))*onewidth;
        		  marginLeft = marginLeft>0 ? 0 : marginLeft;
        		  marginLeft = marginLeft<=-onewidth*(imgs.length-4) ? -onewidth*(imgs.length-4) : marginLeft;
        		  $elem.find('#pic-box').stop().animate({ 'marginLeft': marginLeft+"px" }, 'slow');
          }
          }
      }
  };
  

  //预约看车
  detailModule.yuyuea = function(config) {
      var $el = $(config.$el);
      if (cookieModule.get('yy273_' + G.config('car_id')) != 1) {
          $el.click(function() {
              if (cookieModule.get('yy273_' + G.config('car_id')) == 1) {
                  return false;
              }
              if (cookieModule.get('yuyue_default_mobile') == 1) {
                  $('#telephone').val(mobile_default);
                  yyForJsonSave();
              } else {
                  gdm();
                  $('#yuyue_click').hide();
                  $('#yuyue_input_mobile').show();
                  if(mobile_default == ''){
                      $('#yuyue_input_mobile .tips1').html('请输入手机号码');
                  }
                  return false;
              }
          });
      }
  };
  
//提交预约
  detailModule.submitBooking = function(config) {
      $el = $(config.$el);
      $el.click( function () {
          telephone = $('#telephone').val();
          errmsg = '';
          if (telephone == '') {
              errmsg = '手机号码不能为空';
          } else if (!(/^1[3|4|5|8][0-9]\d{8}$/.test(telephone))) {
              errmsg = '请输入正确的手机';
          }
          if (errmsg!='') {
               $('#yuyue_input_mobile .tips1').html(errmsg);
          } else {
              checkIsYuyue(telephone);
          }
          return false;
      });
  };
  
//预约申请验证
  detailModule.yyForCodeCheck = function(config) {
      $el = $(config.$el);
      $el.click(function(){
          var yy_code = $('#yuyue_code').val();
          var errmsg = '';
          if (yy_code == '') {
              errmsg = '验证码不能为空';
          } else if (!(/^\d{6}$/.test(yy_code))) {
              errmsg = '请输入正确的验证码';
          }
          if (errmsg != '') {
              $('#yuyue_input_code .tips1').html(errmsg);
              return;
          } else {
              $.getJSON(
                      G.config('domain_main')+'Message/checkForAccessCode/?mobile='+$('#telephone').val()+'&access_code='+yy_code+'&jsonp=?',
                      null,
                      function(msg) {
                          if (msg == 1) {
                              $('#yy_code_type').val('1');
                              yyForJsonSave();
                          } else {
                              $('#yuyue_input_code .tips1').addClass('span-bg').html('验证码错误，请重输');
                          }
                      }
              );
          }
      });
  };
  //收藏车源
  detailModule.addMyCarInfo = function(config) {
        var $el = $(config.$el);
        var $title = config.title;
        var $carid = config.carid;
        $el.click( function() {
            var CurrntUrl = window.location;
            var locationUrl = G.config('domain_menber') + 'login.php?comeurl=' + CurrntUrl;
            var authInfo = cheYouModule.Auth();
            if (authInfo) {
                $.ajax({
                    url : G.config('domain_main') + "index.php?m=Sale&a=addMyCarInfo",
                    type : "get",
                    data : "title=" + $title + "&carid=" + $carid,
                    dataType : 'jsonp',
                    success : function(msg) {
                        if (msg == 1) {
                            alert('收藏成功');
                        } else if (msg == 2) {
                            alert('你已经收藏过该车源信息');             
                        } else {
                            alert('收藏失败');
                        }
                    }
                });
            } else {
                $('#login-box').show().css('left',$(window).width()/2-$('#login-box').width()/2+'px')
                .css('top',$(window).scrollTop()+$(window).height()/2-$('#login-box').height()/2+'px');
                
                $('#comefromurl').val(CurrntUrl);
                $('#login-box button').click(function(){
                    var usernames = $('#login_uname').val();
                    var telephone = $('#login_pword').val();
                    if (usernames == '' || telephone == '') {
                        $('#showmsg').css("display","block").find("span").html('请输入您正确的姓名和密码');
                        return false;
                    }
                    $('#login-box form').submit();
                });
                $('#close_login').click( function() {
                    $('#login-box').css("display","none");
                    return false;
                })
            }
        });
  };
  
//发送车源短信前的验证码校验，显示相应提示信息
  detailModule.sendMessageSave = function(config) {
      $el = $(config.$el);
      $el.click( function() {
          var mobile_binded = $('#mobile_binded').val();
          var access_code = $('#wz_access_code').val();
          if (access_code == '') {
              $('#send_message_code_msg').addClass('msg-tishi').html('验证码不能为空');
              return;
          } else if (!(/^\d{6}$/.test(access_code))) {
              $('#send_message_code_msg').addClass('msg-tishi').html('请输入正确的验证码');
              return;   
          }
          if (mobile_binded != 2) {
              $.getJSON(
                  G.config('domain_main')+'Message/checkForAccessCode/?mobile='+$('#send_mobile').val()+'&access_code='+access_code+'&jsonp=?',
                  null,
                  function(msg) {
                      if (msg == 1) {
                          sendMessageJsonSave(mobile_binded);
                      } else {
                          $('#send_message_code_msg').addClass('msg-tishi').html('验证码错误，请输入正确的验证码');
                      }
                  }
              );
          }
      });
  };
  
//发送车源短信
  detailModule.sendMessageOutSave = function(config) {
      var $el = $(config.$el);
      $el.click( function() {
          var carid = $('#car_sale_id_send').val();
          var tel = $('#send_mobile').val();
          if (tel == '') {
              $('#send_message_msg').addClass('msg-tishi').html('手机号码不能为空');
              return;
          } else if (!(/^1[3|4|5|8][0-9]\d{8}$/.test(tel))) {
              $('#send_message_msg').addClass('msg-tishi').html('请输入正确的手机号码');
              return false;   
          } else {
              $('#send_message_msg').removeClass('msg-tishi').html('&nbsp;&nbsp;');
              $.getJSON(
                  G.config('domain_main')+'index.php?m=Message&a=checkContactTelValue&id='+carid+'&mobile='+tel+'&jsonp=?',
                  null,
                  function(msg) {    
                    //验证用户名唯一
                    if (msg) {
                        if (msg == 1) {
                            $('#sended_car_message').html('<p class="sms-msg-yes">此车源信息已发送</p>');
                            $('#sms-msg-bottom').html('&nbsp;&nbsp;');
                        } else if (msg == 2) {
                            sendMessageJsonSave();
                        } else {
                            $('#mobile_binded').val(msg);
                            getAccessCode(tel);
                        }    
                    }
                  }
              );
          }
      });
  };
//免费发送车源短信导航隐藏
  detailModule.noticeSendMessage = function(config) {
      $el = $(config.$el);
      $el.click( function() {
          cookieModule.set('notice_send_message',1,30, '/', '.273.cn');
          $('#guide-sms').hide();
      });
  };
  //验证该车手机号是否预约
  function checkIsYuyue(telephone) {
      var saleId = G.config('car_id');
      $.getJSON(
              G.config('domain_main') + 'Message/checkIsYuyue/?mobile=' + telephone + '&sale_id=' + saleId  +'&jsonp=?',
              null,
              function(msg) {
                  if (msg == 1) {
                      $('#yuyue_click').hide();
                      $('#yuyue_input_mobile').hide();
                      $('#yuyue_input_code').hide();
                      $('#yuyue_success').show();
                      $('#yuyue_success_notice').addClass('success2')
                      .html('<span>我们尽快安排您看车！有疑问请致电<strong>400-600-0273</strong></span>');
                      $('#yuyuea').parent().removeClass('yuyue-btn').addClass('yuyue-btn2');
                      djs(5);
                      cookieModule.set('yy273_' + G.config('car_id'), 1);
                  } else {
                      checkMobileForBind(telephone);
                  }
              }
      );
  }
  
//检测手机号是否绑定
  function checkMobileForBind(telephone) {
      $.getJSON(
              G.config('domain_main') + 'Message/checkMobileForBind/?mobile=' + telephone + '&jsonp=?',
              null,
              function(msg) {
                  if (msg == 1) {
                      yyForJsonSave();
                  } else {
                      $('#yuyue_input_mobile').hide();
                      $('#yuyue_input_code').show();
                      getForYyCode(telephone);
                  }
              }
      );
  }
  
//预约成功窗口定时关闭(n秒)
  function djs(n) {
      clearInterval(st);
      var fn = function() {
          --n;
          n = n>=0 ? n : 0;
          if (n<=0) {
              clearInterval(st);
              $('#yuyue_click').show();
              $('#yuyue_success').hide();
          }
      };
      var st = setInterval(fn,1000);
  }
  
  

  
//发送验证码，显示验证码输入框及相应提示
  function getForYyCode(tel) {
      yyNum++;
      if(tel){
          $.getJSON(
                  G.config('domain_main')+'Message/getForYuyueCode/?uuid='+uuid+'&mobile='+tel+'&jsonp=?',
                  null,
                  function(msg) {
                      if (msg == 1) {
                          $('#yuyue_input_code .tips1').html('提醒：验证码可重复使用');
                          $('#yuyue_input_code .tips2').html('（<em>60</em>秒后）再次获取');
                          countDownYy(tel);
                      } else if (msg == 2) {
                          $('#yuyue_input_code .tips1').html('收不到短信？请致电<strong>400-600-0273</strong>预约');
                          $('#yuyue_input_code .tips2').html('');
                          logCollectModule.trackEventByGjalog('/twodetail@etype=show@place=nocode', null, 'show');
                      }
                  });
      }
  }
  
  //验证码输入60秒倒计时
  function countDownYy(telephone) {
      clearInterval(st);
      var num = 60;
      var fn = function(){
          --num;
          num = num>=0 ? num : 0;
          $('#yuyue_input_code .tips2 em').html(num);
          if (num <= 0) {
              clearInterval(st);
              if (yyNum > 2) {
                  $('#yuyue_input_code .tips1').html('收不到短信？请致电<strong>400-600-0273</strong>预约');
                  $('#yuyue_input_code .tips2').html('');
                  logCollectModule.trackEventByGjalog('/twodetail@etype=show@place=nocode',null,'show');
              } else {
                  $('#yuyue_input_code .tips2').html('<em><a href="###" id="js-yycode-again" style="color:blue">再次获取验证码</a></em>');
                  sendYyCodeAgain(telephone);
              }
          }
      };
      var st=setInterval(fn,1000);
  }
  function sendYyCodeAgain(telephone) {
      $("#js-yycode-again").click( function() {
          getForYyCode(telephone);
          logCollectModule.trackEventByGjalog('/twodetail@etype=click@place=sendagain',$(this),'click');
      });
  }
  
  function yyForJsonSave() {
      $.getJSON(
              $('#yuyue_form').attr('action'),
              $('#yuyue_form').serialize() + '&uuid=' + cookieModule.get('eqs_uuid') + '&jsonp=?',
                  function(json) {
                  if (json.success) {
                      $('#yuyue_click').hide();
                      $('#yuyue_input_mobile').hide();
                      $('#yuyue_input_code').hide();
                      $('#yuyue_success').show();
                      djs(5);
                      cookieModule.set('yy273_'+G.config('car_id'),1);
                      cookieModule.set('yuyue_default_mobile',1,2, '/', '.273.cn');
                      $('#yuyuea').parent().removeClass('yuyue-btn').addClass('yuyue-btn2');
                      logCollectModule.trackEventByGjalog('/twodetail@etype=show@place=successbook', null, 'show');
                  } else {

                  }
              }
      );
  }
  

  
//显示或隐藏短信发送窗口
  function goToToggle(id) {
      gdm();
      $('#'+id).toggle().css('left',$(window).width()/2-$('#'+id).width()/2+'px')
      .css('top',$(window).scrollTop()+$(window).height()/2-$('#'+id).height()/2+'px');
  }
  
  //发送验证码，显示验证码输入框或相应提示
  function getAccessCode( tel) {
      $('#send_message_code_msg').removeClass('msg-tishi').html('');
      if (tel) {
          $.getJSON(
                  G.config('domain_main')+'Message/getForAccessCode/?uuid='+uuid+'&mobile='+tel+'&jsonp=?',
                  null,
                  function(msg){
                      if(msg==1){
                          countdownMin(tel);
                          $('#sms-box-one').hide();
                          $('#sms-box-two').show();
                          $('#send_code_moblie').html(tel); 
                          $('#getForCodeAgain').html('');
                      }else if(msg==2){
                          $('#sms-box-one').show();
                          $('#sms-box-two').hide();
                          $('#sended_car_message').html('<p class="texts">一直收不到短信吗？</p><p class="sms-msg-yes">请致电400-600-0273预约</p>');
                      }
                  }
          );
      } 
  }
  
  function sendMessageJsonSave(bind) {
      var carid = $('#car_sale_id_send').val();
      var mobile = $('#send_mobile').val();
      var bind_type = '';
      if (bind) {
          bind_type = "&bind="+bind;
      }
      $.ajax({
          url:G.config('domain_main') + "index.php?m=Message&a=sendMessageSave",
          type:"post",
          data:"uuid=" + uuid+bind_type + "&mobile=" + mobile + "&car_sale_id=" + carid,
          dataType:'jsonp',
          success:function(j){
              if(j==1){
                  $('#sms-box-one').hide();
                  $('#sms-box-two').hide();
                 // $('#sms-box .close').html('x');
                  $('#sms-box-three').show();
                  $('#mobile_success_send').html(mobile);
                  sendjs(5);
              }
          }
      });
  }
  
  function sendjs(n) {
      clearInterval(st);
      var fn = function(){
          --n;
          n = n>=0 ? n : 0;
          $('#sms-box-three .sms-msg-yes b').html(n+'秒');
          if (n<=0){
              clearInterval(st);
              $('#sms-box').hide();
          }
      };
      var st = setInterval(fn,1000);
  }

//获取绑定手机号,用于"预约看车"手机输入框号码自动填充
  function gdm() {
     if (mobile_default == null) {
        $.getJSON(
                G.config('domain_main') + 'Message/getLastMobileForUuid/?uuid=' + uuid + '&jsonp=?',
                null,
                function(msg){
                    if (msg) {
                        $('#send_mobile').val(msg); //发送短信
                        $('#telephone').val(msg); //预约看车
                        $('#guide-sms').hide();
                    }
                }
        );
    } else {
        $('#send_mobile').val(mobile_default); 
        $('#telephone').val(mobile_default); //预约看车 
        $('#guide-sms').hide();
    }
  }
  //发送车源信息前的手机号码校验，及发送状态检测，并显示相应信息
  //发送车源短信验证码输入计时
  function countdownMin(telephone) {
      clearInterval(st);
      var num = 60;
      var fn = function() {
          --num;
          num = num>=0 ? num : 0;
          $('#getForCodeAgain').html('(<span style="color:red">'+num+'</span>秒后)再次获取验证码');
          if(num<=0) {
              clearInterval(st);
              $('#send_message_code_msg').addClass('msg-tishi').html('请重新发送验证码！');
              $('#getForCodeAgain').html('<a href="###" id="js-code-again" style="color:blue">再次获取验证码</a>');
              sendCodeAgain(telephone);
          }
      };
      var st=setInterval(fn,1000);
  }
  function sendCodeAgain(telephone) {
      $("#js-code-again").click( function() {
          getAccessCode(telephone);
      });
  }
  function bmap() {
      var map = new BMap.Map("allmap");            // 创建Map实例
      map.setCurrentCity(G.config('city_name')); 
      if (G.config('shop_point')) {
          var srr = G.config('shop_point').split(",");
          var zd = new BMap.Point(parseFloat(srr[0]),parseFloat(srr[1]));
          map.centerAndZoom(zd, 18);
          var marker = new BMap.Marker(zd);
          map.addOverlay(marker);
      }
      
      map.addControl(new BMap.NavigationControl());
      searchAC = new BMap.Autocomplete({
          "input"    : $('#qidian')[0],
          "location" : map
      });    
      
      $('#map_search').click( function() {
          t = $('#search_type').val();
          qd = $('#qidian').val();
          $('#mst_result').html('');
          if (qd == '') {
              $('#mst_result').html('请输入起点');
              return false;
          }
          if (t == 'gj') {
              var transit = new BMap.TransitRoute(map, {
                  renderOptions: {map: map,panel:"ms_result"}
              });
              transit.search(qd, zd);
          } else {
              var transit = new BMap.DrivingRoute(map, {
                  renderOptions: {map: map,panel:"ms_result"}, 
                  policy: BMAP_DRIVING_POLICY_LEAST_TIME
              });
              transit.search(qd, zd);
          }
          transit.setSearchCompleteCallback( function(results) {
              if (transit.getStatus() == BMAP_STATUS_SUCCESS) {
              } else {
                  $('#mst_result').html('未找到合适的路线');
              }
              var myGeo = new BMap.Geocoder();
              myGeo.getPoint(qd, function(point) {
                  if (point) {
                      $('input[name=start_point]').val(point.lng + "," + point.lat);
                  }
                  $.get(
                          $('#mapform').attr('action'),
                          $('#mapform').serialize()+'&eqs_uuid='+cookieModule.get('eqs_uuid')+'&jsonp=?'
                  );
              }, G.config('city_name'));
          });
          return false;
      });
  }
  
  //导航悬浮
  function fixnavbar(){
      $.fn.capacityFixed = function(options) {
          var opts = $.extend({},$.fn.capacityFixed.deflunt,options);
          var FixedFun = function(element) {
              var top = opts.top;
              var right = ($(window).width()-opts.pageWidth)/2+opts.right;
              element.css({
                  "right":right,
                  "top":top
              });
              $(window).resize(function(){
                  var right = ($(window).width()-opts.pageWidth)/2+opts.right;
                  element.css({
                      "right":right
                  });
              });
              $(window).scroll( function() {
                  var scrolls = $(this).scrollTop();
                  if (scrolls > top) {
                      if (window.XMLHttpRequest) {
                          element.css({
                              position: "fixed",
                              top: 0
                          });
                      } else {
                          element.css({
                              top: scrolls
                          });
                      }
                      $('#fixnavbar').show();
                      //滑动切换menu
                      $('.car-info-box').each(function(){
                          var n = $('.car-info-box').index($(this));
                          var m = $(this).offset().top;  //alert(scrolls);                      
                          if(scrolls > m - 32){
                              $("#fixnavbar li").removeClass("on");
                              $('#fixnavbar li:eq('+n+')').addClass("on");
                          }else{
                              
                          }
                      });
                  } else {
                      $("#fixnavbar").hide();
                      element.css({
                          position: "absolute",
                          top: top
                      });
                  }
              });
          };
          return $(this).each( function() {
              FixedFun($(this));
          });
      };
      $.fn.capacityFixed.deflunt={
              left:0,
              right : 0,//相对于页面宽度的右边定位
              top:638,
              pageWidth : 990
      };
      $("#fixnavbar").capacityFixed();
  }
