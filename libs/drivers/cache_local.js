/*!
 * https://www.instapio.com
 * Copyright(c) 2013-2017 Instapio, Inc
 * MIT Licensed
 */
const NodeCache = require("node-cache");
const nodeCache = new NodeCache();

function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
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
    nodeCache.set(key, value, cacheTTL, callback);
}
cache.get = function(key, cb) {
    var callback = function() {};
    if (cb !== undefined) {
        if (isFunction(cb)) callback = cb;
    }
    nodeCache.get(key, callback);
}
cache.flush = function() {
    nodeCache.flushAll();
}
cache.del = function(key) {
    nodeCache.del(key);
}
module.exports = cache;