---
layout: post
title:  "Javascript ES6 Classes for Java Developers"
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
2. [Accessors](#accessors)
4. [Static Methods](#static-methods)
5. [Static Fields](#static-fields)
6. [Abstract Classes](#abstract-classes)
7. [Abstract Methods](#abstract-methods)
8. [Private Fields](#private-fields)
9. [Functions Overloading](#functions-overloading)
10. [Interfaces](#interfaces)

Inheritance
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
with the name of the class, you just put `constructor` and the parameters for it.  
<br />

### Default constructor and the "..." function parameters

If you don’t specify a constructor for a base class, the following constructor is used:
 
{% highlight javascript %}
constructor() {}
{% endhighlight %}

For derived classes, the following default constructor is used:

{% highlight javascript %}
constructor(...args) {
    super(...args);
}
{% endhighlight %}

So here we can see two things, how default constructors are, and the `...args` syntax that is also used in Java to pass
as many arguments as you want. The array of arguments already existed in javascript using the `arguments` object, 
but now we can do something like:
 
{% highlight javascript %}
class MyClass {

    receiveWhatever(aNumber, ...rest) {
        console.log(aNumber);
        
        rest.forEach(function(thing){
            console.log(thing);
        });
    }
 
}
{% endhighlight %}


Accessors
----------

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
console.log(donatello.health); // 100, nicer and you can do things in the getter

donatello.health = 80; // Error!
// TypeError: Cannot set property health of # which has only a getter at eval

donatello._health = 80; // You can, but shame on you...

{% endhighlight %}

When we define a getter (and no setter), the variable becomes read-only with the getter/setter name, but you can still change
it when the variable name, "_health" in this case, but is not a good practice! 

Either use the accessors, or don't.

{% highlight javascript %}
    
// [...]

    set health(newHealth){
        this._health = newHealth;
    }

}

let donatello = new Ninja("Donatello");
donatello.health = 80; // Right way of doing it

{% endhighlight %}

Static Methods
----------------

Static methods are also something included in ES6, are easy and similar to Java. 

{% highlight javascript %}

class Foo {
    static classMethod() {
        return 'hello';
    }
}

Foo.classMethod(); // 'hello'

{% endhighlight %}

Very similar to java.
One thing you can do in Javascript but can't in Java is the following:

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

From the derived class you can override and call your parents static method. 

Why can't you in java? [Answer](http://stackoverflow.com/questions/2223386/why-doesnt-java-allow-overriding-of-static-methods).

Static Fields
----------------

They are not baked-in ES6 but there is a [discussion](https://github.com/jeffmo/es-class-properties)
about it for ES7. Right now you can simulate the functionality like this: 

{% highlight javascript %}

class Foo {
    constructor() {}
}

//definition
const staticNumber = 5;
const staticObj = { prop: 5 };
Foo.staticNumber = staticNumber;
Foo.staticObj = staticObj;
{% endhighlight %}

{% highlight javascript %}
// Examples of use

new Foo().staticNumber; //undefined
Foo.staticNumber; // 5
Foo.staticObj; //{ prop: 5 }

Foo.staticObj.prop = 2; // Error! const can't be changed! 

Foo.staticVar = 10; // WARNING: overriding static field value
Foo.staticObj = {prop: "hello"}; // WARNING: overriding static field value

Foo.staticVar; // 10
Foo.staticObj; // {prop: "hello"};
{% endhighlight %}

But as we saw in the example it can be changed easily...

Abstract classes
---------------------

This concept is not implemented in ES6 or ES7, and I couldn't find anything official about it, but I found a way to mimic them
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

It doesn't seem a super hacky way of implementing it.

Abstract Methods
---------------------

Similar thing for abstract methods.

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


Private Fields
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

Although the `WeakMap` is a new structure for Javascript, for Java is not: [WeakHashMap](http://docs.oracle.com/javase/8/docs/api/java/util/WeakHashMap.html).

> The WeakMap object is a collection of key/value pairs in which the keys are weakly referenced. The keys must be objects and the values can be arbitrary values.



<span style="color:#DCE775; text-decoration: underline;">WARNING</span>

The above `private` WeakMap is shared among all Warrior instances, so potentially you can access another warrior's
health. It's a disadvantage of this implementation.  


Functions Overloading
----------------------
This functionality have never existed in Javascript and there is no plan on supporting it. But this es mainly because
Javascript, as a dynamically typed language, make this impossible:
 
{% highlight javascript %}

class Person {
    
    say(what) { //string
        console.log(thing);
    }
    
    say(things) { //array
        things.forEach(function(thing){
            console.log(thing);
        });
            
    }
    
    say() {
        console.log("blah")
    }
    
}

{% endhighlight %}

Javascript has no type checking on arguments or required quantity of arguments, so you can just have one
implementation of `say()`. 
You can adapt to what arguments were passed to it by checking the type, presence or quantity of arguments.

Interfaces
-------------------

There is no concept of interface whatsoever in any version of javascript, you can find interfaces in
[Typescript](www.typescriptlang.org/) or [Dart](https://www.dartlang.org/) than then are compiled to ES5 javascript
but nothing native.

There is a native rather ugly workaround in this [StackOverflow answer](http://stackoverflow.com/questions/3710275/does-javascript-have-the-interface-type-such-as-javas-interface)
if you **really** need it native.


Conclusion
-------------------
Despite not having all the OOP concepts and constructs that Java has (remember javascript was born and is as a prototype based language), 
it's possible to have a lot of the functionality, some are more hacky than others but hey, 
if you have programmed in js for a while you are scared of nothing. 

Am I missing something or is there a better way to do these things?

Comments or improvements are appreciated!

Thanks!


--------------------
Resources:

1. [www.2ality.com](http://www.2ality.com/2015/02/es6-classes-final.html)
2. [es6-features.org](http://es6-features.org/#ClassDefinition)
3. [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
