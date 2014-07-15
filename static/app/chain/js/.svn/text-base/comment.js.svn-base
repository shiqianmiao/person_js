/*
 * 新版门店车源评论ajax
 * @author WangYu
 * @since 2014-6-6
 */

var Comment = exports;
var Base = require('app/ms_v2/js/base.js');
var $ = require('jquery');
var CommentTpl = require('app/chain/tpl/comment_list.tpl');
$.extend(Comment, Base);

//初始化
Comment.start = function(params) {
    Comment.get();
    Comment.click();
    Base.init(params);
};

//js事件
Comment.click = function() {
    //tab切换
    $('#stores_eva .title1 h2').live('click', function() {
        $('#current_page').val('1');
        $(this).addClass('on').siblings().removeClass('on');
        Comment.get();
    });

    //翻页条，触发筛选
    $('#page a').live('click', function() {
        if ($(this).html() == '上一页') {
            $('#current_page').val(parseInt($('#current_page').val()) - 1);
        } else if ($(this).html() == '下一页') {
            $('#current_page').val(parseInt($('#current_page').val()) + 1);
        } else {
            $('#current_page').val($(this).html());
        }
        Comment.get();
    });
};

//ajax获取评论
Comment.get = function() {
    $.ajax({
        type: 'get',
        url: '/ajax.php?module=GetCommentList',
        data: {type:$('#stores_eva .title1 .on').attr('id'), current_page:$('#current_page').val()},
        dataType: 'json',
        success: function(data) {
            if (data.total < 1) {
                $('.eva_list').html('<li class=" pj-user pjjl-no"><p>暂无评价记录</p></li>');
                return;
            }
            var commentData = new Array();
            commentData['data'] = data.list;
            commentData['shopUrl'] = $('#shop-url').val();
            $('.eva_list').html(CommentTpl(commentData));
            $('#page').html(data.pager);
        }
    });
};




