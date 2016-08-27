---
layout: post
title:  "Webpack Series (Part 2): Webpack (AMD) + Karma + Mocha"
description: "Learning Webpack"
date:   2016-05-01 12:30:16
categories: web-development
tags: javascript, webpack
---

Here's the situation:

* You bundle your app/library with `output.libraryTarget = amd` (and for the sake of the example let's say that also `output.library = "myLibrary"`)
* You want to test it using Mocha
* You want to run your tests using Karma

I had a few challengues here and I haven't found any documentation about it so I thought this might be useful to somebody.

You have to use:

* [karma-mocha](https://github.com/karma-runner/karma-mocha) to run your mocha tests with karma. You can also use whatever test framework they support
* [karma-requirejs](https://github.com/karma-runner/karma-requirejs) to load your amd app, this is **key**, we'll see why.

First, the obvious:

```bash
npm i -D karma-mocha karma-requirejs
```

You might need to install other peer dependencies like `requirejs` and `mocha`.

In your `karma.conf.js`:

```javascript
module.exports = function(config) {
    config.set({
    
		// add the installed frameworks here
		frameworks: ["mocha", "requirejs"],
		
		files: [
			//here we include all tests, see the file below
			"src/test/index.js",
			//this is the file that will require our amd bundle, see the file below
			"src/test/runner.js",
		],
		
		preprocessors: [
			// preprocess all your tests with webpack, so you bundle all the necessary dependencies
			"src/test/index.js" : ["webpack"]
		],
		
		// load plugins
		plugins: [
			require("karma-mocha"),
			require("karma-requirejs")
		]
	});
};
```

Karma will load (you can see all this if you run the tests with a browser, in the `debug.html`)

```html
<!-- ... -->
<!-- Dynamically replaced with <script> tags -->
<script type="text/javascript" src="/base/node_modules/requirejs/require.js"></script>
<script type="text/javascript" src="/base/node_modules/karma-requirejs/lib/adapter.js"></script>
<link type="text/css" href="/base/node_modules/mocha/mocha.css" rel="stylesheet">
<script type="text/javascript" src="/base/node_modules/mocha/mocha.js"></script>
<script type="text/javascript" src="/base/node_modules/karma-mocha/lib/adapter.js"></script>
<script type="text/javascript" src="/base/src/test/js/index.js"></script>
<script type="text/javascript" src="/base/src/test/js/runner.js"></script>
<script type="text/javascript">
  window.__karma__.loaded();
</script>
<!-- ... -->
```

1. The karma runner code
2. `requirejs` and `requirejs-adapter`.
3. `mocha` and `mocha-adapter`
4. Your `index.js` bundle (as you defined your `libraryTarget: amd` it will just define your module)
5. And your `runner.js` that will require your `myLibrary` module.
6. The script that starts the tests, enclosed in a script tag.

It's important that you use `karma-requirejs` instead of just `requirejs` from your `bower_components` or `node_modules`, because what you really need is the `requirejs-adapter`, why? 

As the execution of your tests is asynchronous, the call to `window.__karma__.loaded()` would be done **before** executing the tests. The `requirejs-adapter` overrides the `__karma__.loaded` function to do nothing and waits for **your** call to `window.__karma__.start()` (karma's "loaded()" calls "start()").

Hence:

__index.js__

```javascript
// require all modules ending in "_test" from the
// current directory and all subdirectories
var testsContext = require.context(".", true, /_test$/);
testsContext.keys().forEach(testsContext);
```

So the runner needs to load your amd library and tell karma to start running the tests!

__runner.js__

```javascript
require(["myLibrary"], function(myLibrary){
	// probably you don't want to do anything with your library here
	// I didn't...
	
	console.log("Let the tests begin...");
	
	// now that our bundle with the tests are loaded, run the tests!
	window.__karma__.start();
	
});
```

This way, your app + tests are loaded and required, and your tests can be ran by karma.

I figured all these out by using these resources:

* https://karma-runner.github.io/0.13/plus/requirejs.html
* https://github.com/karma-runner/karma-requirejs
* https://github.com/kjbekkelund/karma-requirejs


Hope it helps!
Till the next one.