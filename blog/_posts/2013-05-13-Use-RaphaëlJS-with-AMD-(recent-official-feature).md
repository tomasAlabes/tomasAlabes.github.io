---
layout: post
title:  "Use RaphaëlJS with AMD (recent official feature)"
description: "Showing the recent AMD feature of RaphaelJS"
date:   2013-05-13 12:30:16
categories: web-development svg
tags: javascript, raphaeljs, svg, tutorial
---

Hi all, I'm the collaborator of RaphaëlJS github repo. (Don't know SVG or Raphaël?? Check it out!, really cool things can be done with it).
Thanks to our contributors now it's easy to add the library using AMD, something difficult to do before.
Here is how and an example!
tl;dr? Check my raphael-boilerplate repo.

The example

First the html, we will use require.js so you need to add it in you project structure. The same with your main javascript file, where require will start to download the js.

{% highlight html %}
<html>
<head>
 <title>Raphael Dev testing html</title>
 <script data-main="main" src="require.js"></script>
</head>
<body>
        <!-- Here is the container for Raphael -->
 <div id="container"></div>
</body>
</html>
{% endhighlight %}

We have in the body the div that will work as the container of Raphael, notice that there are other ways of creating the svg/vml root element.

Then the main.js file:

{% highlight javascript %}
require([ "path/to/raphael" ], function (Raphael) {
    console.log(Raphael);
});
{% endhighlight %}

Here you set the path to Raphael and you are ready to go!

Or set this configuration in your configuration:

{% highlight javascript %}
require.config({
  paths: {
    raphael: "libs/raphael"
  }
});
{% endhighlight %}

And you can require the module like this:

{% highlight javascript %}
require([ "raphael" ], function (Raphael) {
    console.log(Raphael);
});
{% endhighlight %}

This is the simplest of the examples, in my repo I have some variants:
Global use (window.Raphael)
This example of AMD
HTML5 Boilerplate with Raphael

Enjoy!!
