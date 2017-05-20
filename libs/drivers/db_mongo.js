/*!
 * https://www.instapio.com
 * Copyright(c) 2013-2017 Instapio, Inc
 * MIT Licensed
 */
console.log("Loading Mongo");
var MongoClient = require('mongodb').MongoClient;

var gcloud = require('google-cloud');
var datastore = gcloud.datastore();
var database = {
    load: function(req, env_name, kind, entity_id, cb) {
        MongoClient.connect(global.config.DATABASE_URL, function(err, db) {
            if (err) return cb(err);
            db.collection(env_name + kind, function(err, collection) {
                if (err) return cb(err);
                collection.findOne({ "_id": entity_id }, function(err, item) {
                    if (item === undefined) return cb(null);
                    if (item === null) return cb(null)
                    return cb(err, item)
                });
            });

        });
    },
    save: function(req, env_name, kind, entity_id, entity, cb) {
        MongoClient.connect(global.config.DATABASE_URL, function(err, db) {
            if (err) return cb(err);
            db.collection(env_name + kind, function(err, collection) {
                if (err) return cb(err);
                collection.findOneAndUpdate({ "_id": entity_id }, { '$set': entity }, { upsert: true, safe: false }, function(err, item) {
                    if (err) return cb(err);
                    return cb(err, item)
                });
            });

        });
    },
    list: function(req, env_name, kind, params, cb) {

        req.debug("params");
        req.debug(params);
        var find_query = {};
        for (var i = 0; i < params.length; i++) {
            var property = params[i].property;
            var operator = params[i].operator;
            var value = params[i].value;
            if (operator === undefined) operator = "="
            if (operator == "=") find_query[property] = value;
            if (operator == ">") find_query[property]['$gt'] = value;
            if (operator == "<") find_query[property]['$lt'] = value;
            if (operator == ">=") find_query[property]['$gte'] = value;
            if (operator == "<=") find_query[property]['$lte'] = value;
            if (operator == "!=") find_query[property]['$ne'] = value;

        }
        req.debug("Query");
        req.debug(find_query);
        MongoClient.connect(global.config.DATABASE_URL, function(err, db) {
            if (err) return cb(err);
            db.collection(env_name + kind, function(err, collection) {
                if (err) return cb(err);
                collection.find(find_query).toArray(function(err, entities) {
                    req.debug("Entities:");
                    req.debug(entities);
                    return cb(null, entities);
                })

            });

        });
    }
}
module.exports = database;