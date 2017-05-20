/*!
 * https://www.instapio.com
 * Copyright(c) 2013-2017 Instapio, Inc
 * MIT Licensed
 */
const request = require("request");

function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
module.exports = function(req, res, next) {
    req.httpservice = function(opts, cb) {
        var options = {
            method: "GET",
        }
        if (opts.url === undefined) {
            if (isFunction(cb)) {
                return cb("url not set");
            }
            return

        }
        options.url = opts.url;
        if (opts.method) options.method = opts.method;
        if (opts.headers) options.headers = opts.headers;
        if (opts.form) options.form = opts.form;
        if (opts.json) options.json = opts.json;
        req.debug("HTTP Service Request:" + JSON.stringify(options));
        try {
            request(options, function(err, msg, response) {
                req.debug("HTTP Service Recived Error:" + err);
                req.debug("HTTP Service Recived Response:" + JSON.stringify(response));
                if (isFunction(cb)) {
                    if (err) {
                        return cb(err);
                    }
                    return cb(null, response);
                }
            })
        } catch (e) {
            req.debug("HTTP Service Error: " + e);
            if (isFunction(cb)) {
                return cb(e);
            }
        }
    }
    next();
};