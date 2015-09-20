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
function createObject(classFunction) {
    var tempClass = function (parameters) {
        classFunction.apply(this, parameters);
    };

    tempClass.prototype = classFunction.prototype;
    return tempClass;
}

/**
 * Builds instances based on given string parameters.
 *
 * @this {Container}
 * @param {string[]|function[]} parameters
 * @returns {string[]|function[]}
 */
function buildParameters(parameters) {
    var classInstanceParameters = [];

    parameters.forEach(function (item) {
        var value = ("function" === typeof item) ? item() : this.get(item);

        classInstanceParameters.push(value);
    }.bind(this));

    return classInstanceParameters;
}

/**
 * Constructor of Container object. The `map` parameter allows to create default
 * bindings for existing classes, ie. {Date: Date}. When Container.get() is calling with
 * "Date" parameter, engine knows that name and will return concrete instance of Date.
 *
 * @param {Object.<string, function>} map [map={}]
 * @constructor
 */
var Container = function (map) {
    map = map || {};
    this.map = {};

    Object.keys(map).forEach(function (className) {
        this.bind(className, map[className]);
    }.bind(this));
};

/**
 * Return true if Container contains element with given name.
 *
 * @param {string} name
 * @returns {boolean}
 */
Container.prototype.has = function (name) {
    return !!this.map[name];
};

/**
 * Method binds given instance with given name. Each value in `parameters` array
 * should be name of element in Container or function which return value of parameter.
 *
 * @param {string} name
 * @param {function} instance
 * @param {string[]|function[]} parameters [parameters=[]]
 * @returns {void}
 */
Container.prototype.bind = function (name, instance, parameters) {
    if ("function" !== typeof instance) {
        throw new TypeError('Given `instance` does not seem like Class definition.');
    }

    if (true === this.has(name)) {
        throw new Error('Element "' + name + '" is already bound.');
    }

    if (false === Array.isArray(parameters)) {
        parameters = [];
    }

    this.map[name] = {
        instance: instance,
        parameters: parameters,
        isSingleton: false
    };
};

/**
 *
 * @param {string} name
 * @param {function} concrete
 * @param {string[]} parameters [parameters=[]]
 * @returns {void}
 */
Container.prototype.singleton = function (name, concrete) {
    if ("object" !== typeof concrete) {
        throw new TypeError('Given `instance` does not seem like class instance.');
    }

    if (true === this.has(name)) {
        throw new Error('Element "' + name + '" is already bound.');
    }

    this.map[name] = {
        instance: concrete,
        parameters: [],
        isSingleton: true
    };
};

/**
 * It returns instance of earlier bound instance. Parameter `callback` the function
 * will be called when container finds given element. Scope of callback function
 * will be earlier created instance.
 *
 * Parameter `callback` is optional.
 *
 * @param {string} name
 * @param {function} callback [callback=undefined]
 * @returns {*}
 */
Container.prototype.get = function (name, callback) {
    // Throws error when given element doesn't exist
    if (false === this.has(name)) {
        throw new Error('Element "' + name + '" does not exist.');
    }

    var className = this.map[name];

    if (true === className.isSingleton) {
        return ("function" === typeof callback) ? callback.call(className.instance) : className.instance;
    }

    // Return instance of given element
    if ("undefined" === typeof callback && 0 === className.parameters.length) {
        return new className.instance();
    }

    // Scope in callback function is instance of class from Container
    if ("function" === typeof callback && 0 === className.parameters.length) {
        return callback.call(new className.instance());
    }

    var classInstanceParameters = buildParameters.call(this, className.parameters),
        classInstance = new (createObject(className.instance))(classInstanceParameters);

    return ("function" === typeof callback) ? callback.call(classInstance) : classInstance;
};

/**
 * Removes link between Container and given name.
 *
 * @param {string} name
 * @returns {void}
 */
Container.prototype.remove = function (name) {
    delete this.map[name];
};

return Container;

}));
