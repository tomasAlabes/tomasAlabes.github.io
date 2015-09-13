---
layout: post
title:  "SVG/VML views in your Backbone app with Raphael"
description: "Adding SVG/VML views to your backbone app"
date:   2013-05-28 12:30:16
categories: web-development svg
tags: javascript, raphaeljs, svg, tutorial, backbonejs
---

Presenting [backbone.raphael](https://github.com/tomasAlabes/backbone.raphael)

You may already know the famous [Backbone](http://backbonejs.org/) javascript library that lets you build an MV* architecture in the client. And perhaps you also know Raphael, that gives you the opportunity to abstract you from the browser you are using and let you work with SVG o VML indifferently.

In Backbone, the V was thought for html views, but with the flexibility that backbone offers and a little bit of ingenuity we can extend backbone and let your app embrace the vectorial images in your browser.

For this, I created/am creating a Backbone extension that easily lets you do that, called backbone.raphael. It is a simple tweak of how Backbone handles Views events, and how Raphael does it.
How do I use it?

1. Add backbone.raphael.js after backbone.js in your html

{% highlight html %}
<script type="text/javascript" src="backbone.js"></script>

<!-- The extension  -->
<script type="text/javascript" src="backbone.raphael.js"></script>
{% endhighlight %}

This will enable you to use the new Backbone.RaphaelView
2. How to use it

First:

{% highlight javascript %}
//Raphael root element
var paper = Raphael(0, 0, 300, 640);

// Usual backbone model, why change it if the View is the new thing?
var CircleModel = Backbone.Model.extend();
Now we create the view
//This view extends from Backbone.View
var CircleView = Backbone.RaphaelView.extend({

    initialize: function(){
        var model = this.model;
        this.listenTo(model, "change", this.render);

        // Create raphael element from the model
        var circle = paper.circle(model.get("x"), model.get("y"), model.get("radio")).attr({fill: model.get("color")});

        // Set the element of the view
        this.setElement(circle);
    },

    events: {
        // Any raphael event, no selector needed
        "click": "sayType",
        // Or any custom event
        "foo": "sayType"
    },

    sayType: function(evt){
        console.log(evt.type);
    },

    render: function(){
        var circle = this.el;
        var model = this.model;

        //When the model changes, so the element
        circle.attr({
            cx: model.get("x"),
            cy: model.get("y"),
            r: model.get("radio"),
            fill: model.get("color")
        });
    }

});
{% endhighlight %}

Now is time for creating some real objects:

{% highlight javascript %}
var model = new CircleModel({
    x: 100,
    y: 150,
    radio: 50,
    color: "blue"
});

var view = new CircleView({
    model: model
});
{% endhighlight %}

Then in your app you can trigger the custom events you binded:

{% highlight javascript %}
view.trigger("foo");
{% endhighlight %}

In my [github](https://github.com/tomasAlabes/backbone.raphael) repo it is the source code and a more complex sample app for you to see. This extension is still in development but is usable today.

Enjoy!