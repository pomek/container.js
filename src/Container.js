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
 * Constructor of Container object. The `map` parameter allows to create default
 * bindings for existing class, ie. {Date: Date}. When Container.get() is calling with
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
 * Method binds given instance with given key name. Each value in `parameters` array
 * should be name of element in Container or function if want get custom value.
 *
 * Instead of key name you can also pass function. Result of the function will be use
 * as an argument.
 *
 * @param {string} name
 * @param {function} instance
 * @param {string[]} parameters [parameters=[]]
 * @returns {void}
 */
Container.prototype.bind = function (name, instance, parameters) {
    if ("function" !== typeof instance) {
        throw new TypeError('Given `instance` argument does not seem like Class definition.');
    }

    if (true === this.has(name)) {
        throw new Error('Element "' + name + '" is already bound.');
    }

    if (false === Array.isArray(parameters)) {
        parameters = [];
    }

    this.map[name] = {
        instance: instance,
        parameters: parameters
    };
};

Container.prototype.singleton = function (name, instance) {
    // todo: implementation
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

    // Return instance of given element
    if ("undefined" === typeof callback && 0 === className.parameters.length) {
        return new className.instance();
    }

    // this in callback function will be instance of "name" class from container
    if ("function" === typeof callback && 0 === className.parameters.length) {
        return callback.call(new className.instance());
    }

    var classInstanceParameters = [];

    // Build parameters
    className.parameters.forEach(function (item) {
        var value = ("function" === typeof item) ? item() : this.get(item);

        classInstanceParameters.push(value);
    }.bind(this));

    var classInstance = new (createObject(className.instance))(classInstanceParameters);

    if ("function" === typeof callback) {
        return callback.call(classInstance);
    }

    return classInstance;
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
