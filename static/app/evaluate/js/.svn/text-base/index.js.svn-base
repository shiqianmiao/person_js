/**
 * @desc 评估首页
 * @copyright (c) 2013 273 Inc
 * @author chenhan <chenhan@273.cn>
 * @since 2013-12-11
 */

var $ = require('jquery');
var Widget = require('lib/widget/widget.js');
var Base = require('app/ms/js/base.js');
var EvalForm = require('app/common/eval_form.js');
var Index = exports;

/**
 * 初始化评估表单
 */
Index.initEvalForm = function(config) {
    var $el = config.$el;
    new EvalForm($el, '/evaluate/index');
}

/**
 * 广告淡入淡出
 */
Index.fadeToggle = function(config) {
    var $el     = config.$el,
        $imgs   = $el.find('img'),
        $btn    = $el.find('.link_btn a');
    
    var index   = 1,
        num     = $btn.size(),
        timer   = null;
    $btn.on('click', function() {
        index = $(this).index();
        triggerEvent();
    });
    
    $btn.on('fade', fadeImg);
    
    
    function fadeImg() {
        $(this).addClass('on').siblings().removeClass();
        var $nowImg = null;
        $imgs.each(function() {
            if ($(this).is(':visible')) {
                $nowImg = $(this);
            }
        });
        $nowImg.fadeOut('normal', $.proxy(function() {
            $($imgs[$(this).index()]).fadeIn('normal');
        }, this));
    }
    

    
    timer = window.setInterval(triggerEvent, 15000);
    $btn.hover(function() {
        clearInterval(timer);
    }, function() {
        timer = window.setInterval(triggerEvent, 15000);
    });
    
    function triggerEvent() {
        $($btn[index%num]).trigger('fade');
        index++;
    }
}

/**
 * 了解评估团
 */
Index.evalGroup = function(config) {
    var $el         = config.$el,
        $detail     = $el.find('#js_detail'),
        $knowBtn    = $el.find('#js_s_know_btn'),
        $closeBtn   = $el.find('.close');
    $knowBtn.on('click', function() {
        $detail.show();
    });
    $closeBtn.on('click', function() {
        $detail.hide();
    });
    $(document).on('click', function(e) {
        if (!$.contains($el[0], e.target)) {
            $detail.hide();
        }
    });
}

/**
 * 宣传框
 */
Index.propaganda  = function(config) {
    var $el  = config.$el,
        $lis = $el.find('li');
    $lis.hover(function() {
        $(this).find('.mod_box_info').stop().animate({top : 0}, 'fast');
    }, function() {
        var $box = $(this).find('.mod_box_info');
        $box.stop().animate({top : -$box.height()}, 'fast');
    });
}

Index.init = function (param) {
    Base.init(param);
}

Index.shopTab = function(config) {
    var $el = config.$el,
        $tabs = $el.find('h2 a'),
        $contents = $el.find('.js_tab_shop')
        $uls = $el.find('ul');
    $tabs.on('mouseenter', function() {
        var $this = $(this);
        var index = $this.index();

        $tabs.removeClass('current');
        $this.addClass('current');
        $contents.css('display', 'none');
        $($contents[index]).css('display', 'block');
    });

    $contents.css('display', 'block');
    $.each($uls, function(index, el) {
        var $ul = $(el),
            $lis = $ul.find('li');
        $ul.width(($lis[0].offsetWidth + 10) * $lis.length);
        var num = $ul.data('liNum') || 4;

        var $as  = $el.find('#js_scroll_btn a'),
        unit = num * ($lis[0].offsetWidth + 10);
        $as.on('click', function() {
            $(this).addClass('current').siblings().removeClass();
            $ul.animate({right : $(this).index() * unit}, 'normal');
        });
    });
    $($tabs[0]).trigger('mouseenter');
}