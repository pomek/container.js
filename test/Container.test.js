var Container = require('../dist/Container.min.js');
var Window = require('./stubs/Window');

module.exports = {
    "setUp": function (test) {
        this.container = new Container({
            Date: Date
        });

        test();
    },

    "tearDown": function (test) {
        test();
    },

    "it should contain default objects": function (test) {
        test.ok(this.container.has('Date'));
        test.done();
    },

    "it should add new item into container": function (test) {
        this.container.bind('Window', Window);
        test.ok(this.container.has('Window'));

        test.done();
    },

    "it should throw error when try to bind already exist element": function (test) {
        test.throws(
            function () {
                this.container.bind('Date', Date)
            },
            Error,
            'Element "Date" is already bound.'
        );

        test.done();
    },

    "it should get instance from container without any more parameters": function (test) {
        this.container.bind('Window', Window);
        test.ok(this.container.get('Window') instanceof Window);
        test.ok(this.container.get('Date') instanceof Date);

        test.done();
    },

    "it should get date instance from container and after run callback": function (test) {
        this.container.get('Date', function () {
            var different = new Date().getTime() - this.getTime();

            // sometimes CPU catches lags and test fails...
            test.ok(different < 2);
        });

        test.done();
    },

    "it should get Window instance from container with Date parameter": function (test) {
        this.container.bind('Window', Window);

        var window_container = this.container.get('Window', ['Date']);

        test.ok(window_container instanceof Window);
        test.ok(window_container.getDate() instanceof Date);

        test.done();
    },

    "it should get Window instance from container with Date parameter and after run callback": function (test) {
        this.container.bind('Window', Window);

        this.container.get('Window', ['Date'], function () {
            test.ok(this instanceof Window);
            test.ok(this.getDate() instanceof Date);
        });

        test.done();
    },

    "it should throw when try to get undefined element from container": function (test) {
        test.throws(
            function () {
                this.container.get('Undefined Element')
            },
            Error,
            'Element "Undefined Element" does not exist.'
        );

        test.done();
    }
};
