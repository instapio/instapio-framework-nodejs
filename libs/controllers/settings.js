/*!
 * https://www.instapio.com
 * Copyright(c) 2013-2017 Instapio, Inc
 * MIT Licensed
 */
'use strict';
var express = require('express');
var router = express.Router();
if (global.app.settings !== undefined && global.app.settings.routes != undefined && Array.isArray(global.app.settings.routes)) {
    for (var i = 0; i < global.app.settings.routes.length; i++) {
        var r = global.app.settings.routes[i];
        if (r.method === undefined) r.method = "get";
        if (r.path === undefined) r.path = "/";
        if (r.func === undefined) r.func = function(req, res) {
            req.error("Function not defined for route");
            res.send({ success: false, error: "route function not defined" });
        };
        console.log(r.method + " /settings" + r.path + " Mapped");
        router[r.method](r.path, r.func);
    }
}
router.get('/', function(req, res, next) {
    req.debug("Settings GET /");
    req.debug("Getting Settings From Database");
    req.debug(req.vars);
    req.db.account.load(req.vars.environment_name, req.vars.account_id, function(err, entity) {
        var form = [];
        if (global.app !== undefined && global.app.account !== undefined && global.app.account.form !== undefined) {
            var form = global.app.account.form;
            req.debug("Static Form Defined:" + JSON.stringify(form));
        }
        if (global.app !== undefined && global.app.account !== undefined && global.app.account.getform !== undefined) {
            req.debug("Dynamic Form Defined");
            global.app.account.getform(req, req.vars.environment_name, req.vars.account_id, account, function(err, dynamicForm) {
                if (err) {
                    req.debug("Error Dynamic Form:" + err);
                }

                if (dynamicForm !== undefined && dynamicForm != null) {
                    req.debug("Dynamic Form:" + JSON.stringify(dynamicForm));
                    res.locals.form = dynamicForm;
                    if (entity === undefined) {
                        entity = {}
                        for (var i = 0; i < dynamicForm.length; i++) {
                            entity[dynamicForm[i].name] = dynamicForm[i].default;
                        }
                    }
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
                if (global.app !== undefined && global.app.account !== undefined && global.app.account.resolveView !== undefined) {
                    global.app.account.resolveView(req, res, req.vars.environment_name, req.vars.account_id, res.locals.entity, res.locals.form, function(view, params) {
                        res.render(view, params)
                    })
                } else {
                    if (req.query.json) return res.send(entity);
                    res.render('settings')
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
            if (global.app !== undefined && global.app.account !== undefined && global.app.account.resolveView !== undefined) {
                global.app.account.resolveView(req, res, req.vars.environment_name, req.vars.account_id, res.locals.entity, res.locals.form, function(view, params) {
                    res.render(view, params)
                })
            } else {
                if (req.query.json) return res.send(entity);
                res.render('settings')
            }
        }

    });
});
router.put('/', function(req, res, next) {
    req.debug("Settings PUT /");
    req.debug(req.body);
    req.db.account.save(req.vars.environment_name, req.vars.account_id, req.body, function(err, entity) {
        if (err) {
            return res.send({ success: false, error: err });
        }
        return res.send({ success: true, data: entity })
    })
});
router.post('/validate/', function(req, res, next) {
    if (global.app !== undefined && global.app.account !== undefined && global.app.account.validate !== undefined) {
        global.app.account.validate(req.body, function(err) {
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