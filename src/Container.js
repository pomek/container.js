"use strict";

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
 * Constructor of Container object. The `elements` parameter allows to create default
 * bindings for existing classes, ie. {Date: Date}. When Container.get() is calling with
 * "Date" parameter, engine knows that name and will return concrete instance of Date.
 *
 * @param {Object.<string, function>} elements [elements={}]
 * @constructor
 */
var Container = function (elements) {
    elements = elements || {};
    this.elements = {};

    Object.keys(elements).forEach(function (className) {
        this.bind(className, elements[className]);
    }.bind(this));
};

/**
 * Return true if Container contains element with given name.
 *
 * @param {string} name
 * @returns {boolean}
 */
Container.prototype.has = function (name) {
    return !!this.elements[name];
};

/**
 * Binds given instance with given name. Each value in `parameters` array
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

    this.elements[name] = {
        instance: instance,
        parameters: parameters,
        isSingleton: false
    };
};

/**
 * Binds given object as singleton in container.
 *
 * @param {string} name
 * @param {function} concrete
 * @returns {void}
 */
Container.prototype.singleton = function (name, concrete) {
    if ("object" !== typeof concrete) {
        throw new TypeError('Given `instance` does not seem like class instance.');
    }

    if (true === this.has(name)) {
        throw new Error('Element "' + name + '" is already bound.');
    }

    this.elements[name] = {
        instance: concrete,
        parameters: [],
        isSingleton: true
    };
};

/**
 * It returns instance of earlier bound instance. Callback function will be called when
 * container finds given element. Scope of callback function will be earlier created instance.
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

    var className = this.elements[name],
        hasCallback = ("function" === typeof callback);

    if (true === className.isSingleton) {
        return hasCallback ? callback.call(className.instance) : className.instance;
    }

    if (0 === className.parameters.length) {
        var concreteInstance = new className.instance();

        return hasCallback ? callback.call(concreteInstance) : concreteInstance;
    }

    var classInstanceParameters = buildParameters.call(this, className.parameters),
        classInstance = new (createObject(className.instance))(classInstanceParameters);

    return hasCallback ? callback.call(classInstance) : classInstance;
};

/**
 * Removes link between Container and given name.
 *
 * @param {string} name
 * @returns {void}
 */
Container.prototype.remove = function (name) {
    delete this.elements[name];
};
