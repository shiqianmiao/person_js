/**
 * @desc uuid唯一用户id
 * @copyright (c) 2013 273 Inc
 * @author 马鑫 <maxin@273.cn>
 * @since 2013-06-24
 */

var Cookie  = require('util/cookie.js');
var Storage = require('util/storage.js');
var Winame  = require('util/winame.js');

var UUID_KEY = 'eqs_uuid';
var EXPIRES  = 365; //天
var DOMAIN   = '273.cn';


/**
 * @desc 获取uuid
 * @return int uuid || bool false
 */
var getUuid = function () {

    var uuid = Cookie.get(UUID_KEY) || Storage.get(UUID_KEY) || Winame.get(UUID_KEY);

    if (!uuid || !validateUuid(uuid)) {

        uuid = createUuid();

        Cookie.set(UUID_KEY, uuid, {
            expires : EXPIRES,
            path : '/',
            domain : DOMAIN
        });

        Storage.set(UUID_KEY, uuid);

        Winame.set(UUID_KEY, uuid);
    }

    return uuid;
};

var createUuid = function () {

    var random = G.util.math.random;

    var tm = +new Date();

    var rm = random(10000000, 99999999);

    var swich = function(s) {

        var ret = '';
        var len = s.length;

        while (len > 0) {

            len--;
            ret += s.substr(len, 1);
        }

        return ret;
    };

    var s = swich(tm + '' + random(1, 9));

    s = (s * 1 + rm) + '' + rm;

    return s;
};


// todo:
var validateUuid = function (uuid) {
    return true;
};

// public
module.exports = function () {

    return getUuid();
};
