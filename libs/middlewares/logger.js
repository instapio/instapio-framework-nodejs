/*!
 * https://www.instapio.com
 * Copyright(c) 2013-2017 Instapio, Inc
 * MIT Licensed
 */
module.exports = function(req, res, next) {
    var fs = require('fs');
    var os = require('os');
    req._starttime = (new Date);
    var logdetails = [];
    var request_path = req.path;
    var objectToLog = function(o) {
        if (Array.isArray(o) || Object.prototype.toString.call(o) == "[object Object]") {
            return JSON.stringify(o);
        }
        return o;
    }
    req.debug = function(msg) {
        if (global.config.LOGGER == "appengine") {
            logdetails.push({ logMessage: objectToLog(msg), severity: "DEBUG", timestamp: (new Date().toISOString) })
        } else {
            console.log("DEBUG:" + objectToLog(msg))
        }
    }
    req.info = function(msg) {
        if (global.config.LOGGER == "appengine") {
            logdetails.push({ logMessage: objectToLog(msg), severity: "INFO", timestamp: (new Date().toISOString) })
        } else {
            console.log("DEBUG:" + objectToLog(msg))
        }
    };
    req.warning = function(msg) {
        if (global.config.LOGGER == "appengine") {
            logdetails.push({ logMessage: objectToLog(msg), severity: "WARNING", timestamp: (new Date().toISOString) })
        } else {
            console.log("DEBUG:" + objectToLog(msg))
        }
    };
    req.error = function(msg) {
        if (global.config.LOGGER == "appengine") {
            logdetails.push({ logMessage: objectToLog(msg), severity: "ERROR", timestamp: (new Date().toISOString) })
        } else {
            console.log("DEBUG:" + objectToLog(msg))
        }
    };
    req.critical = function(msg) {
        if (global.config.LOGGER == "appengine") {
            logdetails.push({ logMessage: objectToLog(msg), severity: "CRITICAL", timestamp: (new Date().toISOString) })
        } else {
            console.log("DEBUG:" + objectToLog(msg))
        }
    }
    req.getLog = function(latency, responseSize, status) {
        return {
            "@type": "type.googleapis.com/google.appengine.logging.v1.RequestLog",
            "method": req.method,
            "resource": request_path,
            "latency": (latency / 1000) + "s",
            "responseSize": responseSize,
            "status": status,
            "severity": "INFO",
            line: logdetails

        }
    }
    var end = res.end;
    res.end = function(chunck, encoding) {
        res.responseTime = (new Date) - req._starttime;
        res.end = end;
        res.end(chunck, encoding);
        if (global.config.LOGGER == "appengine") {
            var logs = req.getLog(res.responseTime, chunck.length, res.statusCode);
            console.log("\n" + logs.method + "\t" + logs.latency + "\t" + logs.status + "\t" + logs.resource);
            for (var i = 0; i < logs.line.length; i++) {
                console.log("\t" + logs.line[i].severity + "\t" + logs.line[i].logMessage);
            }
            console.log("\n");
            var line = JSON.stringify(logs) + os.EOL;
            fs.appendFile('/var/log/app_engine/app.log.json', line, function() {});
        }
    }
    next();
}