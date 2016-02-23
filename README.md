![Container.js](https://raw.githubusercontent.com/pomek/container.js/master/assets/logo.png)
[![Code Climate](https://codeclimate.com/github/pomek/container.js/badges/gpa.svg)](https://codeclimate.com/github/pomek/container.js)
[![Build Status](https://travis-ci.org/pomek/container.js.svg)](https://travis-ci.org/pomek/container.js)

> Simply Container for using Dependency Injection pattern in JavaScript

Container.js is lightweight library (<2kb when minified), designed to facilitate how you can implement [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection) pattern in your JavaScript applications.
It works both versions of ECMAScript - 2015 (ES6) and 5 (ES5).

## How to use

In order to use this package, you need to install it in your project:

**via [Bower](https://bower.io)** (by default will be used **ES5** version)

```js
bower install Container.js --save
```

**via [NPM](https://www.npmjs.com/package/node-container.js)** (by default will be used **ES2015** version)

```js
npm install node-container.js --save
```

or download it manually:
 * [**ES5** version](https://github.com/pomek/container.js/blob/master/dist/Container.min.js),
 * [**ES2015** version](https://github.com/pomek/container.js/blob/master/dist/Es2015-Container.js).

```html
<script src="/path/to/Container.min.js"></script>
<script src="/path/to/Es2015-Container.js"></script>
```

## Changes

### 2.0.0

* Removed callback from `Container.get` method
* Gulp instead of Grunt
* Support for ES2015

## API Reference

`void` `Container` - **Constructor** - *arguments*: [`Object<string, function> elements`]
> Argument `elements` is optional. It allows to create default bindings for existing classes.

*Example:*

```js
var appContainer = new Container({
    "Date": Date
});
```

---

`boolean` `Container.prototype.has` - *arguments*: [`string name`]
> Return true if Container contains element with given name.

*Example:*

```js
console.log(appContainer.has('Date')); // true
console.log(appContainer.has('MyObject')); // false
```

---

`void` `Container.prototype.bind` - *arguments*: [`string name, function instance, string[]|function[] parameters`]
> Binds given instance with given name. Each value in `parameters` array should be name of element in Container or function which return value of parameter.

*Example:*

```js
appContainer.bind('Window', Window, ['Date']);
appContainer.bind('Door', Door, [function () { return Math.random(); }]);
```

---

`void` `Container.prototype.singleton` - *arguments*: [`string name, function instance, string[]|function[] parameters`]
> Binds given object as singleton in container. Parameters are the same like `Container.bind` method.

*Example:*

```js
appContainer.singleton('Date', new Date());
appContainer.get('Date').setFullYear(2014);
appContainer.get('Date').getFullYear(); // 2014
```

---

`mixed` `Container.prototype.get` - *arguments*: [`string name`]
> Returns instance of earlier bound instance.

*Example:*

```js
appContainer.get('Window'); // an Window instance
```

---

`void` `Container.prototype.remove` - *arguments*: [`string name`]
> Removes link between Container and given name.

*Example:*

```js
appContainer.remove('Date');
appContainer.has('Date'); // false
```

## Development

Firstly need to install dev dependencies:

```js
npm install
```

For running unit tests:

```js
npm run gulp test
```

For build new dists version:

```js
npm run gulp
```

