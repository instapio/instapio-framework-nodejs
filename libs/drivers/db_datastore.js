/*!
 * https://www.instapio.com
 * Copyright(c) 2013-2017 Instapio, Inc
 * MIT Licensed
 */
console.log("Loading Datastore");
var gcloud = require('google-cloud');
var datastore = gcloud.datastore();
var database = {
    load: function(req, env_name, kind, entity_id, cb) {
        var key = datastore.key(['AppId', global.config.INSTAPIO_CLIENT_ID, 'Environment', env_name, kind, entity_id]);
        req.debug("key:" + JSON.stringify(key));
        datastore.get(key, function(err, entity) {
            return cb(err, entity);
        });
    },
    save: function(req, env_name, kind, entity_id, entity, cb) {
        var key = datastore.key(['AppId', global.config.INSTAPIO_CLIENT_ID, 'Environment', env_name, kind, entity_id]);
        req.debug("key:" + JSON.stringify(key));
        datastore.save({ key: key, data: entity }, function(err) {
            return cb(err);
        });
    },
    list: function(req, env_name, kind, params, cb) {
        var query = datastore.createQuery(kind);
        if (c_env) {
            query = query.hasAncestor(datastore.key(['AppId', global.config.INSTAPIO_CLIENT_ID, 'Environment', env_name]));
        } else {
            query = query.hasAncestor(datastore.key(['AppId', global.config.INSTAPIO_CLIENT_ID]));
        }
        req.debug("params");
        req.debug(params);
        if (params !== undefined && Array.isArray(params)) {
            for (var i = 0; i < params.length; i++) {
                req.debug("Filtering:" + JSON.stringify(params[i]))
                var property = params[i].property;
                var operator = params[i].operator;
                var value = params[i].value;
                if (operator === undefined) operator = "=";
                query = query.filter(property, operator, value);
            }
        }
        req.debug("query:" + JSON.stringify(query));
        datastore.runQuery(query, function(err, entities) {
            return (err, entities);
        });
    }
}
module.exports = database;