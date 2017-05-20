/*!
 * https://www.instapio.com
 * Copyright(c) 2013-2017 Instapio, Inc
 * MIT Licensed
 */
'use strict';
var express = require('express');
var router = express.Router();
var async = require('async');
if (global.app.push !== undefined && global.app.push.routes != undefined && Array.isArray(global.app.push.routes)) {
    for (var i = 0; i < global.app.push.routes.length; i++) {
        var r = global.app.push.routes[i];
        if (r.method === undefined) r.method = "get";
        if (r.path === undefined) r.path = "/";
        if (r.func === undefined) r.func = function(req, res) {
            req.error("Function not defined for route");
            res.send({ success: false, error: "route function not defined" });
        };
        console.log(r.method + " /push" + r.path + " Mapped");
        router[r.method](r.path, r.func);
    }
}
var processSensor = function(req, environment, connection, event, context) {
    return function(cb) {
        global.app.processPush(req, environment, connection, event, context, function() {
            req.debug("Processed Sensor:" + connection.id)
            cb();
        })
    }
}
router.post('/', function(req, res, next) {
    req.debug("Push Get /");
    req.debug("Body:" + JSON.stringify(req.body));
    if (global.app.processPushRaw) {
        global.app.processPushRaw(req, req.body, function() {
            res.send({ success: true });
        })
    } else {
        if (req.body.connections && global.app.processPush) {
            var calls = []
            for (var i = 0; i < req.body.connections.length; i++) {
                var connection = req.body.connections[i];
                calls.push(
                    processSensor(
                        req, { env_name: req.body.environment_name, env_url: req.body.environment_url },
                        connection,
                        req.body.event,
                        req.body.context)
                );
            }
            async.parallel(calls, function(err, results) {
                res.send({ success: true });
            })
        } else {
            res.send({ success: true });
        }

    }

});
module.exports = router;