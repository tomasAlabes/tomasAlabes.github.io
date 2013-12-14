---
layout: post
title:  "How to get the latest tweets of a group of people with Twitter REST API"
description: "How to get the latest tweets of a group of people with Twitter REST API"
date:   2013-03-08 12:30:16
categories: [javascript, node, rest, twitter API, tutorial]
comments: true
share: true
---

This seems like a easy or at least common task of twitter right? Well...I thought so, but it gave me a headache for half an hour.

I first tried to use the twitter search API (I recommend you using this API Tester for testing the api from twitter itself) , using queries like "from:tweeterA or from:tweeterB" but I wanted from like 50 people, pretty big query... And:

Twitter's search is optimized to serve relevant tweets to end-users in response to direct, non-recurring queries such as #hashtags, URLs, domains, and keywords. The Search API is an interface to this search engine. Our search service is not meant to be an exhaustive archive of public tweets and not all tweets are indexed or returned. Some results are refined to better combat spam and increase relevance.

So definitively this was not the answer...
It HAD to be easy! Googling and googling I found the answer to my humble question: lists.

For a collection of recent Tweets by more than one user, consider creating a Twitter List and leveraging the list timeline.
A list is a curated group of Twitter users. You can create your own lists or subscribe to lists created by others. Viewing a list timeline will show you a stream of Tweets from only the users on that list.
More on lists.

So in my twitter account made a list, add all the people I wanted to follow and use the GET list statuses service.

Here is the obligatory data the service needs, of course you can view more info in the official documentation of it.

Now to the code.

I'm using nodeJS in my server (remember we now have to authenticate to use even some of the simplest services of the twitter API), the configuration or how to query the server can be seen in other post of mine.

An example of use would be the following:

{% highlight javascript %}
var config = {listId: "86236722", ownerId: "tomasAlabes", count: 10, slug: "poli-tweets-com-ar"}
exports.getLatestTweetsFromList = function(config, callback){
    oauth.get("http://api.twitter.com/1.1/lists/statuses.json?"+
"owner_id="+config.ownerId+
"&count="+config.count+
"&list_id="+config.listId+
"&slug="+config.slug, access_token, access_token_secret, function (error, data) {
        var result;
        if(error){
            result = {error: error};
        }else{
            result = data;
        }
        console.log(data);
        callback(result);
    });
};
{% endhighlight %}

Don't know how to get your list id? Check this.

Hope it helps,
Enjoy!