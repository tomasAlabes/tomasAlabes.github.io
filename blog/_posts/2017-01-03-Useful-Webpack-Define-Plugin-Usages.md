---
layout: post
title:  "Useful Webpack DefinePlugin Usages"
description: "Useful Webpack DefinePlugin Usages for your project"
date:   2017-01-03 12:30:16
categories: web-development
tags: javascript, webpack
---

## What the plugin does

The [Webpack DefinePlugin](https://webpack.github.io/docs/list-of-plugins.html#defineplugin) allows you to create 
global constants which can be configured at compile time and used in your webpack bundle. 

Example constant definitions:

```javascript
plugins: [
  //...
  new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      VERSION: JSON.stringify("5fa3b9"),
      BROWSER_SUPPORTS_HTML5: true,
      TWO: "1+1",
      "typeof window": JSON.stringify("object"),
      env: {
        DEVELOPMENT: JSON.stringify(false)
      }
  })
  //...
]
```

These are different ways of setting variables.

When Webpack runs the build, it will replace the exact definitions occurrences 
(`PRODUCTION`, `TWO`, `typeof window`) with the correspondent value (`true`, `"1+1"` and `"object"`).

Let's see some real-world use cases and why this might be useful.


## Possible Usages

### Client-Side Logging

Server logging is very common and important in all applications. 
[OWASP](https://www.owasp.org/index.php/Main_Page) has a very good wiki for what should be included and what shouldn't: 
[Logging Cheat Sheet](https://www.owasp.org/index.php/Logging_Cheat_Sheet). But when it comes to client-side logging, 
it's a bit different.

In the case of web apps, logging is something that you might want during development but avoid in production.

Production client-side logging might:

* Expose info that you don't want to expose (everything in the client is already "public", 
logging would it make much easier to get...)
* Affect your application performance
* Trigger an error if trying to be accidentally executed in an old browser without the console object

One way to avoid production logging would be setting an env variable for when our build is for development. 

Assuming you have different webpack configs for the environments, this is a way of writing the `DEVELOPMENT` variable:

_webpack.config.dev.js_

```javascript
plugins: [
    new webpack.DefinePlugin({
        'DEVELOPMENT': JSON.stringify(true)
    })
]
```

You can also check for the node process env variables with something like

```javascript
new webpack.DefinePlugin({
    DEVELOPMENT: JSON.stringify(process.env.NODE_ENV === 'development')
})
```

And then calling webpack like `NODE_ENV=development webpack ...` 
(I use the configs separation approach).


Later in the code you would reference this variables as such:

```javascript
var Logger =  {
    log: function (msg) {
        if(DEVELOPMENT)	console.log(msg);
    }
    // etc
};

Logger.log("Hello!");
```

This way, in development this code would be transformed to:

```javascript
var Logger =  {
    log: function (msg) {
        if(true)	console.log(msg);
    }
};

Logger.log("Hello!");
```

and in production to:

```javascript
var Logger =  {
    log: function (msg) {
        if(false)	console.log(msg);
    }
};

Logger.log("Hello!");
```

> If in production your are using UglifyJS and the `dead_code` optimization, 
> those branches will be removed from the code, because obviously those logs would never be ran.

> If you don't care about your console calls **at all**, you can also use UglifyJS `drop_console` optimization
> where it removes all the calls to the console.

> Using ESLint? You can add the `/* global DEVELOPMENT */` comment to ignore the error, or add the `globals: { DEVELOPMENT: true }` in the `.eslintrc` file.

### Feature Flags

You want a feature to not be seen in production, or even not appear in the bundle (again with the UglifyJS optimization on):

```javascript
plugins: [
    new webpack.DefinePlugin({
        'NICE_FEATURE': JSON.stringify(true),
        'EXPERIMENTAL_FEATURE': JSON.stringify(false)
    })
]
```


### Services URLs

During development you want to hit a Service URL to test your app, and in production you want to use the real thing:

_webpack.config.dev.js_

```javascript
plugins: [
    new webpack.DefinePlugin({
        'SERVICE_URL': JSON.stringify("http://mockservice.com")
    })
]
```

_webpack.config.prod.js_

```javascript
plugins: [
    new webpack.DefinePlugin({
        'SERVICE_URL': JSON.stringify("http://realservice.com")
    })
]
```

The same could apply with users or tokens or whatever you use for communicate with services in dev/prod.


## EnvironmentPlugin

This plugin will allow you to reference environment variables through `process.env`

```javascript
new webpack.EnvironmentPlugin([
  "NODE_ENV"
])
```

In your code:

```javascript
var env = process.env.NODE_ENV;
```

It's a shortcut that allows you to refer to node environment variables using the DefinePlugin internally.
It would be the same than doing:

```javascript
plugins: [
    new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }
    })
]
```


Do you have more uses of this plugin? I would love to here them in the comments!
See ya