/*!
 * https://www.instapio.com
 * Copyright(c) 2013-2017 Instapio, Inc
 * MIT Licensed
 */
'use strict';
var express = require('express');
var router = express.Router();

if (global.app.home !== undefined && global.app.home.routes != undefined && Array.isArray(global.app.home.routes)) {
    for (var i = 0; i < global.app.home.routes.length; i++) {
        var r = global.app.home.routes[i];
        if (r.method === undefined) r.method = "get";
        if (r.path === undefined) r.path = "/";
        if (r.func === undefined) r.func = function(req, res) {
            req.error("Function not defined for route");
            res.send({ success: false, error: "route function not defined" });
        };
        console.log(r.method + " /home" + r.path + " Mapped");
        router[r.method](r.path, r.func);
    }
}
router.get('/', function(req, res, next) {
    console.log("Home Get /");
    req.debug("Home Get /");
    res.render('home')
});
module.exports = router;