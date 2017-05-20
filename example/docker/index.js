/*!
 * https://www.instapio.com
 * Copyright(c) 2013-2017 Instapio, Inc
 * MIT Licensed
 */
var path = require('path');
var fs = require('fs');
var app = { connection: {}, account: {} };
app.config = {
    "INSTAPIO_APPLICATION_NAME": "ExampleApp",
    "INSTAPIO_CLIENT_ID": "exampleapp",
    "INSTAPIO_CLIENT_SECRET": "exampleappsecret",
    "INSTAPIO_PUSH_SECRET": "exampleappsecretpush",
    "INSTAPIO_PROJECT_ID": "instapio-apps-example",
    "DATABASE_DRIVER": "datastore",
    "DATABASE_URL": "mongodb://127.0.0.1:27017/app",
    "CACHE_DRIVER": "local",
    "CACHE_URL": "redis://127.0.0.1:6379",
    "LOGGER": "console",
    "FRAMEWORK": "bootstrap" // framework can be "bootstrap" for bootstrap layout, "angular" from angularjs/material-design or "custom" where built in view templating will be ignored

}
if (fs.existsSync(require('path').join(__dirname, 'views'))) app.views = require('path').join(__dirname, 'views');
if (fs.existsSync(require('path').join(__dirname, 'assets'))) app.assets = require('path').join(__dirname, 'assets');
// OAUTH Section

// Base Configuration to enable oauth

/*
app.config.OAUTH="facebook"; //name can be anything.
app.config.OAUTH_AUTHORIZATION_URL="https://www.facebook.com/dialog/oauth";
app.config.OAUTH_TOKEN_URL="https://graph.facebook.com/oauth/access_token";
app.config.OAUTH_CLIENT_ID="XXXXXXXXXXX";
app.config.OAUTH_CLIENT_SECRET="XXXXXXXXXXX";
app.config.OAUTH_CALLBACK_URL="https://parhamdb.ngrok.io/oauth/callback"; // Only replace domain part. /oauth/callback is built in.
*/

// Configure Required Scopes for OAuth
/*
app.oauth_scopes=['pages_show_list','email','manage_pages','publish_pages','public_profile','read_page_mailboxes','user_about_me','user_friends'];
*/

// Optional Account Callback after authentication. by default below code will run which will save access_token to device. If you need anything else, uncomment below and modify
/*
app.oauth_callback=function(req,jwt_data,access_token,refresh_token,profile,cb){
    req.db.account.load(req.vars.environment_name,req.vars.account_id,function(err,account){
        if(account===undefined || account==null) account={};
        account.access_token=access_token;
        account.refresh_token=refresh_token;
        account.profile=profile;
        req.db.account.save(req.vars.environment_name,req.vars.account_id,account,function(err){
            cb(null,account);
        })
    });
}
*/

// Optional token Verification. By default when OAuth is enabled we just check presence of access_token field in account object. example below verifies against facebook to make sure token is still good.
/*
app.oauth_verify=function(req,account,cb){
    req.debug("Verifying Account");
    if(account===undefined || account==null || account.access_token===undefined) return cb("Not Set");
    var url="https://graph.facebook.com/me?access_token="+ account.access_token;
    req.debug("Verifying with Url:"+ url);
    req.httpservice({method:"get",url:url,json:true},function(err,result){
        if(err) return cb(err);
        req.debug(result);
        if(result.error!==undefined){
            req.debug("Verification failed");
            return cb(result.error);
        }
        req.debug("Verified");
        cb();
    })
}
*/

//Processing Raw Push. This has priority over processPush
/*
app.processPushRaw=function(req,push,cb){
    req.debug("Processing Raw");
    req.debug(push);
    req.debug("Done Processing Raw");
    cb();
}
*/

// Process Push, one will be fired for each connection
/*
app.processPush=function(req,env,connection,event,context,cb){
    req.debug("Processing Push");
    req.debug(env);
    req.debug(connection);
    req.debug(event);
    req.debug(context);
    req.debug("Done Processing");
    cb();
}
*/

// Static Form Generation for accounts
/*
app.account.form=[
    {
        name:"twilio_sid",
        title:"Twilio SID",
        default:"",
        field_type:"text"
    },
    {
        name:"twilio_password",
        title:"Twilio Password",
        default:"option1",
        field_type:"options",
        options:[
            {name:"Option 1",value:"option1"},
            {name:"Option 2",value:"option2"},
            {name:"Option 3",value:"option3"}
        ]
    }
];
*/

// Dynamic Form Generation
/*
app.account.getform=function(environment_name,account_id,account,cb){

}
*/

//provide additional routes to "connection","settings","dashboard", or "external". You can even override default "/" for all these routes
// example below will add "/connection/test" route.
/*
app.connection.routes=[
    {
        method:"get",
        path:"/test",
        func:function(req,res){
            console.log("TEST");
            res.send({test:true});
        }
    }
];
*/

/*
app.preload(env_name,kind,entity_id,cb){
    cb();
}
*/

/*
app.postload(env_name,kind,entity_id,entity,cb){
    cb();
}
*/

/*
app.presave(env_name,kind,entity_id,entity,cb){
    cb();
}
*/

/*
app.postsave(env_name,kind,entity_id,entity,cb){
    cb();
}
*/

/*
app.prelist(env_name,kind,cb){
    cb();
}
*/

/*
app.postlist(env_name,kind,entities,cb){
    cb();
}
*/

/*
app.connection.preload(env_name,kind,entity_id,cb){
    cb();
}
*/

/*
app.connection.postload(env_name,kind,entity_id,entity,cb){
    cb();
}
*/

/*
app.connection.presave(env_name,kind,entity_id,entity,cb){
    cb();
}
*/

/*
app.connection.postsave(env_name,kind,entity_id,entity,cb){
    cb();
}
*/

/*
app.connection.prelist(env_name,kind,cb){
    cb();
}
*/

/*
app.connection.postlist(env_name,kind,entities,cb){
    cb();
}
*/

/*
app.account.preload(env_name,kind,entity_id,cb){
    cb();
}
*/

/*
app.account.postload(env_name,kind,entity_id,entity,cb){
    cb();
}
*/

/*
app.account.presave(env_name,kind,entity_id,entity,cb){
    cb();
}
*/

/*
app.account.postsave(env_name,kind,entity_id,entity,cb){
    cb();
}
*/

/*
app.account.prelist(env_name,kind,cb){
    cb();
}
*/

/*
app.account.postlist(env_name,kind,entities,cb){
    cb();
}
*/

// Uncomment below if you need to process anything periodically. call cb when you are done.
/*
app.cron=function(ctx,cb){
    ctx.debug("Running Cronjob");
    // callback empty if everything is ok
    return cb();
    // if there is an error return it
    cb("error");
}
*/


// Uncomment below to validate data as entered by user
/*
app.account.validate(account,cb){
    //Check account data
    //send errors like below:
    //cb("invalid account")
    // if data is valid, just call cb();
    cb()
}
*/

// Uncomment below to validate data as entered by user
/*
app.connection.validate(connection,cb){
    //Check account data
    //send errors like below:
    //cb("invalid connection")
    // if data is valid, just call cb();
    cb()
}
*/
//uncomment this line if you copy this to your root.
var framework = false;
var found_module = false;
try {
    framework = require('@instapio/instapio-apps-framework');
    found_module = true;
} catch (e) {}
if (!found_module) {
    try {
        framework = require('../../');
        found_module = true;
    } catch (e) {

    }
}
if (found_module) {
    framework(app, function(err) {
        if (err) {
            console.log("Bootstrap Failed:" + err);
        }
        console.log("Application bootstrapped");
    })
} else {
    console.log("Framework Not Found");
}