/*!
 * https://www.instapio.com
 * Copyright(c) 2013-2017 Instapio, Inc
 * MIT Licensed
 */

module.exports = function(app_module, cb) {
    var express = require('express');
    var app = express();
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var CronJob = require('cron').CronJob;
    global.config = {
        "INSTAPIO_APPLICATION_NAME": "",
        "INSTAPIO_CLIENT_ID": "",
        "INSTAPIO_CLIENT_SECRET": "",
        "INSTAPIO_PUSH_SECRET": "",
        "INSTAPIO_PROJECT_ID": "",
        "DATABASE": "mongo",
        "PORT": "8080",
        "FRAMEWORK": "bootstrap",
        "OAUTH": "",
        "OAUTH_AUTHORIZATION_URL": "",
        "OAUTH_TOKEN_URL": "",
        "OAUTH_CLIENT_ID": "",
        "OAUTH_CLIENT_SECRET": "",
        "OAUTH_CALLBACK_URL": "",
        "CACHE_ENTITIES": "false",
        "DATABASE_DRIVER": "datastore",
        "DATABASE_URL": "mongodb://127.0.0.1:27017/app",
        "CACHE_DRIVER": "local",
        "LOGGER": "appengine",
        "MONGO_ENTITY_NAMESPACE": "true",
        "CACHE_URL": "redis://127.0.0.1:6379"
    };
    if (app_module === undefined || app_module == null) {
        return cb("App Not Passed");
    }
    global.app = app_module
    console.log("App Defined");
    if (global.app.config !== undefined) {
        var k = Object.keys(global.app.config);
        console.log(k);
        for (var i = 0; i < k.length; i++) {
            global.config[k[i]] = global.app.config[k[i]];
        }
    } else {
        console.log("Config Not Defined");
    }
    require('request').get({
        url: "http://metadata.google.internal/computeMetadata/v1/instance/attributes/?recursive=true",
        json: true,
        headers: {
            "Metadata-Flavor": "Google"
        }
    }, function(err, res, body) {
        var keys = Object.keys(global.config)
        for (var i = 0; i < keys.length; i++) {
            if (process.env[keys[i]] !== undefined) global.config[keys[i]] = process.env[keys[i]]
        }
        if (!err) {
            console.log("Received Google Response")
            console.log(body);
            for (var i = 0; i < keys.length; i++) {
                if (body[keys[i]] !== undefined) global.config[keys[i]] = body[keys[i]]
            }
        } else {
            console.log("Non Google Environment")
        }
        if (global.app.assets) {
            console.log("App Assets Defined");
            app.use('/assets', express.static(global.app.assets));
        }
        app.use('/assets', express.static(require('path').join(__dirname, 'assets')));
        app.use('/assets/bower_components', express.static(require('path').join(__dirname, 'bower_components')));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        if (global.config.FRAMEWORK == "bootstrap") {
            console.log("Bootstrap Framework");
            if (global.app.views) {
                app.set('views', [global.app.views, require('path').join(__dirname, 'views_bootstrap'), require('path').join(__dirname, 'views_builtin')]);
            } else {
                app.set('views', [require('path').join(__dirname, 'views_bootstrap'), require('path').join(__dirname, 'views_builtin')]);
            }

        } else if (global.config.FRAMEWORK == "angular") {
            console.log("Angular Framework");
            if (global.app.views) {
                app.set('views', [global.app.views, require('path').join(__dirname, 'views_angular'), require('path').join(__dirname, 'views_builtin')]);
            } else {
                app.set('views', [require('path').join(__dirname, 'views_angular'), require('path').join(__dirname, 'views_builtin')]);
            }
        } else {
            console.log("Custom Framework");
            if (global.app.views) {
                app.set('views', [global.app.views, require('path').join(__dirname, 'views_builtin')]);
            } else {
                app.set('views', [require('path').join(__dirname, 'views_builtin')]);
            }
        }
        app.set('view engine', 'ejs');
        app.use(require('./libs/middlewares/logger'));
        app.use(require('./libs/middlewares/database'));
        app.use(require('./libs/middlewares/cache'));
        app.use(require('./libs/middlewares/http'));
        app.use(require('./libs/middlewares/api'));
        app.use('/', require('./libs/controllers/home'));
        app.use('/connection', require('./libs/middlewares/security'), require('./libs/controllers/connection'));
        app.use('/settings', require('./libs/middlewares/security'), require('./libs/controllers/settings'));
        app.use('/dashboard', require('./libs/middlewares/security'), require('./libs/controllers/dashboard'));
        app.use('/push', require('./libs/middlewares/security'), require('./libs/controllers/push'));
        app.use('/external', require('./libs/controllers/external'));
        app.use('/cron', require('./libs/controllers/cron'));
        app.use('/status', require('./libs/controllers/status'));
        if (global.config.OAUTH !== "") {
            console.log("OAuth Enabled");
            app.use('/oauth', require('./libs/middlewares/security'), require('./libs/controllers/oauth'));
        }

        if (global.app.cron !== undefined) {
            console.log("Cron is set");
            var cron_time = '* * * * *';
            if (global.app !== undefined && global.app.cron_time !== undefined) cron_time = global.app.cron_time;
            console.log("Cron Time is: " + cron_time);
            try {
                var job = new CronJob(cron_time, function() {
                    console.log("Running Cron" + global.app.cron_time);
                    require('request')("http://localhost:" + global.config.PORT + "/cron", function(err, msg, response) {});
                });
                job.start();
            } catch (e) {
                console.log("Bad Cron Format" + cron_time);
                console.log(e);
            }

        } else {
            console.log("No Cron is Set");
        }
        app.locals.config = global.config;
        console.log("Configuration:" + JSON.stringify(global.config));
        app.listen(global.config.PORT, function() {
            console.log("%s Version:%s Listening %s", global.config.INSTAPIO_APPLICATION_NAME, global.config.VERSION, global.config.PORT);
            cb();
        })
    });
}