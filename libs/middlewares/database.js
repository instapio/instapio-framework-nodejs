/*!
 * https://www.instapio.com
 * Copyright(c) 2013-2017 Instapio, Inc
 * MIT Licensed
 */
module.exports = function(req, res, next) {
    var database = {};
    console.log("Database");
    console.log(JSON.stringify(global.app));
    if (global.config.DATABASE_DRIVER == "mongo") {
        database = require('../drivers/db_mongo');
    } else {
        database = require('../drivers/db_datastore');
    }
    req.db = {
        account: {},
        connection: {}
    }
    req.db.connection.load = function(env_name, connection_id, cb) {
        req.debug("Loading Connection:" + env_name + ":" + connection_id);
        req.db.load(env_name, "connection", connection_id, cb)
    }
    req.db.connection.save = function(env_name, connection_id, entity, cb) {
        req.debug("Saving Connection:" + env_name + ":" + connection_id + ":" + JSON.stringify(entity));
        req.db.save(env_name, "connection", connection_id, entity, cb)
    }
    req.db.connection.list = function(env_name, cb) {
        req.debug("Listing Connection:" + env_name);
        req.db.list(env_name, "connection", cb)
    }
    req.db.account.load = function(env_name, account_id, cb) {
        req.debug("Loading Setting:" + env_name + ":" + account_id);
        req.db.load(env_name, "account", account_id, cb)
    }
    req.db.account.save = function(env_name, account_id, entity, cb) {
        req.debug("Saving Setting:" + env_name + ":" + account_id + ":" + JSON.stringify(entity));
        req.db.save(env_name, "account", account_id, entity, cb)
    }
    req.db.account.list = function(env_name, cb) {
        req.debug("Listing Setting:" + env_name);
        req.db.list(env_name, "account", cb)
    }
    req.db.load = function(env_name, kind, entity_id, cb) {
        var pre = function(req, env_name, kind, entity_id, cb) {
            cb();
        };
        var post = function(req, env_name, kind, entity_id, entity, cb) {
            cb();
        };
        if (global.app !== undefined && global.app.preload !== undefined) {
            req.debug("Global preload");
            pre = global.app.preload;
        }
        if (global.app !== undefined && global.app.postload !== undefined) {
            req.debug("Global postload");
            post = global.app.postload;
        }

        if (global.app !== undefined && global.app[kind] !== undefined && global.app[kind].preload !== undefined) {
            req.debug(kind + " preload");
            pre = global.app[kind].preload;
        }
        if (global.app !== undefined && global.app[kind] !== undefined && global.app[kind].postload !== undefined) {
            req.debug(kind + " postload");
            post = global.app[kind].postload;
        }
        pre(req, env_name, kind, entity_id, function(err) {
            if (err !== undefined && err !== null) {
                req.debug("pre error:" + err);
                return cb(err);
            }
            database.load(req, env_name, kind, entity_id, function(err, entity) {
                if (err !== undefined && err !== null) {
                    req.debug("error load:" + err);
                    return cb(err);
                }
                post(req, env_name, kind, entity_id, entity, function(err, modifiedEntity) {
                    if (err !== undefined && err !== null) {
                        req.debug("post error:" + err);
                        return cb(err);
                    }
                    if (modifiedEntity !== undefined) {
                        req.debug("entity modified:" + JSON.stringify(modifiedEntity));
                        if (global.config.CACHE_ENTITIES === "true") {
                            req.debug("Caching Entity");
                            req.cache.set("entity-" + env_name + "-" + kind + "-" + entity_id, modifiedEntity, 0, function() {
                                return cb(null, modifiedEntity);
                            })
                        } else {
                            return cb(null, modifiedEntity);
                        }
                    }
                    req.debug("entity:" + JSON.stringify(entity));
                    if (global.config.CACHE_ENTITIES === "true") {
                        req.debug("Caching Entity");
                        req.cache.set("entity-" + env_name + "-" + kind + "-" + entity_id, modifiedEntity, 0, function() {
                            return cb(null, entity);
                        })
                    } else {
                        return cb(null, entity);
                    }

                });
            })
        });
    }
    req.db.save = function(env_name, kind, entity_id, entity, cb) {
        if (global.config.CACHE_ENTITIES === "true") {
            req.debug("Removing Entity From Cache");
            req.cache.del("entity-" + env_name + "-" + kind + "-" + entity_id);
        }

        var savingEntity = entity;
        var pre = function(req, env_name, kind, entity_id, entity, cb) {
            cb();
        };
        var post = function(req, env_name, kind, entity_id, entity, cb) {
            cb();
        };
        if (global.app !== undefined && global.app.presave !== undefined) {
            req.debug("Global presave");
            pre = global.app.presave;
        }
        if (global.app !== undefined && global.app.postsave !== undefined) {
            req.debug("Global postsave");
            post = global.app.postsave;
        }
        if (global.app !== undefined && global.app[kind] !== undefined && global.app[kind].presave !== undefined) {
            req.debug(kind + " presave");
            pre = global.app[kind].presave;
        }
        if (global.app !== undefined && global.app[kind] !== undefined && global.app[kind].postsave !== undefined) {
            req.debug(kind + " postsave");
            post = global.app[kind].postsave;
        }
        pre(req, env_name, kind, entity_id, savingEntity, function(err, modifiedEntity) {


            if (err !== undefined && err !== null) {
                req.debug("pre error:" + err);
                return cb(err);
            }
            if (modifiedEntity != undefined && modifiedEntity != null) {
                req.debug("entity modified:" + JSON.stringify(modifiedEntity));
                savingEntity = modifiedEntity;
            }
            savingEntity.app_id = global.config.INSTAPIO_CLIENT_ID;
            savingEntity.env_name = env_name;
            savingEntity.kind = kind;
            savingEntity.id = entity_id;
            database.save(req, env_name, kind, entity_id, savingEntity, function(err) {
                if (err !== undefined && err !== null) {
                    req.debug("error save:" + err);
                    return cb(err);
                }
                post(req, env_name, kind, entity_id, savingEntity, function(err) {
                    if (err !== undefined && err !== null) {
                        req.debug("post error:" + err);
                        return cb(err);
                    }
                    req.debug("entity:" + JSON.stringify(savingEntity));
                    return cb(null, savingEntity);
                });
            })
        });
    }
    req.db.list = function(env_name, kind, params, cb) {
        var c_env = env_name;
        var c_kind = kind;
        var c_params = params;
        var c_cb = cb;
        if (cb === undefined && params === undefined) {
            c_cb = kind;
            c_kind = env_name;
            c_env = undefined;
            c_params = []
        } else if (cb === undefined) {
            if (Array.isArray(kind)) {
                c_kind = env_name;
                c_params = kind;
                c_cb = params;
                c_env = undefined;
            } else {
                c_params = [];
                c_env = env_name;
                c_kind = kind;
                c_cb = params;
            }
        }

        var pre = function(req, c_env, c_kind, cb) {
            cb();
        };
        var post = function(req, c_env, c_kind, entities, cb) {
            cb();
        };
        if (global.app !== undefined && global.app.prelist !== undefined) {
            req.debug("Global prelist");
            pre = global.app.prelist;
        }
        if (global.app !== undefined && global.app.postlist !== undefined) {
            req.debug("Global postlist");
            post = global.app.postlist;
        }
        if (global.app !== undefined && global.app[c_kind] !== undefined && global.app[c_kind].prelist !== undefined) {
            req.debug(c_kind + " prelist");
            pre = global.app[c_kind].prelist;
        }
        if (global.app !== undefined && global.app[c_kind] !== undefined && global.app[c_kind].postlist !== undefined) {
            req.debug(c_kind + " postlist");
            post = global.app[c_kind].postlist;
        }
        pre(req, env_name, c_kind, function(err) {
            if (err !== undefined && err !== null) {
                req.debug("pre error:" + err);
                return c_cb(err);
            }

            database.list(req, env_name, c_kind, c_params, function(err, entities) {
                if (err !== undefined && err !== null) {
                    req.debug("error query:" + err);
                    return c_cb(err);
                }
                post(req, c_env, c_kind, entities, function(err, newList) {
                    if (err !== undefined && err !== null) {
                        req.debug("post error:" + err);
                        return c_cb(err);
                    }
                    if (newList !== undefined && newList != null) {
                        req.debug("list modified:" + JSON.stringify(newList));
                        return c_cb(null, newList);
                    }
                    req.debug("list:" + JSON.stringify(entities));
                    return c_cb(null, entities);
                });
            })
        });
    }
    next();
};