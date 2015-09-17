---
layout: post
title:  "ES6 Classes for Java Developers"
description: "Concepts of Java classes in ES6 Javascript"
date:   2015-09-16 12:30:16
categories: web-development
tags: ES6, javascript, classes
---


I'm part Java part Javascript developer, so one of the first things I wanted to know when I saw the new ES6 classes 
is what they can do, how are they similar to Java classes. 
So these are my findings:

We will analyze: 

1. [Inheritance](#inheritance)
2. [Getters/Setters, fields access](#fieldGS)
4. [Static Methods](#staticMethods)
5. [Static Fields](#staticFields)
6. [Abstract Classes](#abstractClasses)
7. [Abstract Methods](#abstractMethods)
8. [Private fields](#privateFields)
9. [Interfaces](#interfaces)

[Inheritance](id:inheritance)
----------------

Inheritance is one of the building blocks of Java and OOP, and it's one of the things that ES6 already has,
lets see how it looks in Javascript.

{% highlight javascript %}
    
class Warrior {

    constructor(name) {
        this._name = name;
        this._health = 100;
    }
    
    heal(amount) {
        this._health = Math.min(this._health + amount, 100);
    }
}

class Ninja extends Warrior {

    constructor(name) {
        super(name);
    }

    heal(amount) {
        super.heal(amount * 1.2);
    }

}

{% endhighlight %}

Everything here is almost self-explanatory, it uses a a very similar syntax than Java. Instead of having the constructor 
with the name of the class, you just put `constructor` and the parameters of it.

> If you don’t specify a constructor for a base class, the following definition is used:[^1]
> 
> {% highlight javascript %}
constructor() {}
{% endhighlight %}
> 
> For derived classes, the following default constructor is used:[^1]
> 
> {% highlight javascript %}
constructor(...args) {
    super(...args);
}
{% endhighlight %}

Now, what's the scope of the variables I set inside the constructor? How can I access them?

{% highlight javascript %}
let donatello = new Ninja("Donatello"); //Ninja turtle!
console.log(donatello._health); // 100
w._health = 200; //I can access it as any other property
console.log(donatello._health); // 200
{% endhighlight %}

The '_' feels bad right...? Let's move to something cleaner.

[Getters/Setters, fields access](id:fieldGS)
------------------------------------

We have the ability to define getters and setters for our fields. So we can access them as any other object property.

{% highlight javascript %}
    
class Warrior {

    constructor(name) {
        this._name = name;
        this._health = 100;
    }
    
    get health(){
        return this._health;
    }
}

let donatello = new Ninja("Donatello");
console.log(donatello._health); // 100 (this will still work...) but:
console.log(donatello.health); // 100, nicer

donatello.health = 80; // Error!
// TypeError: Cannot set property health of # which has only a getter at eval

donatello._health = 80; // You can, but shame on you...

{% endhighlight %}

When we define a getter (and no setter), the variable becomes read-only with the getter/setter name, but you can still change
it when the variable name, "_health" in this case, but is not a good practice! Either use the accessors, or don't use them.

{% highlight javascript %}
    
// [...]

    set health(newHealth){
        this._health = newHealth;
    }

}

let donatello = new Ninja("Donatello");
donatello.health = 80; // Right way of doing it

{% endhighlight %}

[Static Methods](id:staticMethods)
------------------------------------

Static methods are also something included in ES6, are easy and similar to Java. 

{% highlight javascript %}

    class Foo {
        static classMethod() {
            return 'hello';
        }
    }
    
    class Bar extends Foo {
        static classMethod() {
            return super.classMethod() + ', too';
        }
    }
    Bar.classMethod(); // 'hello, too'

{% endhighlight %}

Two things here, fist how you define a method with the `static` keyword, very similar to java, and then
how from the derived class you can override and call your parents static method. 

<span style="color: red">Can you do that it Java?</span>.

[Static Fields](id:staticFields)
---------------------

They are not baked-in ES6 but there is a [discussion](https://github.com/jeffmo/es-class-properties)
about it for ES7. Right now you can simulate the functionality like this: 

{% highlight javascript %}

class Foo {
    constructor() {}
}
Foo.staticVar = 5;

// Then

let f = new Foo();
f.staticVar; //undefined
Foo.staticVar; // 5

Foo.staticVar = 10; // :s
Foo.staticVar; // 10
{% endhighlight %}

But as we saw in the example it can be changed easily...

<span style="color: red">Other better approach?</span>.

[Abstract classes](id:abstractClasses)
---------------------

This concepts is not implemented in ES6 or ES7, and I could find anything official about I found a way to mimic them
in this [Stack Overflow answer](http://stackoverflow.com/questions/29480569/does-ecmascript-6-have-a-convention-for-abstract-classes).

{% highlight javascript %}

class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }
  }
}

class Derived extends Abstract {
  constructor() {
    super();
    // more Derived-specific stuff here, maybe
  }
}

const a = new Abstract(); // new.target is Abstract, so it throws Error
const b = new Derived(); // new.target is Derived, so no error

{% endhighlight %}


[Abstract methods](id:abstractMethods)
---------------------

{% highlight javascript %}

class Abstract {
  constructor() {
    if (this.method === undefined) {
      // or maybe test typeof this.method === "function"
      throw new TypeError("Must override method");
    }
  }
}

class Derived1 extends Abstract {}

class Derived2 extends Abstract {
  method() {}
}

const a = new Abstract(); // this.method is undefined; error
const b = new Derived1(); // this.method is undefined; error
const c = new Derived2(); // this.method is Derived2.prototype.method; no error

{% endhighlight %}


[Private fields](id:privateFields)
-------------------

Private fields are not supported in any ES right now, but there are a couple of 
new structures in ES6 that let you emulate the private scope.
I've read several good articles about it, I recommend [Private Properties in Javascript](https://curiosity-driven.org/private-properties-in-javascript).

{% highlight javascript %}

const private = new WeakMap();

class Warrior {
    
    constructor(name) {
        this._name = name;
        
        private.set(this, {
            health: 100
        });
        
    }
    
    heal(amount) {
        this._health = Math.min(this._health + amount, 100);
    }
    
    get health(){
        return private.get(this).health;
    }
}

{% endhighlight %}


[Interfaces](id:interfaces)
-------------------

There is no concept of interface whatsoever in any version of javascript, you can find interfaces in
[Typescript](www.typescriptlang.org/) or [Dart](https://www.dartlang.org/) than then are compiled to ES5 javascript
but nothing native.

There is a native rather ugly workaround in this [StackOverflow answer](http://stackoverflow.com/questions/3710275/does-javascript-have-the-interface-type-such-as-javas-interface)
if you **really** need it native.


Conclusion
-------------------
Despite not having all the OOP concepts that Java has, it's possible to have most of the functionalties, some are more hacky than
others but hey, if you have programmed in js for a while you are scared of nothing.

Comments or improvements are appreciated!
Thanks!


--------------------
References:

[^1]: [http://www.2ality.com/2015/02/es6-classes-final.html](http://www.2ality.com/2015/02/es6-classes-final.html)
