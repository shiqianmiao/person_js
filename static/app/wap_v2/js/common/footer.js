var $ = require('lib/zepto/zepto-1.0.js');
var Footer = exports;
require('app/wap_v2/js/util/overlay.js');
Footer.showTelBox = function(config) {
    var $elem = config.$el;
    var type = config.type;
    $elem.on('click' , function(){
        var self = this;
        var id = '';
        var msg = '';
        if (type == 'sale') {
            id = 'sale_msg';
            msg = '感谢您提交卖车需求，我们将为您接通273客服热线，请将您的车辆信息告知给我们的客服人员！';
        } else if (type == 'call') {
            id = 'call_msg';
            msg = '您将致电273客服热线：400-6000-273';
        }
        $(this).overlay({
            effect: 'none',
            opacity: 0.8,
            closeOnClick: true,
            glossy:true,
            onShow: function() {
            },
            onHide: function() {
            },
        });
        showBox(id, msg);
        centerDisplay('#'+id);
        function closeMessage(){
            $('#'+id).removeClass('show');
            removeOverlay();
        }
        $('#'+id + ' .btn').click(closeMessage);
        $(window).off('click.dialog').on('click.dialog', function (e) {
            if (!$.contains($('#'+id)[0], e.target) && !$.contains(self, e.target) && self!=e.target) {
                closeMessage();
            }
        });
    });
    function removeOverlay() {
        $(".overlay-trigger").removeClass('overlay-trigger');
        $("body").css('overflow', 'auto');
        $(".overlay").remove();
    }
    function centerDisplay(id) {
        var div = $(id);
        var winHeight = $(window).height();
        var divHeight = div.height();
        var top = (winHeight - divHeight) / 2 + $(window).scrollTop();
        div.css({ top: top + "px"});
    }
    function showBox(id, content) {
        var divTitle = '';
        if (id =='sale_msg') {
            $('#call_msg').hide();
            $('#join_msg').hide();
            divTitle = '我要卖车';
        } else if (id == 'call_msg') {
            $('#sale_msg').hide();
            $('#join_msg').hide();
            divTitle = '联系我们';
        } 
        if ($('#'+id).length > 0) {
            $('#'+id).addClass('show');
        } else {
            $div = "<div id='"+id+"' class='popbox show' style='z-index:1002;'>" +
                   "<div class='popbox-contents'>" +
                   "<p class='tc'><b>"+divTitle+"</b></p>" +
                   "<p class='tl'>"+content+"</p>" +
                   "</div>"+
                   "<div class='popbox-btn shange2'>"+
                   "<div class='left'><span class='btn' data-273-click-log='/wap/box/"+id+"/@etype=click@value=no'>取消</span></div>"+
                   "<div class='right'><span class='btn btn-green'><a data-273-click-log='/wap/box/"+id+"/@etype=click@value=yes' href='tel:4006000273' mce_href='tel:4006000273'>拨打电话</a></span></div>"+
                   "</div>"+
                   "</div>";
            $('body').append($div);
        }
    }
};

// 返回顶部
Footer.scrollTop = function (config) {

    var $top = config.$el;
    var $win = $(window);
    function show() {
        $top.css('visibility', 'visible');
    }

    function hide() {
        $top.css('visibility', 'hidden');
    }

    $win.scroll(function () {

        if ($win.scrollTop() > $win.height() / 2) {
            show();
        } else {
            hide();
        }
    });

    $top.click(function () {
        window.scroll(0, 0);
    });

    $win.scroll();
};
