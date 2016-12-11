---
layout: post
title:  "Webpack and the Public Path Config"
description: "Consuming Webpack Dynamic Resources"
date:   2016-12-11 12:30:16
categories: web-development
tags: javascript, webpack
---

# Webpack and the Public Path Config

You have your app bundled with webpack and some resources (like images) that are outside that bundle, and your app can be used 
in your domain or consumed by someone else in his site.

This post is meant to explain how to manage the url to the resources that are not part of your webpack bundle, so that
it works in your site and in your consumers' sites.

## The Case

You might have a webpack configuration that uses the `url-loader` to manage images, possibly with a limit, so that 
images smaller than X kbs are inlined into the bundle and the rest are requested by webpack dynamically when necessary.

This configuration would be something like this:

```javascript
// webpack.config.js
module.exports = {
  entry: './main.js',
    output: {
      path: './build', // This is where images AND js will go
      publicPath: 'http://mysite.com/', // This is used to generate URLs to e.g. images
      filename: 'bundle.js',
      library: 'myApp',
      libraryTarget: 'umd' //loaded via commonjs, amd or globally
  },
  module: {
    loaders: [
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }, // inline base64 URLs for <=8k images, direct URLs for the rest
      { test: /\.css$/, loader: 'style-loader!css-loader' }, // loader for css, imgs will be loaded
      { test: /\.html$/, loader: 'html-loader' } // loader for html, imgs src attrs will be loaded
    ]
  }
};
```

And the output of your app would be like:

```
- ./build/bundle.js
- ./build/myBigImg.jpg
- ./build/myBigImg2.png
```

All the images smaller than 8kb are bundled as base64 strings in `bundle.js`, the rest are requested to `output.publicPath` + image.

If you see the Network Tab when your bundle is loaded, you might see the requests to:

* `http://mysite.com/myBigImg.jpg`
* `http://mysite.com/myBigImg2.png`

And that's cool! Webpack managed this for us. But...

`http://myfriendsite.com` wants to use my app too, and when he loads my bundle, a request to `http://mysite.com/myBigImg.jpg` 
is done! And although it a completely valid request, if I were him, I wouldn't want to rely on `mysite.com` to have the component working.
I would want the images to be requested to my server.

How do I change the `publicPath` property to point to `http://myfriendsite.com`? 

Here's where the `__webpack_publicPath__` property comes in, and the good willing of the app author to open the door 
to customizing the `publicPath` (or you can always fork it and add it yourself ;) ) 

This means that the author of the app should have a function to receive the new `publicPath` as part of its **entry**:

```javascript
// This is the app entry "main.js". I'm using a CommonJS syntax but you can use what you want 
module.exports = {
  load: function(publicPath){
    if(publicPath) __webpack_publicPath__ = publicPath;
    // else the one in the webpack.config.js will be used.
    
    // continue loading the app
  }
}
```

**It is important that this option is part of the app entry, not any file inside the app.** 

Like this, the other site can use it like:

```javascript
var app = require('myApp'); // output.library config in webpack.config.js
app.load('http://myfriendsite.com/'); // this can be absolute or relative
// do whatever you want with the app
```

When loaded, you will see the network requests as:

* `http://myfriendsite.com/myBigImg.jpg`
* `http://myfriendsite.com/myBigImg2.png`

Nice.

Hope it helps, if you know a better or cleaner way please share it in a comment!

Bye!