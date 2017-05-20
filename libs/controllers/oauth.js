/*!
 * https://www.instapio.com
 * Copyright(c) 2013-2017 Instapio, Inc
 * MIT Licensed
 */
'use strict';
var express = require('express');
var router = express.Router();
var passport = require('passport'),
    OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

passport.use(global.config.OAUTH, new OAuth2Strategy({
        authorizationURL: global.config.OAUTH_AUTHORIZATION_URL,
        tokenURL: global.config.OAUTH_TOKEN_URL,
        clientID: global.config.OAUTH_CLIENT_ID,
        clientSecret: global.config.OAUTH_CLIENT_SECRET,
        callbackURL: global.config.OAUTH_CALLBACK_URL,
        passReqToCallback: true
    },
    function(req, accessToken, refreshToken, params, profile, done) {
        req.debug("Authenticated:");
        req.debug(accessToken);
        req.debug(refreshToken);
        req.debug(profile);
        req.debug(req.vars);
        req.debug("AuthBody");
        req.debug(params);
        if (global.app.oauth_callback !== undefined) {
            req.debug("Sending to App Callback");
            global.app.oauth_callback(req, req.vars, accessToken, refreshToken, params, profile, done);
        } else {
            req.db.account.load(req.vars.environment_name, req.vars.account_id, function(err, account) {
                if (account === undefined || account == null) account = {};
                account.access_token = accessToken;
                account.refresh_token = refreshToken;
                account.profile = profile;
                account.auth_params = params;
                req.db.account.save(req.vars.environment_name, req.vars.account_id, account, function(err) {
                    done(null, account);
                })
            });
        }
    }
));
router.use(passport.initialize());
router.get('/',
    function(req, res, next) {
        var scope = [];
        if (global.app.oauth_scopes !== undefined) scope = global.app.oauth_scopes;
        passport.authenticate(
            global.config.OAUTH, {
                session: false,
                state: req.query.jwt,
                scope: scope
            }
        )(req, res, next)
    }
);

router.get('/callback',
    function(req, res, next) {
        req.debug("Received Callback");
        req.debug(req.query);
        passport.authenticate(global.config.OAUTH, { session: false, successRedirect: '/oauth/authenticated?jwt=' + req.query.state, failureRedirect: '/oauth/failed?jwt=' + req.query.state })(req, res, next)
    }


);

router.get('/authenticated', function(req, res) {
    res.render('oauth_success');
});

router.get('/failed', function(req, res) {
    res.render('oauth_fail');
});

module.exports = router;