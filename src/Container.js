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
        throw new Error('Element "' + name + '" is already binded.');
    }

    this.map[name] = instance;
};

Container.prototype.singleton = function (name, instance) {
};

Container.prototype.get = function (name, parameters, callback) {
    var instance = this.map[name];

    if (typeof undefined === typeof parameters) {
        return new instance();
    }

    if ("function" === typeof parameters) {
        return parameters.call(new instance());
    }

    var instance_parameters = [];

    parameters.forEach(function (param) {
        instance_parameters.push(this.get(param));
    }.bind(this));

    var cApply = function(c) {
        var ctor = function(args) {
            c.apply(this, args);
        };
        ctor.prototype = c.prototype;
        return ctor;
    };
    var new_instance = new (cApply(instance))(instance_parameters);

    if ("function" === typeof callback) {
        return callback.call(new_instance);
    }

    return new_instance;
};

Container.prototype.remove = function (name) {
};
