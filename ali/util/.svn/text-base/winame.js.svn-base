/**
 * @desc winname即window.name
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-06-24
 */

var Winame = exports;

var init = function (win) {

    try {

        var name = win.name || '{}';

        name = JSON.parse(name);

    } catch (e) {

        name = {};
    }

    return name;
};

// public
Winame.get = function (k, win) {

    win || (win = window);

    var name = init(win);

    return name[k] || false;
};

Winame.set = function (k, v, win) {

    win || (win = window);

    var name = init(win);

    name[k] = v;

    try {

        name = JSON.stringify(name);

        win.name = name;

    } catch (e) {

        return false;
    }

    return true;
};

Winame.remove = function (k, w) {

    win || (win = window);

    var name = init(win);

    delete name[k];

    try {

        name = JSON.stringify(name);

        win.name = name;

    } catch (e) {

        return false;
    }

    return true;
};


Winame.clear = function (win) {

    win || (win = window);

    try {

        win.name = '{}';

    } catch (e) {

        return false;
    }

    return true;
};
