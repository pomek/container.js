"use strict";

const ElementsSymbol = Symbol('Elements Collection');

class Container {
    /**
     * Constructor of Container object. The `elements` parameter allows to create default
     * bindings for existing classes, ie. {Date: Date}. When Container.get() is calling with
     * "Date" parameter, engine knows that name and will return concrete instance of Date.
     *
     * @param {Object.<string, function>} elements [elements={}]
     * @constructor
     */
    constructor (elements) {
        elements = elements || {};

        this[ElementsSymbol] = {};

        Object.keys(elements).forEach(function (className) {
            this.bind(className, elements[className]);
        }.bind(this));
    }

    /**
     * Return true if Container contains element with given name.
     *
     * @param {string} name
     * @returns {boolean}
     */
    has (name) {
        return this[ElementsSymbol].hasOwnProperty(name);
    }

    /**
     * Binds given instance with given name. Each value in `parameters` array
     * should be name of element in Container or function which return value of parameter.
     *
     * @param {string} name
     * @param {function} instance
     * @param {string[]|function[]} parameters [parameters=[]]
     * @returns {void}
     */
    bind (name, instance, parameters) {
        if ("function" !== typeof instance) {
            throw new TypeError('Given `instance` does not seem like Class definition.');
        }

        if (true === this.has(name)) {
            throw new Error('Element "' + name + '" is already bound.');
        }

        if (false === Array.isArray(parameters)) {
            parameters = [];
        }

        this[ElementsSymbol][name] = {
            instance: instance,
            parameters: parameters,
            isSingleton: false
        };
    }

    /**
     * Binds given object as singleton in container.
     *
     * @param {string} name
     * @param {function} concrete
     * @returns {void}
     */
    singleton (name, concrete) {
        if ("object" !== typeof concrete) {
            throw new TypeError('Given `instance` does not seem like class instance.');
        }

        if (true === this.has(name)) {
            throw new Error('Element "' + name + '" is already bound.');
        }

        this[ElementsSymbol][name] = {
            instance: concrete,
            parameters: [],
            isSingleton: true
        };
    }

    /**
     * It returns instance of earlier bound class.
     *
     * @param {string} name
     * @returns {*}
     */
    get (name) {
        // Throws error when given element doesn't exist
        if (false === this.has(name)) {
            throw new Error('Element "' + name + '" does not exist.');
        }

        var className = this[ElementsSymbol][name];

        if (true === className.isSingleton) {
            return className.instance;
        }

        var classInstanceParameters = [];

        className.parameters.forEach(function (item) {
            var value = ("function" === typeof item) ? item() : this.get(item);
            classInstanceParameters.push(value);
        }.bind(this));

        return new className.instance(...classInstanceParameters);
    }

    /**
     * Removes link between Container and given name.
     *
     * @param {string} name
     * @returns {void}
     */
    remove (name) {
        delete this[ElementsSymbol][name];
    }
}

/**
 * Version of Container.
 *
 * @type {string}
 * @static
 */
Container.version = "2.0.0";
