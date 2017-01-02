---
layout: post
title:  "How to register your library or component in Bower"
description: "How to register your library or component in Bower"
date:   2013-06-03 12:30:16
categories: web-development
tags: javascript, bower
---

Bower is a package manager for the web. It offers a generic, un-opinionated solution to the problem of front-end package management.

Bower depends on Node and npm. It's installed globally using npm:

`npm install -g bower`

To register a new package:
* There must be a valid manifest JSON in the current working directory. 
* Your package should use semver Git tags. 
* Your package must be available at a Git endpoint (e.g., GitHub); remember to push your Git tags! 

You can use bower init to generate the valid manifest json

```shell
bower init
```

It will produce something like this:

```javascript
{
  "name": "appName",
  "version": "1.0.0",
  "main": [
    "app.js"
  ],
  "ignore": [
    "**/.*",
    "node_modules",
    "components"
  ],
  "dependencies": {
    "myDep": "latest",
    "myDep2": "2.0.0"
  }
}
```

Then to register your app:

```sh
bower register [app name] [git endpoint]

// example:
bower register raphael.backbone git://github.com/tomasAlabes/backbone.raphael.git
Registering a package will make it visible and installable via the registry.
Proceed (y/n)? y
registered backbone.raphael to git://github.com/tomasAlabes/backbone.raphael.git
```

And now your library is ready to be used via bower :)
Use my library as an example if you want: [backbone.raphael](https://github.com/tomasAlabes/backbone.raphael)

Enjoy!