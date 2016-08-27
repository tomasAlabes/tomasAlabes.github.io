---
layout: post
title:  "Using NodeJS oAuth module to communicate with Twitter REST API 1.1"
description:  "Using NodeJS oAuth module to communicate with Twitter REST API 1.1"
date:   2013-02-06 12:30:16
categories: web-development
tags: javascript, twitter API, tutorial
---

Hi, lets see how to use the 'oauth' module in nodeJS, for getting information from the Twitter API.

You should start by installing the module:

```bash
$ npm install oauth
```

And add it to the package.json of your app:

```javascript
"dependencies": {
    "express": "3.1.0",
    "ejs": "*",
    "oauth": "*"
  }
```

Then, in the file where you will add the twitter retrieval logic, import the module:

```javascript
var util = require('util');
var OAuth = require('oauth').OAuth;
```

Once you created your app and got your data in https://dev.twitter.com/:

```javascript
var oa = new OAuth("https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    "YOUR_CONSUMER_KEY",
    "YOUR_CONSUMER_SECRET",
    "1.0A",
    null,
    "HMAC-SHA1");

var access_token = 'YOUR_ACCESS_TOKEN';
var access_token_secret = 'YOUR_ACCESS_TOKEN_SECRET'
```

Then I will give you a couple of examples of how to get stuff from Twitter:

```javascript
exports.getLatestTweets = function (tweeter, count, callback) {
    oa.get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=" + tweeter + "&count=" + count, access_token, access_token_secret, function (error, data) {
        var result;
        if(error){
            result = {error: error};
        }else{
            result = data;
        }

        callback(result);
    });
};

exports.getLatestProfilePicture = function (tweeter, callback) {
    oa.get("http://api.twitter.com/1.1/users/show.json?screen_name=" + tweeter, access_token, access_token_secret, function (error, data) {
        var result;
        if(error){
            result = {error: error};
        }else{
            result = JSON.parse(data);
        }

        callback(result);
    });
};
```

To use it, import it from other js

```javascript
var twitterUtil = require('path/to/twitterUtil');
```

Now go get Twitter data and use it for good!!

Enjoy!