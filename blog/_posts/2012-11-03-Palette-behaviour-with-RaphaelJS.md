---
layout: post
title:  "Palette behaviour with RaphaelJS"
description: "Creating a palette behaviour with RaphaelJS library"
date:   2012-11-03 12:30:16
categories: web-development svg
tags: raphaeljs, javascript, svg, tutorial
---

Hi all, welcome to my new blog!
For my first entry I chose [RaphaelJS](raphaeljs.com), an svg library to manipulate SVG with javascript in a easier way than directly with the SVG DOM, but of course losing some of the svg spec capabilities.
I've been working with Raphaeljs for a while now and I would like to share some code with you for a nice behaviour, the palette behaviour.

First of all, in what consists my palette behaviour? It's like in many editors, where you have elements on the side that you can add by drag and drop to a 'canvas'.

I will assume that we already have the rectangle representing the palette and the elements inside, and I will explain to you how to give them the correct behaviour.
For this we will use the drag() function that Raphael gives us, using some functions that give us the feeling of d&d new elements to a canvas.

You'll have to add to every palette element this startFunction:

{% highlight javascript %}
//DragFunctions is the object that has all the 3 d&d methods, clearer in the complete file
paletteStart:function () {
    // keep the relative coords at the start of the drag
    this.ox = 0;
    this.oy = 0;

    // as we are dragging the palette element, we clone it to leave one in his place.
    var newPaletteObj = this.clone();

    //we give the new palette element the behaviour of a palette element
    DragFunctions.addDragAndDropCapabilityToPaletteOption(newPaletteObj);

    //nice animation
    this.animate({"opacity":0.5}, 500);
}
{% endhighlight %}

Now we need the function while the element is being dragged:

{% highlight javascript %}
move: function (dx, dy) {
    // calculate translation coords
    var new_x = dx - this.ox;
    var new_y = dy - this.oy;

    // transforming coordinates
    this.transform('...T' + new_x + ',' + new_y);

    // save the new values for future drags
    this.ox = dx;
    this.oy = dy;
}
{% endhighlight %}

And finally, the function executed at finish dropping:

{% highlight javascript %}
paletteUp: function(){
    if(!DragFunctions.isInsideCanvas(this)){
        this.remove();
        //notify the user as you want!
    }else{
        //Giving the new D&D behaviour
        this.undrag();

        //give the element the new d&d functionality!

        this.animate({"opacity":1}, 500);
    }
}
{% endhighlight %}

2 things to comment here, when the element is dropped, you will have to remove the palette behaviour and give it another one (a plain d&d functionality), if not, it will continue cloning elements all around.
Here I give you some nice behaviour to give them:

{% highlight javascript %}
start:function () {
    // keep the relative coords at the start of the drag
    this.ox = 0;
    this.oy = 0;
    // animate attributes to a "being dragged" state
    this.animate({"opacity":0.5}, 500);
},
    //same move function
    up: function () {
        if(!DragFunctions.isInsideCanvas(this)){
            this.animate({transform:'...T' + (-this.ox) + ',' + (-this.oy)}, 1000, "bounce");
        }
        this.animate({"opacity": 1}, 500);
    },

    //and the method that gives the behaviour
    addDragAndDropCapabilityToSet: function(compSet) {
        compSet.drag(this.move, this.start, this.up, compSet, compSet, compSet);
    }
{% endhighlight %}

And as you may also see, we have a validator that sees if the element is inside the canvas, it is a very useful function, here:

{% highlight javascript %}
isInsideCanvas: function(obj){
            var canvasBBox = //get your 'canvas'
            var objectBBox = obj.getBBox();
            var objectPartiallyOutside = !Raphael.isPointInsideBBox(canvasBBox, objectBBox.x, objectBBox.y) || !Raphael.isPointInsideBBox(canvasBBox, objectBBox.x, objectBBox.y2) || !Raphael.isPointInsideBBox(canvasBBox, objectBBox.x2, objectBBox.y) || !Raphael.isPointInsideBBox(canvasBBox, objectBBox.x2, objectBBox.y2);
            return !(objectPartiallyOutside);
        }
{% endhighlight %}

Finally, the place to call to give the element all this behaviour:

{% highlight javascript %}
//this works for elements and sets
addDragAndDropCapabilityToPaletteOption:function (compSet) {
    compSet.drag(this.move, this.paletteStart, this.paletteUp, compSet, compSet, compSet);
}
{% endhighlight %}

A demo of this is in a website I created to play with raphael, called comoformamos project
The hole code is in a github gist or hosted on github so if you want to get a little deeper in the code feel free to do it.

I hope you find this helpful,
til next time!