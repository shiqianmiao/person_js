//头部好评差评跳转
var HeaderComment = exports;
var $ = require('jquery');

HeaderComment.start = function() {
    $('#shop-good').click(function() {
        location.href = $('#shop-comment-url').val();
    });

    $('#shop-bad').click(function() {
        location.href = $('#shop-comment-url').val() + '#';
    });

    $('#adviser-good').click(function() {
        location.href = $('#adviser-comment-url').val();
    });

    $('#adviser-bad').click(function() {
        location.href = $('#adviser-comment-url').val() + '#';
    });

    var currentUrl = window.location.href;
    if (currentUrl.indexOf('#') >= 0) {
            $('#stores_eva h2:eq(2)').trigger('click');
    } else {
            $('#stores_eva h2:eq(1)').trigger('click');
    }
};
