/*!
 * https://www.instapio.com
 * Copyright(c) 2013-2017 Instapio, Inc
 * MIT Licensed
 */
'use strict';
var express = require('express');
var router = express.Router();
router.get('/', function(req, res, next) {
    console.log("Status Get /");
    req.debug("Status Get /");
    res.send({ success: true });
});
module.exports = router;