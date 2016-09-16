---
layout: post
title:  "Webpack and CSS"
description: "Working with Style"
date:   2016-09-13 12:30:16
categories: web-development
tags: javascript, webpack, css, loaders
---

As you know, Webpack use Loaders to manage different type of web resources, like css. Being css files so important for web applications, there are more than one way of handling this. There are different loaders and different combination of loaders that will help you have the right behavior for you app.

We will take a look at these loaders:

1. css-loader
2. style-loader
3. style/usable-loader
4. css-modules

And then I will mention some other tools that can help with css development.

## [css-loader](https://github.com/webpack/css-loader)
This is the plain css loader. **It will return the css code interpreting the resources inside, but it will not add it to the page.**

With this loader `@import` and `url(...)` are interpreted like `require()` and will be resolved.
Good loaders for requiring your assets are the [file-loader](https://github.com/webpack/file-loader)
and the [url-loader](https://github.com/webpack/url-loader) which you should specify in your config.

Then what you do with that css code it's up to you. The next loader will help you with it.

## [style-loader](https://github.com/webpack/style-loader)
This loader adds CSS to the DOM by injecting a `<style>` or `<link>` tag.

### `<style>`

To inject a `<style>` you need to get the content of the css file, and then inject that. 

``` javascript
require("style!raw!./file.css");
// => add rules in file.css to document
```

But it's recommended to combine it with the [`css-loader`](https://github.com/webpack/css-loader), as it will interpret all the resources
in your css file, instead of just having the raw css. 

``` javascript
require("style!css!./file.css");
// => add rules in file.css to document
```

### `<link>`

If you want to add a `<link>` to your css file, you need to first have the url to that file, for that you can use the [`file-loader`](https://github.com/webpack/file-loader). 

``` javascript
require("style/url!file!./file.css");
// => add a <link rel="stylesheet"> to file.css to document
```
Notice that it's not `style` anymore, but `style/url`, it's like another flavor of the same loader.

As you can see, these loaders are the ones that help you to add the style to the page.

## [style/usable](https://github.com/webpack/style-loader/blob/master/README.md#reference-counted-api)
This is another flavor of the style-loader.
With styleable/usable-loader you get the option to inject and remove the styles yourself using a simple API given by the loader.

```javascript
var myStyle = require('myStyle.css');
myStyle.use(); //inject it via a `<style>` element
myStyle.unuse(); //removes it
```

Something important that you need to know is that these loader works counting references of the css usages (kind of like a GC). So: 

```javascript
var myStyle = require('myStyle.css');
myStyle.use(); //inject it via a `<style>` element (counter = 1)
myStyle.use(); //nothing happens, already injected (counter = 2)

myStyle.unuse(); // nothing happens! counter should be 0 to remove it (counter = 1)
myStyle.unuse(); // removes it (counter = 0)

myStyle.unuse(); // nothing happens (counter = -1) -> weird!
```
As you can see in the last line, if you call unuse() more than use() you get a negativa counter, which looks weird, I created a [PR in github](https://github.com/webpack/style-loader/pull/122) to fix this but the repo seems to be asleep...

A recommended way to use this is having a different suffix for css files that you want to use with this loader, in case you have css files that
you want to load with a `<style>` and files that you want to load with this API.

``` javascript
{
  module: {
    loaders: [
      { test: /\.css$/, exclude: /\.useable\.css$/, loader: "style!css" },
      { test: /\.useable\.css$/, loader: "style/useable!css" }
    ]
  }
}
```

## [css-modules](https://github.com/webpack/css-loader#css-modules)
This is also a flavor of the `css-loader`.
This loader helps us the developers to avoid name conflicts while using css, and by doing so, keep our components modular. 

When requiring a css file, it will return an object with all the css selectors in that file (if you have images, etc then you first use some of the other loaders). That object should be passed to the html template or react view or whatever, and use the key corresponging to the class you want to use. An example:

```css 
.myClass {
	color: red;
}
```

```javascript
var myStyle = require('myStyle.css');
// {
// 	"myClass": "73nsdfsdf7agkfdg73"
// }
```

```html
<div class="{ { myStyle.myClass } }">
</div>
<!-- would convert to -->
<div class="73nsdfsdf7agkfdg73">
</div>
```
And the final css would be like

```css 
.73nsdfsdf7agkfdg73 {
	color: red;
}
```

So as you can see, selectors are made universal, avoiding any clash in names and giving more modularity to the components using it. 
It's an interesting approach on an eternal css problem, the global scope. Until [Shadow DOM](https://www.w3.org/TR/shadow-dom/) and CSS local scope comes, this might be an option.

More on `css-modules` [here](https://github.com/css-modules/css-modules).

## Helpful tools and docs for css development

* [Webpack documentation for working with stylesheets](https://webpack.github.io/docs/stylesheets.html)
* Pre-processors loaders
	* [postcss](https://github.com/postcss/postcss-loader)
	* [less](https://github.com/webpack/less-loader)
	* [sass](https://github.com/jtangelder/sass-loader)
* CSS linters
	* [csslint loader](https://github.com/hyungjs/csslint-loader) (plain css linter)
	* [stylelint](https://github.com/adrianhall/stylelint-loader) (css linter for pre-processors syntax)
	* [stylefmt](https://github.com/tomasAlabes/stylefmt-loader) (fixes common css linters issues automatically)
	
If you are using any of the CSS pre-processors and you want to lint your CSS, you can check [my post on it](http://tomasalabes.me/blog/_site/web-development/2016/08/26/Webpack-Series-Part-3.html).

All these loaders have different configuration options you can check out but I hope this helps you 
to choose what loaders to use and what tools to help you get going!
