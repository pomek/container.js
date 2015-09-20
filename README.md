![Container.js](https://raw.githubusercontent.com/pomek/container.js/master/assets/logo.png)
[![Code Climate](https://codeclimate.com/github/pomek/container.js/badges/gpa.svg)](https://codeclimate.com/github/pomek/container.js)
[![Build Status](https://travis-ci.org/pomek/container.js.svg)](https://travis-ci.org/pomek/container.js)

> Simply Container for using Dependency Injection pattern in JavaScript

Container.js is lightweight library (<2kb when minified), designed to facilitate how you can implement [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection) pattern in your JavaScript applications.

## How to use

In order to use this package, you need to install it in your project:

**via [Bower](https://bower.io)**

```js
bower install Container.js
```

**via [NPM](https://www.npmjs.com/package/node-container.js)**

```js
npm install node-container.js --save
```

or download it manually from [here](https://github.com/pomek/container.js/blob/master/dist/Container.min.js).

```html
<script src="/path/to/Container.min.js"></script>
```

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
appContainer.get('Date', function () {
    this.setFullYear(2014);
});

console.log(appContainer.get('Date').getFullYear()); // 2014
```

---

`mixed` `Container.prototype.get` - *arguments*: [`string name, function callback`]
> Returns instance of earlier bound instance. Callback function will be called when container finds given element. Scope of callback function will be earlier created instance.

*Example:*

```js
appContainer.get('Window', function () {
    console.log(this instanceof Window); // true
});
```

---

`void` `Container.prototype.remove` - *arguments*: [`string name`]
> Removes link between Container and given name.

*Example:*

```js
appContainer.remove('Date');
console.log(appContainer.has('Date')); // false
```

## Development

Firstly need to install dev dependencies:

```js
npm install -g grunt grunt-cli
npm install
```

For running unit tests:

```js
grunt test
```

For build new version dists:

```js
grunt build
```

