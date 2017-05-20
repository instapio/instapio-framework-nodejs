/*!
 * https://www.instapio.com
 * Copyright(c) 2013-2017 Instapio, Inc
 * MIT Licensed
 */
'use strict';
const async = require('async');
var express = require('express');
var router = express.Router();
if (global.app.dashboard !== undefined && global.app.dashboard.routes != undefined && Array.isArray(global.app.dashboard.routes)) {
    for (var i = 0; i < global.app.dashboard.routes.length; i++) {
        var r = global.app.dashboard.routes[i];
        if (r.method === undefined) r.method = "get";
        if (r.path === undefined) r.path = "/";
        if (r.func === undefined) r.func = function(req, res) {
            req.error("Function not defined for route");
            res.send({ success: false, error: "route function not defined" });
        };
        console.log(r.method + " /dashboard" + r.path + " Mapped");
        router[r.method](r.path, r.func);
    }
}
router.get('/', function(req, res, next) {
    req.debug("Dashboard Get /");
    async.parallel({
        connections: function(cb) {
            req.api.getAccountConnections(req.vars.environment_url, req.vars.account_id, cb);
        },
        account: function(cb) {
            req.api.getAccount(req.vars.environment_url, req.vars.account_id, cb);
        },
        locations: function(cb) {
            req.api.getAccountLocations(req.vars.environment_url, req.vars.account_id, cb);
        },
    }, function(err, result) {
        var calls = {};
        var getDbConnectionCall = function(connection_id) {
            return function(cb) {
                req.db.connection.load(req.vars.environment_name, connection_id, cb);
            }
        }
        if (result && result.connections) res.locals.connections = result.connections;
        if (result && result.account) res.locals.account = result.account;
        if (result && result.locations) res.locals.locations = result.locations;
        if (result && result.connections && Array.isArray(result.connections)) {
            for (var i = 0; i < result.connections.length; i++) calls[result.connections[i].id] = getDbConnectionCall(result.connections[i].id);
        }
        console.log(result);
        async.parallel(calls, function(err, connectiondbs) {
            res.locals.connectiondbs = connectiondbs;
            if (global.app !== undefined && global.app.dashboard !== undefined && global.app.dashboard.resolveView !== undefined) {
                global.app.dashboard.resolveView(req, res, req.vars.environment_name, req.vars.account_id, function(view, params) {
                    res.render(view, params)
                })
            } else {
                if (req.query.json) return res.send({ account: res.locals.account, connections: res.locals.connections, connectiondbs: res.locals.connectiondbs });
                res.render('dashboard')
            }
        })
    })
});
module.exports = router;