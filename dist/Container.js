(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function () {
      return (root['Container'] = factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    root['Container'] = factory();
  }
}(this, function () {

"use strict";

/**
 * It allows "hide" body of given function. When you try to see body of function,
 * console returns something like "function bound () { [native code] }".
 *
 * @see http://tutorials.comandeer.pl/js-hiding.html
 * @param {function} body
 * @returns function
 */
//function hideFn (body) {
//    return Function.prototype.call.call(Function.prototype.bind, body);
//}

/**
 * It creates instance of given object with dynamic list of parameters.
 *
 * @see http://stackoverflow.com/a/16324447
 * @param {function} classFunction
 * @returns {function}
 */
function createObject (classFunction) {
    var tempClass = function (parameters) {
        classFunction.apply(this, parameters);
    };

    tempClass.prototype = classFunction.prototype;
    return tempClass;
}

/**
 * @param {Object.<string, function>} map
 * @constructor
 */
var Container = function (map) {
    map = map || {};
    this.map = {};

    Object.keys(map).forEach(function (className) {
        this.bind(className, map[className]);
    }.bind(this));
};

Container.prototype.has = function (name) {
    return !!this.map[name];
};

/**
 * Method binds given instance with given key name.
 *
 * @param {string} name
 * @param {function} instance
 */
Container.prototype.bind = function (name, instance) {
    if (true === this.has(name)) {
        throw new Error('Element "' + name + '" is already bound.');
    }

    this.map[name] = instance;
};

Container.prototype.singleton = function (name, instance) {
};

/**
 * It returns instance of earlier bound instance. Parameter `parameters` can be
 * an array of strings with name of elements. Given elements will return Container.
 *
 * The `parameters` can also be a function. The function will be called when container
 * finds given element. New created instance will be scope (this) for callback function.
 *
 * Both parameters (`parameters` and `callback`) are optional.
 *
 * @param {string} name
 * @param {string[]|function} parameters [parameters=undefined]
 * @param {function} callback [callback=undefined]
 * @returns {*}
 */
Container.prototype.get = function (name, parameters, callback) {
    // Throws error when given element doesn't exist
    if (false === this.has(name)) {
        throw new Error('Element "' + name + '" does not exist.');
    }

    var className = this.map[name];

    // Return instance of given element
    if ("undefined" === typeof parameters) {
        return new className();
    }

    // This in callback function will be instance of "name" from container.
    if ("function" === typeof parameters) {
        return parameters.call(new className());
    }

    var classInstanceParameters = [];

    // Build parameters
    parameters.forEach(function (param) {
        classInstanceParameters.push(this.get(param));
    }.bind(this));

    var classInstance = new (createObject(className))(classInstanceParameters);

    if ("function" === typeof callback) {
        return callback.call(classInstance);
    }

    return classInstance;
};

Container.prototype.remove = function (name) {
};

return Container;

}));
