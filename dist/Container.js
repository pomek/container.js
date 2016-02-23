;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Container = factory();
  }
}(this, function() {
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ElementsSymbol = Symbol('Elements Collection');

var Container = function () {
    /**
     * Constructor of Container object. The `elements` parameter allows to create default
     * bindings for existing classes, ie. {Date: Date}. When Container.get() is calling with
     * "Date" parameter, engine knows that name and will return concrete instance of Date.
     *
     * @param {Object.<string, function>} elements [elements={}]
     * @constructor
     */

    function Container(elements) {
        _classCallCheck(this, Container);

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


    _createClass(Container, [{
        key: "has",
        value: function has(name) {
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

    }, {
        key: "bind",
        value: function bind(name, instance, parameters) {
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

    }, {
        key: "singleton",
        value: function singleton(name, concrete) {
            if ("object" !== (typeof concrete === "undefined" ? "undefined" : _typeof(concrete))) {
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

    }, {
        key: "get",
        value: function get(name) {
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
                var value = "function" === typeof item ? item() : this.get(item);
                classInstanceParameters.push(value);
            }.bind(this));

            return new (Function.prototype.bind.apply(className.instance, [null].concat(classInstanceParameters)))();
        }

        /**
         * Removes link between Container and given name.
         *
         * @param {string} name
         * @returns {void}
         */

    }, {
        key: "remove",
        value: function remove(name) {
            delete this[ElementsSymbol][name];
        }
    }]);

    return Container;
}();

/**
 * Version of Container.
 *
 * @type {string}
 * @static
 */


Container.version = "2.0.0";
return Container;
}));
