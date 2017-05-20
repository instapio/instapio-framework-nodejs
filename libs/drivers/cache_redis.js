/*!
 * https://www.instapio.com
 * Copyright(c) 2013-2017 Instapio, Inc
 * MIT Licensed
 */
const redis = require("redis");
var cacheClient = null;

function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function getCache() {
    if (cacheClient != null) return cacheClient;
    cacheClient = redis.createClient(global.config.CACHE_URL);
    return cacheClient;
}
cache = {};
cache.set = function(key, value, ttl, cb) {
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
    if (ttl < 1) {
        getCache().set(global.config.INSTAPIO_CLIENT_ID + "-" + key, JSON.stringify(value));
    } else {
        getCache().set(global.config.INSTAPIO_CLIENT_ID + "-" + key, JSON.stringify(value), 'EX', ttl);
    }

    return callback();
}
cache.get = function(key, cb) {
    var callback = function() {};
    if (cb !== undefined) {
        if (isFunction(cb)) callback = cb;
    }
    getCache().get(global.config.INSTAPIO_CLIENT_ID + "-" + key, function(err, reply) {
        if (err) return callback(err);
        try {
            return callback(null, JSON.parse(reply));
        } catch (e) {
            return callback(e);
        }
    })
}
cache.flush = function() {}
cache.del = function(key) {
    getCache().del(global.config.INSTAPIO_CLIENT_ID + "-" + key);
}
module.exports = cache;