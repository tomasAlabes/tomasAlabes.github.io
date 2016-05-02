---
layout: post
title:  "Webpack Series (Part 1): Some Configs Explained"
description: "Experiences with Webpack"
date:   2016-04-30 12:30:16
categories: web-development
tags: javascript, webpack
---

#Webpack Series (Part 1): Some Configs Explained

I've been migrating a big project that used requirejs optimizer to bundle all the javascript modules to Webpack. As everybody knows Webpack's documentation is not the best but the community has helped writing about their experiences and doing tutorials about it.

To do my part I would like to write a series sharing my experiences during my migration.

I'll start with Webpack's [configuration](https://webpack.github.io/docs/configuration.html), trying to explain some properties and give more info of what's not in the official docs, with some examples.

##module.noParse
This property can be either a RegEx or an array of RegExs. All matching files will not be parsed by webpack.

{% highlight javascript %}
module.exports = {
	//...	
	module: {
		noParse: [ /^dontParseThis$/ ]
	}
	//...
}
{% endhighlight %}

This means that webpack, when requiring them, will bundle them `as is`, without doing anything to them. This means that:

1. These files can only have require calls to dependencies marked as external or any dependency that isn't in any webpack chunk. Because that dependency will be "encapsulated" by webpack inside the bundle and won't be accesible through regular `require` calls.
2. You can skip big files that are already optimized, increasing the speed of the build.
3. Although they are not parsed by webpack, they will be part of your bundle.

##output.libraryTarget
You developed your `magicLibrary` in a very modular fashion using all the power of webpack. But have you thought how your users are going to consume it? Here's where `libraryTarget` config comes in.

_First a quick note, to give your library a name (you should), set the `output.library` config to it._

For the distribution type you have several options:


#### var (default)

When your library is loaded, the **return value of your entry point** will be assigned to a variable:

{% highlight javascript %}
var magicLibrary = _entry_return_;
// your users will use your library like:
magicLibrary.doTheTrick();
{% endhighlight %}
_(Not specifying a `output.library` will cancel this `var` configuration)_


#### this

When your library is loaded, the **return value of your entry point** will be assigned to `this`, the meaning of `this` is up to you:

{% highlight javascript %}
this["magicLibrary"] = _entry_return_;
// your users will use your library like:
this.magicLibrary.doTheTrick();
magicLibrary.doTheTrick(); //if this is window
{% endhighlight %}
`this` will depend mostly on how you are injecting the bundle.


#### commonjs

When your library is loaded, the **return value of your entry point** will be part of the `exports` object. As the name implies, this is used in commonjs environments.

{% highlight javascript %}
exports["magicLibrary"] = _entry_return_;
//your users will use your library like:
require("magicLibrary").doTheTrick();

{% endhighlight %}


#### commonjs2

When your library is loaded, the **return value of your entry point** will be part of the `exports` object. As the name implies, this is used in commonjs environments.

{% highlight javascript %}
module.exports = _entry_return_;
//your users will use your library like:
require("magicLibrary").doTheTrick();

{% endhighlight %}
_Wondering the difference between commonjs and commonjs2? Check [this](https://github.com/webpack/webpack/issues/1114) out. (They are pretty much the same)_


#### amd _(Asynchronous Module Definition)_

In this case webpack will surround you library with an AMD.

But there is a **very important pre-requisite, your entry chunk must be defined with the `define` property**, if not, webpack wil create the AMD module, but without dependencies. I learned this the hard way, it's logical but not obvious I think. Anyway... the output will be something like this:


{% highlight javascript %}
define([], function() {
	//what this module returns is what your entry chunk returns
});
{% endhighlight %}

But if you download this script, first you may get a `error: define is not defined`, it's ok! if you are distributing your library as with amd, then your users need to use require to load it.
But, `require([_what_])`? 

`output.library`!

{% highlight javascript %}
output: {
	name: "magicLibrary",
	libraryTarget: "amd"
}
{% endhighlight %}

And the module will be:

{% highlight javascript %}
define("magicLibrary", [], function() {
	//what this module returns is what your entry chunk returns
});

// And then your users will be able to do:
require(["magicLibrary"], function(magic){
	magic.doTheTrick();
});
{% endhighlight %}


#### umd _(Universal Module Definition)_

This is a way for your library to work with all module definitions (and where aren't modules at all). It will work with commonjs, amd and as global variable.

Here to name your module you need the another property:

{% highlight javascript %}
output: {
	name: "magicLibrary",
	libraryTarget: "umd",
	umdNamedDefine: true
}
{% endhighlight %}
And finally the output is:

{% highlight javascript %}
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("magicLibrary", [], factory);
	else if(typeof exports === 'object')
		exports["magicLibrary"] = factory();
	else
		root["magicLibrary"] = factory();
})(this, function() {
	//what this module returns is what your entry chunk returns
});
{% endhighlight %}
Module proof library.

##externals
Externals can be tricky, specially with all the ways you have for defining them and the combination with the `output.libraryTarget` configuration.
These dependencies won't be resolved by webpack, but should become dependencies of the resulting bundle. The kind of the dependency depends on `output.libraryTarget`.

I'll paste the official documentation that I think is complete and add comments.

{% highlight javascript %}
externals: [
    {
        a: false, // a is not external
        b: true, // b is external (require("b"))
        "./c": "c", // "./c" is external (require("c"))
        "./d": "var d" // "./d" is external (d)
    },
    // Every non-relative module is external
    // abc -> require("abc")
    /^[a-z\-0-9]+$/,
    function(context, request, callback) {
        // Every module prefixed with "global-" becomes external
        // "global-abc" -> abc
        if(/^global-/.test(request))
            return callback(null, "var " + request.substr(7));
        callback();
    },
    "./e" // "./e" is external (require("./e"))
]
{% endhighlight %}

<table>
<thead>
<tr>
<th>type</th>
<th>value</th>
<th>resulting import code</th>
</tr>
</thead>
<tbody>
<tr>
<td>“var”</td>
<td>"abc"</td>
<td>module.exports = abc;</td>
</tr>
<tr>
<td>“var”</td>
<td>"abc.def"</td>
<td>module.exports = abc.def;</td>
</tr>
<tr>
<td>“this”</td>
<td>"abc"</td>
<td>(function() { module.exports = this["abc"]; }());</td>
</tr>
<tr>
<td>“this”</td>
<td>["abc", "def"]</td>
<td>(function() { module.exports = this["abc"]["def"]; }());</td>
</tr>
<tr>
<td>“commonjs”</td>
<td>"abc"</td>
<td>module.exports = require("abc");</td>
</tr>
<tr>
<td>“commonjs”</td>
<td>["abc", "def"]</td>
<td>module.exports = require("abc").def;</td>
</tr>
<tr>
<td>“amd”</td>
<td>"abc"</td>
<td>define(["abc"], function(X) { module.exports = X; })</td>
</tr>
<tr>
<td>“umd”</td>
<td>"abc"</td>
<td>everything above</td>
</tr>
</tbody>
</table>

All the ways to set an external dep are easy to understand with the official doc.

The only thing I'd recommend is to not mix your `libraryTarget` and the type of the `externals`. Like:

{% highlight javascript %}
output:{
	libraryTarget: "amd"
},
externals = [
	{
		"./extLibrary": "var extLibrary"
	}
}
{% endhighlight %}

This would be **invalid**, as `extLibrary` wouldn't exist as a variable in the final bundle, as the bundle is defined as amd.

Webpack will give more importance to your `libraryTarget` than to your external type, "correcting" them. But I wouldn't relay on it that much. Keep it consistent!

Some official warnings before ending with this configuartion:

> Enforcing amd or umd in a external value will break if not compiling as amd/umd target.
> 
> Note: If using umd you can specify an object as external value with property commonjs, commonjs2, amd and root to set different values for each import kind.


Hope it helped, give me feedback if I'm missing something or if I'm wrong in something!