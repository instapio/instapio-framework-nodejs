/*!
 * https://www.instapio.com
 * Copyright(c) 2013-2017 Instapio, Inc
 * MIT Licensed
 */
module.exports = function(req, res, next) {
    req.api = {};
    req.environments = function(cb) {
        if (req.cache && req.cache.get) {
            req.cache.get("environments", function(err, environments) {
                if (err || environments === undefined || environments == null) {
                    req.db.load('all', 'environments', 'environments', function(err, env_entity) {
                        console.log("Checking Environments Loaded from DB");
                        if (env_entity === undefined) {
                            console.log("Checking Environments Not Defined in DB");
                            env_entity = { environments: {} }
                        }
                        if (env_entity.environments === undefined) env_entity.environments = {};
                        return cb(env_entity.environments)
                    });
                } else {
                    return cb(environments);
                }
            });
        } else {
            return cb({});
        }
    }
    req.api.getApp = function(env_url, cb) {
        var environment_url = env_url;
        var callback = cb;
        if (cb === undefined) {
            environment_url = "";
            callback = cb;
            if (req.vars.environment_url) environment_url = req.vars.environment_url;
        }
        var options = {
            method: "get",
            json: true,
            url: environment_url + "/api/v2/developers/apps/" + global.config.INSTAPIO_CLIENT_ID + "/?client_id=" + global.config.INSTAPIO_CLIENT_ID + "&client_secret=" + global.config.INSTAPIO_CLIENT_SECRET,
        }
        req.httpservice(options, function(err, result) {
            if (err) return callback(err);
            if (result.success) return callback(null, result.data);
            return callback(result.error);
        })
    }
    req.api.getAccounts = function(env_url, cb) {
        var options = {
            method: "get",
            json: true,
            url: env_url + "/api/v2/developers/apps/" + global.config.INSTAPIO_CLIENT_ID + "/accounts/?client_id=" + global.config.INSTAPIO_CLIENT_ID + "&client_secret=" + global.config.INSTAPIO_CLIENT_SECRET,
        }
        req.httpservice(options, function(err, result) {
            if (err) return cb(err);
            if (result.success) return cb(null, result.data);
            return cb(result.error);
        })
    }
    req.api.getAccount = function(env_url, account_id, cb) {
        var options = {
            method: "get",
            json: true,
            url: env_url + "/api/v2/developers/apps/" + global.config.INSTAPIO_CLIENT_ID + "/accounts/" + account_id + "/?client_id=" + global.config.INSTAPIO_CLIENT_ID + "&client_secret=" + global.config.INSTAPIO_CLIENT_SECRET,
        }
        req.httpservice(options, function(err, result) {
            if (err) return cb(err);
            if (result.success) return cb(null, result.data);
            return cb(result.error);
        })
    }
    req.api.getConnections = function(env_url, cb) {
        var options = {
            method: "get",
            json: true,
            url: env_url + "/api/v2/developers/apps/" + global.config.INSTAPIO_CLIENT_ID + "/connections/?client_id=" + global.config.INSTAPIO_CLIENT_ID + "&client_secret=" + global.config.INSTAPIO_CLIENT_SECRET,
        }
        req.httpservice(options, function(err, result) {
            if (err) return cb(err);
            if (result.success) return cb(null, result.data);
            return cb(result.error);
        })
    }
    req.api.getConnection = function(env_url, connection_id, cb) {
        var options = {
            method: "get",
            json: true,
            url: env_url + "/api/v2/developers/apps/" + global.config.INSTAPIO_CLIENT_ID + "/connections/" + connection_id + "/?client_id=" + global.config.INSTAPIO_CLIENT_ID + "&client_secret=" + global.config.INSTAPIO_CLIENT_SECRET,
        }
        req.httpservice(options, function(err, result) {
            if (err) return cb(err);
            if (result.success) return cb(null, result.data);
            return cb(result.error);
        })
    }
    req.api.getAccountVisitor = function(env_url, account_id, visitor_id, cb) {
        var options = {
            method: "get",
            json: true,
            url: env_url + "/api/v2/developers/apps/" + global.config.INSTAPIO_CLIENT_ID + "/accounts/" + account_id + "/visitors/" + visitor_id + "/?client_id=" + global.config.INSTAPIO_CLIENT_ID + "&client_secret=" + global.config.INSTAPIO_CLIENT_SECRET,
        }
        req.httpservice(options, function(err, result) {
            if (err) return cb(err);
            if (result.success) return cb(null, result.data);
            return cb(result.error);
        })
    }
    req.api.setAccountVisitor = function(env_url, account_id, visitor_id, visitor, cb) {
        var options = {
            method: "put",
            json: visitor,
            url: env_url + "/api/v2/developers/apps/" + global.config.INSTAPIO_CLIENT_ID + "/accounts/" + account_id + "/visitors/" + visitor_id + "/?client_id=" + global.config.INSTAPIO_CLIENT_ID + "&client_secret=" + global.config.INSTAPIO_CLIENT_SECRET,
        }
        req.httpservice(options, function(err, result) {
            if (err) return cb(err);
            if (result.success) return cb(null, result.data);
            return cb(result.error);
        })
    }
    req.api.getConnectionVisitors = function(env_url, connection_id, cb) {
        var options = {
            method: "get",
            json: true,
            url: env_url + "/api/v2/developers/apps/" + global.config.INSTAPIO_CLIENT_ID + "/connections/" + connection_id + "/visitors/?client_id=" + global.config.INSTAPIO_CLIENT_ID + "&client_secret=" + global.config.INSTAPIO_CLIENT_SECRET,
        }
        req.httpservice(options, function(err, result) {
            if (err) return cb(err);
            if (result.success) return cb(null, result.data);
            return cb(result.error);
        })
    }
    req.api.getConnectionActingVisitor = function(env_url, connection_id, cb) {
        var options = {
            method: "get",
            json: true,
            url: env_url + "/api/v2/developers/apps/" + global.config.INSTAPIO_CLIENT_ID + "/connections/" + connection_id + "/acting_visitor/?client_id=" + global.config.INSTAPIO_CLIENT_ID + "&client_secret=" + global.config.INSTAPIO_CLIENT_SECRET,
        }
        req.httpservice(options, function(err, result) {
            if (err) return cb(err);
            if (result.success) return cb(null, result.data);
            return cb(result.error);
        })
    }
    req.api.getAccountConnections = function(env_url, account_id, cb) {
        var options = {
            method: "get",
            json: true,
            url: env_url + "/api/v2/developers/apps/" + global.config.INSTAPIO_CLIENT_ID + "/accounts/" + account_id + "/connections/?client_id=" + global.config.INSTAPIO_CLIENT_ID + "&client_secret=" + global.config.INSTAPIO_CLIENT_SECRET,
        }
        req.httpservice(options, function(err, result) {
            if (err) return cb(err);
            if (result.success) return cb(null, result.data);
            return cb(result.error);
        })
    }
    req.api.getAccountLocations = function(env_url, account_id, cb) {
        var options = {
            method: "get",
            json: true,
            url: env_url + "/api/v2/developers/apps/" + global.config.INSTAPIO_CLIENT_ID + "/accounts/" + account_id + "/locations/?client_id=" + global.config.INSTAPIO_CLIENT_ID + "&client_secret=" + global.config.INSTAPIO_CLIENT_SECRET,
        }
        req.httpservice(options, function(err, result) {
            if (err) return cb(err);
            if (result.success) return cb(null, result.data);
            return cb(result.error);
        })
    }
    req.api.getAccountLocations = function(env_url, account_id, cb) {
        var options = {
            method: "get",
            json: true,
            url: env_url + "/api/v2/developers/apps/" + global.config.INSTAPIO_CLIENT_ID + "/accounts/" + account_id + "/locations/?client_id=" + global.config.INSTAPIO_CLIENT_ID + "&client_secret=" + global.config.INSTAPIO_CLIENT_SECRET,
        }
        req.httpservice(options, function(err, result) {
            if (err) return cb(err);
            if (result.success) return cb(null, result.data);
            return cb(result.error);
        })
    }
    req.api.Event = function(env_url, event, cb) {
        var options = {
            method: "post",
            json: event,
            url: env_url + "/api/v2/developers/apps/" + global.config.INSTAPIO_CLIENT_ID + "/connections/?client_id=" + global.config.INSTAPIO_CLIENT_ID + "&client_secret=" + global.config.INSTAPIO_CLIENT_SECRET,
        }
        req.debug("API Event " + env_url + ":" + JSON.stringify(event));
        req.httpservice(options, function(err, result) {
            if (err) {
                console.log("Api Event Error: " + err);
                return cb(err);
            }
            console.log("Api Event Result: " + JSON.stringify(result));
            if (result === undefined) return cb("no result");
            if (result.success) return cb(null, result.data);
            return cb(result.error);
        })
    }
    next();
};