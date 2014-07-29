---
layout: post
title:  "Make Your Maven Projects Grunt"
description: "How to add Grunt to you Maven Project"
date:   2014-07-27 12:30:16
tags: [javascript, maven, java, grunt]
comments: true
share: true
---

If you work in a Maven project and you work in the front-end then you know how difficult is to work with a fully automated asset pipeline for all you client resources. If you want to automate the quality analysis, uglyfication, concatenation, headless tests, and more, then you need more than just a structure to place your resources in you web module in Maven. 

To do all this I used [Grunt](http://gruntjs.com), taking the description from its web: it is a very popular javascript task runner, it lets you perform repetitive tasks like minification, compilation, unit testing, linting, etc. After you've configured it, a task runner can do most of that mundane work for you—and your team—with basically zero effort. 
Grunt and Grunt plugins are installed and managed via [npm](http://npmjs.org), the [Node.js](http://nodejs.org) package manager.

It's not the objetive of this post to explain how to use grunt but to explain how I integrated it to Maven, that's why I will skip explaining some things about it.

