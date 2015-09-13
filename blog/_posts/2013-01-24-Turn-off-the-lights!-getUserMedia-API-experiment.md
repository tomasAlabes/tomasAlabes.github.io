---
layout: post
title:  "Turn off the lights! getUserMedia API experiment"
description:  "getUserMedia API experiment"
date:   2013-01-24 12:30:16
categories: web-development
tags: javascript, webrtc , html5, tutorial, experiment
---

Hi folks, 2nd post here :)

I've been getting to know the new HTML5 Web RTC project and the getUserMedia API through this great HTML5Rocks article by Eric Bidelman.

Don't know what Web RTC is? Quick definition from the projects Web:
"WebRTC is an open framework for the web that enables Real Time Communications in the browser. It includes the fundamental building blocks for high quality communications on the web such as network, audio and video components used in voice and video chat applications.
These components, when implemented in a browser, can be accessed through a Javascript API, enabling developers to easily implement their own RTC web app. "

The navigator.getUserMedia() API allows web apps to access a user's camera and microphone.

Playing around with the javascript API, I made a simple website where, through your webcam, you can take snapshots, add filters to them, and whenever you want (this is my new thing) turn off the camera by covering it with your hand (or whatever).
To show you what I mean, this is the web site.

I would like to show you how I did this, hope you enjoy it.
Boilerplate

First I downloaded the last html5 boilerplate, this gives all you need to get started.
In the template you will see this comment:

{% highlight javascript %}
<!-- Add your site or application content here -->
{% endhighlight %}

There is where you start adding things. The first html element you need now is the following:

{% highlight javascript %}
<video autoplay=""></video>
{% endhighlight %}

This tag will be where the camera will stream its content.
Feature Detection

Then, following Eric's article, I started the feature detection and asking permission for the video.
"The getUserMedia() API is still very new. In Chrome < 21, you need to enable the feature by visiting about:flags. If you're using Chrome 21, you can skip this section."
You can see other browsers compatibility with this feature here.

{% highlight javascript %}
window.URL = window.URL || window.webkitURL;
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia;

var video = document.querySelector('video'),
    localMediaStream;

if (navigator.getUserMedia) {
  navigator.getUserMedia({video: true}, function(stream) {
    video.src = window.URL.createObjectURL(stream);
    localMediaStream = stream;
  }, onFailSoHard);
} else {
  //You can add a fallback here if you want, I didn't.
  //video.src = 'somevideo.webm';
}
{% endhighlight %}

Notice that you can use 'audio: true' also in the first parameter of the getUserMedia() function, but it isn't necessary as we only want to take photos or analyze images.

I'm only going to explain the part about covering the webcam, as the filters part is well explained in the html5rocks article.

First, taking frames snapshots

To do this you must add a canvas element to the html:

{% highlight javascript %}
<canvas id="ghostCanvas" style="display:none" width="440" height="320"></canvas>
{% endhighlight %}

This canvas will be one where our images will be taken secretly, the width/height can be anything you want.

How do we take a screenshot of the camera? Here:

{% highlight javascript %}
function snapshot(canvas) {
    if (localMediaStream) {
        var canvasContext = canvas.getContext('2d');
        canvasContext.drawImage(video, 0, 0, 440, 320);
    }
}
{% endhighlight %}

You can see the drawImage function here, but the parameters can be easily understood with this image:


Analyzing the images

To analyze the images I used a very simple algorithm, comparing 9 points of the images, this ones:

This is how:

{% highlight javascript %}
    darkyImage: function (canvas) {
        var canvasContext = canvas.getContext('2d'),
            i, j,
            x, y,
            image, data;

        for (i = 1; i < 3; i++) {
            for (j = 1; j < 3; j++) {
                x = canvas.width / j - 1;
                y = canvas.height / i - 1;
                image = canvasContext.getImageData(x, y, 1, 1);
                data = image.data;
                if (!this.darkyPixel(data)) {
                    return false;
                }
            }
        }
        return true;
    }
{% endhighlight %}

What about that 'darkyPixel' function? Simple (really, VERY simple), I chose a color limit (20) and a redOffset, this offset is because as your palm has a reddish color, the red part of the pixel generally was 20/25 points higher, so this adjustment did the analysis a bit better.

{% highlight javascript %}
darkyPixel: function (rgba) {
        var offColor = 20,
            redOffset = 25;
        return ((rgba[0] < offColor + redOffset && rgba[1] < offColor && rgba[2] < offColor));
{% endhighlight %}

Of course any algorithm you would like to suggest is welcome!
Reading the camera

Now, when the user accepts us to use their camera, we need to start reading the camera taking snapshots every N seconds/ms, I choose 700ms.

{% highlight javascript %}
function startReading(){
        var ghostCanvas = $('#ghostCanvas')[0];
        setInterval(function(){
            snapshot(ghostCanvas);
            if (darkyImage(ghostCanvas)) {
                stopWebCam();
            }
        }, 700);
    }
{% endhighlight %}

This should be inside the navigator.getUserMedia(), like this:

{% highlight javascript %}
 navigator.getUserMedia({video: true}, function(stream) {
    video.src = window.URL.createObjectURL(stream);
    localMediaStream = stream;
    startReading(); //here!!
  }, onFailSoHard);
{% endhighlight %}

How do I turn off the service when you cover the camera?
You covered the webcam! Shut it down!
{% highlight javascript %}
    function stopWebCam(){
        video.pause();
        localMediaStream.stop();
        $('video').fadeOut(500);
        $("#ghostCanvas").hide();
    }
{% endhighlight %}

Well, that's it!
Here it is all together:

{% highlight javascript %}
$(document).ready(function(){
    window.URL = window.URL || window.webkitURL;

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia;

    var onFailSoHard = function (e) {
        console.log('Reeeejected!', e);
    };

    var video = $('video')[0];
    var canvas = $('canvas')[0];
    var localMediaStream = null;

    function stopWebCam(){
        video.pause();
        localMediaStream.stop();
        $('video').fadeOut(1000);
        $("#ghostCanvas").hide();
    }

    function snapshot(canvas) {
        if (localMediaStream) {
            var canvasContext = canvas.getContext('2d');
            canvasContext.drawImage(video, 0, 0, 440, 320);
        }
    }

    function startReading(){
        var ghostCanvas = $('#ghostCanvas')[0];
        var intervalId = setInterval(function(){
            snapshot(ghostCanvas);
            if (darkyImage(ghostCanvas)) {
                stopWebCam();
            }
        }, 1000);
    }

    darkyPixel: function (rgba) {
        var offColor = 20,
            redOffset = 25;
        return ((rgba[0] < offColor + redOffset && rgba[1] < offColor && rgba[2] < offColor));

    darkyImage: function (canvas) {
        var canvasContext = canvas.getContext('2d'),
            i, j,
            x, y,
            image, data;

        for (i = 1; i < 3; i++) {
            for (j = 1; j < 3; j++) {
                x = canvas.width / j - 1;
                y = canvas.height / i - 1;
                image = canvasContext.getImageData(x, y, 1, 1);
                data = image.data;
                if (!this.darkyPixel(data)) {
                    return false;
                }
            }
        }
        return true;
    }

    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true}, function (stream) {
            video.src = window.URL.createObjectURL(stream);

            localMediaStream = stream;
            startReading();

        }, onFailSoHard);
    } else {
        alert('getUserMedia() is not supported in your browser');
    }
});
{% endhighlight %}

I know that my site has a couple of more things like modules and dimming the background while covering the webcam but I'll try to make another post with them.

Here is my github repo with my web site source code.

Enjoy!