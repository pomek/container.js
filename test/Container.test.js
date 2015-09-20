var Container = require('../dist/Container.min.js');
var Window = require('./stubs/Window');
var Home = require('./stubs/Home');

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
        this.container.bind('Window', Window, ['Date']);

        test.ok(this.container.has('Window'));

        test.done();
    },

    "it should add new item into container with function argument": function (test) {
        var windowArguments = [
            function () {
                return new Date();
            }
        ];

        this.container.bind('Window', Window, windowArguments);

        test.ok(this.container.has('Window'));

        test.done();
    },

    "it should throw error when try to bind element with invalid definition of class": function (test) {
        test.throws(
            function () {
                this.container.bind('Window', new Window);
            },
            TypeError,
            'Given `instance` argument does not seem like Class definition.'
        );

        test.done();
    },

    "it should throw error error when try to bind already exist element": function (test) {
        test.throws(
            function () {
                this.container.bind('Date', Date)
            },
            Error,
            'Element "Date" is already bound.'
        );

        test.done();
    },

    "it should get instance from container": function (test) {
        this.container.bind('Window', Window, ['Date']);

        test.ok(this.container.get('Date') instanceof Date);
        test.ok(this.container.get('Window') instanceof Window);

        test.done();
    },

    "it should get instance from container with custom argument": function (test) {
        var windowArguments = [
            function () {
                return 'Date';
            }
        ];

        this.container.bind('Window', Window, windowArguments);
        var windowElement = this.container.get('Window');

        test.ok(windowElement instanceof Window);
        test.strictEqual(windowElement.getDate(), 'Date');

        test.done();
    },

    "it should get date instance from container and run callback": function (test) {
        this.container.get('Date', function () {
            var different = new Date().getTime() - this.getTime();

            // sometimes CPU catches lags and test fails...
            test.ok(different < 2);
        });

        test.done();
    },

    "it should get Window instance from container with Date parameter": function (test) {
        this.container.bind('Window', Window, ['Date']);

        var window_container = this.container.get('Window');

        test.ok(window_container instanceof Window);
        test.ok(window_container.getDate() instanceof Date);

        test.done();
    },

    "it should get Window instance from container with Date parameter and run callback": function (test) {
        this.container.bind('Window', Window, ['Date']);

        this.container.get('Window', function () {
            test.ok(this instanceof Window);
            test.ok(this.getDate() instanceof Date);
        });

        test.done();
    },

    "it should get Home instance from container (test nesting)": function (test) {
        this.container.bind('Window', Window, ['Date']);
        this.container.bind('Home', Home, ['Window']);

        var homeElement = this.container.get('Home');

        test.ok(homeElement instanceof Home);
        test.ok(homeElement.getWindow() instanceof Window);
        test.ok(homeElement.getWindow().getDate() instanceof Date);

        test.done();
    },

    "it should get Home instance from container and run callback (test nesting)": function (test) {
        this.container.bind('Window', Window, ['Date']);
        this.container.bind('Home', Home, ['Window']);

        this.container.get('Home', function () {
            var windowElement = this.getWindow(),
                different = new Date().getTime() - windowElement.getDate().getTime();

            // sometimes CPU catches lags and test fails...
            test.ok(different < 2);
        });

        test.done();
    },

    "it should throw error when try to get undefined element from container": function (test) {
        test.throws(
            function () {
                this.container.get('Undefined Element')
            },
            Error,
            'Element "Undefined Element" does not exist.'
        );

        test.done();
    },

    "it should remove existing element from container": function (test) {
        this.container.remove('Date');

        test.strictEqual(this.container.has('Date'), false);

        test.done();
    }
};
