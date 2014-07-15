/**
 * @desc 收藏夹
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-06-24
 */

// public
var Favorite = exports;
var Util = require('util');

// private

var URL = window.location.href;
var TITLE = document.title;
var CTRL_KEY = Util.ua.os === 'macintosh' ? 'command' : 'ctrl';


Favorite.add = function (url, title) {

    url = url || URL;
    title = title || TITLE;

    try {

        if (window.sidebar) {

            window.sidebar.addPanel(title, url, '');
        } else if (window.opera && window.print) {

            var $el = $('<a>');

            $el.attr({
                rel : 'sidebar',
                href : url,
                title : title
            }).click();

        } else {

            window.external.AddFavorite(url, title);
        }
    } catch (e) {

        alert('您的浏览器暂不支持此操作，\n请使用按键 ' + CTRL_KEY + '+D 收藏【' + title + '】');
    }

}