/*!
 * https://www.instapio.com
 * Copyright(c) 2013-2017 Instapio, Inc
 * MIT Licensed
 */
'use strict';
var express = require('express');
var router = express.Router();
if (global.app.connection !== undefined && global.app.connection.routes !== undefined && Array.isArray(global.app.connection.routes)) {
    for (var i = 0; i < global.app.connection.routes.length; i++) {
        var r = global.app.connection.routes[i];
        if (r.method === undefined) r.method = "get";
        if (r.path === undefined) r.path = "/";
        if (r.func === undefined) r.func = function(req, res) {
            req.error("Function not defined for route");
            res.send({ success: false, error: "route function not defined" });
        };
        console.log(r.method + " /connection" + r.path + " Mapped");
        router[r.method](r.path, r.func);
    }
}
var preload = function(connection_id, vars, cb) {
    cb();
}
var postload = function(connection_id, entity, cb) {
    cb()
}
if (global.app.connection.preload) preload = global.app.connection.preload;
if (global.app.connection.postload) postload = global.app.connection.postload;

router.get('/', function(req, res, next) {
    req.debug("Connection GET /");
    req.debug("Getting Connection From Database");
    req.debug(req.vars);
    req.db.connection.load(req.vars.environment_name, req.vars.connection_id, function(err, entity) {
        var form = [];
        if (global.app !== undefined && global.app.connection !== undefined && global.app.connection.form !== undefined) {
            var form = global.app.connection.form;
            req.debug("Static Form Defined:" + JSON.stringify(form));
        }
        if (global.app !== undefined && global.app.connection !== undefined && global.app.connection.getform !== undefined) {
            req.debug("Dynamic Form Defined");
            global.app.connection.getform(req, req.vars.environment_name, req.vars.account_id, req.vars.connection_id, entity, function(err, dynamicForm) {
                if (err) {
                    req.debug("Error Dynamic Form:" + err);
                }
                if (dynamicForm !== undefined && dynamicForm != null) {
                    req.debug("Dynamic Form:" + JSON.stringify(dynamicForm));
                    res.locals.form = dynamicForm;
                } else {
                    req.debug("Dynamic Form: Empty");
                }
                if (entity === undefined) {
                    entity = {}
                }
                if (res.locals.form !== undefined) {
                    req.debug("Form Defined. Setting Defaults")
                    for (var i = 0; i < res.locals.form.length; i++) {
                        if (entity[res.locals.form[i].name] === undefined) {
                            req.debug("Setting: " + res.locals.form[i].name + " To:" + res.locals.form[i].default)
                            entity[res.locals.form[i].name] = res.locals.form[i].default;
                        }
                    }
                }
                res.locals.entity = entity;
                if (global.app !== undefined && global.app.connection !== undefined && global.app.connection.resolveView !== undefined) {
                    global.app.connection.resolveView(req, res, req.vars.environment_name, req.vars.connection_id, res.locals.entity, res.locals.form, function(view, params) {
                        res.render(view, params)
                    })
                } else {
                    res.render('connection')
                }
            });
        } else {

            res.locals.form = form;
            if (entity === undefined) {
                entity = {}
            }
            if (res.locals.form !== undefined) {
                req.debug("Form Defined. Setting Defaults")
                for (var i = 0; i < res.locals.form.length; i++) {
                    req.debug("Setting: " + res.locals.form[i].name + " To:" + res.locals.form[i].default)
                    if (entity[res.locals.form[i].name] === undefined) entity[res.locals.form[i].name] = res.locals.form[i].default;
                }
            }
            res.locals.entity = entity;
            if (global.app !== undefined && global.app.connection !== undefined && global.app.connection.resolveView !== undefined) {
                global.app.connection.resolveView(req, res, req.vars.environment_name, req.vars.connection_id, res.locals.entity, res.locals.form, function(view, params) {
                    res.render(view, params)
                })
            } else {
                if (req.query.json) return res.send(entity);
                res.render('connection')
            }
        }
    });
});
router.put('/', function(req, res, next) {
    req.debug("Connection PUT /");
    req.db.connection.save(req.vars.environment_name, req.vars.connection_id, req.body, function(err, entity) {
        if (err) {
            return res.send({ success: false, error: err });
        }
        return res.send({ success: true, data: entity })
    })
});
router.post('/validate/', function(req, res, next) {
    if (global.app !== undefined && global.app.connection !== undefined && global.app.connection.validate !== undefined) {
        global.app.connection.validate(req, req.body, function(err) {
            if (err) {
                res.send({ success: false, error: err });
            } else {
                res.send({ success: true });
            }
        })
    } else {
        res.send({ success: true });
    }
})
module.exports = router;