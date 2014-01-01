---
layout: post
title:  "Convert SVG to Raphael in one step"
description: "Quick way to convert SVG to Raphael in one step"
date:   2013-02-17 12:30:16
tags: [javascript, raphaeljs, svg, tutorial]
comments: true
share: true
---

Perhaps you have heard of the [Raphaël](raphaeljs.com) library. Raphaël is a small JavaScript library that should simplify your work with vector graphics on the web. It's open-source and its one of the most famous libraries on github, the most popular for svg manipulation on the browser.

As the library wraps all svg elements into raphael objects, it wasn't posible at first to convert an svg file to those objects, and it was a really requested feature for the library.
Well, the author didn't add to the project but he did a tool for it, called rappar.

Here its an example of how to use it:
First of all you must have node installed.
Then you would download the official repo but it has a bug with the latest node version, so download mine which has the fix.
Now is time to convert your svg file, I took this svg as example:

<a href="http://3.bp.blogspot.com/-tVwEgKwJeWs/UR-ovH8xvhI/AAAAAAAAATQ/wb6OXxQ9yl8/s1600/vectorstock_5307.jpg" imageanchor="1" style="margin-left: 1em; margin-right: 1em;"><img border="0" height="320" src="http://3.bp.blogspot.com/-tVwEgKwJeWs/UR-ovH8xvhI/AAAAAAAAATQ/wb6OXxQ9yl8/s320/vectorstock_5307.jpg" width="304" /></a>

(pretty cool huh? you can find the free svg here)

Execute
{% highlight bash %}
node rappar.js path/to/eagle.svg
{% endhighlight %}

This will output the svg code, but perhaps we could do this in a cleaner way:

{% highlight bash %}
node rappar.js path/to/eagle.svg > myCode.txt
{% endhighlight %}

Now you have it in a separate file. Want to add it to your web? Like this:

{% highlight javascript %}
var paper = Raphael(0, 0, 1600, 1600); //I'm using an arbitrary width and height
paper.add(your_code)
{% endhighlight %}

And you are done! Easy right? Now you can add any svg file to your browser converting it with this tool. Check the raphael documentation for more info on the library.

Enjoy!