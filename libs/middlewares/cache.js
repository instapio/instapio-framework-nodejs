/*!
 * https://www.instapio.com
 * Copyright(c) 2013-2017 Instapio, Inc
 * MIT Licensed
 */
function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
var cache = null;

function getCache(req) {
    if (cache != null) return cache;
    console.log("Cache");
    console.log(JSON.stringify(global.app));
    if (global.config.CACHE_DRIVER == "redis") {
        cache = require('../drivers/cache_redis');
    } else {
        cache = require('../drivers/cache_local');
    }
    return cache;
}
module.exports = function(req, res, next) {
    var cache = getCache(req);
    req.cache = {};
    req.cache.set = function(key, value, ttl, cb) {
        var cacheTTL = 0;
        var callback = function() {};
        if (!isNaN(ttl)) {
            cacheTTL = ttl;
        }
        if (cb === undefined) {
            if (isFunction(ttl)) callback = ttl;
        } else {
            if (isFunction(cb)) callback = cb;
        }
        cache.set(key, value, cacheTTL, callback);
    }
    req.cache.get = function(key, cb) {
        var callback = function() {};
        if (cb !== undefined) {
            if (isFunction(cb)) callback = cb;
        }
        cache.get(key, callback);
    }
    req.cache.flush = function() {
        cache.flushAll();
    }
    req.cache.del = function(key) {
        cache.del(key);
    }
    next();
};