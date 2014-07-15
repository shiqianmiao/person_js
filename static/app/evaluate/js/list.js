
var $ = require('jquery');
var Base = require('app/ms/js/base.js');
var List = exports;

List.Screening = function (config) {
    var $el = config.$el,
        $btns = $el.find('.js_search_dd');

    $btns.hover(function() {
        $(this).find('.morelayer').toggle();
    });
}

List.init = function (param) {
    Base.init(param);
}