---
layout: post
title:  "Adding CSS with Requirejs"
description: "Technique for using CSS with Requirejs"
date:   2015-09-12 12:30:16
categories: web-development
tags: require, requirejs, css, javascript
---

Problem
--------

In one of my projects I was using requirejs and I had the situation where I had html templates with links to external css files, after I appended these templates to the DOM, the javascript that needed to use that styled DOM didn't have the style applied...why? easy, the css file was not there yet to apply the style. 
I also wanted to have all the app bundled into 1 single file, css included, to avoid this problem. So what did I do?

**TLDR?**

I used the same [requirejs-text plugin](https://github.com/requirejs/text) that I used for the html templates but for the css an inject it as a `<style>` tag. 

That way, when I bundle all my files into 1, I already bundled the css (as text) and inject it immediatly when I needed, and the code that is executed after it already has the style applied. Take a look at the [solution](#solution).


How I got to that solution
--------------------------

I first used the [require-css](https://github.com/guybedford/require-css) plugin:

	```javascript
	define(['css!style', 'myJavascript'], function(style, myJavascript) {
	    // in this case the plugin adds a <link> for the css, 
	    // and calls this code on the onload of it (and the js).
	});
	```

This would do the job, but when I wanted to bundle all the css and js files into 1 big file with this code:

	```javascript
	define(['someJs'], function(someJs) {
		if(someCondition){
			require(['css!style', 'myJavascript'], function(style, myJavascript) {
				// if some condition applies, I want to load my css
				// and work with the js that uses the styled DOM
			});
		}
	});
	```

In this case, when I bundled everything, the css weren't bundled as well, so I needed to wait for the css to arrive to execute the dependant code. It makes sense but I want the css to be bundled too so the execution of that code is instant.

[Solution](id:solution)
--------

So the way i did that was using the same [requirejs-text plugin](https://github.com/requirejs/text) that I used for the html templates, but for the css.

	```javascript
	define(['someJs'], function(someJs) {
		if(someCondition){
			require(['text!style', 'myJavascript'], function(style, myJavascript) {
				// this way it's immedietly injected in the html
				$('head').append('<style>' + style + '</style>');	
				// and work with the js that uses the styled DOM
			});
		}
	});
	```

The only disadvantage that I see it that I will bundle all the css with the rest of the app when perhaps I won't use them all. But I don't mind adding 0.5 kb to the file to improve the UX of the app.

This isn't really rocket science but in production I didn't want to wait for external css to be loaded when the rest of the app is already in the client. So I found these easy and simple solution to it.

By the way, I was using grunt for all these, I know webpack has this already built-in but I didn't have the chance to use it.

That's it, thanks!

