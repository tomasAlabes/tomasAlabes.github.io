---
layout: post
title:  "Webpack Series (Part 3): Webpack + PostCSS + Stylelint + Stylefmt"
description: "Experiences with Webpack"
date:   2016-09-01 12:30:16
categories: web-development
tags: javascript, webpack, stylelint, stylefmt
---

If you want to, with Webpack you can use different pre-processors for your CSS: Sass, Less and PostCSS are the most popular ones. I won't go into the differences between them but I will say why I chose PostCSS. 

I like how extensible is via its plugins, gives me the freedom to pick and choose, and why not extend it myself. The rest is like a canned product, leave it or take it, it works but I find PostCSS extensibility better.

#PostCSS

The configuration to use PostCSS is the following:

First install the [postcss-loader](https://github.com/postcss/postcss-loader), we are going to let webpack handle the processing while bundling.

{% highlight bash %}
npm install postcss-loader --save-dev
{% endhighlight %}

Then add it to your `webpack.config.js`:

{% highlight javascript %}
module.exports = {
    module: {
        loaders: [
            {
                test:   /\.css$/,
                loader: "style-loader!css-loader!postcss-loader"
            }
        ]
    },
    postcss: function () {
        return [];
    }
}
{% endhighlight %}

This won't do anything until we use a plugin, the one that gives you the "Sass/Less" most common features is [precss](https://github.com/jonathantneal/precss).

{% highlight bash %}
npm install precss --save-dev
{% endhighlight %}

Then we use it:

{% highlight javascript %}
var precss = require('precss');

module.exports = {
    module: {
        loaders: [
            {
                test:   /\.css$/,
                loader: "style-loader!css-loader!postcss-loader"
            }
        ]
    },
    postcss: function () {
        return [precss];
    }
}
{% endhighlight %}

And now you can write with the `precss` syntax in your css!


#Stylelint

Besides helping with standarizing quality, I always think that a great way to learn a languague/framework/technology is leaning on tools that "already know" what are the good practices that you need to follow. In case of PostCSS this is [Stylelint](https://github.com/stylelint/stylelint). It's a CSS linter that helps you enforce consistent conventions and avoid errors in your stylesheets. It works for the 3 pre-processors we mentioned.

The best option out there integrated with Webpack right now I think is the [stylelint-webpack-plugin](https://github.com/vieron/stylelint-webpack-plugin). You can always use the CLI interface too.

Let's see how to configure it:

{% highlight bash %}
npm install --save stylelint-webpack-plugin
{% endhighlight %}

{% highlight javascript %}
var StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  // ...
  plugins: [
    new StyleLintPlugin({/* Options */}),
  ],
  // ...
}
{% endhighlight %}

All the options for it can be seen [here](https://github.com/vieron/stylelint-webpack-plugin#options). This will output all the corresponding warnings/erros and fail if you want it to. Just one note there, the options example says:

{% highlight javascript %}
context: 'inherits from webpack'
{% endhighlight %}

_"inherits from webpack"_ is not a valid value, I've seen people defining it like that, but it's not a valid value (see [this issue](https://github.com/vieron/stylelint-webpack-plugin/issues/7)).


#Stylefmt
When using linters you also might need something that helps you fixing the low-hanging fruit problems in your stylesheets. This is key when you are introducing a linter into an existing project. [stylefmt](https://github.com/morishitter/stylefmt) aims to help with that.

Right now, with Webpack, you can use the [stylefmt-loader](https://github.com/tomasAlabes/stylefmt-loader). Same as Stylelint, the CLI is also available.

This loader will automatically fix whatever it can in your stylesheets before pre-processing them.

The configuration:

{% highlight bash %}
npm install --save stylefmt-loader
{% endhighlight %}

{% highlight javascript %}
"module": {
    "loaders": [
        {"test": /\.css/, "loader": "css!postcss!stylefmt"}
        ]
    }
{% endhighlight %}

#Conclusion
With this tools, you have the power to scale your css development in your project, with a set of standards and rules that will be automatically enforced in your dev process, making your application easier to maintain and improving the overall quality of it.

Hope it helps!

Till next time!