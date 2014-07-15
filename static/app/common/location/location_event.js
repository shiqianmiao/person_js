/**
 * @fileoverview 地域选择事件
 * @author chenhan <chenhan@273.cn>
 */
'use strict';
var $ = require('jquery'),
    Storage = require('util/storage.js');

var PREFIX = 'data/location',
    locationData = {},
    dataStatus = false,
    cacheDefers = {};
//    DATA_PER = 'http://data.273.cn/?_mod=location';

/**
 * 保存数据的defer缓存
 * @param {string} id 唯一标识符
 * @param {defer} defer
 */
function _saveDefer(id, defer) {
    if (!cacheDefers[id]) {
        cacheDefers[id] = defer;
    }
}

/**
 * 取得数据的defer缓存
 * @param {string} id 唯一标识符
 */
function _getDefer(id) {
    return cacheDefers[id] ? cacheDefers[id] : null;
}
/**
 * 取得取数据的defer对象
 * @param {string} type 数据类型
 * @param {number} id
 * @returns {defer}
 */
function getAsync(type, id) {
    var timer = null,
        deferId = type + '_' + id,
        defer;
    if (dataStatus) {
        defer = _getDefer(deferId);
        if (defer) {
            return defer;
        }
    }
    defer = $.Deferred();
    timer = setInterval(function() {
        if (dataStatus) {
            var data = locationData[type];
            if (id) {
                data = data[id];
            }
            defer.resolve(data);
            clearInterval(timer);
        }
    }, 20);
    if (!defer) {
        _saveDefer(deferId, defer);
    }
    return defer;
}

/**
 * 延迟取得数据
 * @param {number} id
 * @param {string} name 保存在localstore中的key
 */
function asyncData(id, name) {
    require.async([id]).done(function(data) {
        locationData = data;
        Storage.set(name, JSON.stringify(data));
        dataStatus = true;
    });
}

/**
 * 目前取数据途径
 * * 从js文件中取
 */
module.exports = (function() {
    return {
        /**
         * 取得location data
         * * 在有最近一周内的版本号时,优先取最近一周的数据
         * * 没有时,取上周的版本号
         * * 在storage里取到数据直接保存
         * * 没有取到则去异步加载
         * * 只有特定更新版本的缓存会存留下来,no zuo no die
         */
        getLocationData: function() {
            var id = PREFIX + '/location.js',
                version = G.config('version')[id],
                data;
            if (version) {
                data = Storage.get('location_' + version);
                if (!data) {
                    asyncData(id, 'location_' + version);

                    //清除可能存在的本周初缓存
                    version = Math.round(Date.now() / 1000);
                    version -= version % 64800;
                    Storage.remove('location_' + version);
                    return;
                }
            } else {
                version = Math.round(Date.now() / 1000);
                version -= version % 64800;
                data = Storage.get('location_' + version);
            }

            if (data) {
                locationData = $.parseJSON(data);
                dataStatus = true;
            } else {
                asyncData(id, 'location_' + version);
                //清除可能存在的上周缓存
                Storage.remove('location_' + (version - 64800));
            }
        },
        /**
         * 取得所有省份
         * @returns {Object} defer
         */
        getProvince: function(fn) {
            return getAsync('province');
//            return $.ajax(DATA_PER + '&_act=getprovince', {dataType: 'jsonp'});
        },
        /**
         * 根据省份id取得城市
         * @returns {Object} defer
         */
        getCityListById: function(provinceId) {
            return getAsync('city', provinceId);
//            return $.ajax(DATA_PER + '&_act=getCityListByProvinceId', {
//                data: {'province_id': provinceId},
//                dataType: 'jsonp'
//            });
        },
        /**
         * 根据城市取得地区
         * @returns {Object} defer
         */
        getDistrictListByCityId: function(cityId) {
            return getAsync('city_dist', cityId);
//            return $.ajax(DATA_PER + '&_act=getDistrictListByCityId', {
//                data: {'city_id': cityId},
//                dataType: 'jsonp'
//            });
        },
        /**
         * 根据城市取得所有所有直营和普通门店
         * @returns {defer} defer
         */
        getDeptListByCityId: function(cityId) {
            return getAsync('city_dept', cityId);
//            return $.ajax(DATA_PER + '&_act=getDeptListByCityId', {
//                data: {'city_id': cityId},
//                dataType: 'jsonp'
//            });
        }
    };
} ());
