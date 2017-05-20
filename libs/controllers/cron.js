/*!
 * https://www.instapio.com
 * Copyright(c) 2013-2017 Instapio, Inc
 * MIT Licensed
 */
'use strict';
var express = require('express');
var fs = require('fs');
var router = express.Router();

router.get('/', function(req, res, next) {
    req.debug("Cron Get /");
    if (global.app.cron !== undefined) {
        req.debug("CronJob Defined");
        global.app.cron(req, function(err) {
            if (err !== undefined && err !== null) {
                req.error("Error Running Cronjob");
                req.error(err);
                res.send(500, { success: false, error: err });
                return
            }
            req.debug("Cronjob Ran Successfully");
            return res.send({ success: true });
        });
    } else {
        req.debug("CronJob Not Defined");
        return res.send({ success: true });
    }
});
module.exports = router;