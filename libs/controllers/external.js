/*!
 * https://www.instapio.com
 * Copyright(c) 2013-2017 Instapio, Inc
 * MIT Licensed
 */
'use strict';
var express = require('express');
var router = express.Router();
if (global.app.external !== undefined && global.app.external.routes != undefined && Array.isArray(global.app.external.routes)) {
    for (var i = 0; i < global.app.external.routes.length; i++) {
        var r = global.app.external.routes[i];
        if (r.method === undefined) r.method = "get";
        if (r.path === undefined) r.path = "/";
        if (r.func === undefined) r.func = function(req, res) {
            req.error("Function not defined for route");
            res.send({ success: false, error: "route function not defined" });
        };
        console.log(r.method + " /external" + r.path + " Mapped");
        router[r.method](r.path, r.func);
    }
}
router.get('/', function(req, res, next) {
    req.debug("External Get /");
    res.send({ success: true });
});
module.exports = router;