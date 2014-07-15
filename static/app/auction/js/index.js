/**
 * Created by han on 4/14/14.
 */
"use strict";
var $ = require('jquery');
var Base = require('app/auction/js/base.js');
var Countdown = require('app/common/countdown.js');
var Index = exports;

$.extend(Index, Base);

Index.countdown = function(config) {
    var $el = config.$el,
        countDown,
    time = $el.data('value');
    if (time) {
        countDown = new Countdown({
            $el: $el,
            val: time,
            onCount: function(formated) {
                this.$el.text(formated);
            },
            onEnd: function() {
                this.$el.parent().remove();
            }
        });
    }
};

/**
 * 关注
 * @param config
 */
Index.fo = function(config) {
    var $el = config.$el;
    function follow(session_car_id, obj) {
        $.ajax({
            url:'/?_mod=default&_act=ajaxFollow',
            type:'post',
            data:'session_car_id='+session_car_id,
            dataType:'json',
            success:function(j){
                var aobj = $(obj);
                if(j.code === 0) {
                    alert(j.msg);
                }
                else if(j.code === 1){
                    if(Index.followCount === 0){
                        $('#followImg').hide();
                        $('#followTable').show();
                    }
                    Index.followCount++;
                    $('#follow'+session_car_id).show();
                    $('#list'+session_car_id).hide();
                }
            }
        });
    }
    $el.delegate('.att_btn', 'click', function() {
        follow($(this).data('id'));
    });
};

/**
 * 取消关注
 * @param config
 */
Index.unfo = function(config) {
    var $el = config.$el;
    function cancleFollow(session_car_id) {
        $.ajax({
            url:'/?_mod=default&_act=ajaxCancelFollow',
            type:'post',
            data:{session_car_id: session_car_id},
            dataType:'json',
            success:function(j) {
                if (j.code === 0) {
                    alert(j.msg);
                } else if (j.code === 1) {
                    Index.followCount--;
                    if(Index.followCount === 0){
                        $('#followImg').show();
                        $('#followTable').hide();
                    }
                    $('#follow'+session_car_id).hide();
                    $('#list'+session_car_id).show();
                }
            }
        });
    }
    $el.delegate('.att_btn_cancel', 'click', function() {
        cancleFollow($(this).data('id'));
    });
};
Index.init = function(config) {
    $.extend(Index, config);
    Base.init();
};